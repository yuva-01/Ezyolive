import React from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTheme } from '../context/ThemeContext';
import ThemeSwitcher from '../components/common/ThemeSwitcher';
import '../styles/auth.css';

const AuthLayout = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (isAuthenticated && localStorage.getItem('user')) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className={`min-h-screen ${
      isDark 
        ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      {/* Top Navigation Bar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-4">
        <Link to="/" className={`flex items-center gap-2 text-sm font-semibold transition ${
          isDark ? 'text-primary-300 hover:text-primary-200' : 'text-primary-600 hover:text-primary-700'
        }`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Home
        </Link>
        <ThemeSwitcher />
      </div>

      {/* Auth Content */}
      <Outlet />
    </div>
  );
};

export default AuthLayout;
