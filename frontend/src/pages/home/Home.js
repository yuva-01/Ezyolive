import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import Button from '../../components/ui/Button';
import { 
  CalendarIcon, 
  UserIcon, 
  VideoCameraIcon, 
  DocumentTextIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  ChevronDownIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeFaq, setActiveFaq] = useState(null);
  const [isVisible, setIsVisible] = useState({});
  const [showScrollTop, setShowScrollTop] = useState(false);
  const statsRef = useRef(null);
  
  // Theme
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Handle scroll effects (scroll-to-top button)
  useEffect(() => {
    const handleScroll = () => {
      // Show scroll-to-top button when scrolled down enough
      if (window.scrollY > 500) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Function to scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Animation for counting stats
  const [counts, setCounts] = useState({
    practices: 0,
    patients: 0,
    appointments: 0,
    satisfaction: 0
  });
  
  // Intersection observer for scroll animations
  useEffect(() => {
    // Add smooth scrolling behavior to the entire page
    document.documentElement.style.scrollBehavior = 'smooth';
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          
          // Start counting animation when stats section is visible
          if (entry.target.id === 'stats-section') {
            const interval = setInterval(() => {
              setCounts(prev => ({
                practices: prev.practices >= 2500 ? 2500 : prev.practices + 50,
                patients: prev.patients >= 500000 ? 500000 : prev.patients + 10000,
                appointments: prev.appointments >= 1500000 ? 1500000 : prev.appointments + 30000,
                satisfaction: prev.satisfaction >= 98 ? 98 : prev.satisfaction + 2
              }));
            }, 50);
            
            return () => clearInterval(interval);
          }
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }); // Add rootMargin for earlier trigger
    
    // Elements to observe
    const sections = document.querySelectorAll('.animate-on-scroll');
    sections.forEach(section => observer.observe(section));
    
    if (statsRef.current) {
      observer.observe(statsRef.current);
    }
    
    return () => {
      sections.forEach(section => observer.unobserve(section));
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, []);

  // FAQs data
  const faqItems = [
    {
      question: "How secure is my patient data?",
      answer: "Absolutely. We maintain the highest standards of security and compliance. All data is encrypted end-to-end, and we conduct regular security audits to ensure your patient information is always protected."
    },
    {
      question: "What kind of support do you offer?",
      answer: "We offer 24/7 technical support via chat, email, and phone. Our team of healthcare IT specialists understands both the technical and clinical aspects of your practice."
    },
    {
      question: "Do you offer training for my staff?",
      answer: "Yes, comprehensive training is included with every plan. We provide live virtual sessions, on-demand videos, and detailed documentation to ensure your team gets the most out of EzyOlive."
    }
  ];
  
  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };
  
  return (
    <>
      {/* Hero section - Enhanced with 3D elements and dynamic visual effects */}
      <div className={`relative overflow-hidden ${isDark ? 'bg-gradient-to-br from-slate-900 via-indigo-950 to-gray-900' : 'bg-gradient-to-br from-blue-950 via-blue-800 to-indigo-900'}`}>
        {/* Simplified background effects - static gradients instead of animations */}
        <div className="absolute top-0 left-0 w-[120%] h-[120%] bg-blue-400 rounded-full filter blur-[200px] opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-[100%] h-[100%] bg-indigo-600 rounded-full filter blur-[180px] opacity-20"></div>
        <div className="absolute top-1/3 left-1/4 w-[80%] h-[80%] bg-teal-400 rounded-full filter blur-[180px] opacity-10"></div>
        
        {/* Simplified background without animated particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Removed particle animations for better performance */}
          <div className={`h-full w-full ${isDark ? 'opacity-10' : 'opacity-15'}`} style={{ 
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            backgroundSize: '30px 30px'
          }}></div>
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-current to-transparent"></div>
        </div>
        
        {/* Glowing accent lines - horizontal (static) */}
        <div className="absolute top-[15%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
        <div className="absolute top-[85%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/30 to-transparent"></div>
        
        {/* Glowing accent lines - vertical (static) */}
        <div className="absolute top-0 bottom-0 left-[15%] w-px bg-gradient-to-b from-transparent via-blue-500/30 to-transparent"></div>
        <div className="absolute top-0 bottom-0 right-[15%] w-px bg-gradient-to-b from-transparent via-teal-500/30 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="pt-28 pb-28 sm:pt-32 lg:pt-36 lg:pb-36">
            <div className="lg:grid lg:grid-cols-12 lg:gap-16">
              {/* Left content column */}
              <div className="lg:col-span-6 z-10" id="hero-content">
                {/* Modern, attention-grabbing headline with gradient layers and 3D effect */}
                <div className="relative">
                  <div className="absolute -left-6 -top-6 w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-cyan-400 blur-2xl opacity-20"></div>
                  <div className="absolute -right-12 bottom-0 w-32 h-32 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 blur-2xl opacity-20"></div>
                  
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight drop-shadow-lg relative">
                    <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-blue-200 pb-1">Modern</span>
                    <span className="block -mt-2 text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-blue-200 pb-1">Healthcare</span>
                    <span className="block -mt-2 text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-teal-300 pb-1">Management</span>
                    <span className="block -mt-2 text-transparent bg-clip-text bg-gradient-to-br from-teal-300 to-emerald-400 pb-1">Solution</span>
                    
                    {/* 3D text shadow layers */}
                    <span className="absolute -left-1 top-1 blur-sm text-transparent bg-clip-text bg-gradient-to-r from-blue-700/20 to-teal-700/20 z-[-1] select-none">Modern Healthcare Management Solution</span>
                    <span className="absolute -left-1.5 top-1.5 blur-md text-transparent bg-clip-text bg-gradient-to-r from-blue-900/10 to-teal-900/10 z-[-2] select-none">Modern Healthcare Management Solution</span>
                  </h1>
                </div>
                
                {/* Regular tagline without animation */}
                <div className="relative mt-10 sm:mt-12">
                  <div className="h-px w-24 bg-gradient-to-r from-blue-500 to-teal-500 mb-6"></div>
                  <p className="text-base sm:text-xl lg:text-lg xl:text-xl text-blue-50 leading-relaxed max-w-lg relative">
                    Streamline your medical practice with our all-in-one platform designed for modern healthcare providers.
                    <span className="text-teal-300"> From appointments to patient records, EzyOlive makes healthcare management simple and efficient.</span>
                  </p>
                </div>
                
                {/* Enhanced call-to-action buttons with hover effects and animated accents */}
                <div className="mt-12 sm:mt-14 relative">
                  <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
                    <Link
                      to="/register"
                      className="group flex items-center justify-center px-8 py-4 text-lg font-medium rounded-md shadow-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-500 hover:to-teal-400 transition-all duration-300 hover:shadow-xl hover:shadow-blue-600/30 transform hover:-translate-y-1 relative overflow-hidden"
                    >
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600/0 via-white/20 to-blue-600/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                      <span className="relative flex items-center">
                        Get Started
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </Link>
                    <Link
                      to="/features"
                      className="group flex items-center justify-center px-8 py-4 text-lg font-medium rounded-md border border-blue-400/30 bg-white/5 backdrop-blur-sm text-white hover:bg-white/15 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden"
                    >
                      <span className="absolute inset-0 w-0.5 h-full bg-gradient-to-b from-transparent via-blue-400/50 to-transparent opacity-50 left-0"></span>
                      <span className="absolute inset-0 w-0.5 h-full bg-gradient-to-b from-transparent via-blue-400/50 to-transparent opacity-50 right-0"></span>
                      <span className="absolute inset-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent opacity-50 top-0"></span>
                      <span className="absolute inset-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent opacity-50 bottom-0"></span>
                      <span className="relative flex items-center">
                        View Features
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:rotate-45 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </Link>
                  </div>
                </div>
                
                {/* Trust indicators with animated pulse */}
                <div className="mt-14 hidden sm:block">
                  <p className="text-blue-200/80 text-sm mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-teal-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Trusted by 2,500+ healthcare providers
                  </p>
                  <div className="flex space-x-4">
                    <div className="h-2 w-16 bg-gradient-to-r from-blue-400 via-teal-400 to-blue-400 rounded-full"></div>
                    <div className="h-2 w-8 bg-white/30 rounded-full"></div>
                    <div className="h-2 w-4 bg-white/20 rounded-full"></div>
                  </div>
                </div>
              </div>
              
              {/* Right image column with simplified effect */}
              <div className="mt-16 lg:mt-0 lg:col-span-6 relative z-10" id="hero-image">
                <div className="relative h-full">
                  <div className="transition-all duration-500">
                    {/* Simplified image wrapper without 3D animations */}
                    <div className="relative transition-all duration-500">
                      {/* Multi-layered card with glow effects */}
                      <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-blue-600 to-teal-400 opacity-75 blur-md"></div>
                      <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-blue-600/30 to-teal-400/30 opacity-75 blur-xl"></div>
                      
                      {/* Main image with glassy frame */}
                      <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-gradient-to-br from-blue-900/70 via-indigo-900/70 to-blue-950/70 backdrop-blur-sm">
                        {/* Glass reflections */}
                        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/20 to-transparent rounded-t-xl"></div>
                        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                        
                        {/* Main image with subtle border */}
                        <img
                          className="w-full h-full object-cover rounded-lg z-10 transform transition-transform duration-700 hover:scale-105"
                          src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                          alt="EzyOlive healthcare dashboard"
                        />
                        
                        {/* Floating elements */}
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500/20 rounded-full blur-xl"></div>
                        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-teal-500/20 rounded-full blur-xl"></div>
                      </div>
                      
                      {/* Decorative floating badges */}
                      <div className="absolute -top-4 -left-4 bg-white/10 backdrop-blur-md rounded-lg p-3 shadow-xl border border-white/20 transform -rotate-6">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <span className="text-xs font-medium text-white">Live Patient Data</span>
                        </div>
                      </div>
                      
                      <div className="absolute -bottom-3 -right-3 bg-white/10 backdrop-blur-md rounded-lg p-3 shadow-xl border border-white/20 transform rotate-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          <span className="text-xs font-medium text-white">Appointment Scheduling</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className={`py-16 sm:py-24 lg:py-32 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className={`text-base font-semibold uppercase tracking-wide ${
              isDark ? 'text-blue-400' : 'text-blue-600'
            }`}>Comprehensive Solution</h2>
            <p className={`mt-1 text-4xl font-extrabold sm:text-5xl sm:tracking-tight lg:text-6xl ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Everything you need</p>
            <p className={`max-w-xl mt-5 mx-auto text-xl ${
              isDark ? 'text-gray-300' : 'text-gray-500'
            }`}>
              Designed by healthcare professionals for healthcare professionals.
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className={`animate-on-scroll relative pt-8 ${
                isDark ? 'bg-gray-800' : 'bg-gray-50'
              } rounded-lg px-6 pb-8 transition-transform duration-500 hover:-translate-y-2`} id="feature-1">
                <div className={`absolute top-0 left-1/2 transform -translate-y-1/2 -translate-x-1/2 p-3 rounded-lg ${
                  isDark ? 'bg-blue-900' : 'bg-blue-100'
                }`}>
                  <CalendarIcon className={`h-8 w-8 ${isDark ? 'text-blue-300' : 'text-blue-600'}`} aria-hidden="true" />
                </div>
                <h3 className={`mt-8 text-xl font-medium ${isDark ? 'text-white' : 'text-gray-900'} text-center`}>
                  Appointment Management
                </h3>
                <p className={`mt-4 text-base ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                  Schedule, reschedule, and manage appointments with our intuitive calendar interface. Send automated reminders to reduce no-shows.
                </p>
              </div>

              {/* Feature 2 */}
              <div className={`animate-on-scroll relative pt-8 ${
                isDark ? 'bg-gray-800' : 'bg-gray-50'
              } rounded-lg px-6 pb-8 transition-transform duration-500 hover:-translate-y-2`} id="feature-2">
                <div className={`absolute top-0 left-1/2 transform -translate-y-1/2 -translate-x-1/2 p-3 rounded-lg ${
                  isDark ? 'bg-indigo-900' : 'bg-indigo-100'
                }`}>
                  <DocumentTextIcon className={`h-8 w-8 ${isDark ? 'text-indigo-300' : 'text-indigo-600'}`} aria-hidden="true" />
                </div>
                <h3 className={`mt-8 text-xl font-medium ${isDark ? 'text-white' : 'text-gray-900'} text-center`}>
                  Electronic Health Records
                </h3>
                <p className={`mt-4 text-base ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                  Maintain comprehensive patient records with our secure EHR system. Access patient history, medications, and tests in one place.
                </p>
              </div>

              {/* Feature 3 */}
              <div className={`animate-on-scroll relative pt-8 ${
                isDark ? 'bg-gray-800' : 'bg-gray-50'
              } rounded-lg px-6 pb-8 transition-transform duration-500 hover:-translate-y-2`} id="feature-3">
                <div className={`absolute top-0 left-1/2 transform -translate-y-1/2 -translate-x-1/2 p-3 rounded-lg ${
                  isDark ? 'bg-green-900' : 'bg-green-100'
                }`}>
                  <VideoCameraIcon className={`h-8 w-8 ${isDark ? 'text-green-300' : 'text-green-600'}`} aria-hidden="true" />
                </div>
                <h3 className={`mt-8 text-xl font-medium ${isDark ? 'text-white' : 'text-gray-900'} text-center`}>
                  Telehealth Integration
                </h3>
                <p className={`mt-4 text-base ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                  Conduct virtual visits with integrated video calls. Share screens, send files, and maintain the same level of care remotely.
                </p>
              </div>

              {/* Feature 4 */}
              <div className={`animate-on-scroll relative pt-8 ${
                isDark ? 'bg-gray-800' : 'bg-gray-50'
              } rounded-lg px-6 pb-8 transition-transform duration-500 hover:-translate-y-2`} id="feature-4">
                <div className={`absolute top-0 left-1/2 transform -translate-y-1/2 -translate-x-1/2 p-3 rounded-lg ${
                  isDark ? 'bg-purple-900' : 'bg-purple-100'
                }`}>
                  <UserIcon className={`h-8 w-8 ${isDark ? 'text-purple-300' : 'text-purple-600'}`} aria-hidden="true" />
                </div>
                <h3 className={`mt-8 text-xl font-medium ${isDark ? 'text-white' : 'text-gray-900'} text-center`}>
                  Patient Portal
                </h3>
                <p className={`mt-4 text-base ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                  Empower patients with a secure portal to request appointments, access records, and communicate with their providers.
                </p>
              </div>

              {/* Feature 5 */}
              <div className={`animate-on-scroll relative pt-8 ${
                isDark ? 'bg-gray-800' : 'bg-gray-50'
              } rounded-lg px-6 pb-8 transition-transform duration-500 hover:-translate-y-2`} id="feature-5">
                <div className={`absolute top-0 left-1/2 transform -translate-y-1/2 -translate-x-1/2 p-3 rounded-lg ${
                  isDark ? 'bg-red-900' : 'bg-red-100'
                }`}>
                  <ChartBarIcon className={`h-8 w-8 ${isDark ? 'text-red-300' : 'text-red-600'}`} aria-hidden="true" />
                </div>
                <h3 className={`mt-8 text-xl font-medium ${isDark ? 'text-white' : 'text-gray-900'} text-center`}>
                  Analytics & Reporting
                </h3>
                <p className={`mt-4 text-base ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                  Gain insights with comprehensive analytics. Track practice performance, patient demographics, and financial metrics.
                </p>
              </div>

              {/* Feature 6 */}
              <div className={`animate-on-scroll relative pt-8 ${
                isDark ? 'bg-gray-800' : 'bg-gray-50'
              } rounded-lg px-6 pb-8 transition-transform duration-500 hover:-translate-y-2`} id="feature-6">
                <div className={`absolute top-0 left-1/2 transform -translate-y-1/2 -translate-x-1/2 p-3 rounded-lg ${
                  isDark ? 'bg-yellow-900' : 'bg-yellow-100'
                }`}>
                  <CurrencyDollarIcon className={`h-8 w-8 ${isDark ? 'text-yellow-300' : 'text-yellow-600'}`} aria-hidden="true" />
                </div>
                <h3 className={`mt-8 text-xl font-medium ${isDark ? 'text-white' : 'text-gray-900'} text-center`}>
                  Billing & Payments
                </h3>
                <p className={`mt-4 text-base ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                  Simplify billing with insurance verification, claims submission, and payment processing all in one system.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-20 text-center">
            <Link
              to="/features"
              className={`inline-flex items-center px-6 py-3 text-base font-medium rounded-md shadow-sm ${
                isDark 
                  ? 'text-white bg-blue-700 hover:bg-blue-600' 
                  : 'text-white bg-blue-600 hover:bg-blue-700'
              } transition-colors duration-300`}
            >
              View All Features
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Stats section */}
      <div ref={statsRef} id="stats-section" className={`${
        isDark ? 'bg-blue-900' : 'bg-blue-700'
      } py-16`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Stat 1 */}
            <div className="text-center">
              <p className="text-5xl font-extrabold text-white">
                {counts.practices.toLocaleString()}+
              </p>
              <p className="mt-2 text-xl font-medium text-blue-100">Medical Practices</p>
            </div>
            
            {/* Stat 2 */}
            <div className="text-center">
              <p className="text-5xl font-extrabold text-white">
                {counts.patients.toLocaleString()}+
              </p>
              <p className="mt-2 text-xl font-medium text-blue-100">Patients Served</p>
            </div>
            
            {/* Stat 3 */}
            <div className="text-center">
              <p className="text-5xl font-extrabold text-white">
                {counts.appointments.toLocaleString()}+
              </p>
              <p className="mt-2 text-xl font-medium text-blue-100">Appointments Booked</p>
            </div>
            
            {/* Stat 4 */}
            <div className="text-center">
              <p className="text-5xl font-extrabold text-white">
                {counts.satisfaction}%
              </p>
              <p className="mt-2 text-xl font-medium text-blue-100">Client Satisfaction</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ section */}
      <div className={`${isDark ? 'bg-gray-900' : 'bg-white'} py-16 sm:py-24`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl font-extrabold text-center ${
            isDark ? 'text-white' : 'text-gray-900'
          } sm:text-4xl`}>
            Frequently Asked Questions
          </h2>
          <div className="mt-12 max-w-3xl mx-auto">
            <div className="space-y-6">
              {faqItems.map((item, index) => (
                <div 
                  key={index} 
                  className={`${
                    isDark 
                      ? 'bg-gray-800 hover:bg-gray-700' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  } p-6 rounded-lg transition-colors duration-300`}
                >
                  <button
                    className="flex justify-between items-center w-full text-left focus:outline-none"
                    onClick={() => toggleFaq(index)}
                  >
                    <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {item.question}
                    </h3>
                    <ChevronDownIcon 
                      className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'} transform ${
                        activeFaq === index ? 'rotate-180' : 'rotate-0'
                      } transition-transform duration-300`} 
                    />
                  </button>
                  {activeFaq === index && (
                    <div className="mt-4 animate-fadeIn">
                      <p className={`text-base ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-10 text-center">
              <Link
                to="/contact"
                className={`inline-flex items-center px-4 py-2 text-base font-medium rounded-md ${
                  isDark 
                    ? 'text-blue-300 hover:text-blue-200' 
                    : 'text-blue-600 hover:text-blue-500'
                }`}
              >
                Have more questions? Contact us
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Call to action section */}
      <div className={`relative ${isDark ? 'bg-blue-900' : 'bg-blue-600'} overflow-hidden`}>
        {/* Background decorative elements */}
        <div className="hidden lg:block lg:absolute lg:inset-0">
          <svg
            className="absolute top-0 left-1/2 transform translate-x-64 -translate-y-8"
            width="640"
            height="784"
            fill="none"
            viewBox="0 0 640 784"
          >
            <defs>
              <pattern
                id="9ebea6f4-a1f5-4d96-8c4e-4c2abf658047"
                x="118"
                y="0"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <rect x="0" y="0" width="4" height="4" className="text-blue-500" fill="currentColor" />
              </pattern>
            </defs>
            <rect y="72" width="640" height="640" className="text-blue-800" fill="currentColor" />
            <rect x="118" width="404" height="784" fill="url(#9ebea6f4-a1f5-4d96-8c4e-4c2abf658047)" />
          </svg>
        </div>
        
        <div className="relative py-16 sm:py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
                Ready to streamline your practice?
              </h2>
              <p className="mt-4 text-xl text-blue-100 max-w-2xl mx-auto">
                Join thousands of healthcare providers who trust EzyOlive to run their practice more efficiently.
              </p>
              <div className="mt-8 flex justify-center">
                <Link
                  to="/register"
                  className="px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 transition-colors duration-300"
                >
                  Start Your Free Trial
                </Link>
                <Link
                  to="/contact"
                  className="ml-4 px-5 py-3 border border-blue-300 text-base font-medium rounded-md text-white hover:bg-blue-800 transition-colors duration-300"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg ${
            isDark ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-500'
          } text-white transition-all duration-300 z-50 focus:outline-none focus:ring-2 focus:ring-blue-400`}
          aria-label="Scroll to top"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          <span className="sr-only">Scroll to top</span>
        </button>
      )}
    </>
  );
};

export default Home;
