import React, { createContext, useState, useEffect } from 'react';
import { getCurrentUser, isAuthenticated, logout, initAuth } from '../lib/auth';

// Create the context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);

  // Initialize auth state
  useEffect(() => {
    const initialize = async () => {
      // Initialize auth (set token in axios headers)
      initAuth();
      
      // Try to get current user data if authenticated
      if (isAuthenticated()) {
        try {
          const userData = await getCurrentUser();
          if (userData && userData.success) {
            setCurrentUser(userData.user);
          } else {
            // If token is invalid but exists, log out
            logout();
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          logout();
        }
      }
      
      setLoading(false);
      setAuthInitialized(true);
    };

    initialize();
  }, []);

  // Update auth state when user logs in
  const updateUser = (user) => {
    setCurrentUser(user);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!currentUser,
        currentUser,
        updateUser,
        logout: handleLogout,
        loading,
        authInitialized
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
