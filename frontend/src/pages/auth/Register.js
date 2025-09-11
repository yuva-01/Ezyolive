import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { register, reset } from '../../features/auth/authSlice';
import { toast } from 'react-toastify';

const Register = () => {
  // Initial form values
  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  };

  // Form validation schema
  const validationSchema = Yup.object({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
    agreeTerms: Yup.boolean()
      .oneOf([true], 'You must accept the terms and conditions')
  });

  // Import what we need
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  // Handle form submission with real registration
  const handleSubmit = (values) => {
    // Create user data object (without confirmPassword)
    const userData = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
    };
    
    dispatch(register(userData));
  };
  
  // Handle success or error messages
  useEffect(() => {
    if (isError) {
      toast.error(message || 'Registration failed');
    }

    if (isSuccess) {
      navigate('/dashboard');
    }

    dispatch(reset());
  }, [isError, isSuccess, message, navigate, dispatch]);

  return (
    <>
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center rounded-full bg-green-100 p-2 mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
          </svg>
        </div>
        <h2 className="text-2xl font-extrabold dark:text-white text-gray-800">
          Join EzyOlive Healthcare
        </h2>
        <p className="mt-2 text-center dark:text-gray-300 text-gray-600 text-sm">
          Create your account to get started
        </p>
      </div>

      <div className="p-4 mb-5 dark:bg-yellow-900/30 bg-yellow-50 border dark:border-yellow-700 border-yellow-200 rounded-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 dark:text-yellow-400 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm dark:text-yellow-300 text-yellow-700">
              This is a demo page. Registration functionality is coming soon.
            </p>
          </div>
        </div>
      </div>
      
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isValid, dirty }) => (
          <Form className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-1">
                  First name
                </label>
                <div className="group">
                  <Field
                    id="firstName"
                    name="firstName"
                    type="text"
                    className="block w-full py-2.5 px-3 dark:text-white dark:bg-gray-700 dark:border-gray-600 dark:focus:border-indigo-500 dark:placeholder-gray-400 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    placeholder="John"
                  />
                  <ErrorMessage name="firstName" component="p" className="mt-1 text-sm text-red-600 dark:text-red-400" />
                </div>
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-1">
                  Last name
                </label>
                <div className="group">
                  <Field
                    id="lastName"
                    name="lastName"
                    type="text"
                    className="block w-full py-2.5 px-3 dark:text-white dark:bg-gray-700 dark:border-gray-600 dark:focus:border-indigo-500 dark:placeholder-gray-400 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    placeholder="Doe"
                  />
                  <ErrorMessage name="lastName" component="p" className="mt-1 text-sm text-red-600 dark:text-red-400" />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-1">
                Email address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-indigo-500 transition-colors duration-200" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  className="block w-full pl-10 py-2.5 dark:text-white dark:bg-gray-700 dark:border-gray-600 dark:focus:border-indigo-500 dark:placeholder-gray-400 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                  placeholder="your.email@example.com"
                />
                <ErrorMessage name="email" component="p" className="mt-1 text-sm text-red-600 dark:text-red-400" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-indigo-500 transition-colors duration-200" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <Field
                  id="password"
                  name="password"
                  type="password"
                  className="block w-full pl-10 py-2.5 dark:text-white dark:bg-gray-700 dark:border-gray-600 dark:focus:border-indigo-500 dark:placeholder-gray-400 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                  placeholder="••••••••"
                />
                <ErrorMessage name="password" component="p" className="mt-1 text-sm text-red-600 dark:text-red-400" />
              </div>
              <p className="mt-1.5 text-xs dark:text-gray-400 text-gray-500">Password must be at least 8 characters long</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-1">
                Confirm password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-indigo-500 transition-colors duration-200" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <Field
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className="block w-full pl-10 py-2.5 dark:text-white dark:bg-gray-700 dark:border-gray-600 dark:focus:border-indigo-500 dark:placeholder-gray-400 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                  placeholder="••••••••"
                />
                <ErrorMessage name="confirmPassword" component="p" className="mt-1 text-sm text-red-600 dark:text-red-400" />
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <Field
                  id="agreeTerms"
                  name="agreeTerms"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-offset-0 focus:ring-indigo-500 focus:ring-2 border-gray-300 rounded transition duration-200"
                />
              </div>
              <label htmlFor="agreeTerms" className="ml-2 block text-sm dark:text-gray-300 text-gray-700">
                I agree to the <a href="/terms" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition duration-200">Terms of Service</a> and <a href="/privacy" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition duration-200">Privacy Policy</a>
              </label>
            </div>
            <ErrorMessage name="agreeTerms" component="p" className="mt-1 text-sm text-red-600 dark:text-red-400" />

            <div>
              <button
                type="submit"
                disabled={!(isValid && dirty)}
                className="w-full flex items-center justify-center py-3 px-6 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-gradient-to-r from-green-600 to-teal-500 hover:from-green-700 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Create account
              </button>
            </div>
          </Form>
        )}
      </Formik>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t dark:border-gray-700 border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 dark:bg-gray-800 dark:text-gray-400 bg-white text-gray-500 rounded-full">Already have an account?</span>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Link to="/login" className="inline-flex items-center font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
            Sign in instead
          </Link>
        </div>
      </div>
    </>
  );
};

export default Register;
