import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import {
  UserPlusIcon,
  EnvelopeIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  SparklesIcon,
  BuildingOffice2Icon,
} from '@heroicons/react/24/outline';
import { register, reset } from '../../features/auth/authSlice';
import { useTheme } from '../../context/ThemeContext';

const onboardingHighlights = [
  'Concierge launch with interoperability specialists',
  'FHIR, HL7, and SSO integrations ready to activate',
  'Continuous governance to keep data private and safe',
];

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Confirm password is required'),
    agreeTerms: Yup.boolean().oneOf([true], 'You must accept the terms and conditions'),
  });

  const handleSubmit = (values) => {
    const userData = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
      confirmPassword: values.confirmPassword,
      agreeTerms: values.agreeTerms,
    };

    dispatch(register(userData));
  };

  useEffect(() => {
    if (isError) {
      toast.error(message || 'Registration failed');
      dispatch(reset());
    }
  }, [isError, message, dispatch]);

  useEffect(() => {
    if (isSuccess) {
      navigate('/dashboard');
      dispatch(reset());
    }
  }, [isSuccess, navigate, dispatch]);

  useEffect(() => () => dispatch(reset()), [dispatch]);

  const inputBase = 'block w-full rounded-xl border px-4 pl-12 py-3 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0';
  const inputTheme = isDark
    ? 'border-gray-700 bg-gray-900/70 text-gray-100 placeholder-gray-500 focus:border-primary-400 focus:ring-primary-400/40 focus:ring-offset-gray-950'
    : 'border-gray-200 bg-white text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:ring-primary-500/30 focus:ring-offset-white';
  const iconTheme = isDark ? 'text-gray-400' : 'text-gray-500';
  const cardBase = isDark
    ? 'border-gray-800 bg-gray-900/80 shadow-2xl'
    : 'border-gray-200 bg-white/95 shadow-xl';

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-3 text-center md:text-left">
        <span
          className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] ${
            isDark ? 'border border-gray-700 bg-gray-900/70 text-primary-200' : 'border border-primary-100 bg-primary-50 text-primary-600'
          }`}
        >
          <SparklesIcon className="h-4 w-4" />
          Create Workspace
        </span>
        <h1 className={`text-3xl font-semibold leading-tight sm:text-4xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Launch a tailored EzyOlive environment
        </h1>
        <p className={`text-base sm:text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          Bring teams together with a secure command center designed around your existing technology stack.
        </p>
      </div>

      <div className={`overflow-hidden rounded-3xl border ${cardBase}`}>
        <div
          className={`flex items-center gap-3 px-6 py-5 ${
            isDark ? 'bg-gradient-to-r from-gray-900 via-gray-900 to-gray-800' : 'bg-gradient-to-r from-primary-50 via-white to-teal-50'
          }`}
        >
          <span
            className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${
              isDark ? 'bg-primary-500/15 text-primary-200' : 'bg-primary-100 text-primary-600'
            }`}
          >
            <BuildingOffice2Icon className="h-6 w-6" />
          </span>
          <div>
            <p className={`text-xs font-semibold uppercase tracking-[0.28em] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Guided onboarding
            </p>
            <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Dedicated launch team partners with your clinicians
            </p>
          </div>
        </div>

        <div className="px-6 py-6">
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ isValid, dirty }) => (
              <Form className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className={`mb-2 block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                      First name
                    </label>
                    <div className="relative">
                      <Field
                        id="firstName"
                        name="firstName"
                        type="text"
                        className={`${inputBase} ${inputTheme}`}
                        placeholder="Avery"
                      />
                    </div>
                    <ErrorMessage name="firstName" component="p" className="mt-1 text-sm text-danger-500" />
                  </div>
                  <div>
                    <label htmlFor="lastName" className={`mb-2 block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                      Last name
                    </label>
                    <div className="relative">
                      <Field
                        id="lastName"
                        name="lastName"
                        type="text"
                        className={`${inputBase} ${inputTheme}`}
                        placeholder="Taylor"
                      />
                    </div>
                    <ErrorMessage name="lastName" component="p" className="mt-1 text-sm text-danger-500" />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className={`mb-2 block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                    Work email
                  </label>
                  <div className="relative">
                    <EnvelopeIcon className={`pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 ${iconTheme}`} />
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      className={`${inputBase} ${inputTheme}`}
                      placeholder="team@clinic.com"
                    />
                  </div>
                  <ErrorMessage name="email" component="p" className="mt-1 text-sm text-danger-500" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="password" className={`mb-2 block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                      Password
                    </label>
                    <div className="relative">
                      <LockClosedIcon className={`pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 ${iconTheme}`} />
                      <Field
                        id="password"
                        name="password"
                        type="password"
                        className={`${inputBase} ${inputTheme}`}
                        placeholder="Create a secure password"
                      />
                    </div>
                    <ErrorMessage name="password" component="p" className="mt-1 text-sm text-danger-500" />
                    <p className={`mt-1 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Use at least 8 characters with a mix of numbers and symbols.</p>
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className={`mb-2 block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                      Confirm password
                    </label>
                    <div className="relative">
                      <LockClosedIcon className={`pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 ${iconTheme}`} />
                      <Field
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        className={`${inputBase} ${inputTheme}`}
                        placeholder="Repeat password"
                      />
                    </div>
                    <ErrorMessage name="confirmPassword" component="p" className="mt-1 text-sm text-danger-500" />
                  </div>
                </div>

                <div className={`rounded-2xl border px-4 py-3 ${isDark ? 'border-gray-700/70 bg-gray-900/70' : 'border-primary-100 bg-primary-50/40'}`}>
                  <label className="flex items-start gap-3 text-sm">
                    <Field
                      id="agreeTerms"
                      name="agreeTerms"
                      type="checkbox"
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                    />
                    <span className={isDark ? 'text-gray-200' : 'text-gray-700'}>
                      I agree to the
                      <a href="/terms" className="mx-1 font-semibold text-primary-500 hover:text-primary-600">Terms of Service</a>
                      and
                      <a href="/privacy" className="ml-1 font-semibold text-primary-500 hover:text-primary-600">Privacy Policy</a>.
                    </span>
                  </label>
                  <ErrorMessage name="agreeTerms" component="p" className="mt-2 text-sm text-danger-500" />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !(isValid && dirty)}
                  className={`w-full inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-primary-500/10 ${
                    isLoading || !(isValid && dirty) ? 'cursor-not-allowed opacity-70' : 'hover:-translate-y-0.5 hover:shadow-xl'
                  }`}
                  style={{ background: 'linear-gradient(135deg, #22c55e 0%, #0ea5e9 100%)' }}
                >
                  {isLoading ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Creating workspace
                    </>
                  ) : (
                    <>
                      <ArrowRightIcon className="h-5 w-5" />
                      Launch my account
                    </>
                  )}
                </button>
              </Form>
            )}
          </Formik>

          <ul className={`mt-6 grid gap-3 border-t pt-4 text-sm ${isDark ? 'border-gray-800 text-gray-300' : 'border-gray-200 text-gray-600'}`}>
            {onboardingHighlights.map((item) => (
              <li key={item} className="flex items-start gap-2 rounded-2xl bg-gray-900/5 px-4 py-3 dark:bg-white/5">
                <ShieldCheckIcon className="mt-0.5 h-4 w-4 text-primary-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={`flex flex-col items-center gap-2 border-t px-6 py-4 text-sm sm:flex-row sm:justify-between ${
          isDark ? 'border-gray-800 bg-gray-900/90 text-gray-200' : 'border-gray-200 bg-white text-gray-600'
        }`}
        >
          <div className="flex items-center gap-2 text-sm">
            <ShieldCheckIcon className="h-4 w-4 text-primary-500" />
            <span>HIPAA, SOC2, and ISO27001 compliant</span>
          </div>
          <Link
            to="/login"
            className={`inline-flex items-center gap-2 text-sm font-semibold transition-colors duration-200 ${
              isDark ? 'text-primary-200 hover:text-primary-100' : 'text-primary-600 hover:text-primary-700'
            }`}
          >
            Already have an account?
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
