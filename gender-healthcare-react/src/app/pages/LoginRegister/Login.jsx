import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../../hooks/Context/AuthContext.jsx';
import { postData } from './api_register.js';
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
        console.log('Sign In Data:', account);

        const token = '';
        try {
            const result = await postData('/accounts/authentication', token, account);
            console.log('result', result);
            console.log('allowLogin', result.allowLogin);

            if (result.allowLogin) {
                // setSuccessSignIn('Sign up success!');
                // if (result.userInfo.role == 'Customer') {
                // navigate('http://localhost:5173/register');
                // } else {

                // localStorage.removeItem('Token');
                // localStorage.setItem('Token', data.token);
                localStorage.removeItem('UserId');
                localStorage.setItem('UserId', result.userInfo._id);
                localStorage.removeItem('UserRole');
                localStorage.setItem('UserRole', result.userInfo.role);
                localStorage.removeItem('isLogIn');
                localStorage.setItem('IsLogIn', 'true');
                login();
                navigate('/');
                // }
            } else {
                setErrorSignIn('Incorrect email or password');
            }
        } catch (error) {
            setError('Failed to fetch data: ', error);
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
