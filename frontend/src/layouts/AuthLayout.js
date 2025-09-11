import React from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTheme } from '../context/ThemeContext';
import Logo from '../components/common/Logo';
import ThemeSwitcher from '../components/common/ThemeSwitcher';
import '../styles/auth.css';

const AuthLayout = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // If user is authenticated, redirect to dashboard
  // Using React Router's Navigate causes the component to remount, which might be causing the issue
  // Only redirect if truly authenticated to prevent infinite render loops
  if (isAuthenticated && localStorage.getItem('user')) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image and branding */}
      <div className="hidden lg:block relative w-0 flex-1 overflow-hidden">
        <div className="absolute inset-0">
          <img
            className="h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
            alt="Healthcare professionals"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-800/90 via-indigo-600/80 to-green-600/70" aria-hidden="true" />
        </div>
        <div className="absolute inset-0 flex flex-col justify-center items-center p-12 text-white">
          <div className="backdrop-blur-sm bg-white/10 p-8 rounded-2xl shadow-2xl border border-white/20">
            <Logo className="h-24 w-auto mb-8 mx-auto" />
            <h1 className="text-4xl font-extrabold tracking-tight text-center text-shadow-sm">
              EzyOlive Healthcare
            </h1>
            <p className="mt-6 max-w-3xl text-center text-xl text-shadow-sm">
              A comprehensive healthcare management platform designed for modern medical practices.
            </p>
            <div className="mt-8 bg-white/20 rounded-lg p-4 backdrop-blur-sm border border-white/30">
              <blockquote className="italic text-white">
                "Transforming healthcare management with modern technology and intuitive design."
              </blockquote>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth forms */}
      <div className={`flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 ${
        isDark 
          ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
          : 'bg-gradient-to-br from-gray-50 to-gray-100'
      }`}>
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="flex flex-col">
            <div className="lg:hidden flex flex-col items-center mb-4">
              <Logo className="h-16 w-auto" />
              <h2 className={`mt-3 text-center text-3xl font-extrabold ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}>
                EzyOlive Healthcare
              </h2>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <Link to="/" className="flex items-center text-indigo-600 hover:text-indigo-500 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Home
              </Link>
              <ThemeSwitcher />
            </div>
          </div>

          <div className={`${
            isDark 
              ? 'bg-gray-800/80 text-white shadow-2xl border border-gray-700' 
              : 'bg-white/90 shadow-2xl border border-gray-100'
          } rounded-2xl p-8 backdrop-blur-sm`}>
            <Outlet />
          </div>

          {/* Footer links */}
          <div className={`mt-8 text-center ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <div className="flex justify-center space-x-6">
              <Link to="/" className={`hover:${isDark ? 'text-indigo-400' : 'text-indigo-600'} transition-colors duration-200 flex items-center`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Home
              </Link>
              <Link to="/about" className={`hover:${isDark ? 'text-indigo-400' : 'text-indigo-600'} transition-colors duration-200 flex items-center`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                About
              </Link>
              <Link to="/contact" className={`hover:${isDark ? 'text-indigo-400' : 'text-indigo-600'} transition-colors duration-200 flex items-center`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M2.94 6.412A2 2 0 002 8.108V16a2 2 0 002 2h12a2 2 0 002-2V8.108a2 2 0 00-.94-1.696l-6-3.75a2 2 0 00-2.12 0l-6 3.75zm2.615 2.423a1 1 0 10-1.11 1.664l5 3.333a1 1 0 001.11 0l5-3.333a1 1 0 00-1.11-1.664L10 11.798 5.555 8.835z" clipRule="evenodd" />
                </svg>
                Contact
              </Link>
            </div>
            <p className="mt-4 text-sm">&copy; {new Date().getFullYear()} EzyOlive Healthcare. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
