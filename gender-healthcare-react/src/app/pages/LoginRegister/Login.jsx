import React, { useState } from 'react';
import './LoginRegister.css';
import { Link } from 'react-router-dom';

export default function Login() {

    const [Remember, setRemember] = useState(false);

    const handleRemember = () => {
        console.log(!Remember);
        setRemember(p => !p);
    };

    const handleSignIn = (e) => {
        e.preventDefault();
        console.log('Submit');
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
                            <input type='text' id='email' name='email'
                                placeholder='Enter your email'
                            // value={formData.email}
                            // onChange={handleChange}
                            />
                        </div>
                        <div className='form-password form-group'>
                            <label htmlFor='password'>Password</label>
                            <input type='password' id='password' name='password'
                                placeholder='Enter your password'
                            // value={formData.password}
                            // onChange={handleChange}
                            />
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

                        <button className='btn'>SIGN IN</button>
                    </form>

                    <div className='or'>
                        <hr />
                        <span>Or continue with</span>
                        <hr />
                    </div>

                    <button className='btn-google'>Login with Google</button>

                    <div className='signup-link link'>Don't have any account? <Link to='/register'>Sign up here!</Link></div>
                </div>
            </div>
        </div>
    )
}
