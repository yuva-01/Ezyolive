import React from 'react';
import './styles.css';
import { useTheme } from '../../context/ThemeContext';
import { Link } from 'react-router-dom';
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
  BellAlertIcon
} from '@heroicons/react/24/outline';

function Features() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const mainFeatures = [
    {
      title: "Advanced Analytics",
      description: "Get deep insights into your healthcare practice with detailed analytics dashboards, patient metrics, and financial reporting tools.",
      icon: <ChartBarIcon className="w-12 h-12" />,
      color: "blue"
    },
    {
      title: "Secure Patient Data",
      description: "Your patients' data is protected with enterprise-grade security, HIPAA compliance, and end-to-end encryption.",
      icon: <ShieldCheckIcon className="w-12 h-12" />,
      color: "green"
    },
    {
      title: "Mobile Friendly Access",
      description: "Access your practice dashboard, patient records, and scheduling tools from any device, anywhere, anytime.",
      icon: <DevicePhoneMobileIcon className="w-12 h-12" />,
      color: "purple"
    },
    {
      title: "Fast Performance",
      description: "Our optimized platform ensures rapid access to patient information, scheduling, and billing when you need it most.",
      icon: <BoltIcon className="w-12 h-12" />,
      color: "yellow"
    }
  ];

  const additionalFeatures = [
    {
      title: "Appointment Scheduling",
      icon: <CalendarIcon className="w-6 h-6" />,
      description: "Intuitive calendar for scheduling and managing appointments"
    },
    {
      title: "Patient Management",
      icon: <UserGroupIcon className="w-6 h-6" />,
      description: "Complete patient profiles with medical history and visit notes"
    },
    {
      title: "Real-time Updates",
      icon: <ClockIcon className="w-6 h-6" />,
      description: "Stay updated with real-time notifications and alerts"
    },
    {
      title: "Document Management",
      icon: <DocumentTextIcon className="w-6 h-6" />,
      description: "Store and manage all patient documents securely"
    },
    {
      title: "Payment Processing",
      icon: <CreditCardIcon className="w-6 h-6" />,
      description: "Process payments and manage billing seamlessly"
    },
    {
      title: "Cloud Backup",
      icon: <CloudArrowUpIcon className="w-6 h-6" />,
      description: "Automatic backups of all your important data"
    },
    {
      title: "Performance Reports",
      icon: <ChartPieIcon className="w-6 h-6" />,
      description: "Comprehensive reporting for practice performance"
    },
    {
      title: "Appointment Reminders",
      icon: <BellAlertIcon className="w-6 h-6" />,
      description: "Automated reminders to reduce no-shows"
    }
  ];

  const getIconColor = (color) => {
    switch(color) {
      case 'blue': return 'text-blue-500';
      case 'green': return 'text-green-500';
      case 'purple': return 'text-purple-500';
      case 'yellow': return 'text-amber-500';
      default: return 'text-blue-500';
    }
  };

  return (
    <div className={`features-page ${isDark ? 'dark-mode' : ''}`}>
      {/* Hero section */}
      <div className={`hero-section ${isDark ? 'bg-gray-900' : 'bg-blue-900'}`}>
        <div className="container">
          <h1 className="text-white text-4xl md:text-5xl font-bold mb-4">Powerful Features for Modern Healthcare</h1>
          <p className="text-blue-100 text-xl mb-8 max-w-2xl">
            EzyOlive provides all the tools you need to streamline your healthcare practice and deliver exceptional patient care.
          </p>
          <Link to="/register" className="cta-button">
            Start Free Trial
          </Link>
        </div>
      </div>

      {/* Main features */}
      <div className={`main-features ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="container">
          <h2 className={`section-title ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Core Features
          </h2>
          <div className="features-grid">
            {mainFeatures.map((feature, index) => (
              <div 
                key={index} 
                className={`feature-card ${isDark ? 'bg-gray-800' : 'bg-white'}`}
              >
                <div className={`feature-icon-wrapper ${getIconColor(feature.color)}`}>
                  {feature.icon}
                </div>
                <h3 className={`feature-title ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  {feature.title}
                </h3>
                <p className={`feature-description ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary features */}
      <div className={`secondary-features ${isDark ? 'bg-gray-800' : 'bg-blue-50'}`}>
        <div className="container">
          <h2 className={`section-title ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Additional Capabilities
          </h2>
          <div className="additional-features-grid">
            {additionalFeatures.map((feature, index) => (
              <div 
                key={index} 
                className={`additional-feature-card ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-blue-50'}`}
              >
                <div className="additional-feature-icon">
                  <div className={`icon-wrapper ${isDark ? 'bg-blue-900' : 'bg-blue-100'}`}>
                    <div className="icon text-blue-500">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className={`${isDark ? 'text-white' : 'text-gray-800'}`}>
                    {feature.title}
                  </h3>
                </div>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="cta-section">
        <div className="container">
          <div className={`cta-box ${isDark ? 'bg-blue-900' : 'bg-gradient-to-r from-blue-500 to-blue-700'}`}>
            <h2 className="text-white text-3xl font-bold mb-4">Ready to transform your healthcare practice?</h2>
            <p className="text-blue-100 text-xl mb-8">
              Join thousands of healthcare providers who trust EzyOlive for their practice management needs.
            </p>
            <div className="cta-buttons">
              <Link to="/register" className="cta-primary">
                Get Started
              </Link>
              <Link to="/contact" className="cta-secondary">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Features;
