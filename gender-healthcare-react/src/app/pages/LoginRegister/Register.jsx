import React, { useState } from 'react';
import './Login.css';
import { Link } from 'react-router-dom';

export default function Register() {

    const [Accept, setAccept] = useState(false);

    const handleAccept = () => {
        setAccept(p => !p);
        console.log(Accept);
        // console.log('ABC');
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        console.log('Submit');
    }

    return (
        <div className='register-container'>
            <div className='register-card'>
                <div className='card-heading'>
                    <i className='fa-regular fa-heart'></i>
                    <div className='welcome'>Join GenderHealthcare</div>
                    <div className='text'>Create your account to get started</div>
                </div>

                <div className='card-body'>
                    <form onSubmit={handleUpdate}>
                        <div className='form-name form-group'>
                            <label htmlFor='name'>Name</label>
                            <input type='text' id='name' name='name'
                                placeholder='Enter your name'
                            // value={formData.name}
                            // onChange={handleChange}
                            />
                        </div>
                        <div className='form-email form-group'>
                            <label htmlFor='email'>Email</label>
                            <input type='text' id='email' name='email'
                                placeholder='Enter your email'
                            // value={formData.email}
                            // onChange={handleChange}
                            />
                        </div>

                        <div className='form-group'>
                            <label htmlFor='date'>Date of birth</label>
                            <input type='date' id='date' name='date'
                            // value={formData.password}
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

                        <div className='form-confirm form-group'>
                            <label htmlFor='confirm'>Confirm</label>
                            <input type='password' id='confirm' name='confirm'
                                placeholder='Confirm your password'
                            // value={formData.confirm}
                            // onChange={handleChange}
                            />
                        </div>

                        <div className='last-form'>
                            <div className='form-accept'>
                                <label>
                                    <input type='checkbox' checked={Accept} name='accept' onChange={handleAccept} />
                                    Accept provision
                                </label>
                            </div>
                        </div>

                        <button className='btn'>CREATE ACCOUNT</button>
                    </form>

                    <div className='or'>
                        <hr />
                        <span>Or continue with</span>
                        <hr />
                    </div>

                    <div className='signin-link link'>Have an account? <Link to='/'>Sign in here!</Link></div>
                </div>
            </div>
        </div>
    )
}
