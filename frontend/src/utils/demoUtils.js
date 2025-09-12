// src/utils/demoUtils.js

// Demo user credentials for testing purposes
export const DEMO_USERS = [
  {
    id: '1',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin',
    avatar: null
  },
  {
    id: '2',
    firstName: 'Doctor',
    lastName: 'Smith',
    email: 'doctor@example.com',
    password: 'password123',
    role: 'doctor',
    avatar: null
  },
  {
    id: '3',
    firstName: 'Patient',
    lastName: 'Johnson',
    email: 'patient@example.com',
    password: 'password123',
    role: 'patient',
    avatar: null
  }
];

export const DEMO_KEY = 'EZYOLIVE_DEMO_MODE';

// Demo mode toggles
export const enableDemo = () => localStorage.setItem(DEMO_KEY, 'true');
export const disableDemo = () => localStorage.removeItem(DEMO_KEY);
export const isInDemoMode = () => localStorage.getItem(DEMO_KEY) === 'true';

/**
 * Authenticate user with demo credentials
 * Returns { token, user, message } or null
 */
export const authenticateDemo = (email, password) => {
  const found = DEMO_USERS.find(u => u.email === email && u.password === password);
  if (!found) return null;

  const user = {
    id: found.id,
    firstName: found.firstName,
    lastName: found.lastName,
    email: found.email,
    role: found.role,
    avatar: found.avatar
  };

  return {
    user,
    token: 'demo-jwt-token-' + Date.now(),
    message: 'Login successful in demo mode'
  };
};

/**
 * Register a demo user
 * Returns { token, user, message }
 */
export const registerDemo = (userData) => {
  const newUser = {
    id: 'demo-' + Date.now(),
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    role: 'patient',
    avatar: null
  };

  return {
    user: newUser,
    token: 'demo-jwt-token-' + Date.now(),
    message: 'Registration successful in demo mode'
  };
};
