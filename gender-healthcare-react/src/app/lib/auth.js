// auth.js - Authentication utility functions for the frontend
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/accounts';

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
    const response = await axios.post(`${API_URL}/register`, userData);
    if (response.data.success && response.data.token) {
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
    const response = await axios.post(`${API_URL}/login`, { email, password });
    if (response.data.success && response.data.token) {
      setAuthToken(response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error occurred' };
  }
};

// Logout user
export const logout = () => {
  setAuthToken(null);
  // Additional cleanup if needed
};

// Get current user info
export const getCurrentUser = async () => {
  try {
    // Make sure we have a token
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }
    
    // Set token in headers just in case it wasn't set
    setAuthToken(token);
    
    const response = await axios.get(`${API_URL}/me`);
    return response.data;
  } catch (error) {
    // If token is invalid or expired, clear it
    if (error.response && [401, 403].includes(error.response.status)) {
      setAuthToken(null);
    }
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

// Initialize authentication
export const initAuth = () => {
  const token = localStorage.getItem('token');
  if (token) {
    setAuthToken(token);
  }
};
