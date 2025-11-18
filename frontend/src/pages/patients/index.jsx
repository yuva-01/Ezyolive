import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  EnvelopeIcon,
  HeartIcon,
  UserGroupIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { getAppointments } from '../../features/appointments/appointmentSlice';
import { DEMO_RECENT_PATIENTS, DEMO_UPCOMING_APPOINTMENTS } from '../../utils/demoData';
import { isInDemoMode } from '../../utils/demoUtils';
import { useTheme } from '../../context/ThemeContext';

const getAppointmentCollection = (appointments, demoMode) => {
  if (demoMode) {
    return DEMO_UPCOMING_APPOINTMENTS;
  }

  if (Array.isArray(appointments)) {
    return appointments;
  }

  if (Array.isArray(appointments?.appointments)) {
    return appointments.appointments;
  }

  return [];
};

const fallbackDemoPatients = () =>
  DEMO_RECENT_PATIENTS.map((patient, index) => ({
    id: patient.id || `demo-patient-${index}`,
    name: patient.name,
    lastVisit: patient.lastVisit,
    condition: patient.condition,
    gender: patient.gender,
    age: patient.age,
    nextVisit: null,
    riskLevel: index % 2 === 0 ? 'Medium' : 'Low',
    telehealthCount: index % 3,
    inPersonCount: index + 1,
    careTeam: ['Dr. Hart', 'Dr. Garcia'].slice(0, (index % 2) + 1),
  }));

const derivePatientsFromAppointments = (appointmentCollection) => {
  if (!appointmentCollection.length) {
    return fallbackDemoPatients();
  }

  const map = new Map();

  appointmentCollection.forEach((appointment, index) => {
    const patientId =
      appointment.patient?.id ||
      appointment.patient?._id ||
      appointment.patientId ||
      appointment.patient?.email ||
      `appt-${index}`;

    const patientName =
      appointment.patientName ||
      [appointment.patient?.firstName, appointment.patient?.lastName].filter(Boolean).join(' ') ||
      'Patient';

    const baseEntry = map.get(patientId) || {
      id: patientId,
      name: patientName,
      condition: appointment.reason || appointment.patient?.condition || 'General care',
      gender: appointment.patient?.gender || '—',
      age: appointment.patient?.age,
      contact: appointment.patient?.email,
      phone: appointment.patient?.phoneNumber,
      nextVisit: null,
      lastVisit: null,
      telehealthCount: 0,
      inPersonCount: 0,
      appointmentCount: 0,
      riskLevel: 'Low',
      careTeam: new Set(),
    };

    const start = appointment.startTime || appointment.date;
    const parsedDate = start ? new Date(start) : null;

    if (parsedDate) {
      if (!baseEntry.lastVisit || parsedDate.getTime() < baseEntry.lastVisit.getTime()) {
        baseEntry.lastVisit = parsedDate;
      }

      if (!baseEntry.nextVisit || parsedDate.getTime() > baseEntry.nextVisit.getTime()) {
        baseEntry.nextVisit = parsedDate;
      }
    }

    baseEntry.appointmentCount += 1;

    if ((appointment.type || '').toLowerCase() === 'telehealth') {
      baseEntry.telehealthCount += 1;
    } else {
      baseEntry.inPersonCount += 1;
    }

    const doctorName =
      appointment.doctorName ||
      [appointment.doctor?.firstName, appointment.doctor?.lastName].filter(Boolean).join(' ') ||
      null;

    if (doctorName) {
      baseEntry.careTeam.add(doctorName);
    }

    if ((appointment.status || '').toLowerCase() === 'in-progress') {
      baseEntry.riskLevel = 'High';
    } else if ((appointment.status || '').toLowerCase() === 'cancelled') {
      baseEntry.riskLevel = 'Medium';
    }

    map.set(patientId, baseEntry);
  });

  const result = Array.from(map.values()).map((entry) => ({
    ...entry,
    careTeam: Array.from(entry.careTeam),
  }));

  return result.length ? result : fallbackDemoPatients();
};

