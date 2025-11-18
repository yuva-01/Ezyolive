import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTheme } from '../../context/ThemeContext';
import {
  CalendarIcon,
  UserIcon,
  CurrencyDollarIcon,
  VideoCameraIcon,
  UserGroupIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline';
import { getAppointments, createAppointment } from '../../features/appointments/appointmentSlice';
import { DEMO_STATS, DEMO_UPCOMING_APPOINTMENTS, DEMO_RECENT_PATIENTS, DEMO_DOCTORS } from '../../utils/demoData';
import { isInDemoMode } from '../../utils/demoUtils';

const formatCurrency = (amount, options = {}) => {
  const { minimumFractionDigits = 0, maximumFractionDigits = 0 } = options;
  const numericAmount = Number(amount);
  const safeAmount = Number.isFinite(numericAmount) ? numericAmount : 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(safeAmount);
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const authPayload = useSelector((state) => state.auth.user);
  const { appointments, isLoading, isError, message } = useSelector((state) => state.appointments);

  const demoMode = isInDemoMode();
  const authToken = authPayload?.token;
  const resolvedUser = useMemo(() => {
    if (!authPayload) return null;
    if (authPayload.data?.user) return authPayload.data.user;
    if (authPayload.user) return authPayload.user;
    return authPayload;
  }, [authPayload]);
  const isPatient = resolvedUser?.role === 'patient';
  const showDoctorView = !isPatient;

  const [stats, setStats] = useState({
    appointments: { today: 0, upcoming: 0, total: 0 },
    patients: { total: 0, new: 0 },
    revenue: { today: 0, thisMonth: 0, outstanding: 0 },
    telehealth: { upcoming: 0 },
  });
  const [upcomingAppointmentsList, setUpcomingAppointmentsList] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);
  const [doctorOptions, setDoctorOptions] = useState([]);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    doctor: '',
    date: '',
    time: '',
    reason: '',
    type: 'in-person',
  });
  const [isBooking, setIsBooking] = useState(false);

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Fetch appointments when user available (and not demo)
  useEffect(() => {
    if (demoMode) return;
    if (authToken) {
      dispatch(getAppointments());
    }
  }, [demoMode, authToken, dispatch]);

  // Set demo data / initial stats safely and clean up timeout
  useEffect(() => {
    if (demoMode) {
      setStats(DEMO_STATS);
      setUpcomingAppointmentsList(DEMO_UPCOMING_APPOINTMENTS);
      setRecentPatients(DEMO_RECENT_PATIENTS);
      return;
    }

    // Only set demo-like stats after mount (for UX placeholder)
    const t = setTimeout(() => {
      setStats({
        appointments: { today: 12, upcoming: 45, total: 1250 },
        patients: { total: 853, new: 24 },
        revenue: { today: 2500, thisMonth: 45000, outstanding: 12500 },
        telehealth: { upcoming: 8 },
      });
    }, 1000);

    return () => clearTimeout(t);
  }, [demoMode]);

  // If appointments change, compute upcoming appointments (next 7 days)
  useEffect(() => {
    if (demoMode) {
      setUpcomingAppointmentsList(DEMO_UPCOMING_APPOINTMENTS);
      return;
    }
    if (!appointments || !Array.isArray(appointments)) {
      setUpcomingAppointmentsList([]);
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    nextWeek.setHours(23, 59, 59, 999);

    const filtered = appointments.filter((appointment) => {
      if (!appointment || !appointment.date) return false;
      const appointmentDate = new Date(appointment.date);
      appointmentDate.setHours(0, 0, 0, 0);
      return appointmentDate.getTime() > today.getTime() && appointmentDate.getTime() <= nextWeek.getTime();
    });

    setUpcomingAppointmentsList(filtered);
  }, [appointments, demoMode]);

  // Compute today's appointments using useMemo (derived value, no state set)
  const todayAppointments = useMemo(() => {
    if (demoMode) return DEMO_UPCOMING_APPOINTMENTS.filter(a => {
      const d = new Date(a.date);
      d.setHours(0,0,0,0);
      const t = new Date(); t.setHours(0,0,0,0);
      return d.getTime() === t.getTime();
    });

    if (!appointments || !Array.isArray(appointments)) return [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return appointments.filter((appointment) => {
      if (!appointment.date) return false;
      const appointmentDate = new Date(appointment.date);
      appointmentDate.setHours(0, 0, 0, 0);
      return appointmentDate.getTime() === today.getTime();
    });
  }, [appointments, demoMode]);

  // Show API errors via toast (only for non-demo)
  useEffect(() => {
    if (isError && !demoMode) {
      toast.error(message || 'Failed to load data');
    }
  }, [isError, message, demoMode]);

  useEffect(() => {
    if (!isPatient) return;
    if (demoMode) {
      setDoctorOptions(DEMO_DOCTORS);
      return;
    }
    if (!authToken) return;

    let isMounted = true;
    setIsLoadingDoctors(true);
    axios
      .get('/api/users/doctors?limit=50', {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      .then((response) => {
        if (!isMounted) return;
        setDoctorOptions(response.data?.data?.doctors || []);
      })
      .catch((error) => {
        if (!isMounted) return;
        console.error('Unable to load doctors', error);
        toast.error('Unable to load doctors right now');
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingDoctors(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isPatient, demoMode, authToken]);

  const handleAppointmentClick = (appointmentId) => {
    navigate(`/appointments/${appointmentId}`);
  };

  const getAppointmentStart = (appointment) => {
    if (!appointment) return null;
    if (appointment.startTime) return new Date(appointment.startTime);
    if (appointment.date) return new Date(appointment.date);
    return null;
  };

  const formatAppointmentDate = (appointment) => {
    const date = getAppointmentStart(appointment);
    if (!date) return 'TBD';
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const formatAppointmentTime = (appointment) => {
    const date = getAppointmentStart(appointment);
    if (!date) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getDoctorDisplayName = (appointment) => {
    if (!appointment) return 'Assigned doctor';
    if (appointment.doctorName) return appointment.doctorName;
    if (appointment.doctor) {
      const first = appointment.doctor.firstName || '';
      const last = appointment.doctor.lastName || '';
      if (first || last) {
        return `Dr. ${`${first} ${last}`.trim()}`.trim();
      }
    }
    return 'Assigned doctor';
  };

  const demoPatientAppointments = useMemo(() => {
    if (!demoMode) return [];
    const now = Date.now();
    const reasons = ['Care plan review', 'Follow-up visit', 'Medication check'];
    return DEMO_DOCTORS.map((doc, index) => {
      const startTime = new Date(now + (index + 1) * 3600000).toISOString();
      return {
        id: `demo-patient-${index}`,
        doctorName: `Dr. ${doc.firstName} ${doc.lastName}`,
        specialization: doc.specialization,
        startTime,
        type: index % 2 === 0 ? 'telehealth' : 'in-person',
        reason: reasons[index % reasons.length],
        status: 'scheduled',
      };
    });
  }, [demoMode]);

  const patientUpcomingAppointments = useMemo(() => {
    if (demoMode) {
      return demoPatientAppointments;
    }
    if (!appointments || !Array.isArray(appointments)) return [];
    const now = Date.now();
    return appointments
      .filter((appointment) => {
        const start = getAppointmentStart(appointment);
        return start && start.getTime() >= now;
      })
      .sort((a, b) => {
        const startA = getAppointmentStart(a)?.getTime() || 0;
        const startB = getAppointmentStart(b)?.getTime() || 0;
        return startA - startB;
      });
  }, [appointments, demoMode, demoPatientAppointments]);

  const nextAppointment = patientUpcomingAppointments[0] || null;

  const patientMetrics = useMemo(() => {
    if (demoMode) {
      const telehealthCount = demoPatientAppointments.filter((appt) => appt.type === 'telehealth').length;
      return {
        upcoming: demoPatientAppointments.length,
        completed: 6,
        doctors: DEMO_DOCTORS.length,
        telehealth: telehealthCount,
      };
    }

    if (!appointments || !appointments.length) {
      return { upcoming: 0, completed: 0, doctors: 0, telehealth: 0 };
    }

    const now = Date.now();
    const doctorIds = new Set();
    let upcoming = 0;
    let completed = 0;
    let telehealth = 0;

    appointments.forEach((appointment) => {
      if (appointment.doctor?._id) {
        doctorIds.add(appointment.doctor._id);
      }
      const start = getAppointmentStart(appointment);
      if (!start) return;
      if (start.getTime() >= now) {
        upcoming += 1;
        if ((appointment.type || '').toLowerCase() === 'telehealth') {
          telehealth += 1;
        }
      } else {
        completed += 1;
      }
    });

    return {
      upcoming,
      completed,
      doctors: doctorIds.size,
      telehealth,
    };
  }, [appointments, demoMode, demoPatientAppointments]);

  const patientCards = [
    {
      title: 'Scheduled visits',
      value: patientMetrics.upcoming,
      description: 'Next 30 days',
    },
    {
      title: 'Completed visits',
      value: patientMetrics.completed,
      description: 'All-time history',
    },
    {
      title: 'Care team',
      value: patientMetrics.doctors,
      description: 'Assigned clinicians',
    },
    {
      title: 'Telehealth ready',
      value: patientMetrics.telehealth,
      description: 'Virtual sessions queued',
    },
  ];

  const telehealthSessions = useMemo(
    () =>
      patientUpcomingAppointments.filter(
        (appointment) => (appointment.type || '').toLowerCase() === 'telehealth'
      ),
    [patientUpcomingAppointments]
  );

  const telehealthSpotlight = telehealthSessions.length
    ? {
        label: 'Connection ready',
        headline: `${formatAppointmentDate(telehealthSessions[0])} · ${formatAppointmentTime(telehealthSessions[0])}`,
        subline: `${getDoctorDisplayName(telehealthSessions[0])} (${telehealthSessions[0].specialization || 'Care team'})`,
        meta: telehealthSessions[0].reason || 'Virtual care session',
      }
    : {
        label: 'No virtual visits',
        headline: 'Need a remote check-in?',
        subline: 'Book a telehealth appointment and connect from anywhere.',
        meta: null,
      };

  const patientBillingSnapshot = useMemo(() => {
    if (demoMode) {
      return {
        outstanding: 128.5,
        nextDue: 'Dec 05, 2025',
        method: 'Visa ···· 4242',
        autopay: true,
        lastPayment: 'Nov 12 · ₹45 copay',
      };
    }
    return {
      outstanding: Math.max(0, (appointments?.length || 0) * 20),
      nextDue: 'No invoices due',
      method: 'Add payment method',
      autopay: false,
      lastPayment: appointments?.length ? 'Processing recent visit' : 'No payments recorded',
    };
  }, [appointments, demoMode]);

  const patientCareTasks = useMemo(
    () => [
      { id: 'task-1', label: 'Log blood pressure reading', due: 'Today · 6pm', completed: false },
      { id: 'task-2', label: 'Review nutrition guide', due: 'Tomorrow · Anytime', completed: false },
      { id: 'task-3', label: 'Complete mood check-in', due: 'Fri · Morning', completed: true },
    ],
    []
  );

  const nextAppointmentSummary = nextAppointment
    ? (() => {
        const doctorLabel = getDoctorDisplayName(nextAppointment);
        const specialty = nextAppointment.specialization || nextAppointment.doctor?.specialization;
        return {
          headline: `${formatAppointmentDate(nextAppointment)} · ${formatAppointmentTime(nextAppointment)}`,
          subline: specialty ? `${doctorLabel} · ${specialty}` : doctorLabel,
          meta: nextAppointment.reason || nextAppointment.type || 'Care coordination',
        };
      })()
    : {
        headline: 'No visits scheduled',
        subline: 'Book an appointment to stay on track with your care plan',
        meta: null,
      };

    const selectableDoctors = demoMode ? DEMO_DOCTORS : doctorOptions;

  const resetBookingForm = () =>
    setBookingForm({
      doctor: '',
      date: '',
      time: '',
      reason: '',
      type: 'in-person',
    });

  const handleBookingChange = (field, value) => {
    setBookingForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleBookingSubmit = (event) => {
    event.preventDefault();
    if (!bookingForm.doctor || !bookingForm.date || !bookingForm.time || !bookingForm.reason) {
      toast.error('Please complete all booking fields');
      return;
    }

    const startTime = new Date(`${bookingForm.date}T${bookingForm.time}`);
    if (Number.isNaN(startTime.getTime())) {
      toast.error('Choose a valid date and time');
      return;
    }
    const endTime = new Date(startTime.getTime() + 30 * 60000);

    if (demoMode) {
      toast.success('Demo: appointment request captured');
      resetBookingForm();
      return;
    }

    setIsBooking(true);
    dispatch(
      createAppointment({
        doctor: bookingForm.doctor,
        startTime,
        endTime,
        type: bookingForm.type,
        reason: bookingForm.reason,
        status: 'scheduled',
      })
    )
      .unwrap()
      .then(() => {
        toast.success('Appointment requested successfully');
        resetBookingForm();
        dispatch(getAppointments());
      })
      .catch((error) => {
        toast.error(error || 'Unable to book appointment right now');
      })
      .finally(() => setIsBooking(false));
  };

  const bookingInputClass = `${
    isDark
      ? 'border-gray-700 bg-gray-800 text-gray-100 placeholder-gray-400'
      : 'border-gray-200 bg-white text-gray-900 placeholder-gray-500'
  } mt-1 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:ring-offset-0`;
  const cardSurfaceClass = isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200';

  const cards = [
    {
      name: "Today's Appointments",
      value: (todayAppointments && todayAppointments.length) || stats.appointments.today,
      href: '/appointments',
      icon: CalendarIcon,
      iconBg: 'bg-primary-500',
      change: '+5%',
      changeType: 'increase',
    },
    {
      name: 'Total Patients',
      value: stats.patients.total,
      href: '/patients',
      icon: UserIcon,
      iconBg: 'bg-secondary-500',
      change: '+12%',
      changeType: 'increase',
    },
    {
      name: 'Upcoming Telehealth',
      value: stats.telehealth.upcoming,
      href: '/telehealth',
      icon: VideoCameraIcon,
      iconBg: 'bg-indigo-500',
      change: '+2',
      changeType: 'increase',
    },
    {
      name: 'Monthly Revenue',
      value: formatCurrency(stats.revenue.thisMonth),
      href: '/billing',
      icon: CurrencyDollarIcon,
      iconBg: 'bg-green-500',
      change: '+8%',
      changeType: 'increase',
    },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };
  const displayName = resolvedUser?.firstName || resolvedUser?.name?.split(' ')[0] || 'User';
  const greetingSubtitle = isPatient
    ? 'Stay on top of your care plan with quick actions below.'
    : "Here's what's happening with your practice today.";

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
          {getGreeting()}, {displayName}!
        </h1>
        <p className={`mt-1 text-sm ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
          {greetingSubtitle}
        </p>
      </div>

      {showDoctorView && (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.name}
                  to={card.href}
                  className={`overflow-hidden hover:shadow-md transition duration-300 rounded-lg ${
                    isDark ? 'bg-gray-800 border border-gray-700 hover:bg-gray-700' : 'bg-white border border-gray-200 shadow'
                  }`}
                >
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 rounded-md ${card.iconBg} p-3`}>
                        <Icon className="h-6 w-6 text-white" aria-hidden="true" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} truncate`}>
                            {card.name}
                          </dt>
                          <dd>
                            <div className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {card.value}
                            </div>
                            <div className={`flex items-center text-xs mt-1 ${card.changeType === 'increase' ? 'text-green-500' : 'text-red-500'}`}>
                              {card.changeType === 'increase' ? <ArrowUpIcon className="h-3 w-3 mr-1" /> : <ArrowDownIcon className="h-3 w-3 mr-1" />}
                              <span>{card.change}</span>
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className={`${cardSurfaceClass} overflow-hidden rounded-lg shadow`}>
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
              <h3 className={`text-lg leading-6 font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Upcoming Appointments</h3>
              <Link to="/appointments" className={`text-sm font-medium ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-500'}`}>
                View all
              </Link>
            </div>

            <ul role="list" className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {upcomingAppointmentsList && upcomingAppointmentsList.length > 0 ? (
                upcomingAppointmentsList.map((appointment) => (
                  <li
                    key={appointment.id || appointment._id}
                    className={`px-4 py-4 sm:px-6 hover:${isDark ? 'bg-gray-700' : 'bg-gray-50'} cursor-pointer transition-colors duration-150`}
                    onClick={() => handleAppointmentClick(appointment.id || appointment._id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${appointment.isVirtual ? 'bg-indigo-100 text-indigo-500' : 'bg-blue-100 text-blue-500'}`}>
                          {appointment.isVirtual ? <VideoCameraIcon className="h-5 w-5" /> : <UserGroupIcon className="h-5 w-5" />}
                        </div>
                        <div className="ml-4">
                          <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{appointment.patientName}</p>
                          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{appointment.type}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>{new Date(appointment.date).toLocaleDateString()}</p>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{appointment.time}</p>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="px-4 py-8 sm:px-6 text-center">
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>No upcoming appointments.</p>
                  <Link to="/appointments/new" className={`inline-block mt-2 text-sm font-medium ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-500'}`}>
                    Schedule an appointment
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div className={`${cardSurfaceClass} overflow-hidden rounded-lg shadow`}>
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
              <h3 className={`text-lg leading-6 font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Recent Patients</h3>
              <Link to="/patients" className={`text-sm font-medium ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-500'}`}>View all</Link>
            </div>

            <ul role="list" className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {recentPatients && recentPatients.length > 0 ? (
                recentPatients.map((patient) => (
                  <li key={patient.id} className={`px-4 py-4 sm:px-6 hover:${isDark ? 'bg-gray-700' : 'bg-gray-50'} cursor-pointer transition-colors duration-150`} onClick={() => navigate(`/patients/${patient.id}`)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`h-10 w-10 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center`}>
                          <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            {patient.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-4">
                          <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{patient.name}</p>
                          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{patient.age} years, {patient.gender}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isDark ? 'bg-indigo-900 text-indigo-300' : 'bg-indigo-100 text-indigo-800'}`}>
                          {patient.condition}
                        </div>
                        <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Last visit: {new Date(patient.lastVisit).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="px-4 py-8 sm:px-6 text-center">
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>No patients yet.</p>
                  <Link to="/patients/new" className={`inline-block mt-2 text-sm font-medium ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-500'}`}>Add a patient</Link>
                </li>
              )}
            </ul>
          </div>
        </>
      )}

      {isPatient && (
        <>
          <div className="grid gap-5 lg:grid-cols-3">
            <div
              className={`rounded-2xl border p-6 lg:col-span-2 ${
                isDark
                  ? 'border-primary-500/30 bg-gradient-to-br from-primary-900/40 via-gray-900 to-primary-800/40'
                  : 'border-primary-100 bg-gradient-to-br from-emerald-50 via-white to-cyan-50'
              }`}
            >
              <p className={`text-xs font-semibold uppercase tracking-[0.3em] ${isDark ? 'text-primary-200' : 'text-primary-600'}`}>
                Next appointment
              </p>
              <h3 className={`mt-2 text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{nextAppointmentSummary.headline}</h3>
              <p className={`mt-1 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{nextAppointmentSummary.subline}</p>
              {nextAppointmentSummary.meta && (
                <div className={`mt-4 inline-flex items-center rounded-full px-4 py-1 text-xs font-semibold ${isDark ? 'bg-white/10 text-white' : 'bg-primary-100 text-primary-700'}`}>
                  {nextAppointmentSummary.meta}
                </div>
              )}
              <div className="mt-6 flex flex-wrap gap-3 text-sm">
                <Link
                  to="/appointments"
                  className={`inline-flex items-center rounded-full px-4 py-2 font-semibold ${isDark ? 'bg-white/10 text-white' : 'bg-white text-primary-700 border border-primary-200'}`}
                >
                  View schedule
                </Link>
                <Link
                  to="/appointments/new"
                  className="inline-flex items-center rounded-full bg-gradient-to-r from-primary-600 to-teal-500 px-4 py-2 font-semibold text-white"
                >
                  Book new visit
                </Link>
              </div>
            </div>
            <div className={`${cardSurfaceClass} rounded-2xl p-6`}>
              <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Care team availability</p>
              <p className={`mt-3 text-3xl font-bold ${isDark ? 'text-primary-200' : 'text-primary-600'}`}>
                {doctorOptions.length || (demoMode ? DEMO_DOCTORS.length : 0)}
              </p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Doctors currently accepting requests
              </p>
              <div className={`mt-4 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {isLoadingDoctors ? 'Updating doctor list…' : 'Pick a clinician below and send a booking request.'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {patientCards.map((card) => (
              <div key={card.title} className={`${cardSurfaceClass} rounded-2xl p-5`}>
                <p className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{card.title}</p>
                <p className={`mt-2 text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{card.value}</p>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{card.description}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
            <div className={`${cardSurfaceClass} rounded-2xl shadow`}>
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Upcoming appointments</h3>
                <Link to="/appointments" className={`text-sm font-medium ${isDark ? 'text-indigo-300 hover:text-indigo-200' : 'text-indigo-600 hover:text-indigo-500'}`}>
                  View schedule
                </Link>
              </div>
              <ul className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {patientUpcomingAppointments && patientUpcomingAppointments.length > 0 ? (
                  patientUpcomingAppointments.slice(0, 5).map((appointment) => {
                    const isTelehealth = (appointment.type || '').toLowerCase() === 'telehealth';
                    const badgeClasses = isTelehealth
                      ? isDark
                        ? 'bg-indigo-900 text-indigo-300'
                        : 'bg-indigo-50 text-indigo-600'
                      : isDark
                      ? 'bg-emerald-900 text-emerald-300'
                      : 'bg-emerald-50 text-emerald-700';
                    return (
                      <li key={appointment.id || appointment._id} className="px-6 py-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{getDoctorDisplayName(appointment)}</p>
                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{appointment.reason || 'General consultation'}</p>
                          </div>
                          <div className="text-right">
                            <p className={`text-sm font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{formatAppointmentDate(appointment)}</p>
                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{formatAppointmentTime(appointment)}</p>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between text-xs">
                          <span className={`inline-flex items-center rounded-full px-3 py-0.5 font-medium ${badgeClasses}`}>
                            {(appointment.type || 'In-person').replace('-', ' ')}
                          </span>
                          <span className={`font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            {(appointment.status || 'scheduled').toUpperCase()}
                          </span>
                        </div>
                      </li>
                    );
                  })
                ) : (
                  <li className="px-6 py-10 text-center text-sm">
                    <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>No confirmed visits yet.</p>
                    <Link to="/appointments/new" className={`mt-2 inline-block font-semibold ${isDark ? 'text-indigo-300 hover:text-indigo-200' : 'text-indigo-600 hover:text-indigo-500'}`}>
                      Book your first appointment
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            <div className={`${cardSurfaceClass} rounded-2xl shadow`}>
              <div className="border-b border-gray-200 px-6 py-4">
                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Book a new appointment</h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Send a request to your care team in seconds.
                </p>
              </div>
              <form className="space-y-4 px-6 py-5" onSubmit={handleBookingSubmit}>
                <div>
                  <label className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Choose doctor</label>
                  <select
                    className={bookingInputClass}
                    value={bookingForm.doctor}
                    onChange={(event) => handleBookingChange('doctor', event.target.value)}
                    disabled={isLoadingDoctors}
                  >
                    <option value="">
                      {isLoadingDoctors ? 'Loading doctors…' : 'Select a doctor'}
                    </option>
                    {selectableDoctors.map((doc) => (
                      <option key={doc._id || doc.id} value={doc._id || doc.id}>
                        Dr. {doc.firstName} {doc.lastName} {doc.specialization ? `· ${doc.specialization}` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Date</label>
                    <input
                      type="date"
                      className={bookingInputClass}
                      value={bookingForm.date}
                      onChange={(event) => handleBookingChange('date', event.target.value)}
                    />
                  </div>
                  <div>
                    <label className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Time</label>
                    <input
                      type="time"
                      className={bookingInputClass}
                      value={bookingForm.time}
                      onChange={(event) => handleBookingChange('time', event.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Visit type</label>
                  <select
                    className={bookingInputClass}
                    value={bookingForm.type}
                    onChange={(event) => handleBookingChange('type', event.target.value)}
                  >
                    <option value="in-person">In-person</option>
                    <option value="telehealth">Telehealth</option>
                  </select>
                </div>
                <div>
                  <label className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Reason</label>
                  <textarea
                    rows={3}
                    className={bookingInputClass}
                    placeholder="Tell your care team what you need help with"
                    value={bookingForm.reason}
                    onChange={(event) => handleBookingChange('reason', event.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isBooking || isLoadingDoctors}
                  className={`w-full rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-lg transition ${
                    isBooking || isLoadingDoctors
                      ? 'cursor-not-allowed bg-gray-500/70'
                      : 'bg-gradient-to-r from-primary-600 to-teal-500 hover:-translate-y-0.5 hover:shadow-xl'
                  }`}
                >
                  {isBooking ? 'Sending request…' : 'Book appointment'}
                </button>
              </form>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className={`${cardSurfaceClass} rounded-2xl p-6 relative overflow-hidden`}>
              <div className="absolute inset-0 pointer-events-none opacity-30" aria-hidden="true">
                <div className="absolute -right-10 top-0 h-32 w-32 rounded-full bg-indigo-300 blur-3xl"></div>
                <div className="absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-cyan-300 blur-3xl"></div>
              </div>
              <p className={`text-xs font-semibold uppercase tracking-[0.3em] ${isDark ? 'text-indigo-200' : 'text-indigo-600'}`}>
                Telehealth
              </p>
              <h3 className={`mt-2 text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {telehealthSpotlight.headline}
              </h3>
              <p className={`mt-1 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{telehealthSpotlight.subline}</p>
              {telehealthSpotlight.meta && (
                <p className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${isDark ? 'bg-white/10 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
                  {telehealthSpotlight.meta}
                </p>
              )}
              <div className="mt-6 flex flex-wrap gap-3 text-sm">
                <Link
                  to="/telehealth"
                  className={`inline-flex items-center rounded-full px-4 py-2 font-semibold ${isDark ? 'bg-white/10 text-white' : 'bg-white text-indigo-700 border border-indigo-100'}`}
                >
                  Open telehealth hub
                </Link>
                <button
                  type="button"
                  onClick={() => navigate('/appointments/new')}
                  className="inline-flex items-center rounded-full bg-gradient-to-r from-indigo-600 to-primary-500 px-4 py-2 font-semibold text-white shadow"
                >
                  Schedule virtual visit
                </button>
              </div>
            </div>

            <div className={`${cardSurfaceClass} rounded-2xl p-6`}>
              <p className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Billing snapshot</p>
              <p className={`mt-4 text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {formatCurrency(patientBillingSnapshot.outstanding, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Outstanding balance</p>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Next due</span>
                  <span className={isDark ? 'text-white' : 'text-gray-900'}>{patientBillingSnapshot.nextDue}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Payment method</span>
                  <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{patientBillingSnapshot.method}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Autopay</span>
                  <span className={`font-semibold ${patientBillingSnapshot.autopay ? 'text-emerald-500' : 'text-amber-500'}`}>
                    {patientBillingSnapshot.autopay ? 'Enabled' : 'Off'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Last payment</span>
                  <span className={isDark ? 'text-white' : 'text-gray-900'}>{patientBillingSnapshot.lastPayment}</span>
                </div>
              </div>
              <Link
                to="/billing"
                className="mt-6 inline-flex items-center rounded-xl bg-gradient-to-r from-primary-600 to-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow"
              >
                Go to billing center
              </Link>
            </div>

            <div className={`${cardSurfaceClass} rounded-2xl p-6`}>
              <p className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Care plan tasks</p>
              <ul className="mt-4 space-y-3">
                {patientCareTasks.map((task) => (
                  <li key={task.id} className="flex items-start justify-between">
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        readOnly
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <div className="ml-3">
                        <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{task.label}</p>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{task.due}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-semibold ${task.completed ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {task.completed ? 'Done' : 'Due'}
                    </span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => navigate('/appointments/new')}
                className="mt-6 inline-flex items-center rounded-xl border border-dashed border-primary-300 px-4 py-2 text-sm font-semibold text-primary-600"
              >
                Add care task
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
