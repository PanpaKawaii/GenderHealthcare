import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LoginRegister.css';

export default function Login() {

    const [Remember, setRemember] = useState(false);
    const handleRemember = () => {
        console.log(!Remember);
        setRemember(p => !p);
    };

    const [errorSignIn, setErrorSignIn] = useState(null);
    const [successSignIn, setSuccessSignIn] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

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

        const account = {
            email: email,
            password: password,
        };
        console.log('Sign Ip Data:', account);
        return;

        try {
            const response = await fetch('https://localhost:7166/api/Login/authenticate',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password,
                    }),
                }
            );

            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            if (data.role && data.role === 'User') {
                navigate('/user/information');
            } else {
                navigate('/');
            }

            // if (data.role && data.role === 'User') {
            //     window.location.href = 'http://localhost:5173/user/information';
            // }
            // if (data.role && data.role === 'Staff') {
            //     window.location.href = 'http://localhost:5173';
            // }
            // if (data.role && data.role === 'Admin') {
            //     window.location.href = 'http://localhost:5173';
            // }
        } catch (error) {
            setError('Failed to fetch data: ', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSignIn = (e) => {
        e.preventDefault();
        console.log('Sign In');
        setSuccessSignIn(null);
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
            <div className='login-card'>
                <div className='card-heading'>
                    <i className='fa-regular fa-heart'></i>
                    <div className='welcome'>Welcome back</div>
                    <div className='text'>Sign in to your HeartHealing account</div>
                </div>

                <div className='card-body'>
                    <form onSubmit={handleSignIn}>
                        <div className='form-email form-group'>
                            <label htmlFor='email'>Email</label>
                            <input type='text' id='email' name='email' placeholder='Enter your email'
                                style={{
                                    border: errorSignIn && (
                                        errorSignIn == 'Invalid email'
                                    ) && '1px solid #dc3545',
                                }} />
                        </div>
                        <div className='form-password form-group'>
                            <label htmlFor='password'>Password</label>
                            <input type='password' id='password' name='password' placeholder='Enter your password'
                                style={{
                                    border: errorSignIn && (
                                        errorSignIn == 'Invalid password'
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
