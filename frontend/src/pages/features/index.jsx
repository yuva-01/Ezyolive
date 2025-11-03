import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import {
  ChartBarIcon,
  ShieldCheckIcon,
  DevicePhoneMobileIcon,
  BoltIcon,
  ClockIcon,
  UserGroupIcon,
  CalendarIcon,
  DocumentTextIcon,
  CreditCardIcon,
  CloudArrowUpIcon,
  ChartPieIcon,
  BellAlertIcon,
  ArrowRightIcon,
  CpuChipIcon,
  PresentationChartLineIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';

const coreSuites = [
  {
    title: 'Coordinated Operations',
    description: 'Unify rooms, staff, and devices with intelligent load balancing and auto-escalations for urgent cases.',
    icon: CalendarIcon,
  },
  {
    title: 'Patient Experience',
    description: 'Design branded journeys with self-scheduling, multilingual reminders, and compassionate follow-ups.',
    icon: UserGroupIcon,
  },
  {
    title: 'Revenue & Compliance',
    description: 'Automate claim rules, eligibility, and payment capture with built-in guardrails for every payer.',
    icon: CreditCardIcon,
  },
];

const automationStreams = [
  {
    title: 'Smart Intake & Triage',
    blurb: 'Route patients based on acuity, insurance, and availability. Collect consents and histories before the visit.',
    icon: DocumentTextIcon,
  },
  {
    title: 'Real-time Care Signals',
    blurb: 'Surface critical vitals, overdue labs, and care-gap nudges directly inside the clinician workflow.',
    icon: BoltIcon,
  },
  {
    title: 'Telehealth & Follow-up',
    blurb: 'Deliver HD video, in-visit documentation, and asynchronous messaging that feels deeply personal.',
    icon: DevicePhoneMobileIcon,
  },
  {
    title: 'Billing Intelligence',
    blurb: 'Detect missing codes, automate claim submission, and forecast revenue with predictive models.',
    icon: ChartPieIcon,
  },
];

const analyticsHighlights = [
  {
    label: 'Operational Uptime',
    value: '99.98%',
    detail: 'Across 500+ provider orgs',
  },
  {
    label: 'Clinician Adoption',
    value: '92%',
    detail: 'Average daily active users',
  },
  {
    label: 'Patient NPS',
    value: '+64',
    detail: 'Measured 60 days post-launch',
  },
];

const ecosystemHighlights = [
  {
    title: 'HIPAA-first infrastructure',
    description: 'Encryption in transit and at rest, zero-trust access, and automated audit trails.',
    icon: ShieldCheckIcon,
  },
  {
    title: 'API-first integrations',
    description: 'Bi-directional sync with leading EMRs, labs, CRM, and analytics partners via FHIR-ready APIs.',
    icon: CloudArrowUpIcon,
  },
  {
    title: 'Command insights',
    description: 'Dashboards that align executives, operations, and care teams around one source of truth.',
    icon: PresentationChartLineIcon,
  },
  {
    title: 'Modular architecture',
    description: 'Activate just the modules you need today and expand without disrupting existing workflows.',
    icon: Squares2X2Icon,
  },
];

const microFeatures = [
  {
    title: 'Appointment Reminders',
    description: 'Omnichannel nudges tuned to patient preferences to prevent no-shows.',
    icon: BellAlertIcon,
  },
  {
    title: 'Realtime Notifications',
    description: 'Team alerts for critical lab results and patient escalations as they happen.',
    icon: ClockIcon,
  },
  {
    title: 'Collaborative Notes',
    description: 'Securely co-author documentation with comments, templates, and AI summaries.',
    icon: DocumentTextIcon,
  },
  {
    title: 'Payment Plans',
    description: 'Offer flexible, automated schedules with clear guardrails for finance teams.',
    icon: CreditCardIcon,
  },
];

const Features = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

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
            className={`absolute -top-24 right-0 h-[420px] w-[420px] rounded-full blur-3xl ${
              isDark ? 'bg-primary-500/20' : 'bg-primary-200/40'
            }`}
          />
          <div
            className={`absolute bottom-0 left-0 h-[360px] w-[360px] rounded-full blur-3xl ${
              isDark ? 'bg-teal-400/10' : 'bg-emerald-200/30'
            }`}
          />
        </div>

        <div className="container-medical relative z-10 py-24 md:py-28 lg:py-32">
          <div className="grid items-center gap-16 lg:grid-cols-[1.15fr,0.85fr]">
            <div className="space-y-8">
              <span
                className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] ${
                  isDark ? 'bg-gray-900/70 text-primary-200 border border-gray-800' : 'bg-white/80 text-primary-600 border border-primary-100'
                }`}
              >
                Precision Platform
              </span>
              <div className="space-y-6">
                <h1 className={`text-4xl font-bold leading-tight md:text-5xl lg:text-6xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Every capability your modern healthcare team expects—in one orchestration layer.
                </h1>
                <p className={`max-w-2xl text-lg md:text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Build signature patient journeys, empower clinicians with intelligent context, and keep operations humming with enterprise-grade resilience.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/pricing"
                  className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-base font-semibold text-white shadow-lg shadow-primary-500/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
                  style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #0ea5e9 100%)' }}
                >
                  Explore plans
                  <ArrowRightIcon className="h-5 w-5" />
                </Link>
                <Link
                  to="/contact"
                  className={`inline-flex items-center gap-2 rounded-xl px-6 py-3 text-base font-semibold transition-all duration-200 border ${
                    isDark ? 'border-gray-700 bg-gray-900 text-gray-100 hover:bg-gray-800' : 'border-gray-200 bg-white text-gray-800 hover:border-gray-300'
                  }`}
                >
                  Book a guided tour
                </Link>
              </div>

              <div className="grid gap-4 pt-2 sm:grid-cols-3">
                {coreSuites.map((suite) => {
                  const Icon = suite.icon;
                  return (
                    <div
                      key={suite.title}
                      className={`rounded-3xl border p-5 transition-all duration-300 ${
                        isDark ? 'border-gray-800/80 bg-gray-900/60' : 'border-primary-100/60 bg-white/80'
                      }`}
                    >
                      <Icon className="h-7 w-7 text-primary-500" />
                      <h3 className="mt-3 text-base font-semibold text-primary-500">{suite.title}</h3>
                      <p className={`mt-2 text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{suite.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative">
              <div
                className={`absolute inset-0 rounded-[36px] blur-3xl ${
                  isDark ? 'bg-gradient-to-br from-primary-500/20 via-teal-500/10 to-transparent' : 'bg-gradient-to-br from-primary-200/40 via-white to-transparent'
                }`}
              />
              <div
                className={`relative overflow-hidden rounded-[36px] border ${
                  isDark ? 'border-gray-800 bg-gray-900/80' : 'border-white/60 bg-white/90'
                } shadow-2xl backdrop-blur-sm`}
              >
                <div className={`border-b px-8 py-6 ${isDark ? 'border-gray-800/80' : 'border-gray-100/80'}`}>
                  <p className={`text-xs font-semibold uppercase tracking-[0.3em] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Live view · Command Center
                  </p>
                  <h3 className={`mt-2 text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Clinic Flow Snapshot
                  </h3>
                </div>
                <div className="px-8 py-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Patients in lobby', value: '18', trend: '+6 vs avg' },
                      { label: 'Telehealth live', value: '11', trend: '+3 vs yesterday' },
                      { label: 'Avg wait time', value: '04:12', trend: '-32%' },
                      { label: 'Utilization', value: '87%', trend: '+9 pts' },
                    ].map((stat) => (
                      <div key={stat.label} className={`rounded-2xl border p-4 ${isDark ? 'border-gray-800 bg-gray-900/70' : 'border-gray-200 bg-white/80'}`}>
                        <p className={`text-xs uppercase tracking-wide text-gray-500 ${isDark ? 'text-gray-400' : ''}`}>{stat.label}</p>
                        <p className="mt-2 text-xl font-semibold text-primary-500">{stat.value}</p>
                        <span className="text-xs text-green-500 font-medium">{stat.trend}</span>
                      </div>
                    ))}
                  </div>
                  <div className={`rounded-2xl border p-5 ${isDark ? 'border-gray-800 bg-gray-900/70' : 'border-gray-200 bg-white/80'}`}>
                    <p className={`text-xs font-semibold uppercase tracking-[0.25em] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Care Signals</p>
                    <div className="mt-4 space-y-3">
                      {[
                        { title: 'Cardiology consult rescheduled', detail: 'Patient confirmed SMS reminder · 2 hours ago' },
                        { title: 'High-risk diabetic flagged', detail: 'Glucose trend spiked · care team notified' },
                        { title: 'Claim batch 182 processed', detail: 'Settlement expected Friday · 0 denials' },
                      ].map((signal) => (
                        <div key={signal.title} className={`rounded-xl px-4 py-3 ${isDark ? 'bg-gray-800/80' : 'bg-gray-50/80'}`}>
                          <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{signal.title}</p>
                          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{signal.detail}</p>
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

      {/* Automation flows */}
      <section className={`${isDark ? 'bg-gray-950' : 'bg-slate-50'} py-24`}>
        <div className="container-medical space-y-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl space-y-4">
              <h2 className={`text-3xl font-bold md:text-4xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Automation designed with clinicians, for clinicians.
              </h2>
              <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Every stream is purpose-built with provider feedback so you can simplify complex handoffs while preserving the human touch.
              </p>
            </div>
            <Link
              to="/appointments"
              className="inline-flex items-center gap-2 self-start rounded-xl border border-primary-300 px-6 py-3 text-sm font-semibold text-primary-600 transition-all duration-200 hover:border-primary-400 hover:text-primary-700 md:self-auto"
            >
              See scheduling in action
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {automationStreams.map((stream) => {
              const Icon = stream.icon;
              return (
                <div
                  key={stream.title}
                  className={`group relative overflow-hidden rounded-3xl border p-8 ${
                    isDark ? 'border-gray-800 bg-gray-900/75 hover:border-primary-500/60 hover:bg-gray-900' : 'border-gray-200 bg-white hover:border-primary-200 hover:bg-primary-50/40'
                  } transition-all duration-300`}
                >
                  <div
                    className={`mb-6 inline-flex rounded-2xl p-3 ${
                      isDark ? 'bg-primary-500/15 text-primary-200' : 'bg-primary-100 text-primary-600'
                    }`}
                  >
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-semibold text-primary-500">{stream.title}</h3>
                  <p className={`mt-3 text-base leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{stream.blurb}</p>
                  <div className="mt-6 flex items-center text-sm font-semibold text-primary-500">
                    Explore workflow
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Analytics & results */}
      <section className={`${isDark ? 'bg-gray-900' : 'bg-white'} py-24`}>
        <div className="container-medical grid gap-12 lg:grid-cols-[0.6fr,1.4fr] items-center">
          <div className="space-y-6">
            <span
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide ${
                isDark ? 'bg-primary-500/10 text-primary-200' : 'bg-primary-100 text-primary-700'
              }`}
            >
              Outcomes that stick
            </span>
            <h2 className={`text-3xl font-bold md:text-4xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Guide every decision with data you can trust.
            </h2>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Our analytics layer transforms raw events into actionable stories—washroom bottlenecks, cohort adherence, revenue leakage, and more—so your teams can intervene early.
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary-500 hover:text-primary-600"
            >
              Jump into the dashboard
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>

          <div className={`rounded-[32px] border p-8 shadow-2xl ${isDark ? 'border-gray-800 bg-gray-900/80' : 'border-gray-200 bg-gray-50'}`}>
            <div className="grid gap-6 md:grid-cols-3">
              {analyticsHighlights.map((highlight) => (
                <div key={highlight.label} className={`${isDark ? 'bg-gray-800/80' : 'bg-white'} rounded-3xl p-5 border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <p className="text-sm font-semibold text-primary-500">{highlight.label}</p>
                  <p className="mt-2 text-3xl font-bold">{highlight.value}</p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{highlight.detail}</p>
                </div>
              ))}
            </div>
            <div className={`mt-8 grid gap-4 md:grid-cols-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
              <div className={`rounded-2xl border p-4 ${isDark ? 'border-gray-800 bg-gray-900/90' : 'border-white bg-white shadow'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-500">Pathways</p>
                    <p className="mt-1 text-sm font-medium">Cardiac rehab adherence</p>
                  </div>
                  <CpuChipIcon className="h-6 w-6 text-primary-500" />
                </div>
                <p className="mt-4 text-2xl font-semibold text-primary-500">+18%</p>
                <p className="text-xs text-gray-500">
                  Increase after automations rolled out to region-wide clinics.
                </p>
              </div>
              <div className={`rounded-2xl border p-4 ${isDark ? 'border-gray-800 bg-gray-900/90' : 'border-white bg-white shadow'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-500">Financial</p>
                    <p className="mt-1 text-sm font-medium">Claim denial avoidance</p>
                  </div>
                  <ChartBarIcon className="h-6 w-6 text-primary-500" />
                </div>
                <p className="mt-4 text-2xl font-semibold text-primary-500">-32%</p>
                <p className="text-xs text-gray-500">
                  Reduction in denied claims within the first 60 days of adoption.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem */}
      <section className={`${isDark ? 'bg-gray-950' : 'bg-slate-50'} py-24`}>
        <div className="container-medical space-y-12">
          <div className="max-w-2xl space-y-4">
            <h2 className={`text-3xl font-bold md:text-4xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Built for the realities of enterprise health organizations.
            </h2>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              We partner closely with your clinical, operations, and security leaders to ensure your investment scales for the next decade.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {ecosystemHighlights.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className={`rounded-3xl border p-6 transition-all duration-300 ${
                    isDark ? 'border-gray-800 bg-gray-900/75 hover:border-primary-500/50' : 'border-gray-200 bg-white hover:border-primary-200 hover:bg-primary-50/40'
                  }`}
                >
                  <Icon className="h-6 w-6 text-primary-500" />
                  <h3 className="mt-4 text-lg font-semibold text-primary-500">{item.title}</h3>
                  <p className={`mt-2 text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Micro-features */}
      <section className={`${isDark ? 'bg-gray-900' : 'bg-white'} py-24`}>
        <div className="container-medical space-y-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl space-y-4">
              <h2 className={`text-3xl font-bold md:text-4xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Thoughtful details that make every interaction feel human.
              </h2>
              <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                From automated nudges to collaborative charting, EzyOlive keeps teams aligned without sacrificing the relationships that matter.
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary-500 hover:text-primary-600"
            >
              Talk with our product specialists
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {microFeatures.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className={`rounded-3xl border p-6 ${
                    isDark ? 'border-gray-800 bg-gray-900/75' : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <Icon className="h-6 w-6 text-primary-500" />
                  <h3 className="mt-4 text-lg font-semibold text-primary-500">{item.title}</h3>
                  <p className={`mt-2 text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`${isDark ? 'bg-gray-950' : 'bg-primary-50'} py-24`}>
        <div
          className={`container-medical relative overflow-hidden rounded-3xl border px-8 py-16 lg:px-12 ${
            isDark ? 'border-gray-800 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-900' : 'border-primary-200 bg-gradient-to-br from-primary-100 via-white to-teal-50'
          }`}
        >
          <div
            className={`absolute -right-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full blur-3xl ${
              isDark ? 'bg-primary-500/30' : 'bg-primary-300/40'
            }`}
          />
          <div
            className={`absolute -bottom-10 -left-8 h-64 w-64 rounded-full blur-3xl ${
              isDark ? 'bg-teal-400/25' : 'bg-emerald-200/40'
            }`}
          />
          <div className="relative z-10 flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-6">
              <span
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide ${
                  isDark ? 'bg-gray-800/80 text-primary-200' : 'bg-white text-primary-600 shadow-sm'
                }`}
              >
                Experience the suite
              </span>
              <h2 className={`text-3xl font-bold md:text-4xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Ready to choreograph care with the same confidence as the leaders we serve?
              </h2>
              <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Our team will design a personalized demo highlighting how EzyOlive wraps around your existing ecosystem and elevates every touchpoint.
              </p>
            </div>
            <div className="w-full max-w-sm space-y-4">
              <Link
                to="/register"
                className="flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-primary-500/30 transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-600"
              >
                Start a free pilot
                <ArrowRightIcon className="h-5 w-5" />
              </Link>
              <p className={`text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Want launch support?{' '}
                <Link to="/contact" className="font-semibold text-primary-500 hover:text-primary-600">
                  Speak with onboarding
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;
