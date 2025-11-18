import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { isInDemoMode, authenticateDemo, registerDemo, enableDemo, disableDemo } from '../../utils/demoUtils';

const API_URL = '/api/auth/';

const normalizeAuthPayload = (payload) => {
  if (!payload) return null;

  const baseUser = payload.data?.user || payload.user || payload;
  if (!baseUser) return null;

  const normalized = {
    ...baseUser,
  };

  const token = payload.token || baseUser.token;
  if (token) {
    normalized.token = token;
  }

  if (payload.status && !normalized.status) {
    normalized.status = payload.status;
  }

  if (payload.message && !normalized.message) {
    normalized.message = payload.message;
  }

  return normalized;
};

const persistAuthUser = (payload, { demo = false } = {}) => {
  const normalized = normalizeAuthPayload(payload);
  if (!normalized) return null;

  localStorage.setItem('user', JSON.stringify(normalized));
  if (normalized.token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${normalized.token}`;
  }

  if (demo) {
    enableDemo();
  }

  return normalized;
};

// Register user
const register = async (userData) => {
  // Use demo mode if enabled
  if (isInDemoMode()) {
    const demoResponse = registerDemo(userData);
    
    if (demoResponse) {
      return persistAuthUser(demoResponse, { demo: true });
    }
    
    return null;
  }
  
  // Real API call
  const response = await axios.post(API_URL + 'signup', userData);
  console.log('Registration response:', response);
  if (response.data) {
    disableDemo();
    return persistAuthUser(response.data);
  }

  return null;
};

// Login user
const login = async (userData) => {
  // Use demo mode if enabled
  if (isInDemoMode()) {
    const demoResponse = authenticateDemo(userData);
    
    if (demoResponse) {
      return persistAuthUser(demoResponse, { demo: true });
    }

    throw new Error('Invalid email, password, or role');
  }
  
  // Real API call
  const response = await axios.post(API_URL + 'login', userData);

  if (response.data) {
    disableDemo();
    return persistAuthUser(response.data);
  }

  return null;
};

// Logout user
const logout = async () => {
  // Clean up regardless of demo mode
  disableDemo();
  localStorage.removeItem('user');
  delete axios.defaults.headers.common['Authorization'];
  
  // Only call the API if not in demo mode
  if (!isInDemoMode()) {
    try {
      await axios.get(API_URL + 'logout');
    } catch (error) {
      console.log('Error during logout:', error);
    }
  }
  
  return { success: true };
};

// Get current user
const getCurrentUser = async () => {
  try {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const user = normalizeAuthPayload(storedUser);

    if (!user) {
      return null;
    }

    // Demo mode - no token expiry check
    if (isInDemoMode() && user.token && user.token.startsWith('demo-jwt-token')) {
      // Set token in axios default headers for all requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
      return user;
    }

    // If we switched from demo mode and have a demo token, clear it
    if (!isInDemoMode() && user.token && user.token.startsWith('demo-jwt-token')) {
      logout();
      return null;
    }

    // Check if token is expired for real tokens
    if (user.token) {
      try {
        const decodedToken = jwt_decode(user.token);
        const currentTime = Date.now() / 1000;
        
        if (decodedToken.exp < currentTime) {
          // Token expired
          logout();
          return null;
        }

        // Set token in axios default headers for all requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
        
        return user;
      } catch (error) {
        console.log('Error decoding token:', error);
        logout();
        return null;
      }
    }
    
    return null;
  } catch (error) {
    console.log('Error getting current user:', error);
    logout();
    return null;
  }
};

// Forgot password
const forgotPassword = async (email) => {
  const response = await axios.post(API_URL + 'forgot-password', { email });
  return response.data;
};

// Reset password
const resetPassword = async (token, password) => {
  const response = await axios.post(API_URL + 'reset-password/' + token, {
    password,
  });
  return response.data;
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  forgotPassword,
  resetPassword,
};

export default authService;
