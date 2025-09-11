import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import ThemeSwitcher from '../../components/common/ThemeSwitcher';

const PublicLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const location = useLocation();

  // Handle scroll effects for header styling
  useEffect(() => {
    const handleScroll = () => {
      // Change header styling when scrolled
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`${isDark ? 'bg-gray-900' : 'bg-white'} min-h-screen transition-colors duration-300`}>
      <header className={`${isScrolled 
        ? (isDark ? 'bg-gray-900/90 backdrop-blur-md' : 'bg-blue-900/90 backdrop-blur-md')
        : (isDark ? 'bg-transparent' : 'bg-transparent')
        } sticky top-0 z-50 transition-all duration-300`}>
        <div className={`${isScrolled ? 'py-2' : 'py-4'} max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300`}>
          <nav className="relative flex items-center justify-between">
            <div className="flex items-center flex-1">
              <div className="flex items-center justify-between w-full md:w-auto">
                <Link to="/" className="group">
                  <span className="sr-only">EzyOlive</span>
                  <h1 className="text-3xl font-bold text-white flex items-center">
                    <span className="text-green-300 mr-1 group-hover:text-green-200 transition-colors duration-300">Ezy</span>
                    <span className="text-white group-hover:text-green-100 transition-colors duration-300">Olive</span>
                    <span className="ml-2 text-xs bg-gradient-to-r from-green-500 to-emerald-400 text-white px-2 py-1 rounded-full group-hover:from-green-400 group-hover:to-emerald-300 transition-all duration-300">Healthcare</span>
                  </h1>
                </Link>
                <div className="flex items-center md:hidden">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:text-white hover:bg-blue-700/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white/50 backdrop-blur-sm"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  >
                    <span className="sr-only">Open main menu</span>
                    <svg className={`${mobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <svg className={`${mobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="hidden md:block md:ml-10">
                <div className="flex space-x-8">
                  <Link 
                    to="/" 
                    className={`${location.pathname === '/' 
                      ? 'text-white font-medium border-b-2 border-green-400' 
                      : 'text-white/90 hover:text-white hover:border-b-2 hover:border-green-400/70'
                    } px-1 py-1 text-base transition-all duration-300 relative group`}
                  >
                    <span className="relative z-10">Home</span>
                    {location.pathname !== '/' && (
                      <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-green-400 to-teal-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                    )}
                  </Link>
                  <Link 
                    to="/features" 
                    className={`${location.pathname === '/features' 
                      ? 'text-white font-medium border-b-2 border-green-400' 
                      : 'text-white/90 hover:text-white hover:border-b-2 hover:border-green-400/70'
                    } px-1 py-1 text-base transition-all duration-300 relative group`}
                  >
                    <span className="relative z-10">Features</span>
                    {location.pathname !== '/features' && (
                      <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-green-400 to-teal-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                    )}
                  </Link>
                  <Link 
                    to="/pricing" 
                    className={`${location.pathname === '/pricing' 
                      ? 'text-white font-medium border-b-2 border-green-400' 
                      : 'text-white/90 hover:text-white hover:border-b-2 hover:border-green-400/70'
                    } px-1 py-1 text-base transition-all duration-300 relative group`}
                  >
                    <span className="relative z-10">Pricing</span>
                    {location.pathname !== '/pricing' && (
                      <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-green-400 to-teal-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                    )}
                  </Link>
                  <Link 
                    to="/about" 
                    className={`${location.pathname === '/about' 
                      ? 'text-white font-medium border-b-2 border-green-400' 
                      : 'text-white/90 hover:text-white hover:border-b-2 hover:border-green-400/70'
                    } px-1 py-1 text-base transition-all duration-300 relative group`}
                  >
                    <span className="relative z-10">About</span>
                    {location.pathname !== '/about' && (
                      <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-green-400 to-teal-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                    )}
                  </Link>
                  <Link 
                    to="/contact" 
                    className={`${location.pathname === '/contact' 
                      ? 'text-white font-medium border-b-2 border-green-400' 
                      : 'text-white/90 hover:text-white hover:border-b-2 hover:border-green-400/70'
                    } px-1 py-1 text-base transition-all duration-300 relative group`}
                  >
                    <span className="relative z-10">Contact</span>
                    {location.pathname !== '/contact' && (
                      <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-green-400 to-teal-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                    )}
                  </Link>
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <ThemeSwitcher />
              <Link 
                to="/login" 
                className="relative inline-block bg-white/10 backdrop-blur-sm text-white px-5 py-2 rounded-md font-medium transition-all duration-300 hover:bg-white/20 overflow-hidden group border border-white/30"
              >
                <span className="relative z-10">Login</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 to-teal-400 transition-all duration-500 group-hover:w-full"></span>
              </Link>
              <Link 
                to="/register" 
                className="relative inline-block bg-gradient-to-r from-green-500 to-teal-400 text-white px-5 py-2 rounded-md font-medium transition-all duration-300 hover:from-green-400 hover:to-teal-300 hover:shadow-lg hover:shadow-green-500/20 transform hover:-translate-y-0.5 overflow-hidden"
              >
                <span className="relative z-10">Register</span>
                <div className="absolute inset-0 h-full w-full opacity-0 hover:opacity-20 transition-opacity duration-300 bg-white"></div>
              </Link>
            </div>
          </nav>
          
          {/* Mobile menu */}
          <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden mt-4 rounded-xl overflow-hidden shadow-2xl transition-all duration-300`}>
            <div className={`px-2 pt-2 pb-3 space-y-2 sm:px-3 ${isDark ? 'bg-gray-800/95' : 'bg-blue-600/95'} backdrop-blur-lg`}>
              <Link 
                to="/" 
                className={`${location.pathname === '/' 
                  ? 'text-white font-medium border-l-4 border-green-400' 
                  : 'text-blue-100 hover:text-white border-l-4 border-transparent hover:border-green-400/70'
                } block px-3 py-2 text-base transition-all duration-300`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/features" 
                className={`${location.pathname === '/features' 
                  ? 'text-white font-medium border-l-4 border-green-400' 
                  : 'text-blue-100 hover:text-white border-l-4 border-transparent hover:border-green-400/70'
                } block px-3 py-2 text-base transition-all duration-300`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link 
                to="/pricing" 
                className={`${location.pathname === '/pricing' 
                  ? 'text-white font-medium border-l-4 border-green-400' 
                  : 'text-blue-100 hover:text-white border-l-4 border-transparent hover:border-green-400/70'
                } block px-3 py-2 text-base transition-all duration-300`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link 
                to="/about" 
                className={`${location.pathname === '/about' 
                  ? 'text-white font-medium border-l-4 border-green-400' 
                  : 'text-blue-100 hover:text-white border-l-4 border-transparent hover:border-green-400/70'
                } block px-3 py-2 text-base transition-all duration-300`}
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className={`${location.pathname === '/contact' 
                  ? 'text-white font-medium border-l-4 border-green-400' 
                  : 'text-blue-100 hover:text-white border-l-4 border-transparent hover:border-green-400/70'
                } block px-3 py-2 text-base transition-all duration-300`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="pt-3 flex items-center justify-between border-t border-white/10 mt-3">
                <ThemeSwitcher />
                <span className="text-blue-100 text-sm">Switch Theme</span>
              </div>
            </div>
            <div className="pt-4 pb-3 border-t border-white/20 flex flex-col space-y-3 px-3 bg-gradient-to-r from-blue-600/95 to-blue-700/95 backdrop-blur-lg">
              <Link 
                to="/login" 
                className="relative inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-md font-medium hover:bg-white/30 text-center transition-all duration-300 border border-white/30"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="relative z-10">Login</span>
              </Link>
              <Link 
                to="/register" 
                className="relative inline-block bg-gradient-to-r from-green-500 to-teal-400 text-white px-4 py-2 rounded-md font-medium hover:from-green-400 hover:to-teal-300 text-center transition-all duration-300 transform hover:scale-105"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="relative z-10">Register</span>
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      <main className="overflow-hidden">
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-100 border-gray-200'} border-t mt-20`}>
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <Link to="/" className="group">
                <h2 className="text-2xl font-bold flex items-center">
                  <span className={`${isDark ? 'text-green-400' : 'text-green-500'} mr-1 group-hover:text-green-400 transition-colors duration-300`}>Ezy</span>
                  <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'} group-hover:text-gray-500 transition-colors duration-300`}>Olive</span>
                  <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full group-hover:bg-green-400 transition-colors duration-300">Healthcare</span>
                </h2>
              </Link>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} mt-4 text-base`}>
                A comprehensive healthcare management platform designed for modern medical practices.
              </p>
              <div className="mt-6 flex space-x-6">
                {/* Social media icons would go here */}
              </div>
            </div>
            <div>
              <h3 className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-500'} tracking-wider uppercase`}>
                Company
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link to="/about" className={`${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}>About</Link>
                </li>
                <li>
                  <Link to="/careers" className={`${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}>Careers</Link>
                </li>
                <li>
                  <Link to="/privacy" className={`${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}>Privacy Policy</Link>
                </li>
                <li>
                  <Link to="/terms" className={`${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}>Terms of Service</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-500'} tracking-wider uppercase`}>
                Resources
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link to="/blog" className={`${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}>Blog</Link>
                </li>
                <li>
                  <Link to="/support" className={`${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}>Support</Link>
                </li>
                <li>
                  <Link to="/contact" className={`${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}>Contact</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className={`mt-8 pt-8 ${isDark ? 'border-gray-800' : 'border-gray-200'} border-t md:flex md:items-center md:justify-between`}>
            <p className={`text-base ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              &copy; {new Date().getFullYear()} EzyOlive Healthcare. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
