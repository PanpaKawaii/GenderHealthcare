import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../../hooks/Context/AuthContext.jsx';
import { authenticate } from '../../services/authService';
import './LoginRegister.css';

export default function Login() {

    const [Remember, setRemember] = useState(false);
    const handleRemember = () => {
        console.log(!Remember);
        setRemember(p => !p);
    };

    const navigate = useNavigate();
    const { login } = UserAuth();

    const [errorSignIn, setErrorSignIn] = useState(null);
    const [loading, setLoading] = useState(false);

    const Login = async (email, password) => {
        console.log('Remember: ', Remember);

        if (!email) {
            console.error('Invalid email');
            setErrorSignIn('Invalid email');
            return;
        }
        if (!password) {
            console.error('Invalid password');
            setErrorSignIn('Invalid password');
            return;
        }

        setLoading(true);
        
        try {
            const result = await authenticate(email, password);
            console.log('Authentication result:', result);

            if (result.allowLogin) {
                // Token is already saved in localStorage by the authenticate function
                // User data already saved in localStorage by the authenticate function
                
                login(); // Update auth context
                
                // Redirect based on role
                const userRole = result.userInfo.role;
                if (userRole === 'Admin') {
                  navigate('/admin/dashboard');
                } else if (userRole === 'Doctor') {
                  navigate('/doctor/dashboard');
                } else if (userRole === 'Counselor') {
                  navigate('/counselor/dashboard');
                } else {
                  navigate('/'); // Default for customers
                }
            } else {
                setErrorSignIn('Incorrect email or password');
            }
        } catch (error) {
            console.error('Login error:', error);
            setErrorSignIn(error.message || 'Failed to login. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSignIn = (e) => {
        e.preventDefault();
        console.log('Sign In');
        setErrorSignIn(null);
        const email = e.target.email.value;
        const password = e.target.password.value;
        console.log({
            email,
            password,
        });
        Login(
            email,
            password,
        );
    }

    return (
        <div className='login-container'>

            <div className='back-arrow'>
                <Link to='/'><i className='fa-solid fa-arrow-left'></i></Link>
            </div>

            <div className='login-card'>
                <div className='card-heading'>
                    <i className='fa-regular fa-heart'></i>
                    <div className='welcome'>Welcome back</div>
                    <div className='text'>Sign in to your Healthcare account</div>
                </div>

                <div className='card-body'>
                    <form onSubmit={handleSignIn}>
                        <div className='form-email form-group'>
                            <label htmlFor='email'>Email</label>
                            <input type='text' id='email' name='email' placeholder='Enter your email'
                                style={{
                                    border: errorSignIn && (
                                        errorSignIn == 'Invalid email' ||
                                        errorSignIn == 'Incorrect email or password'
                                    ) && '1px solid #dc3545',
                                }} />
                        </div>
                        <div className='form-password form-group'>
                            <label htmlFor='password'>Password</label>
                            <input type='password' id='password' name='password' placeholder='Enter your password'
                                style={{
                                    border: errorSignIn && (
                                        errorSignIn == 'Invalid password' ||
                                        errorSignIn == 'Incorrect email or password'
                                    ) && '1px solid #dc3545',
                                }} />
                        </div>

                        <div className='last-form'>
                            <div className='form-remember'>
                                <label>
                                    <input type='checkbox' checked={Remember} name='remember' onChange={handleRemember} />
                                    Remember me
                                </label>
                            </div>

                            <a href='https://hotro.tiki.vn/s/article/dieu-khoan-su-dung' className='forgot-password' target='_blank'>Forgot password?</a>
                        </div>

                        {errorSignIn ?
                            <div className='error-status status-box'>*{errorSignIn}</div>
                            :
                            <div className='status-box'></div>
                        }

                        <button className='btn login-btn'>SIGN IN</button>
                    </form>

                    <div className='or'>
                        <hr />
                        <span>Or continue with</span>
                        <hr />
                    </div>

                    <button className='btn btn-google'>Login with Google</button>

                    <div className='signup-link link'>Don't have any account? <Link to='/register'>Sign up here!</Link></div>
                </div>
            </div>
        </div>
    )
}
