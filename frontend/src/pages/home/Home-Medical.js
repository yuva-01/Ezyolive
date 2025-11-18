import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import {
  CalendarIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  ArrowRightIcon,
  BoltIcon,
  DevicePhoneMobileIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

const heroHighlights = [
  'Comprehensive care coordination across teams',
  'Real-time intelligence for every decision',
  'Enterprise security with human warmth',
];

const featureCards = [
  {
    title: 'Unified Scheduling',
    description: 'Coordinate rooms, physicians, and telehealth visits with waitlist automation and smart routing.',
    icon: CalendarIcon,
  },
  {
    title: 'Frictionless Records',
    description: 'Surface the right chart insights instantly with structured notes and context-aware summaries.',
    icon: DocumentTextIcon,
  },
  {
    title: 'Care Anywhere',
    description: 'Deliver HD telehealth experiences, in-app chat, and remote monitoring that feel bespoke.',
    icon: VideoCameraIcon,
  },
  {
    title: 'Clinical Intelligence',
    description: 'Track outcomes, throughput, and financial health with dashboards designed for action.',
    icon: ChartBarIcon,
  },
  {
    title: 'Security First',
    description: 'HIPAA, SOC2, and ISO-compliant architecture with proactive monitoring and automated safeguards.',
    icon: ShieldCheckIcon,
  },
  {
    title: 'Patient Partnerships',
    description: 'Delight patients with modern self-service, compassionate follow-ups, and inclusive access.',
    icon: UserGroupIcon,
  },
];

const workflowSteps = [
  {
    step: '01',
    title: 'Connect Your Universe',
    blurb: 'Seamlessly sync EMR data, schedules, and legacy workflows. Our concierge team stays beside you end-to-end.',
  },
  {
    step: '02',
    title: 'Design Signature Journeys',
    blurb: 'Craft intake flows, automation, and patient pathways that mirror the heart of your organization.',
  },
  {
    step: '03',
    title: 'Scale Compassionate Care',
    blurb: 'Give every clinician the clarity to act quickly and every patient the confidence to stay engaged.',
  },
];

const testimonials = [
  {
    name: 'Dr. Neha Patel',
    role: 'Chief Medical Officer, Horizon Clinic',
    quote:
      'EzyOlive feels like the future of patient relationships. Our teams finally have a command center that is beautiful, responsive, and deeply intuitive.',
    image: 'https://randomuser.me/api/portraits/women/22.jpg',
  },
  {
    name: 'Dr. Marco Alvarez',
    role: 'Cardiologist, Pacific Heart Group',
    quote:
      'Within six weeks we saw a double-digit lift in adherence and satisfaction. The analytics make opportunities crystal clear.',
    image: 'https://randomuser.me/api/portraits/men/36.jpg',
  },
  {
    name: 'Dr. Elaine Foster',
    role: 'Director of Telehealth, ConnectCare',
    quote:
      'Implementation was flawless. Our virtual visits now feel personal, secure, and effortless for both clinicians and patients.',
    image: 'https://randomuser.me/api/portraits/women/47.jpg',
  },
];

const MapEmbed = ({ className = '', height = 420 }) => {
  const [coords, setCoords] = useState(null);
  const [status, setStatus] = useState('pending');

  useEffect(() => {
    if (typeof window === 'undefined' || !navigator?.geolocation) {
      setStatus('unsupported');
      return;
    }

    let mounted = true;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!mounted) return;
        setCoords(position.coords);
        setStatus('success');
      },
      () => {
        if (!mounted) return;
        setStatus('denied');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );

    return () => {
      mounted = false;
    };
  }, []);

  const fallbackImage = 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=1600&q=80';
  const containerStyle = {
    minHeight: `${height}px`,
    height: '100%',
  };

  if (coords) {
    const { latitude, longitude } = coords;
    const q = encodeURIComponent(`hospital+clinic+near+${latitude},${longitude}`);

    return (
      <div className={`relative overflow-hidden ${className}`} style={containerStyle}>
        <iframe
          title="Nearby clinics"
          src={`https://www.google.com/maps?q=${latitude},${longitude}&q=${q}&z=13&output=embed`}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          allowFullScreen
        />
        <div className="pointer-events-none absolute top-4 left-4 rounded-full bg-white/90 px-4 py-1 text-xs font-semibold text-primary-600 shadow">
          Showing clinics near you
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`} style={containerStyle}>
      <img
        src={fallbackImage}
        alt="Modern hospital team"
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />
      {status === 'pending' && (
        <div className="absolute bottom-4 left-4 rounded-full bg-black/60 px-4 py-1 text-xs font-semibold text-white">
          Locating nearby clinics…
        </div>
      )}
      {status === 'denied' && (
        <div className="absolute bottom-4 left-4 rounded-full bg-black/70 px-4 py-1 text-xs font-semibold text-white">
          Location blocked · Showing featured hospital
        </div>
      )}
    </div>
  );
};

const Home = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [stats, setStats] = useState({ patients: 0, providers: 0, appointments: 0, satisfaction: 0 });
  const statsRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  const animateCounter = useCallback((key, target, duration) => {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setStats((prev) => ({ ...prev, [key]: target }));
        clearInterval(timer);
      } else {
        setStats((prev) => ({ ...prev, [key]: Math.floor(start) }));
      }
    }, 16);

    return timer;
  }, []);

  useEffect(() => {
    if (hasAnimated) {
      return undefined;
    }

    const timers = [];
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasAnimated(true);
          timers.push(
            animateCounter('patients', 54000, 1800),
            animateCounter('providers', 2700, 1800),
            animateCounter('appointments', 175000, 1800),
            animateCounter('satisfaction', 97, 1800)
          );
        }
      },
      { threshold: 0.3 }
    );

    const current = statsRef.current;
    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }
      timers.forEach(clearInterval);
    };
  }, [animateCounter, hasAnimated]);

  return (
    <div className={`${isDark ? 'bg-gray-950 text-gray-100' : 'bg-white text-gray-900'} transition-colors duration-300`}>
      {/* Hero */}
      <section
        className={`relative overflow-hidden ${
          isDark ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-900' : 'bg-gradient-to-br from-primary-50 via-white to-emerald-50'
        }`}
      >
        <div className="absolute inset-0">
          <div
            className={`absolute -top-24 -right-24 h-[520px] w-[520px] rounded-full blur-3xl ${
              isDark ? 'bg-primary-500/25' : 'bg-primary-300/30'
            }`}
          />
          <div
            className={`absolute top-1/2 -left-40 h-[420px] w-[420px] rounded-full blur-3xl ${
              isDark ? 'bg-teal-400/20' : 'bg-secondary-200/30'
            }`}
          />
        </div>

        <div className="container-medical relative z-10 py-24 md:py-28 lg:py-32">
          <div className="grid items-center gap-16 lg:grid-cols-[1.05fr,0.95fr]">
            <div className="space-y-10">
              <div
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 shadow-sm ${
                  isDark ? 'border-gray-800 bg-gray-900/70 text-primary-200' : 'border-primary-100 bg-white/90 text-primary-700'
                }`}
              >
                <HeartIconSolid className="h-5 w-5" />
                <span className="text-sm font-semibold uppercase tracking-wide">Designed for Connected Care</span>
              </div>

              <div className="space-y-6">
                <h1
                  className={`text-4xl font-bold leading-tight md:text-5xl lg:text-6xl ${isDark ? 'text-white' : 'text-gray-900'}`}
                >
                  Give every patient journey the precision of tomorrow’s healthcare.
                </h1>
                <p className={`max-w-2xl text-lg md:text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  EzyOlive is the single operating system that keeps clinicians, patients, and operations in harmony—beautifully, securely, and at scale.
                </p>
              </div>

              <ul className="space-y-3">
                {heroHighlights.map((item) => (
                  <li key={item} className={`flex items-start gap-3 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                    <span className={`mt-1 inline-flex h-2.5 w-2.5 rounded-full ${isDark ? 'bg-primary-300' : 'bg-primary-500'}`} />
                    <span className="text-base font-medium leading-relaxed md:text-lg">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-xl px-7 py-3 text-base font-semibold text-white shadow-lg shadow-primary-500/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                  style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #0ea5e9 100%)' }}
                >
                  <span>Launch Your Trial</span>
                  <ArrowRightIcon className="h-5 w-5" />
                </Link>
                <Link
                  to="/features"
                  className={`inline-flex items-center gap-2 rounded-xl px-7 py-3 text-base font-semibold transition-all duration-200 border ${
                    isDark ? 'border-gray-700 bg-gray-900 text-gray-100 hover:bg-gray-800' : 'border-gray-200 bg-white text-gray-800 hover:border-gray-300'
                  }`}
                >
                  <DevicePhoneMobileIcon className="h-5 w-5" />
                  <span>Experience the Platform</span>
                </Link>
              </div>

              <div className={`grid gap-4 pt-6 text-left sm:grid-cols-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <div>
                  <p className="text-3xl font-semibold text-primary-500">97%</p>
                  <p className="text-sm">Patient satisfaction</p>
                </div>
                <div>
                  <p className="text-3xl font-semibold text-primary-500">48 hrs</p>
                  <p className="text-sm">Average go-live</p>
                </div>
                <div>
                  <p className="text-3xl font-semibold text-primary-500">40%</p>
                  <p className="text-sm">Operational efficiency lift</p>
                </div>
                <div>
                  <p className="text-3xl font-semibold text-primary-500">24/7</p>
                  <p className="text-sm">Concierge support</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div
                className={`absolute inset-x-0 top-6 h-[420px] w-[420px] -translate-x-1/2 rounded-full blur-3xl lg:left-1/2 ${
                  isDark ? 'bg-primary-500/20' : 'bg-primary-200/30'
                }`}
              />
              <div className="relative flex flex-col gap-10">
                <div
                  className={`relative overflow-hidden rounded-[32px] border ${
                    isDark ? 'border-gray-800/80 bg-gray-900/60' : 'border-white/40 bg-white/40'
                  } shadow-xl backdrop-blur-sm min-h-[420px]`}
                >
                  <MapEmbed className="h-full w-full" height={420} />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 via-transparent to-transparent" />
                  <div className="absolute top-5 left-5 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-primary-600 shadow-lg shadow-primary-500/20">
                    <BoltIcon className="h-4 w-4" />
                    Real-time orchestration
                  </div>
                  <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/30 bg-white/20 p-4 backdrop-blur-md">
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/70">Care Traffic Today</p>
                    <div className="mt-3 grid grid-cols-3 gap-3 text-white">
                      {[
                        { label: 'Critical cases', value: '12' },
                        { label: 'Avg response', value: '2.3 min' },
                        { label: 'Team adoption', value: '93%' },
                      ].map((item) => (
                        <div key={item.label} className="rounded-xl bg-black/30 p-3">
                          <p className="text-[11px] uppercase tracking-wide text-white/60">{item.label}</p>
                          <p className="mt-1 text-lg font-semibold">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div
                  className={`relative z-10 mx-auto w-full max-w-lg -mt-16 rounded-[26px] border p-8 shadow-2xl ${
                    isDark ? 'border-gray-800 bg-gray-900/85' : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>LIVE OVERVIEW</p>
                        <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Care Command Center</h3>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                          isDark ? 'bg-primary-500/20 text-primary-200' : 'bg-primary-100 text-primary-700'
                        }`}
                      >
                        <BoltIcon className="h-4 w-4" />
                        Optimized
                      </span>
                    </div>

                    <div
                      className={`space-y-4 rounded-2xl border p-5 shadow-inner ${
                        isDark ? 'border-gray-800 bg-gray-900/80' : 'border-gray-100 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Today’s Visits</p>
                        <span className="text-xl font-semibold text-primary-500">156</span>
                      </div>
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        {[
                          { label: 'Telehealth', value: 64 },
                          { label: 'In-person', value: 72 },
                          { label: 'Follow-ups', value: 20 },
                        ].map((metric) => (
                          <div
                            key={metric.label}
                            className={`${isDark ? 'bg-gray-800/70' : 'bg-gray-50'} rounded-xl p-3`}
                          >
                            <p className="text-xs text-gray-500">{metric.label}</p>
                            <p className="text-lg font-semibold text-primary-500">{metric.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {[
                        {
                          label: 'Net Promoter Score',
                          value: '68',
                          delta: '▲ up 8 pts',
                        },
                        {
                          label: 'Care Gaps Closed',
                          value: '92%',
                          delta: '▲ up 18%',
                        },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className={`${isDark ? 'border border-gray-800 bg-gray-900/80' : 'border border-gray-200 bg-white'} rounded-2xl p-4`}
                        >
                          <p className="text-xs uppercase tracking-wide text-gray-500">{item.label}</p>
                          <p className="text-3xl font-semibold text-primary-500">{item.value}</p>
                          <span className={`${isDark ? 'text-green-400' : 'text-green-600'} text-xs font-medium`}>{item.delta}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section ref={statsRef} className={`${isDark ? 'bg-gray-900' : 'bg-white'} py-20`}>
        <div className="container-medical">
          <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-4 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
            {[
              { label: 'Patients Supported', value: `${stats.patients.toLocaleString()}+` },
              { label: 'Healthcare Partners', value: `${stats.providers.toLocaleString()}+` },
              { label: 'Appointments Managed', value: `${stats.appointments.toLocaleString()}+` },
              { label: 'Overall Satisfaction', value: `${stats.satisfaction}%` },
            ].map((item) => (
              <div
                key={item.label}
                className={`rounded-2xl border p-6 shadow-sm ${isDark ? 'border-gray-800 bg-gray-900/70' : 'border-gray-100 bg-white'}`}
              >
                <p className="text-sm font-medium text-gray-500">{item.label}</p>
                <p className="mt-3 text-3xl font-semibold text-primary-500">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className={`${isDark ? 'bg-gray-950' : 'bg-slate-50'} py-24`}>
        <div className="container-medical space-y-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl space-y-4">
              <h2 className={`text-3xl font-bold md:text-4xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Clinician-grade workflows, designed with heart.
              </h2>
              <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Every module is crafted with frontline input so your teams move faster, patients feel seen, and compliance stays effortless.
              </p>
            </div>
            <Link
              to="/appointments"
              className="inline-flex items-center gap-2 self-start rounded-xl border border-primary-300 px-6 py-3 text-sm font-semibold text-primary-600 transition-all duration-200 hover:border-primary-400 hover:text-primary-700 md:self-auto"
            >
              Explore scheduling suite
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featureCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className={`group relative overflow-hidden rounded-3xl border p-8 transition-all duration-300 ${
                    isDark
                      ? 'border-gray-800 bg-gray-900/80 hover:border-primary-500/60 hover:bg-gray-900'
                      : 'border-gray-200 bg-white hover:border-primary-200 hover:bg-primary-50/30'
                  }`}
                >
                  <div
                    className={`mb-6 inline-flex rounded-2xl p-3 ${
                      isDark ? 'bg-primary-500/15 text-primary-200' : 'bg-primary-100 text-primary-600'
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-primary-400 transition-colors duration-300 group-hover:text-primary-500">
                    {card.title}
                  </h3>
                  <p className={`mt-3 text-base ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{card.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section
        className={`relative overflow-hidden ${
          isDark ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950' : 'bg-gradient-to-br from-white via-primary-50 to-emerald-50'
        } py-24`}
      >
        <div className="absolute inset-0">
          <div className="medical-gradient-mesh opacity-60" />
        </div>
        <div className="container-medical relative z-10 grid gap-12 lg:grid-cols-[0.55fr,1.45fr]">
          <div className="space-y-6">
            <span
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide ${
                isDark ? 'bg-primary-500/10 text-primary-200' : 'bg-primary-200 text-primary-700'
              }`}
            >
              <HeartIconSolid className="h-4 w-4" />
              Seamless onboarding
            </span>
            <h2 className={`text-3xl font-bold md:text-4xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
              From integration to inspiration in weeks, not quarters.
            </h2>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Our clinical transformation team walks with you, aligning technology to the rituals that make your organization stand out.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary-500 transition-colors hover:text-primary-600"
            >
              Meet your implementation partners
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-6">
            {workflowSteps.map((item) => (
              <div
                key={item.step}
                className={`rounded-3xl border p-8 backdrop-blur-sm transition-all duration-300 ${
                  isDark ? 'border-gray-800/80 bg-gray-900/70' : 'border-primary-100/80 bg-white/80'
                }`}
              >
                <div className="flex items-start gap-6">
                  <span
                    className={`text-2xl font-semibold ${
                      isDark ? 'text-primary-300' : 'text-primary-500'
                    }`}
                  >
                    {item.step}
                  </span>
                  <div className="space-y-3">
                    <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.title}</h3>
                    <p className={`text-base ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{item.blurb}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={`${isDark ? 'bg-gray-950' : 'bg-white'} py-24`}>
        <div className="container-medical space-y-12">
          <div className="max-w-2xl space-y-4">
            <h2 className={`text-3xl font-bold md:text-4xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Loved by modern care leaders.
            </h2>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Hear how organizations are rewriting patient engagement and operational excellence with EzyOlive.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className={`flex h-full flex-col justify-between rounded-3xl border p-8 ${
                  isDark ? 'border-gray-800 bg-gray-900/70' : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="h-12 w-12 rounded-full object-cover"
                      loading="lazy"
                    />
                    <div>
                      <p className="font-semibold text-primary-500">{testimonial.name}</p>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{testimonial.role}</p>
                    </div>
                  </div>
                  <p className={`text-base leading-relaxed ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>&ldquo;{testimonial.quote}&rdquo;</p>
                </div>
                <div className="mt-6 flex items-center gap-2 text-sm text-primary-500">
                  <ShieldCheckIcon className="h-5 w-5" />
                  Verified partner story
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className={`${isDark ? 'bg-gray-900' : 'bg-primary-50'} py-24`}>
        <div
          className={`container-medical relative overflow-hidden rounded-3xl border px-8 py-16 lg:px-12 ${
            isDark ? 'border-gray-800 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-900' : 'border-primary-200 bg-gradient-to-br from-primary-100 via-white to-teal-50'
          }`}
        >
          <div
            className={`absolute -right-24 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full blur-3xl ${
              isDark ? 'bg-primary-500/30' : 'bg-primary-300/30'
            }`}
          />
          <div
            className={`absolute -bottom-12 -left-10 h-64 w-64 rounded-full blur-3xl ${
              isDark ? 'bg-teal-400/20' : 'bg-emerald-300/30'
            }`}
          />
          <div className="relative z-10 flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-6">
              <span
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide ${
                  isDark ? 'bg-gray-800/80 text-primary-200' : 'bg-white text-primary-600 shadow-sm'
                }`}
              >
                <BoltIcon className="h-4 w-4" />
                Future-ready experiences
              </span>
              <h2 className={`text-3xl font-bold md:text-4xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Ready to orchestrate care that patients rave about?
              </h2>
              <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Co-create a launch blueprint with our strategy specialists and see exactly how EzyOlive elevates every touchpoint.
              </p>
            </div>
            <div className="w-full max-w-sm space-y-4">
              <Link
                to="/contact"
                className="flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-primary-500/30 transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-600"
              >
                Book a strategy call
                <ArrowRightIcon className="h-5 w-5" />
              </Link>
              <p className={`text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Prefer to explore on your own?{' '}
                <Link to="/about" className="font-semibold text-primary-500 hover:text-primary-600">
                  Tour the vision
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
