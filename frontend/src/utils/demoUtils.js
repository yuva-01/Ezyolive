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

/**
 * Check if the application should use demo mode (no backend)
 */
export const isInDemoMode = () => {
  return false; // Set to false to disable demo mode
};

/**
 * Authenticate user with demo credentials
 */
export const authenticateDemo = (email, password) => {
  const user = DEMO_USERS.find(u => u.email === email && u.password === password);
  if (user) {
    // Return a mock response similar to what the API would return
    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      },
      token: 'demo-jwt-token-' + Date.now(),
      message: 'Login successful in demo mode'
    };
  }
  return null;
};

/**
 * Register a demo user
 */
export const registerDemo = (userData) => {
  // Create a new demo user
  const newUser = {
    id: 'demo-' + Date.now(),
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    role: 'patient',
    avatar: null
  };
  
  // Return mock response
  return {
    user: newUser,
    token: 'demo-jwt-token-' + Date.now(),
    message: 'Registration successful in demo mode'
  };
};
