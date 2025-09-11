import React, { useState } from 'react';
import './styles.css';
import { useTheme } from '../../context/ThemeContext';
import { 
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  CheckCircleIcon,
  BuildingOffice2Icon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

function Contact() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    subject: 'General Inquiry',
    message: ''
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const subjects = [
    'General Inquiry',
    'Technical Support',
    'Billing Question',
    'Feature Request',
    'Sales',
    'Partnership Opportunity'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setSubmitted(true);
      setLoading(false);
      
      // Reset form after submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        organization: '',
        subject: 'General Inquiry',
        message: ''
      });
      
      // Reset submission status after 6 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 6000);
    }, 1500);
  };

  return (
    <div className={`contact-page ${isDark ? 'dark-mode' : ''}`}>
      {/* Hero section */}
      <div className={`contact-hero ${isDark ? 'bg-gray-900' : 'bg-blue-900'}`}>
        <div className="contact-hero-content">
          <h1 className="text-white">Contact Us</h1>
          <p className="text-blue-100">
            Have questions or need assistance? Our team is here to help you.
          </p>
        </div>
      </div>
    
      <div className="contact-container">
        <div className={`contact-card ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="contact-info">
            <h2 className={`${isDark ? 'text-white' : 'text-gray-800'}`}>Get in Touch</h2>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              We'd love to hear from you. Whether you have a question about our services, 
              need technical support, or want to explore partnership opportunities, 
              our team is ready to respond to your inquiries.
            </p>
            
            <div className="contact-details">
              <div className="contact-item">
                <div className={`contact-icon ${isDark ? 'bg-blue-900' : 'bg-blue-100'}`}>
                  <MapPinIcon className="h-6 w-6 text-blue-500" />
                </div>
                <div className="contact-text">
                  <h3 className={`${isDark ? 'text-white' : 'text-gray-800'}`}>Address</h3>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    123 Healthcare Blvd, <br />
                    San Francisco, CA 94107
                  </p>
                </div>
              </div>
              
              <div className="contact-item">
                <div className={`contact-icon ${isDark ? 'bg-blue-900' : 'bg-blue-100'}`}>
                  <PhoneIcon className="h-6 w-6 text-blue-500" />
                </div>
                <div className="contact-text">
                  <h3 className={`${isDark ? 'text-white' : 'text-gray-800'}`}>Phone</h3>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    <a href="tel:+15551234567" className="hover:underline">+1 (555) 123-4567</a>
                  </p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Monday-Friday, 9AM-5PM PT
                  </p>
                </div>
              </div>
              
              <div className="contact-item">
                <div className={`contact-icon ${isDark ? 'bg-blue-900' : 'bg-blue-100'}`}>
                  <EnvelopeIcon className="h-6 w-6 text-blue-500" />
                </div>
                <div className="contact-text">
                  <h3 className={`${isDark ? 'text-white' : 'text-gray-800'}`}>Email</h3>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    <a href="mailto:support@ezyolive.com" className="hover:underline">support@ezyolive.com</a>
                  </p>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    <a href="mailto:sales@ezyolive.com" className="hover:underline">sales@ezyolive.com</a>
                  </p>
                </div>
              </div>
              
              <div className="contact-item">
                <div className={`contact-icon ${isDark ? 'bg-blue-900' : 'bg-blue-100'}`}>
                  <ClockIcon className="h-6 w-6 text-blue-500" />
                </div>
                <div className="contact-text">
                  <h3 className={`${isDark ? 'text-white' : 'text-gray-800'}`}>Hours</h3>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Monday - Friday: 8am - 6pm <br />
                    Saturday: 9am - 1pm <br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
            
            <div className="social-links">
              <h3 className={`${isDark ? 'text-white' : 'text-gray-800'}`}>Connect With Us</h3>
              <div className="social-icons">
                <a href="#" className={`social-icon ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}>
                  <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a href="#" className={`social-icon ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}>
                  <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className={`social-icon ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}>
                  <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16.98 0a6.9 6.9 0 0 1 5.08 1.98A6.94 6.94 0 0 1 24 7.02v9.96c0 2.08-.68 3.87-1.98 5.13A7.14 7.14 0 0 1 16.94 24H7.06a7.06 7.06 0 0 1-5.03-1.89A6.96 6.96 0 0 1 0 16.94V7.02C0 2.8 2.8 0 7.02 0h9.96zm.05 2.23H7.06c-1.45 0-2.7.43-3.53 1.25a4.82 4.82 0 0 0-1.3 3.54v9.92c0 1.5.43 2.7 1.3 3.58a5 5 0 0 0 3.53 1.25h9.88a5 5 0 0 0 3.53-1.25 4.73 4.73 0 0 0 1.4-3.54V7.02c0-1.45-.47-2.7-1.3-3.54a4.47 4.47 0 0 0-3.54-1.25zM12 5.76c3.39 0 6.2 2.8 6.2 6.2a6.2 6.2 0 0 1-12.4 0 6.2 6.2 0 0 1 6.2-6.2zm0 2.22a3.99 3.99 0 0 0-3.97 3.97A3.99 3.99 0 0 0 12 15.92a3.99 3.99 0 0 0 3.97-3.97A3.99 3.99 0 0 0 12 7.98z" />
                  </svg>
                </a>
                <a href="#" className={`social-icon ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}>
                  <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.23 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.2 0 22.23 0zM7.27 20.1H3.65V9.24h3.62V20.1zM5.47 7.76h-.03c-1.22 0-2-.83-2-1.87 0-1.06.8-1.87 2.05-1.87 1.24 0 2 .8 2.02 1.87 0 1.04-.78 1.87-2.05 1.87zM20.34 20.1h-3.63v-5.8c0-1.45-.52-2.45-1.83-2.45-1 0-1.6.67-1.87 1.32-.1.23-.11.55-.11.88v6.05H9.28s.05-9.82 0-10.84h3.63v1.54a3.6 3.6 0 0 1 3.26-1.8c2.39 0 4.18 1.56 4.18 4.89v6.21z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="contact-form-wrapper">
            {submitted ? (
              <div className="form-success">
                <div className="success-icon">
                  <CheckCircleIcon className="h-16 w-16 text-green-500" />
                </div>
                <h2 className={`${isDark ? 'text-white' : 'text-gray-800'}`}>Thank you!</h2>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Your message has been sent successfully. Our team will get back to you shortly, 
                  usually within 1-2 business days.
                </p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <h2 className={`${isDark ? 'text-white' : 'text-gray-800'}`}>Send us a message</h2>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="name" className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      <UserCircleIcon className="h-5 w-5 inline-block mr-1" />
                      Full Name*
                    </label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      className={isDark ? 'dark-input' : ''}
                      placeholder="John Doe"
                      required 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email" className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      <EnvelopeIcon className="h-5 w-5 inline-block mr-1" />
                      Email*
                    </label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange}
                      className={isDark ? 'dark-input' : ''}
                      placeholder="your.email@example.com" 
                      required 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="phone" className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      <PhoneIcon className="h-5 w-5 inline-block mr-1" />
                      Phone
                    </label>
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange}
                      className={isDark ? 'dark-input' : ''}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="organization" className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      <BuildingOffice2Icon className="h-5 w-5 inline-block mr-1" />
                      Organization
                    </label>
                    <input 
                      type="text" 
                      id="organization" 
                      name="organization" 
                      value={formData.organization}
                      onChange={handleChange}
                      className={isDark ? 'dark-input' : ''}
                      placeholder="Your Company"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="subject" className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <QuestionMarkCircleIcon className="h-5 w-5 inline-block mr-1" />
                    Subject*
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={isDark ? 'dark-input' : ''}
                    required
                  >
                    {subjects.map((subject) => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="message" className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <ChatBubbleLeftRightIcon className="h-5 w-5 inline-block mr-1" />
                    Message*
                  </label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows="5" 
                    value={formData.message} 
                    onChange={handleChange}
                    className={isDark ? 'dark-input' : ''} 
                    placeholder="How can we help you today?"
                    required 
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  className={`submit-button ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      
      {/* Map section */}
      <div className="map-section">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.1034212475854!2d-122.4194160842856!3d37.77492997976018!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808f7e3c5428e1e7%3A0x3039ab22b65a3324!2sSan%20Francisco%2C%20CA%2094107!5e0!3m2!1sen!2sus!4v1624982472059!5m2!1sen!2sus" 
          width="100%" 
          height="450" 
          style={{ border: 0 }} 
          allowFullScreen="" 
          loading="lazy"
          title="EzyOlive location"
        ></iframe>
      </div>

      {/* FAQ section */}
      <div className={`faq-section ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="container">
          <h2 className={`text-center mb-8 ${isDark ? 'text-white' : 'text-gray-800'}`}>Frequently Asked Questions</h2>
          
          <div className="faq-grid">
            <div className={`faq-item ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className={`${isDark ? 'text-white' : 'text-gray-800'}`}>What are your support hours?</h3>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Our technical support team is available Monday through Friday from 8am to 6pm PT. 
                Emergency support is available 24/7 for our Enterprise customers.
              </p>
            </div>
            
            <div className={`faq-item ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className={`${isDark ? 'text-white' : 'text-gray-800'}`}>How quickly can I expect a response?</h3>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                We typically respond to all inquiries within 1 business day. For urgent matters, 
                please call our support line directly.
              </p>
            </div>
            
            <div className={`faq-item ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className={`${isDark ? 'text-white' : 'text-gray-800'}`}>Do you offer product demos?</h3>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Yes, we offer personalized product demonstrations. Please select "Sales" in the 
                subject dropdown and let us know your availability in the message.
              </p>
            </div>
            
            <div className={`faq-item ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className={`${isDark ? 'text-white' : 'text-gray-800'}`}>How do I request a feature?</h3>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                We welcome feature requests! Use the contact form and select "Feature Request" 
                in the dropdown. Our product team reviews all suggestions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
