import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  CreditCardIcon,
  BanknotesIcon,
  ShieldCheckIcon,
  ArrowUpRightIcon,
  DocumentArrowDownIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { useTheme } from '../../context/ThemeContext';
import { DEMO_UPCOMING_APPOINTMENTS } from '../../utils/demoData';

const formatCurrency = (value) => {
  const num = Number(value) || 0;
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(num);
};

const formatDate = (value) => {
  if (!value) return 'TBD';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'TBD';
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

const BillingPage = () => {
  const { user } = useSelector((state) => state.auth);
  const { appointments } = useSelector((state) => state.appointments);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const appointmentsArray = useMemo(() => {
    if (Array.isArray(appointments)) return appointments;
    if (Array.isArray(appointments?.appointments)) return appointments.appointments;
    return [];
  }, [appointments]);

  const invoices = useMemo(() => {
    const base = appointmentsArray.length ? appointmentsArray : DEMO_UPCOMING_APPOINTMENTS;
    return base.slice(0, 5).map((appointment, index) => ({
      id: `inv-${appointment._id || appointment.id || index}`,
      provider: appointment.doctorName || appointment.doctor?.fullName || 'Care team',
      amount: 45 + index * 15,
      status: ['Pending', 'Paid', 'Processing'][index % 3],
      dueDate: appointment.date || appointment.startTime || new Date().toISOString(),
      type: appointment.type || 'In-person',
    }));
  }, [appointmentsArray]);

  const outstandingBalance = invoices
    .filter((invoice) => invoice.status !== 'Paid')
    .reduce((sum, invoice) => sum + invoice.amount, 0);
  const paidThisMonth = invoices
    .filter((invoice) => invoice.status === 'Paid')
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  const cardSurface = isDark
    ? 'bg-gray-900 border border-gray-800'
    : 'bg-white border border-gray-100 shadow-sm';

  const heroSurface = isDark
    ? 'border border-primary-500/30 bg-gradient-to-br from-emerald-900 via-gray-900 to-primary-900 text-white'
    : 'border border-primary-100 bg-gradient-to-br from-emerald-50 via-white to-primary-50';

  const paymentMethod = user?.billing?.defaultMethod || {
    brand: 'Visa',
    last4: '4242',
    expires: '04/28',
    autopay: true,
  };

  const insurance = user?.insurance || {
    provider: 'Blue Shield Preferred',
    memberId: 'PCT-392-884',
    coverage: '80% after deductible',
    contact: '(800) 123-0000',
  };

  const invoiceStatusClasses = (status) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-emerald-100 text-emerald-700';
      case 'processing':
        return 'bg-indigo-100 text-indigo-700';
      default:
        return 'bg-amber-100 text-amber-700';
    }
  };

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className={`${heroSurface} rounded-3xl p-8 relative overflow-hidden`}>
          <div className="absolute inset-0 pointer-events-none opacity-30">
            <div className="absolute -right-10 top-4 h-48 w-48 rounded-full bg-emerald-400 blur-3xl" />
            <div className="absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-primary-400 blur-3xl" />
          </div>
          <div className="relative z-10 grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
            <div>
              <p className={`text-xs font-semibold uppercase tracking-[0.35em] ${isDark ? 'text-emerald-100' : 'text-emerald-600'}`}>
                Billing center
              </p>
              <h1 className={`mt-3 text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Stay in control of your care costs
              </h1>
              <p className={`mt-2 text-sm ${isDark ? 'text-gray-200' : 'text-gray-600'}`}>
                Review invoices, manage payment methods, and understand coverage in one streamlined dashboard.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
                <button
                  type="button"
                  className="inline-flex items-center rounded-full bg-gradient-to-r from-emerald-600 to-primary-500 px-5 py-2 text-white"
                >
                  <BanknotesIcon className="mr-2 h-4 w-4" /> Pay outstanding balance
                </button>
                <Link
                  to="/appointments"
                  className={`${isDark ? 'bg-white/10 text-white' : 'bg-white text-emerald-700'} inline-flex items-center rounded-full px-5 py-2`}
                >
                  <ArrowUpRightIcon className="mr-2 h-4 w-4" /> View visit receipts
                </Link>
              </div>
            </div>
            <div className={`${isDark ? 'bg-white/5' : 'bg-white/80'} rounded-2xl p-6 backdrop-blur`}>
              <p className={`text-xs font-semibold uppercase ${isDark ? 'text-emerald-100' : 'text-emerald-600'}`}>Balance overview</p>
              <p className={`mt-3 text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{formatCurrency(outstandingBalance)}</p>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Outstanding balance</p>
              <div className="mt-4 grid gap-4 text-sm">
                <p className={`${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  Paid this month: <span className="font-semibold">{formatCurrency(paidThisMonth)}</span>
                </p>
                <p className={`${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  Next auto-payment: <span className="font-semibold">{paymentMethod.autopay ? 'Scheduled' : 'Autopay disabled'}</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
          <div className={`${cardSurface} rounded-2xl p-6`}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Recent invoices</h2>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Download receipts or pay outstanding balances anytime.
                </p>
              </div>
              <button
                type="button"
                className={`${isDark ? 'text-emerald-200 hover:text-emerald-100' : 'text-emerald-600 hover:text-emerald-500'} text-sm font-semibold`}
              >
                Export CSV
              </button>
            </div>
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                  <tr>
                    <th className="py-2 pr-4 font-medium">Invoice</th>
                    <th className="py-2 pr-4 font-medium">Provider</th>
                    <th className="py-2 pr-4 font-medium">Due date</th>
                    <th className="py-2 pr-4 font-medium">Amount</th>
                    <th className="py-2 pr-4 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody className={isDark ? 'text-gray-200' : 'text-gray-700'}>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-gray-100 last:border-0">
                      <td className="py-3 pr-4 font-semibold">{invoice.id}</td>
                      <td className="py-3 pr-4">{invoice.provider}</td>
                      <td className="py-3 pr-4">{formatDate(invoice.dueDate)}</td>
                      <td className="py-3 pr-4">{formatCurrency(invoice.amount)}</td>
                      <td className="py-3 pr-4 text-right">
                        <span className={`inline-flex rounded-full px-3 py-0.5 text-xs font-semibold ${invoiceStatusClasses(invoice.status)}`}>
                          {invoice.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6">
            <div className={`${cardSurface} rounded-2xl p-6`}>
              <div className="flex items-center gap-4">
                <CreditCardIcon className={`${isDark ? 'text-emerald-300' : 'text-emerald-600'} h-10 w-10`} />
                <div>
                  <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Payment method</h3>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Autopay {paymentMethod.autopay ? 'enabled' : 'is currently disabled'}
                  </p>
                </div>
              </div>
              <div className="mt-4 rounded-2xl border border-dashed border-emerald-300 p-4 text-sm">
                <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {paymentMethod.brand} ending in {paymentMethod.last4}
                </p>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Expires {paymentMethod.expires}</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
                <button type="button" className={`${isDark ? 'text-emerald-200' : 'text-emerald-600'}`}>Update card</button>
                <button type="button" className={`${isDark ? 'text-emerald-200' : 'text-emerald-600'}`}>Manage autopay</button>
              </div>
            </div>

            <div className={`${cardSurface} rounded-2xl p-6`}>
              <div className="flex items-center gap-4">
                <ShieldCheckIcon className={`${isDark ? 'text-primary-200' : 'text-primary-600'} h-10 w-10`} />
                <div>
                  <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Insurance coverage</h3>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{insurance.provider}</p>
                </div>
              </div>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <span className="font-semibold">Member ID:</span> {insurance.memberId}
                </li>
                <li>
                  <span className="font-semibold">Coverage:</span> {insurance.coverage}
                </li>
                <li>
                  <span className="font-semibold">Support:</span> {insurance.contact}
                </li>
              </ul>
              <button
                type="button"
                className="mt-4 inline-flex items-center rounded-full bg-gradient-to-r from-primary-600 to-indigo-500 px-4 py-2 text-xs font-semibold text-white"
              >
                <DocumentArrowDownIcon className="mr-2 h-4 w-4" /> Download insurance card
              </button>
            </div>

            <div className={`${cardSurface} rounded-2xl p-6`}>
              <div className="flex items-start gap-3">
                <CheckCircleIcon className="h-6 w-6 text-emerald-500" />
                <div>
                  <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Need help with billing?</p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Our coordinators can clarify charges, update insurance, or set up payment plans.
                  </p>
                  <Link
                    to="/contact"
                    className={`${isDark ? 'text-emerald-200' : 'text-emerald-600'} mt-3 inline-flex items-center text-xs font-semibold`}
                  >
                    Chat with billing support
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BillingPage;
