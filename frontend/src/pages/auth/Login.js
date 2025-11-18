import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import {
  ShieldCheckIcon,
  ArrowRightIcon,
  EnvelopeIcon,
  LockClosedIcon,
  SparklesIcon,
  ComputerDesktopIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { login, reset } from '../../features/auth/authSlice';
import { useTheme } from '../../context/ThemeContext';

const trustSignals = [
  {
    value: '540+',
    label: 'Healthcare orgs live',
  },
  {
    value: '99.98%',
    label: 'Platform uptime',
  },
  {
    value: 'HIPAA · SOC 2',
    label: 'Independently attested',
  },
];

const roleOptions = [
  {
    value: 'patient',
    title: 'Patient Portal',
    description: 'Book visits, attend telehealth sessions, and review care plans.',
    icon: UserIcon,
  },
  {
    value: 'doctor',
    title: 'Doctor Workspace',
    description: 'Manage schedules, monitor panels, and run virtual clinics.',
    icon: ComputerDesktopIcon,
  },
];

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  const initialValues = {
    email: '',
    password: '',
    rememberMe: false,
    role: 'patient',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
    role: Yup.string().oneOf(['patient', 'doctor'], 'Please select a portal').required('Please select a portal'),
  });

  const handleSubmit = (values) => {
    dispatch(login(values));
  };

  useEffect(() => {
    if (isError) {
      toast.error(message || 'Login failed');
    }

    if (isSuccess) {
      navigate('/dashboard');
    }

    if (isError || isSuccess) {
      dispatch(reset());
    }
  }, [isError, isSuccess, message, navigate, dispatch]);

  const inputBase = 'block w-full rounded-xl border px-3.5 pl-11 py-2.5 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0';
  const inputTheme = isDark
    ? 'border-gray-700 bg-gray-900/70 text-gray-100 placeholder-gray-500 focus:border-primary-400 focus:ring-primary-400/40 focus:ring-offset-gray-950'
    : 'border-gray-200 bg-white text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:ring-primary-500/30 focus:ring-offset-white';
  const iconTheme = isDark ? 'text-gray-400' : 'text-gray-500';
  const cardShell = isDark
    ? 'border-gray-800 bg-gray-900/90 shadow-xl'
    : 'border-gray-200 bg-white shadow-xl';

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4 py-8">
      <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[1.2fr,1fr] lg:gap-20">
        {/* Left Column - Hero Content */}
        <div className="flex flex-col justify-center space-y-6 text-center lg:text-left">
          <div className="space-y-4">
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                isDark ? 'bg-primary-500/10 text-primary-300' : 'bg-primary-50 text-primary-700'
              }`}
            >
              <SparklesIcon className="h-3.5 w-3.5" />
              Welcome Back
            </span>
            <div className="space-y-3">
              <h1 className={`text-3xl font-bold leading-tight tracking-tight lg:text-4xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Sign in to your clinical command center
              </h1>
              <p className={`text-base leading-relaxed lg:text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Coordinate patient workflows, monitor operations, and keep every care team aligned in one secure platform.
              </p>
            </div>
          </div>

          {/* Trust Signals */}
          <div className="grid gap-3 sm:grid-cols-3">
            {trustSignals.map((signal) => (
              <div
                key={signal.label}
                className={`rounded-xl border px-3 py-3 text-center ${
                  isDark ? 'border-gray-800 bg-gray-900/50' : 'border-primary-100 bg-primary-50/50'
                }`}
              >
                <p className={`text-xl font-bold ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>{signal.value}</p>
                <p className={`mt-0.5 text-[10px] font-medium uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{signal.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Login Form */}
        <div className="flex items-center justify-center lg:justify-end">
          <div className={`w-full max-w-md overflow-hidden rounded-2xl border ${cardShell}`}>
            {/* Header */}
            <div
              className={`border-b px-6 py-4 ${
                isDark 
                  ? 'border-gray-800 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
                  : 'border-gray-100 bg-gradient-to-br from-white via-primary-50/30 to-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    isDark ? 'bg-primary-500/20 text-primary-300' : 'bg-primary-100 text-primary-600'
                  }`}
                >
                  <ShieldCheckIcon className="h-5 w-5" />
                </div>
                <div>
                  <h2 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Secure Login
                  </h2>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    HIPAA & SOC 2 Certified
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="px-6 py-6">
              <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({ values, isValid, dirty }) => (
                  <Form className="space-y-4">
                    {/* Role Selection */}
                    <div className="space-y-1.5">
                      <label className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                        Sign in as
                      </label>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Choose the portal that fits your role to see the right dashboard.
                      </p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {roleOptions.map((option) => {
                          const Icon = option.icon;
                          const isActive = values.role === option.value;
                          return (
                            <label
                              key={option.value}
                              className={`relative block cursor-pointer rounded-2xl border px-4 py-3 transition-all duration-200 ${
                                isActive
                                  ? 'border-primary-500 bg-primary-500/5 ring-2 ring-primary-500/20'
                                  : isDark
                                  ? 'border-gray-800 bg-gray-900/50 hover:border-primary-400/60'
                                  : 'border-gray-200 bg-white hover:border-primary-200'
                              }`}
                            >
                              <Field type="radio" name="role" value={option.value} className="sr-only" />
                              <div className="flex items-start gap-3">
                                <div
                                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                                    isActive
                                      ? 'bg-primary-500/20 text-primary-400'
                                      : isDark
                                      ? 'bg-gray-800 text-gray-400'
                                      : 'bg-gray-100 text-gray-500'
                                  }`}
                                >
                                  <Icon className="h-5 w-5" />
                                </div>
                                <div>
                                  <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{option.title}</p>
                                  <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {option.description}
                                  </p>
                                </div>
                              </div>
                              {isActive && (
                                <span className="pointer-events-none absolute right-4 top-4 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary-500 text-[10px] font-bold text-white">
                                  ✓
                                </span>
                              )}
                            </label>
                          );
                        })}
                      </div>
                      <ErrorMessage name="role" component="p" className="text-xs text-red-500" />
                    </div>

                    {/* Email Field */}
                    <div className="space-y-1.5">
                      <label htmlFor="email" className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                        Email Address
                      </label>
                      <div className="relative">
                        <EnvelopeIcon className={`pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 ${iconTheme}`} />
                        <Field
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          className={`${inputBase} ${inputTheme}`}
                          placeholder="you@clinic.com"
                        />
                      </div>
                      <ErrorMessage name="email" component="p" className="text-xs text-red-500" />
                    </div>

                    {/* Password Field */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label htmlFor="password" className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                          Password
                        </label>
                        <Link
                          to="/forgot-password"
                          className={`text-xs font-semibold transition-colors ${
                            isDark ? 'text-primary-400 hover:text-primary-300' : 'text-primary-600 hover:text-primary-700'
                          }`}
                        >
                          Forgot?
                        </Link>
                      </div>
                      <div className="relative">
                        <LockClosedIcon className={`pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 ${iconTheme}`} />
                        <Field
                          id="password"
                          name="password"
                          type="password"
                          autoComplete="current-password"
                          className={`${inputBase} ${inputTheme}`}
                          placeholder="••••••••"
                        />
                      </div>
                      <ErrorMessage name="password" component="p" className="text-xs text-red-500" />
                    </div>

                    {/* Remember Me */}
                    <div className="flex items-center pt-1">
                      <label className="flex items-center gap-2">
                        <Field
                          id="rememberMe"
                          name="rememberMe"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-2 focus:ring-primary-500"
                        />
                        <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          Remember me
                        </span>
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading || !(isValid && dirty)}
                      className={`mt-2 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                        isLoading || !(isValid && dirty) 
                          ? 'cursor-not-allowed bg-gray-400 opacity-60' 
                          : 'bg-gradient-to-r from-primary-600 to-teal-600 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary-500/30'
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          Signing in...
                        </>
                      ) : (
                        <>
                          Sign In
                          <ArrowRightIcon className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </Form>
                )}
              </Formik>
            </div>

            {/* Footer */}
            <div
              className={`border-t px-6 py-3.5 text-center ${
                isDark ? 'border-gray-800 bg-gray-900/50' : 'border-gray-100 bg-gray-50/50'
              }`}
            >
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className={`font-semibold transition-colors ${
                    isDark ? 'text-primary-400 hover:text-primary-300' : 'text-primary-600 hover:text-primary-700'
                  }`}
                >
                  Create account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
