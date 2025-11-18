import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ChartBarIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  SignalIcon,
  UserGroupIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';
import { getAppointments } from '../../features/appointments/appointmentSlice';
import { getUsers } from '../../features/users/userSlice';
import { DEMO_STATS, DEMO_UPCOMING_APPOINTMENTS, DEMO_DOCTORS } from '../../utils/demoData';
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

const AnalyticsPage = () => {
  const dispatch = useDispatch();
  const { appointments, isLoading: appointmentsLoading } = useSelector((state) => state.appointments);
  const { users, isLoading: usersLoading } = useSelector((state) => state.users);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const demoMode = isInDemoMode();

  useEffect(() => {
    if (!demoMode) {
      dispatch(getAppointments());
      dispatch(getUsers());
    }
  }, [demoMode, dispatch]);

  const appointmentCollection = useMemo(
    () => getAppointmentCollection(appointments, demoMode),
    [appointments, demoMode]
  );

  const totalAppointments = appointmentCollection.length || DEMO_STATS.appointments.total;
  const telehealthVolume = appointmentCollection.filter((appt) => appt.isVirtual || (appt.type || '').toLowerCase() === 'telehealth').length;
  const completionRate = Math.round((totalAppointments ? (totalAppointments - 2) / totalAppointments : 0.92) * 100);
  const avgWaitTime = 7;
  const revenueRunRate = DEMO_STATS.revenue.thisMonth;

  const doctorLeaderboard = useMemo(() => {
    if (demoMode || !users?.length) {
      return DEMO_DOCTORS.map((doctor, index) => ({
        id: doctor.id,
        name: `${doctor.firstName} ${doctor.lastName}`,
        specialty: doctor.specialization,
        volume: 42 - index * 5,
        satisfaction: 94 - index * 3,
        telehealthShare: 0.5 + index * 0.1,
      }));
    }

    return users
      .filter((user) => user.role === 'doctor')
      .map((doctor) => {
        const doctorAppointments = appointmentCollection.filter((appt) => {
          const doctorId = appt.doctor?._id || appt.doctorId || appt.doctor?._id || appt.doctor;
          return doctorId === doctor._id;
        });
        const telehealthCount = doctorAppointments.filter(
          (appt) => appt.isVirtual || (appt.type || '').toLowerCase() === 'telehealth'
        ).length;
        return {
          id: doctor._id,
          name: `${doctor.firstName || doctor.name || ''} ${doctor.lastName || ''}`.trim() || doctor.email,
          specialty: doctor.specialization || doctor.speciality || doctor.role,
          volume: doctorAppointments.length,
          satisfaction: 92,
          telehealthShare: doctorAppointments.length
            ? telehealthCount / doctorAppointments.length
            : 0,
        };
      })
      .sort((a, b) => b.volume - a.volume);
  }, [appointmentCollection, demoMode, users]);

  const sparkData = [82, 84, 87, 91, 88, 94, 96];

  const metricCards = [
    {
      title: 'Visit volume',
      value: totalAppointments,
      delta: '+12% vs last week',
      icon: ChartBarIcon,
      accent: 'text-primary-500',
    },
    {
      title: 'Completion rate',
      value: `${completionRate}%`,
      delta: '+3.2 pts',
      icon: SignalIcon,
      accent: 'text-emerald-500',
    },
    {
      title: 'Avg wait time',
      value: `${avgWaitTime} min`,
      delta: '-1.8 min',
      icon: ClockIcon,
      accent: 'text-amber-500',
    },
    {
      title: 'Telehealth share',
      value: `${Math.round((telehealthVolume / Math.max(totalAppointments, 1)) * 100)}%`,
      delta: 'Goal: 40%',
      icon: GlobeAltIcon,
      accent: 'text-cyan-500',
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
        <section className={`${heroSurface} relative overflow-hidden rounded-3xl px-8 py-10`}>
          <div className="absolute inset-0 opacity-30">
            <div className="absolute -right-24 top-8 h-64 w-64 rounded-full bg-primary-400 blur-3xl" />
            <div className="absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-cyan-400 blur-3xl" />
          </div>
          <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className={`text-xs font-semibold uppercase tracking-[0.3em] ${isDark ? 'text-primary-100' : 'text-primary-700'}`}>
                Performance intelligence
              </p>
              <h1 className={`mt-2 text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Real-time visibility into care delivery
              </h1>
              <p className={`mt-3 text-sm ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                Stay ahead of demand, staffing, and quality targets with unified insights across virtual and in-clinic care.
              </p>
            </div>
            <div className={`${isDark ? 'bg-white/5 text-white' : 'bg-white text-gray-900'} rounded-2xl px-6 py-4 text-center shadow-lg`}>
              <p className="text-xs font-semibold uppercase tracking-[0.3em]">Net utilization</p>
              <p className="mt-1 text-4xl font-bold">96%</p>
              <p className="text-xs text-emerald-500">+4 pts vs goal</p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metricCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} className={`${cardSurface} rounded-2xl p-5`}>
                <div className="flex items-center gap-3">
                  <span className={`${isDark ? 'bg-gray-800 text-primary-200' : 'bg-primary-50 text-primary-600'} rounded-full p-2`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className={`text-xs uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{card.title}</p>
                    <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{card.value}</p>
                    <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{card.delta}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.4fr,0.6fr]">
          <div className={`${cardSurface} rounded-2xl p-6`}>
            <div className="flex items-start justify-between">
              <div>
                <p className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Visit mix
                </p>
                <h3 className={`mt-2 text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Throughput trend (rolling 6 weeks)
                </h3>
              </div>
              <button
                type="button"
                className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-xs font-semibold underline-offset-4 hover:underline`}
              >
                Export report
              </button>
            </div>
            <div className="mt-6 space-y-8">
              <div className="h-52 w-full">
                <div className="flex h-full items-end gap-2">
                  {sparkData.map((value, index) => (
                    <div key={`bar-${value}-${index}`} className="flex-1">
                      <div
                        className={`${isDark ? 'bg-primary-500/80' : 'bg-primary-500/90'} rounded-xl`}
                        style={{ height: `${value}%` }}
                      />
                      <p className={`mt-2 text-center text-[10px] uppercase ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        wk {index + 1}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Virtual capacity</p>
                  <p className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{Math.round((telehealthVolume / Math.max(totalAppointments, 1)) * 100)}%</p>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>+8 pts vs goal</p>
                </div>
                <div>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Clinic utilization</p>
                  <p className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>78%</p>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>-2 pts vs goal</p>
                </div>
                <div>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Care gaps closed</p>
                  <p className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>64</p>
                  <p className={`text-xs text-emerald-500`}>+11 this week</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className={`${cardSurface} rounded-2xl p-6`}>
              <div className="flex items-center justify-between">
                <p className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Financial pulse
                </p>
                <CurrencyDollarIcon className={`${isDark ? 'text-primary-200' : 'text-primary-500'} h-5 w-5`} />
              </div>
              <h3 className={`mt-3 text-3xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Rs {revenueRunRate.toLocaleString()}
              </h3>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Monthly run-rate · +14% YoY</p>
              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span>Collections</span>
                  <span className="font-semibold text-emerald-500">Rs 21.3k</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Outstanding AR</span>
                  <span className="font-semibold text-amber-500">Rs 4.5k</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Denial rate</span>
                  <span className="font-semibold text-red-500">2.1%</span>
                </div>
              </div>
            </div>

            <div className={`${cardSurface} rounded-2xl p-6`}>
              <div className="flex items-center justify-between">
                <p className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Operating levers
                </p>
                <AdjustmentsHorizontalIcon className={`${isDark ? 'text-primary-200' : 'text-primary-500'} h-5 w-5`} />
              </div>
              <ul className="mt-4 space-y-4 text-sm">
                {[
                  'Add 6 virtual slots on Wed/Thu',
                  'Shift nurse coverage to AM surge',
                  'Target post-discharge outreach within 24h',
                ].map((lever) => (
                  <li key={lever} className="flex items-start gap-3">
                    <span className={`${isDark ? 'bg-gray-800 text-primary-100' : 'bg-primary-50 text-primary-600'} mt-0.5 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase`}>
                      Action
                    </span>
                    <span className={isDark ? 'text-gray-200' : 'text-gray-800'}>{lever}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className={`${cardSurface} rounded-2xl p-6`}>
            <div className="flex items-center justify-between">
              <p className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Provider leaderboard
              </p>
              {(appointmentsLoading || usersLoading) && (
                <span className="text-xs text-primary-500">Refreshing…</span>
              )}
            </div>
            <div className="mt-4 space-y-4">
              {doctorLeaderboard.slice(0, 4).map((doctor, index) => (
                <div key={doctor.id || index} className={`rounded-2xl border px-4 py-3 ${isDark ? 'border-gray-800 bg-gray-900/70' : 'border-gray-100 bg-gray-50'}`}>
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{doctor.name}</p>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{doctor.specialty}</p>
                    </div>
                    <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-xs`}>#{index + 1}</span>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-4 text-xs">
                    <div>
                      <p className={`${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Volume</p>
                      <p className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{doctor.volume}</p>
                    </div>
                    <div>
                      <p className={`${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Satisfaction</p>
                      <p className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{doctor.satisfaction}%</p>
                    </div>
                    <div>
                      <p className={`${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Telehealth</p>
                      <p className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {Math.round(doctor.telehealthShare * 100)}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`${cardSurface} rounded-2xl p-6`}>
            <div className="flex items-center justify-between">
              <p className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Access signals
              </p>
              <ArrowTrendingUpIcon className={`${isDark ? 'text-primary-200' : 'text-primary-500'} h-6 w-6`} />
            </div>
            <div className="mt-6 space-y-6 text-sm">
              <div>
                <div className="flex items-center justify-between">
                  <span>Same-day capacity</span>
                  <span className="font-semibold text-emerald-500">92%</span>
                </div>
                <div className={`${isDark ? 'bg-gray-800' : 'bg-gray-100'} mt-2 h-2 rounded-full`}>
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: '92%' }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <span>Patient response time</span>
                  <span className="font-semibold text-amber-500">2h 14m</span>
                </div>
                <div className={`${isDark ? 'bg-gray-800' : 'bg-gray-100'} mt-2 h-2 rounded-full`}>
                  <div className="h-full rounded-full bg-amber-500" style={{ width: '65%' }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <span>Escalations resolved</span>
                  <span className="font-semibold text-primary-500">87%</span>
                </div>
                <div className={`${isDark ? 'bg-gray-800' : 'bg-gray-100'} mt-2 h-2 rounded-full`}>
                  <div className="h-full rounded-full bg-primary-500" style={{ width: '87%' }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <span>Care team bandwidth</span>
                  <span className="font-semibold text-rose-500">Tight</span>
                </div>
                <p className={`mt-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Tuesday mornings and Friday afternoons need staffing adjustments.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AnalyticsPage;
