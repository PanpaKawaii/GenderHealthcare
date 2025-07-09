import React, { useState } from 'react';
import { login } from '../../lib/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { updateUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(email, password);
      
      if (response.success) {
        // Update auth context with user data
        updateUser(response.user);
        
        // Redirect based on user role
        const userRole = response.user?.role;
        
        if (userRole === 'Admin') {
          navigate('/admin/dashboard');
        } else if (userRole === 'Doctor') {
          navigate('/doctor/dashboard');
        } else if (userRole === 'Counselor') {
          navigate('/counselor/dashboard');
        } else {
          navigate('/profile'); // Default for customers
        }
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form-container">
      <h2>Login</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <div className="login-links">
        <a href="/register">Don't have an account? Register</a>
        <a href="/forgot-password">Forgot password?</a>
      </div>
    </div>
  );
};

export default LoginForm;