const PatientsPage = () => {
  const dispatch = useDispatch();
  const { appointments, isLoading: appointmentsLoading } = useSelector((state) => state.appointments);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const demoMode = isInDemoMode();

  const [searchTerm, setSearchTerm] = useState('');
  const [showTelehealthOnly, setShowTelehealthOnly] = useState(false);

  useEffect(() => {
    if (!demoMode) {
      dispatch(getAppointments());
    }
  }, [dispatch, demoMode]);

  const derivedPatients = useMemo(() => {
    const appointmentCollection = getAppointmentCollection(appointments, demoMode);
    return derivePatientsFromAppointments(appointmentCollection);
  }, [appointments, demoMode]);

  const filteredPatients = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return derivedPatients.filter((patient) => {
      const matchesQuery =
        !query ||
        patient.name.toLowerCase().includes(query) ||
        (patient.condition || '').toLowerCase().includes(query) ||
        patient.careTeam.some((member) => member.toLowerCase().includes(query));

      if (!matchesQuery) {
        return false;
      }

      if (showTelehealthOnly) {
        return patient.telehealthCount > 0;
      }

      return true;
    });
  }, [derivedPatients, searchTerm, showTelehealthOnly]);

  const totalTelehealth = derivedPatients.reduce((sum, patient) => sum + patient.telehealthCount, 0);
  const totalInPerson = derivedPatients.reduce((sum, patient) => sum + patient.inPersonCount, 0);

  const summaryCards = [
    {
      label: 'Active patients',
      value: derivedPatients.length,
      hint: 'Across all panels',
      icon: UserGroupIcon,
    },
    {
      label: 'Telehealth visits',
      value: totalTelehealth,
      hint: 'Last 30 days',
      icon: ChatBubbleLeftRightIcon,
    },
    {
      label: 'In-person visits',
      value: totalInPerson,
      hint: 'Clinic encounters',
      icon: HeartIcon,
    },
    {
      label: 'High-touch care',
      value: derivedPatients.filter((patient) => patient.riskLevel === 'High').length,
      hint: 'Needs extra follow-up',
      icon: ShieldCheckIcon,
    },
  ];

  const containerClass = 'px-4 py-8 sm:px-6 lg:px-8';
  const cardSurface = isDark ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-100 shadow-sm';
  const heroSurface = isDark
    ? 'border border-primary-500/20 bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900/30 text-white'
    : 'border border-primary-100 bg-gradient-to-br from-primary-50 via-white to-cyan-50';

  return (
    <div className={containerClass}>
      <div className="mx-auto max-w-7xl space-y-8">
        <section className={`${heroSurface} rounded-3xl p-8 relative overflow-hidden`}>
          <div className="absolute inset-0 pointer-events-none opacity-30">
            <div className="absolute -right-12 top-6 h-48 w-48 rounded-full bg-primary-400 blur-3xl" />
            <div className="absolute -left-12 bottom-0 h-56 w-56 rounded-full bg-emerald-400 blur-3xl" />
          </div>
          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className={`text-xs font-semibold uppercase tracking-[0.35em] ${isDark ? 'text-primary-100' : 'text-primary-700'}`}>
                Patient panel
              </p>
              <h1 className={`mt-2 text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Full visibility into every patient journey
              </h1>
              <p className={`mt-2 text-sm ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                Track clinical touchpoints, telehealth readiness, and handoffs in one timeline so nothing slips through.
              </p>
            </div>
            <div className={`${isDark ? 'bg-white/5 text-white' : 'bg-white text-gray-900'} rounded-2xl px-6 py-4 text-center shadow-lg`}>
              <p className="text-xs font-semibold uppercase tracking-[0.3em]">Net promoter</p>
              <p className="mt-1 text-4xl font-bold">94%</p>
              <p className="text-xs text-emerald-500">+6 pts vs last quarter</p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {summaryCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className={`${cardSurface} rounded-2xl p-5`}>
                <div className="flex items-center gap-3">
                  <span className={`${isDark ? 'bg-gray-800 text-primary-200' : 'bg-primary-50 text-primary-600'} rounded-full p-2`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className={`text-xs uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{card.label}</p>
                    <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{card.value}</p>
                    <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{card.hint}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
          <div className={`${cardSurface} rounded-2xl p-6`}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-md">
                <MagnifyingGlassIcon className={`pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className={`${
                    isDark
                      ? 'bg-gray-900 border-gray-800 text-gray-100 placeholder-gray-500'
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                  } w-full rounded-2xl border px-11 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40`}
                  placeholder="Search by patient, condition, or care team"
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setShowTelehealthOnly((prev) => !prev)}
                  className={`${
                    showTelehealthOnly
                      ? 'bg-primary-600 text-white border-primary-600'
                      : isDark
                      ? 'bg-gray-900 text-gray-300 border-gray-700'
                      : 'bg-white text-gray-600 border-gray-200'
                  } inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-xs font-semibold transition`}
                >
                  <FunnelIcon className="h-4 w-4" /> Telehealth ready
                </button>
                <button
                  type="button"
                  className={`${isDark ? 'text-gray-400' : 'text-gray-500'} inline-flex items-center gap-2 rounded-2xl border border-dashed px-4 py-2 text-xs font-semibold`}
                >
                  Export CSV
                </button>
              </div>
            </div>

            <div className={`mt-6 overflow-hidden rounded-2xl border ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
              <div className={`hidden px-6 py-3 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'} lg:grid lg:grid-cols-[2fr,1.2fr,1fr,1fr,1fr]`}>
                <span>Patient</span>
                <span>Last contact</span>
                <span>Telehealth</span>
                <span>In-person</span>
                <span>Status</span>
              </div>
              <div className={appointmentsLoading ? 'opacity-70' : ''}>
                {filteredPatients.length === 0 ? (
                  <div className="px-6 py-10 text-center text-sm">
                    <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>No patients match your filters.</p>
                  </div>
                ) : (
                  filteredPatients.map((patient) => (
                    <div
                      key={patient.id}
                      className={`grid gap-4 border-t px-4 py-4 text-sm lg:grid-cols-[2fr,1.2fr,1fr,1fr,1fr] lg:items-center ${
                        isDark ? 'border-gray-800 hover:bg-gray-900/60' : 'border-gray-100 hover:bg-gray-50'
                      }`}
                    >
                      <div>
                        <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{patient.name}</p>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{patient.condition}</p>
                        <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-semibold">
                          {patient.careTeam.slice(0, 2).map((member) => (
                            <span key={member} className={`${isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'} rounded-full px-2 py-0.5`}>
                              {member}
                            </span>
                          ))}
                          {patient.careTeam.length > 2 && (
                            <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>+{patient.careTeam.length - 2}</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className={`${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                          {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '—'}
                        </p>
                        <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                          Next visit: {patient.nextVisit ? new Date(patient.nextVisit).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'TBD'}
                        </p>
                      </div>
                      <div className="font-semibold text-indigo-500">{patient.telehealthCount}</div>
                      <div className="font-semibold text-emerald-500">{patient.inPersonCount}</div>
                      <div>
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-0.5 text-xs font-semibold ${
                            patient.riskLevel === 'High'
                              ? 'bg-red-100 text-red-700'
                              : patient.riskLevel === 'Medium'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {patient.riskLevel}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className={`${cardSurface} rounded-2xl p-6`}>
              <p className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Care coordination
              </p>
              <div className="mt-4 space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <PhoneIcon className={`${isDark ? 'text-primary-200' : 'text-primary-600'} h-5 w-5`} />
                  <div>
                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Outbound call queue</p>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>12 patients awaiting navigation follow-up</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <EnvelopeIcon className={`${isDark ? 'text-primary-200' : 'text-primary-600'} h-5 w-5`} />
                  <div>
                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Lab reminders</p>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>4 panels need to be re-drawn this week</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ChatBubbleLeftRightIcon className={`${isDark ? 'text-primary-200' : 'text-primary-600'} h-5 w-5`} />
                  <div>
                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Secure messages</p>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Average reply time · 2h 14m</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={`${cardSurface} rounded-2xl p-6`}>
              <p className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Quality checklist
              </p>
              <ul className="mt-4 space-y-3 text-sm">
                {[
                  'Close care gaps for diabetics',
                  'Share updated care plans post visit',
                  'Confirm RPM consent renewals',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircleIcon className="h-5 w-5 text-emerald-500" />
                    <span className={isDark ? 'text-gray-200' : 'text-gray-800'}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PatientsPage;
