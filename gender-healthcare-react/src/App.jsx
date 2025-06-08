import './App.css';
import MainRoutes from './app/routes/MainRoutes';
import { useEffect } from 'react';
import { api } from './app/services/api';

export default function App() {
  // Setup axios global error handler for unauthorized responses
  useEffect(() => {
    // Add a response interceptor to handle 401 errors globally
    const interceptor = api.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401) {
          // Clear the token if it's invalid
          localStorage.removeItem('token');
          // Redirect to login page if needed
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );

    return () => {
      // Clean up interceptor on component unmount
      api.interceptors.response.eject(interceptor);
    };
  }, []);

  return <MainRoutes />;
}


