import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  VideoCameraIcon,
  WifiIcon,
  ShieldCheckIcon,
  DevicePhoneMobileIcon,
  MicrophoneIcon,
  PlayCircleIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { getAppointments } from '../../features/appointments/appointmentSlice';
import { useTheme } from '../../context/ThemeContext';
import { DEMO_UPCOMING_APPOINTMENTS } from '../../utils/demoData';
import { isInDemoMode } from '../../utils/demoUtils';

const formatDate = (value, options) => {
  if (!value) return 'To be scheduled';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'To be scheduled';
  return date.toLocaleString(undefined, options);
};

const TelehealthPage = () => {
  const dispatch = useDispatch();
  const { appointments, isLoading } = useSelector((state) => state.appointments);
  const { user } = useSelector((state) => state.auth);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const demoMode = isInDemoMode();

  useEffect(() => {
    if (!demoMode) {
      dispatch(getAppointments());
    }
  }, [dispatch, demoMode]);

  const appointmentsArray = useMemo(() => {
    if (Array.isArray(appointments)) return appointments;
    if (Array.isArray(appointments?.appointments)) return appointments.appointments;
    return [];
  }, [appointments]);

  const telehealthAppointments = useMemo(() => {
    const source = appointmentsArray.length ? appointmentsArray : DEMO_UPCOMING_APPOINTMENTS;
    return source
      .filter((appointment) => (appointment.type || '').toLowerCase() === 'telehealth')
      .sort((a, b) => {
        const dateA = new Date(a.startTime || a.date).getTime();
        const dateB = new Date(b.startTime || b.date).getTime();
        return dateA - dateB;
      });
  }, [appointmentsArray]);

  const nextTelehealth = telehealthAppointments[0] || null;

  const sessionStats = [
    { label: 'Avg. wait time', value: '2 min', hint: 'Last 30 days' },
    { label: 'Connection quality', value: 'Excellent', hint: 'HD video ready' },
    { label: 'Secure channel', value: 'HIPAA-grade', hint: 'AES-256 encrypted' },
  ];

  const readinessChecklist = [
    { icon: DevicePhoneMobileIcon, label: 'Device ready', description: 'Use Chrome, Safari, or Edge on desktop or mobile.' },
    { icon: MicrophoneIcon, label: 'Mic & speakers', description: 'Run a quick audio test before joining.' },
    { icon: WifiIcon, label: 'Network strength', description: 'Aim for at least 5 Mbps upload/download.' },
  ];

  const heroSurface = isDark
    ? 'border border-primary-500/30 bg-gradient-to-br from-indigo-900 via-gray-900 to-primary-900 text-white'
    : 'border border-primary-100 bg-gradient-to-br from-primary-50 via-white to-cyan-50';

  const cardSurface = isDark
    ? 'bg-gray-900 border border-gray-800'
    : 'bg-white border border-gray-100 shadow-sm';

  const renderAppointmentCard = (appointment) => {
    const start = appointment.startTime || appointment.date;
    const headline = formatDate(start, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    const doctorName = appointment.doctorName || appointment.doctor?.fullName || appointment.doctor?.firstName || 'Care team';
    const patientName = appointment.patientName || appointment.patient?.fullName || appointment.patient?.firstName || 'Patient';

    return (
      <li
        key={appointment._id || appointment.id}
        className={`rounded-2xl p-5 ${isDark ? 'bg-gray-900/60 border border-gray-800' : 'bg-white shadow-sm border border-gray-100'}`}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{headline}</p>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {appointment.reason || 'Telehealth visit'}
            </p>
          </div>
          <span className={`inline-flex items-center rounded-full px-3 py-0.5 text-xs font-semibold ${
            isDark ? 'bg-indigo-900/60 text-indigo-200' : 'bg-indigo-50 text-indigo-700'
          }`}>
            {appointment.status ? appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1) : 'Scheduled'}
          </span>
        </div>
        <div className="mt-4 grid gap-3 text-xs sm:grid-cols-2">
          <div>
            <p className={isDark ? 'text-gray-500' : 'text-gray-500'}>Doctor</p>
            <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{doctorName}</p>
          </div>
          <div>
            <p className={isDark ? 'text-gray-500' : 'text-gray-500'}>Patient</p>
            <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{patientName}</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
          <button
            type="button"
            className="inline-flex items-center rounded-full bg-gradient-to-r from-primary-600 to-indigo-500 px-4 py-2 text-white"
          >
            <VideoCameraIcon className="mr-2 h-4 w-4" /> Join session
          </button>
          <Link
            to={`/appointments/${appointment._id || appointment.id || ''}`}
            className={`${isDark ? 'text-primary-200 hover:text-primary-100' : 'text-primary-600 hover:text-primary-500'}`}
          >
            View details
          </Link>
        </div>
      </li>
    );
  };

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className={`${heroSurface} relative overflow-hidden rounded-3xl p-8`}>
          <div className="absolute inset-0 pointer-events-none opacity-40">
            <div className="absolute -right-10 top-4 h-48 w-48 rounded-full bg-primary-400 blur-3xl" />
            <div className="absolute -left-10 bottom-0 h-56 w-56 rounded-full bg-cyan-400 blur-3xl" />
          </div>
          <div className="relative z-10 grid gap-8 lg:grid-cols-[1.2fr,0.8fr]">
            <div>
              <p className={`text-xs font-semibold uppercase tracking-[0.35em] ${isDark ? 'text-primary-100' : 'text-primary-600'}`}>
                Virtual care
              </p>
              <h1 className={`mt-3 text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                See your care team from anywhere
              </h1>
              <p className={`mt-2 text-sm ${isDark ? 'text-gray-200' : 'text-gray-600'}`}>
                Join secure HD video visits, share updates in real time, and keep your treatment plan marching forward without a waiting room.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
                <Link
                  to="/appointments/new"
                  className="inline-flex items-center rounded-full bg-gradient-to-r from-primary-600 to-emerald-500 px-5 py-2 text-white Shadow"
                >
                  <PlusIcon className="mr-2 h-4 w-4" /> Book telehealth visit
                </Link>
                <button
                  type="button"
                  className={`${isDark ? 'bg-white/10 text-white' : 'bg-white text-primary-700'} inline-flex items-center rounded-full px-5 py-2`}
                >
                  <PlayCircleIcon className="mr-2 h-4 w-4" /> Watch quick tips
                </button>
              </div>
            </div>
            <div className={`${isDark ? 'bg-white/5' : 'bg-white/80'} rounded-2xl p-6 backdrop-blur`}>
              <p className={`text-xs font-semibold uppercase ${isDark ? 'text-primary-100' : 'text-primary-600'}`}>
                {nextTelehealth ? 'Next virtual visit' : 'You are all caught up'}
              </p>
              {nextTelehealth ? (
                <>
                  <p className={`mt-3 text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {formatDate(nextTelehealth.startTime || nextTelehealth.date, {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  <p className={`mt-1 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {nextTelehealth.reason || 'Care plan check-in'}
                  </p>
                  <div className="mt-4 text-xs">
                    <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                      with {nextTelehealth.doctorName || nextTelehealth.doctor?.fullName || 'your care team'}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="mt-4 inline-flex items-center rounded-full bg-gradient-to-r from-primary-600 to-indigo-500 px-4 py-2 text-sm font-semibold text-white"
                  >
                    <VideoCameraIcon className="mr-2 h-4 w-4" /> Join test room
                  </button>
                </>
              ) : (
                <p className={`mt-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  No telehealth visits are scheduled. Book a virtual appointment to stay on track with your care plan.
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
          <div className={`${cardSurface} rounded-2xl p-6`}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Upcoming telehealth sessions</h2>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Track links, readiness, and supporting notes in one place.
                </p>
              </div>
              <Link
                to="/appointments"
                className={isDark ? 'text-primary-200 hover:text-primary-100 text-sm font-semibold' : 'text-primary-600 hover:text-primary-500 text-sm font-semibold'}
              >
                View all
              </Link>
            </div>
            <ul className="mt-6 grid gap-4">
              {telehealthAppointments.length ? (
                telehealthAppointments.map(renderAppointmentCard)
              ) : (
                <li className="rounded-2xl border border-dashed border-primary-200 p-6 text-center text-sm text-primary-600">
                  No virtual appointments yet — book one above.
                </li>
              )}
            </ul>
          </div>

          <div className="space-y-6">
            <div className={`${cardSurface} rounded-2xl p-6`}>
              <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Connection health</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {sessionStats.map((stat) => (
                  <div key={stat.label}>
                    <p className={`text-xs uppercase tracking-wide ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{stat.label}</p>
                    <p className={`mt-1 text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
                    <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{stat.hint}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className={`${cardSurface} rounded-2xl p-6`}>
              <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Readiness checklist</h3>
              <ul className="mt-4 space-y-4">
                {readinessChecklist.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.label} className="flex items-start gap-3">
                      <span className={`${isDark ? 'bg-gray-800 text-primary-200' : 'bg-primary-50 text-primary-600'} rounded-full p-2`}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.label}</p>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{item.description}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className={`${cardSurface} rounded-2xl p-6`}>
              <div className="flex items-center gap-3">
                <ShieldCheckIcon className="h-10 w-10 rounded-full bg-emerald-100 p-2 text-emerald-600" />
                <div>
                  <p className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Private & secure</p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Every session is encrypted end-to-end and compliant with HIPAA safeguards.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold">
                <span className={`${isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'} rounded-full px-3 py-1`}>Audit logging</span>
                <span className={`${isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'} rounded-full px-3 py-1`}>BAA on file</span>
                <span className={`${isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'} rounded-full px-3 py-1`}>Secure chat</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TelehealthPage;
