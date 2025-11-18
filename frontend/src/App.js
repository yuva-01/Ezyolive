import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { checkAuth } from './features/auth/authSlice';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';
import PublicLayout from './layouts/public/PublicLayout-Medical';
import Home from './pages/home/Home-Medical';
import Dashboard from './pages/dashboard/Dashboard';
import AppointmentList from './pages/appointments/AppointmentList';
import AppointmentForm from './pages/appointments/AppointmentForm';
import Telehealth from './pages/telehealth';
import Billing from './pages/billing';
import Features from './pages/features';
import Pricing from './pages/pricing';
import Contact from './pages/contact';
import About from './pages/about';
import Patients from './pages/patients';
import Analytics from './pages/analytics';
import './styles/theme.css';
import './styles/animations.css';
import './styles/medical-animations.css';
import './styles/tailwind-custom.css';

// Protected route wrapper component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const App = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);
  
  // Check if user is authenticated on app load
  // Adding error handling to prevent potential render issues
  useEffect(() => {
    try {
      dispatch(checkAuth());
    } catch (error) {
      console.error("Auth check error:", error);
    }
  }, [dispatch]);
  
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }
  
  return (
    <ThemeProvider>
      <Routes>
        {/* Public routes (accessible without login) */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
        </Route>
        
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Route>
        
        {/* Protected App Routes */}
        <Route element={<MainLayout />}>
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
        
        {/* Appointment Management */}
        <Route 
          path="/appointments" 
          element={
            <ProtectedRoute>
              <AppointmentList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/appointments/new" 
          element={
            <ProtectedRoute>
              <AppointmentForm />
            </ProtectedRoute>
          } 
        />

        <Route
          path="/patients"
          element={
            <ProtectedRoute>
              <Patients />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />

        {/* Patient experiences */}
        <Route
          path="/telehealth"
          element={
            <ProtectedRoute>
              <Telehealth />
            </ProtectedRoute>
          }
        />
        <Route
          path="/billing"
          element={
            <ProtectedRoute>
              <Billing />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
    </ThemeProvider>
  );
};

export default App;
