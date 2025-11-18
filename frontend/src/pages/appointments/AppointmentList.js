import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAppointments, reset } from '../../features/appointments/appointmentSlice';
import {
  CalendarIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  VideoCameraIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { useTheme } from '../../context/ThemeContext';
import { DEMO_UPCOMING_APPOINTMENTS } from '../../utils/demoData';
import { isInDemoMode } from '../../utils/demoUtils';

const AppointmentList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { appointments, isLoading, isError, message } = useSelector(
    (state) => state.appointments
  );
  const { theme } = useTheme();

  const isDark = theme === 'dark';
  const demoMode = isInDemoMode();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentView, setCurrentView] = useState('list'); // 'list' or 'calendar'

  const userRole = useMemo(() => {
    if (!user) return 'patient';
    return user.role || user.data?.user?.role || user.user?.role || 'patient';
  }, [user]);

  const appointmentsArray = useMemo(() => {
    if (Array.isArray(appointments)) return appointments;
    if (Array.isArray(appointments?.appointments)) return appointments.appointments;
    return [];
  }, [appointments]);

  const displayAppointments = useMemo(() => {
    if (appointmentsArray.length) return appointmentsArray;
    if (demoMode) return DEMO_UPCOMING_APPOINTMENTS;
    return [];
  }, [appointmentsArray, demoMode]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (!user) {
      navigate('/login');
      return;
    }

    dispatch(getAppointments());

    return () => {
      dispatch(reset());
    };
  }, [user, navigate, isError, message, dispatch]);

  const buildName = (entity, fallback = 'Not provided') => {
    if (!entity) return fallback;
    if (typeof entity === 'string') return entity;
    if (entity.fullName) return entity.fullName;
    const first = entity.firstName || entity.name || '';
    const last = entity.lastName || '';
    const combined = `${first} ${last}`.trim();
    return combined || entity.email || fallback;
  };

  const getPatientName = (appointment) =>
    appointment.patientName || buildName(appointment.patient, 'Patient');

  const getDoctorName = (appointment) =>
    appointment.doctorName || buildName(appointment.doctor, 'Doctor');

  const getAppointmentStart = (appointment) => {
    if (!appointment) return null;
    if (appointment.startTime) {
      const parsed = new Date(appointment.startTime);
      if (!Number.isNaN(parsed.getTime())) return parsed;
    }
    if (appointment.date) {
      const parsed = new Date(appointment.date);
      if (!Number.isNaN(parsed.getTime())) return parsed;
    }
    return null;
  };

  const formatDateValue = (date, options) => {
    if (!date || Number.isNaN(date.getTime())) {
      return 'To be scheduled';
    }
    return date.toLocaleString(undefined, options);
  };

  const formatAppointmentDate = (appointment) =>
    formatDateValue(getAppointmentStart(appointment), { month: 'short', day: 'numeric', year: 'numeric' });

  const formatAppointmentTime = (appointment) =>
    formatDateValue(getAppointmentStart(appointment), { hour: '2-digit', minute: '2-digit' });

  const formatAppointmentHeadline = (appointment) =>
    formatDateValue(getAppointmentStart(appointment), {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const filteredAppointments = useMemo(() => {
    return displayAppointments.filter((appointment) => {
      const patientName = getPatientName(appointment).toLowerCase();
      const doctorName = getDoctorName(appointment).toLowerCase();
      const reason = (appointment.reason || '').toLowerCase();
      const term = searchTerm.toLowerCase();

      const matchesSearch =
        !term ||
        patientName.includes(term) ||
        doctorName.includes(term) ||
        reason.includes(term) ||
        (appointment.status || '').toLowerCase().includes(term) ||
        (appointment.type || '').toLowerCase().includes(term);

      const normalizedStatus = (appointment.status || 'scheduled').toLowerCase();
      const matchesStatus = filterStatus === 'all' || normalizedStatus === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [displayAppointments, searchTerm, filterStatus]);

  const upcomingAppointments = useMemo(() => {
    const now = Date.now();
    return displayAppointments
      .filter((appointment) => {
        const start = getAppointmentStart(appointment);
        return start && start.getTime() >= now;
      })
      .sort((a, b) => {
        const startA = getAppointmentStart(a)?.getTime() || 0;
        const startB = getAppointmentStart(b)?.getTime() || 0;
        return startA - startB;
      });
  }, [displayAppointments]);

  const nextAppointment = upcomingAppointments[0] || filteredAppointments[0] || null;

  const appointmentStats = useMemo(() => {
    const now = Date.now();
    let upcoming = 0;
    let telehealth = 0;
    let completed = 0;
    let cancelled = 0;

    displayAppointments.forEach((appointment) => {
      const status = (appointment.status || 'scheduled').toLowerCase();
      if (status === 'completed') completed += 1;
      if (status === 'cancelled') cancelled += 1;

      const start = getAppointmentStart(appointment);
      if (start && start.getTime() >= now) {
        upcoming += 1;
        if ((appointment.type || '').toLowerCase() === 'telehealth') {
          telehealth += 1;
        }
      }
    });

    return { upcoming, telehealth, completed, cancelled };
  }, [displayAppointments]);

  const summaryCards = [
    { label: 'Upcoming visits', value: appointmentStats.upcoming, hint: 'Next 30 days' },
    { label: 'Telehealth ready', value: appointmentStats.telehealth, hint: 'Virtual sessions queued' },
    { label: 'Completed visits', value: appointmentStats.completed, hint: 'Lifetime total' },
    { label: 'Cancelled/no-show', value: appointmentStats.cancelled, hint: 'Needs follow-up' },
  ];

  const cardSurface = isDark
    ? 'bg-gray-900 border border-gray-800'
    : 'bg-white border border-gray-100 shadow-sm';

  const heroSurface = isDark
    ? 'border border-primary-500/30 bg-gradient-to-br from-primary-900/40 via-gray-900 to-indigo-900/40 text-white'
    : 'border border-primary-100 bg-gradient-to-br from-primary-50 via-white to-cyan-50';

  const filterInputClass = `${
    isDark
      ? 'bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500'
      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
  } block w-full rounded-2xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40`;

  const selectClass = `${
    isDark
      ? 'bg-gray-900 border-gray-700 text-gray-100'
      : 'bg-white border-gray-200 text-gray-900'
  } block w-full rounded-2xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40`;

  const toggleButtonClass = (active) =>
    `${
      active
        ? isDark
          ? 'bg-primary-600/30 text-primary-200 border-primary-500/60'
          : 'bg-primary-50 text-primary-700 border-primary-200'
        : isDark
          ? 'text-gray-400 border-gray-700'
          : 'text-gray-500 border-gray-200'
    } inline-flex items-center rounded-2xl border px-3 py-2 text-xs font-semibold transition`;

  const heroSummary = nextAppointment
    ? {
        label: 'Next visit',
        headline: formatAppointmentHeadline(nextAppointment),
        subline: `${userRole === 'doctor' ? getPatientName(nextAppointment) : getDoctorName(nextAppointment)} · ${(nextAppointment.type || 'In-person').replace('-', ' ')}`,
        meta: nextAppointment.reason || 'Care coordination',
        actionLabel: userRole === 'doctor' ? 'Manage visit' : 'View visit details',
        actionHref: `/appointments/${nextAppointment._id || nextAppointment.id || ''}`,
      }
    : {
        label: 'No visits booked',
        headline: 'You have no appointments scheduled',
        subline: 'Book a visit to stay on track with your care plan.',
        meta: null,
        actionLabel: 'Book visit',
        actionHref: '/appointments/new',
      };

  const heroActionHref = heroSummary.actionHref || '/appointments';
  const heroActionLabel = heroSummary.actionLabel || 'View appointment';

  const nextTelehealth = upcomingAppointments.find(
    (appointment) => (appointment.type || '').toLowerCase() === 'telehealth'
  );

  const telehealthInfo = nextTelehealth
    ? {
        status: 'Ready to join',
        time: formatAppointmentHeadline(nextTelehealth),
        doctor: userRole === 'doctor' ? getPatientName(nextTelehealth) : getDoctorName(nextTelehealth),
      }
    : {
        status: 'No virtual visit scheduled',
        time: 'Book a telehealth session to connect remotely.',
        doctor: null,
      };

  const quickActions = [
    {
      id: 'telehealth',
      icon: VideoCameraIcon,
      label: 'Start telehealth',
      description: telehealthInfo.time,
      badge: telehealthInfo.status,
      action: () => navigate('/telehealth'),
      cta: 'Go to telehealth',
    },
    {
      id: 'message',
      icon: ChatBubbleLeftRightIcon,
      label: 'Message care team',
      description: 'Send updates, share symptoms, or ask questions securely.',
      badge: 'Average reply · 2h',
      action: () => navigate('/contact'),
      cta: 'Open messages',
    },
    {
      id: 'history',
      icon: ClockIcon,
      label: 'Visit history',
      description: 'Review past visits, notes, and care plans anytime.',
      badge: `${appointmentStats.completed} completed`,
      action: () => setFilterStatus('completed'),
      cta: 'Filter completed',
    },
  ];

  // Get status badge color
  const getStatusColor = (status) => {
    const normalized = (status || '').toLowerCase();
    switch (normalized) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'no-show':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeBadgeClasses = (appointment) => {
    const isTelehealth = (appointment.type || '').toLowerCase() === 'telehealth';
    if (isTelehealth) {
      return isDark ? 'bg-indigo-900/50 text-indigo-300 border border-indigo-500/30' : 'bg-indigo-50 text-indigo-700 border border-indigo-100';
    }
    return isDark ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-600/40' : 'bg-emerald-50 text-emerald-700 border border-emerald-100';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className={`${heroSurface} relative overflow-hidden rounded-3xl p-8`}>
          <div className="absolute inset-0 pointer-events-none opacity-40">
            <div className="absolute -right-10 top-6 h-48 w-48 rounded-full bg-primary-400 blur-3xl"></div>
            <div className="absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-cyan-400 blur-3xl"></div>
          </div>
          <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className={`text-xs font-semibold uppercase tracking-[0.35em] ${isDark ? 'text-primary-200' : 'text-primary-600'}`}>
                {heroSummary.label}
              </p>
              <h1 className={`mt-3 text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {heroSummary.headline}
              </h1>
              <p className={`mt-2 text-sm ${isDark ? 'text-gray-200' : 'text-gray-600'}`}>
                {heroSummary.subline}
              </p>
              {heroSummary.meta && (
                <p className={`mt-3 inline-flex rounded-full px-4 py-1 text-xs font-semibold ${isDark ? 'bg-white/10 text-white' : 'bg-primary-100 text-primary-700'}`}>
                  {heroSummary.meta}
                </p>
              )}
              <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
                <Link
                  to={heroActionHref}
                  className={`${isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-white text-primary-700 hover:text-primary-900'} inline-flex items-center rounded-full px-5 py-2`}
                >
                  {heroActionLabel}
                </Link>
                <Link
                  to="/appointments/new"
                  className="inline-flex items-center rounded-full bg-gradient-to-r from-primary-600 to-emerald-500 px-5 py-2 text-white shadow-lg shadow-primary-500/30"
                >
                  <PlusIcon className="mr-1 h-4 w-4" /> Book visit
                </Link>
              </div>
            </div>
            {nextAppointment && (
              <div className={`${isDark ? 'bg-white/5' : 'bg-white/80'} rounded-2xl p-5 backdrop-blur`}> 
                <p className={`text-xs font-semibold uppercase ${isDark ? 'text-primary-100' : 'text-primary-600'}`}>
                  Quick glance
                </p>
                <p className={`mt-2 text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {formatAppointmentDate(nextAppointment)} · {formatAppointmentTime(nextAppointment)}
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-200' : 'text-gray-600'}`}>
                  {nextAppointment.reason || 'General consultation'}
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs">
                  <span className={`rounded-full px-3 py-1 font-semibold ${getTypeBadgeClasses(nextAppointment)}`}>
                    {(nextAppointment.type || 'In-person').replace('-', ' ')}
                  </span>
                  <span className={`rounded-full bg-white/10 px-3 py-1 font-semibold ${isDark ? 'text-white' : 'text-gray-700'}`}>
                    {userRole === 'doctor' ? getPatientName(nextAppointment) : getDoctorName(nextAppointment)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {summaryCards.map((card) => (
            <div key={card.label} className={`${cardSurface} rounded-2xl p-5`}>
              <p className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {card.label}
              </p>
              <p className={`mt-2 text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{card.value}</p>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{card.hint}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.3fr,0.7fr]">
          <div className={`${cardSurface} rounded-2xl overflow-hidden`}>
            <div className={`flex flex-col gap-6 border-b ${isDark ? 'border-gray-800' : 'border-gray-100'} px-6 py-5 lg:flex-row lg:items-center lg:justify-between`}>
              <div className="relative w-full lg:max-w-lg">
                <MagnifyingGlassIcon className={`absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                <input
                  type="text"
                  className={filterInputClass}
                  placeholder="Search doctor, patient, or reason"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex w-full flex-wrap gap-3 lg:w-auto lg:flex-nowrap">
                <select
                  className={selectClass}
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All statuses</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="in-progress">In Progress</option>
                  <option value="no-show">No Show</option>
                </select>
                <div className="flex gap-2">
                  <button type="button" className={toggleButtonClass(currentView === 'list')} onClick={() => setCurrentView('list')}>
                    List
                  </button>
                  <button type="button" className={toggleButtonClass(currentView === 'calendar')} onClick={() => setCurrentView('calendar')}>
                    <CalendarIcon className="mr-1 h-4 w-4" /> Calendar
                  </button>
                </div>
              </div>
            </div>

            {currentView === 'list' ? (
              <ul className={`divide-y ${isDark ? 'divide-gray-800' : 'divide-gray-100'}`}>
                {filteredAppointments.length === 0 ? (
                  <li className="px-6 py-10 text-center text-sm">
                    <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>No appointments found</p>
                    <Link to="/appointments/new" className={`mt-2 inline-flex font-semibold ${isDark ? 'text-primary-200 hover:text-primary-100' : 'text-primary-600 hover:text-primary-500'}`}>
                      Book your next visit
                    </Link>
                  </li>
                ) : (
                  filteredAppointments.map((appointment, index) => {
                    const key = appointment._id || appointment.id || index;
                    const typeLabel = (appointment.type || 'in-person').replace('-', ' ');
                    const statusLabel = (appointment.status || 'scheduled').toLowerCase();
                    const detailHref = appointment._id ? `/appointments/${appointment._id}` : '/appointments';
                    const showEdit = userRole === 'doctor';
                    return (
                      <li key={key} className={`px-6 py-5 transition ${isDark ? 'hover:bg-gray-900/60' : 'hover:bg-gray-50'}`}>
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                          <div>
                            <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {showEdit ? getPatientName(appointment) : getDoctorName(appointment)}
                            </p>
                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                              {appointment.reason || 'General consultation'}
                            </p>
                          </div>
                          <div className="text-sm text-right">
                            <p className={isDark ? 'text-gray-200' : 'text-gray-700'}>{formatAppointmentDate(appointment)}</p>
                            <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>{formatAppointmentTime(appointment)}</p>
                          </div>
                        </div>
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          <span className={`inline-flex items-center rounded-full px-3 py-0.5 text-xs font-semibold ${getTypeBadgeClasses(appointment)}`}>
                            {typeLabel}
                          </span>
                          <span className={`inline-flex items-center rounded-full px-3 py-0.5 text-xs font-semibold ${getStatusColor(statusLabel)}`}>
                            {statusLabel.replace('-', ' ')}
                          </span>
                          <div className="ml-auto flex items-center gap-4 text-xs font-semibold">
                            {showEdit ? (
                              <Link to={`${detailHref}/edit`} className={isDark ? 'text-primary-200 hover:text-primary-100' : 'text-primary-600 hover:text-primary-500'}>
                                Edit
                              </Link>
                            ) : (
                              <Link to={detailHref} className={isDark ? 'text-primary-200 hover:text-primary-100' : 'text-primary-600 hover:text-primary-500'}>
                                View details
                              </Link>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })
                )}
              </ul>
            ) : (
              <div className={`px-6 py-10 text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Calendar view coming soon...
              </div>
            )}
          </div>

          <div className={`${cardSurface} rounded-2xl p-6 space-y-6`}>
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Telehealth status
              </p>
              <p className={`mt-3 text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {telehealthInfo.status}
              </p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{telehealthInfo.time}</p>
              {telehealthInfo.doctor && (
                <p className={`mt-1 text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>with {telehealthInfo.doctor}</p>
              )}
              <Link
                to="/telehealth"
                className="mt-4 inline-flex items-center rounded-xl bg-gradient-to-r from-indigo-600 to-primary-500 px-4 py-2 text-sm font-semibold text-white shadow"
              >
                Open telehealth hub
              </Link>
            </div>

            <div className={`border-t ${isDark ? 'border-gray-800' : 'border-gray-100'} pt-4`}>
              <p className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Quick actions
              </p>
              <ul className="mt-4 space-y-3">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <li key={action.id}>
                      <button
                        type="button"
                        onClick={action.action}
                        className={`${
                          isDark ? 'hover:bg-gray-800/80' : 'hover:bg-gray-50'
                        } flex w-full items-center justify-between rounded-2xl border border-dashed px-4 py-3 text-left transition`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`${
                            isDark ? 'bg-gray-800 text-primary-200' : 'bg-primary-50 text-primary-600'
                          } rounded-full p-2`}>
                            <Icon className="h-4 w-4" />
                          </span>
                          <div>
                            <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{action.label}</p>
                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{action.description}</p>
                          </div>
                        </div>
                        <div className="text-right text-xs font-semibold">
                          <p className={isDark ? 'text-primary-200' : 'text-primary-600'}>{action.cta}</p>
                          <p className={`mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{action.badge}</p>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentList;
