import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import ForumPage from '../pages/ForumPage/ForumPage';
import LoginPage from '../pages/AuthPages/LoginPage';
import RegisterPage from '../pages/AuthPages/RegisterPage';

import Login from '../pages/Login/Login'
import Register from '../pages/Login/Register'

import { accountAPI } from '../services/api';

// Protected route component
const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setIsAuthenticated(false);
                    setLoading(false);
                    return;
                }

                await accountAPI.getCurrentUser();
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Authentication check failed:', error);
                localStorage.removeItem('token');
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default function MainRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public routes */}
                {/* <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} /> */}

                {/* Protected routes with layout */}
                <Route path="/" element={
                    //   <ProtectedRoute>
                    <Layout />
                    //   </ProtectedRoute>

                }>
                    <Route index element={<Navigate to="/forum" replace />} />
                    <Route path="forum" element={<ForumPage />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/register' element={<Register />} />
                    <Route path="profile" element={<div>Profile Page (Coming Soon)</div>} />
                    <Route path="menstrual-tracker" element={<div>Menstrual Tracker (Coming Soon)</div>} />
                    <Route path="reminders" element={<div>Reminders (Coming Soon)</div>} />
                </Route>

                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}