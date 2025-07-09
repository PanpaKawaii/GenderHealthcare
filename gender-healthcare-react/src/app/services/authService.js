import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Set JWT token in localStorage and axios headers
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Register a new user
export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/accounts/register`, userData);
    if (response.data.success && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('UserId', response.data.user._id);
      localStorage.setItem('UserRole', response.data.user.role);
      localStorage.setItem('IsLogIn', 'true');
      setAuthToken(response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error occurred' };
  }
};

// Login user
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/accounts/login`, { email, password });
    if (response.data.success && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('UserId', response.data.user._id);
      localStorage.setItem('UserRole', response.data.user.role);
      localStorage.setItem('IsLogIn', 'true');
      setAuthToken(response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error occurred' };
  }
};

// Authentication with existing method
export const authenticate = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/accounts/authentication`, { email, password });
    if (response.data.success && response.data.allowLogin && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('UserId', response.data.userInfo._id);
      localStorage.setItem('UserRole', response.data.userInfo.role);
      localStorage.setItem('IsLogIn', 'true');
      setAuthToken(response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error occurred' };
  }
};

// Logout user
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('UserId');
  localStorage.removeItem('UserRole');
  localStorage.removeItem('IsLogIn');
  setAuthToken(null);
};

// Get current user information
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }
    
    setAuthToken(token);
    const response = await axios.get(`${API_URL}/accounts/me`);
    return response.data;
  } catch (error) {
    if (error.response && [401, 403].includes(error.response.status)) {
      logout();
    }
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

// Initialize authentication state
export const initAuth = () => {
  const token = localStorage.getItem('token');
  if (token) {
    setAuthToken(token);
  }
};

// Setup axios interceptor for expired tokens
export const setupAxiosInterceptors = () => {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        logout();
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
};
