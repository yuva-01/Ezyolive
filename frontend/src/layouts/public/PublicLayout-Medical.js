import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import ThemeSwitcher from '../../components/common/ThemeSwitcher';
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  InformationCircleIcon,
  CurrencyDollarIcon,
  PhoneIcon,
  SparklesIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  ShieldCheckIcon,
  ClockIcon,
  EnvelopeIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

const PublicLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navigation = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Features', href: '/features', icon: SparklesIcon },
    { name: 'About', href: '/about', icon: InformationCircleIcon },
    { name: 'Pricing', href: '/pricing', icon: CurrencyDollarIcon },
    { name: 'Contact', href: '/contact', icon: PhoneIcon },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`${isDark ? 'bg-gray-900' : 'bg-clinical-50'} min-h-screen transition-colors duration-300`}>
      {/* Top Bar with Trust Indicators */}
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} py-2`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-secondary-600">
                <ShieldCheckIcon className="w-4 h-4" />
                <span className="hidden sm:inline">HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-2 text-teal-600">
                <ClockIcon className="w-4 h-4" />
                <span className="hidden sm:inline">24/7 Support</span>
              </div>
              <div className="flex items-center gap-2 text-primary-600">
                <HeartIconSolid className="w-4 h-4 pulse-slow" />
                <span className="hidden sm:inline">Trusted by 2,500+ Providers</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-gray-600">
              <a href="tel:+1234567890" className="hidden sm:flex items-center gap-2 hover:text-primary-600 transition-colors">
                <PhoneIcon className="w-4 h-4" />
                <span>(123) 456-7890</span>
              </a>
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header 
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? isDark
              ? 'bg-gray-900/95 backdrop-blur-xl shadow-medical border-b border-gray-800'
              : 'bg-white/95 backdrop-blur-xl shadow-medical border-b border-gray-200'
            : isDark
              ? 'bg-transparent'
              : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="group flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-teal-500 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-primary-500 via-primary-600 to-teal-600 rounded-xl flex items-center justify-center shadow-medical transform group-hover:scale-110 transition-transform duration-300">
                  <HeartIconSolid className="w-7 h-7 text-white heartbeat" />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-display font-bold bg-gradient-to-r from-primary-600 to-teal-600 bg-clip-text text-transparent">
                    Ezy
                  </span>
                  <span className="text-2xl font-display font-bold text-primary-600">
                    Olive
                  </span>
                </div>
                <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Healthcare Platform
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group relative px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      active
                        ? 'text-primary-600'
                        : isDark
                          ? 'text-gray-300 hover:text-white'
                          : 'text-gray-700 hover:text-primary-600'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Icon className="w-5 h-5" />
                      {item.name}
                    </span>
                    {active && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-primary-500 to-teal-500 rounded-full"></span>
                    )}
                    {!active && (
                      <span className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-teal-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Auth Buttons - Desktop */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                to="/login"
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all duration-300 ${
                  isDark
                    ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
                }`}
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                <span>Login</span>
              </Link>
              <Link
                to="/register"
                className="group relative inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary-500 to-teal-500 text-white rounded-lg font-semibold shadow-glow hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <UserIcon className="w-5 h-5 relative z-10" />
                <span className="relative z-10">Get Started</span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                isDark
                  ? 'text-gray-300 hover:bg-gray-800'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`lg:hidden border-t ${isDark ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'}`}>
            <div className="px-4 py-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                      active
                        ? 'bg-gradient-to-r from-primary-500/10 to-teal-500/10 text-primary-600'
                        : isDark
                          ? 'text-gray-300 hover:bg-gray-800'
                          : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}
              <div className="pt-4 space-y-2 border-t border-gray-200 dark:border-gray-800">
                <Link
                  to="/login"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                    isDark
                      ? 'text-gray-300 hover:bg-gray-800'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-primary-500 to-teal-500 text-white rounded-lg font-semibold shadow-glow"
                >
                  <UserIcon className="w-5 h-5" />
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className={`${isDark ? 'bg-gray-900 border-t border-gray-800' : 'bg-white border-t border-gray-200'} mt-auto`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2 space-y-4">
              <Link to="/" className="group inline-flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-teal-500 rounded-xl blur-md opacity-30"></div>
                  <div className="relative w-12 h-12 bg-gradient-to-br from-primary-500 to-teal-600 rounded-xl flex items-center justify-center shadow-medical">
                    <HeartIconSolid className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-display font-bold bg-gradient-to-r from-primary-600 to-teal-600 bg-clip-text text-transparent">
                    EzyOlive
                  </span>
                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Healthcare Platform
                  </span>
                </div>
              </Link>
              <p className={`text-sm max-w-md ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Transforming healthcare management with innovative technology. Trusted by healthcare professionals worldwide for secure, efficient, and comprehensive medical practice solutions.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-secondary-600">
                  <ShieldCheckIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">HIPAA Compliant</span>
                </div>
                <div className="flex items-center gap-2 text-primary-600">
                  <HeartIconSolid className="w-5 h-5" />
                  <span className="text-sm font-medium">99.9% Uptime</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className={`font-semibold text-lg mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Quick Links
              </h3>
              <ul className="space-y-2">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={`text-sm transition-colors ${
                        isDark
                          ? 'text-gray-400 hover:text-primary-400'
                          : 'text-gray-600 hover:text-primary-600'
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className={`font-semibold text-lg mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Contact Us
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <EnvelopeIcon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                  <a
                    href="mailto:contact@ezyolive.com"
                    className={`text-sm transition-colors ${
                      isDark
                        ? 'text-gray-400 hover:text-primary-400'
                        : 'text-gray-600 hover:text-primary-600'
                    }`}
                  >
                    contact@ezyolive.com
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <PhoneIcon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                  <a
                    href="tel:+1234567890"
                    className={`text-sm transition-colors ${
                      isDark
                        ? 'text-gray-400 hover:text-primary-400'
                        : 'text-gray-600 hover:text-primary-600'
                    }`}
                  >
                    (123) 456-7890
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <MapPinIcon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    123 Healthcare Ave<br />
                    Medical District, CA 90210
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className={`mt-8 pt-8 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'} flex flex-col md:flex-row justify-between items-center gap-4`}>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              © {new Date().getFullYear()} EzyOlive Healthcare Platform. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                to="/privacy"
                className={`text-sm transition-colors ${
                  isDark
                    ? 'text-gray-400 hover:text-primary-400'
                    : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className={`text-sm transition-colors ${
                  isDark
                    ? 'text-gray-400 hover:text-primary-400'
                    : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
