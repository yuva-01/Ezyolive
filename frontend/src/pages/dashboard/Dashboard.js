import React, { useState, useEffect, useMemo } from 'react';
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
import { getAppointments } from '../../features/appointments/appointmentSlice';
import { DEMO_STATS, DEMO_UPCOMING_APPOINTMENTS, DEMO_RECENT_PATIENTS } from '../../utils/demoData';
import { isInDemoMode } from '../../utils/demoUtils';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
  const appointments = useSelector((state) => state.appointments.appointments);
  const isLoading = useSelector((state) => state.appointments.isLoading);
  const isError = useSelector((state) => state.appointments.isError);
  const message = useSelector((state) => state.appointments.message);

  const [stats, setStats] = useState({
    appointments: { today: 0, upcoming: 0, total: 0 },
    patients: { total: 0, new: 0 },
    revenue: { today: 0, thisMonth: 0, outstanding: 0 },
    telehealth: { upcoming: 0 },
  });
  const [upcomingAppointmentsList, setUpcomingAppointmentsList] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Fetch appointments when user available (and not demo)
  useEffect(() => {
    if (isInDemoMode()) return;
    if (user) {
      dispatch(getAppointments());
    }
  }, [user, dispatch]);

  // Set demo data / initial stats safely and clean up timeout
  useEffect(() => {
    if (isInDemoMode()) {
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
  }, []); // run once on mount

  // If appointments change, compute upcoming appointments (next 7 days)
  useEffect(() => {
    if (isInDemoMode()) return setUpcomingAppointmentsList(DEMO_UPCOMING_APPOINTMENTS);
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
  }, [appointments]);

  // Compute today's appointments using useMemo (derived value, no state set)
  const todayAppointments = useMemo(() => {
    if (isInDemoMode()) return DEMO_UPCOMING_APPOINTMENTS.filter(a => {
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
  }, [appointments]);

  // Show API errors via toast (only for non-demo)
  useEffect(() => {
    if (isError && !isInDemoMode()) {
      toast.error(message || 'Failed to load data');
    }
  }, [isError, message]);

  const handleAppointmentClick = (appointmentId) => {
    navigate(`/appointments/${appointmentId}`);
  };

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
      value: `$${stats.revenue.thisMonth.toLocaleString()}`,
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
          {getGreeting()}, {user?.firstName || user?.name?.split(' ')[0] || 'User'}!
        </h1>
        <p className={`mt-1 text-sm ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
          Here's what's happening with your practice today.
        </p>
      </div>

      {/* Stat cards */}
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

      {/* Upcoming appointments */}
      <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} overflow-hidden border rounded-lg shadow`}>
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

      {/* Recent patients */}
      <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} overflow-hidden border rounded-lg shadow`}>
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
    </div>
  );
};

export default Dashboard;
