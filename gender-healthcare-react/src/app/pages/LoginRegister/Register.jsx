import React, { useState } from 'react';
import './LoginRegister.css';
import { Link } from 'react-router-dom';

export default function Register() {

    const [Accept, setAccept] = useState(false);
    const handleAccept = () => {
        console.log(!Accept);
        setAccept(p => !p);
    };

    // const [formData, setFormData] = useState({
    //     name: '',
    //     image: '',
    //     gender: '',
    //     email: '',
    //     phone: '',
    //     password: '',
    //     role: '',
    //     accountId: '',
    //     dateOfBirth: '',
    //     address: '',
    // });

    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormData((prevState) => ({
    //         ...prevState,
    //         [name]: value,
    //     }));
    // };

    // const handleGenderChange = (e) => {
    //     setFormData((prevState) => ({
    //         ...prevState,
    //         gender: e.target.value,
    //     }));
    // };

    const [errorSignUp, setErrorSignUp] = useState(null);
    const [successSignUp, setSuccessSignUp] = useState(null);


    const SignUp = async (name, email, phone, date, gender, password, confirm) => {

        console.log('Accept: ', Accept);

        if (!name) {
            console.error('Invalid name');
            setErrorSignUp('Invalid name');
            return;
        }

        if (!email) {
            console.error('Invalid email');
            setErrorSignUp('Invalid email');
            return;
        }

        if (!phone) {
            console.error('Invalid phone number');
            setErrorSignUp('Invalid phone number');
            return;
        }
        if (!/^\d+$/.test(phone)) {
            console.error('Phone number must contain only digits');
            setErrorSignUp('Phone number must contain only digits');
            return;
        }
        if (phone.length !== 10) {
            console.error('Phone number must contain exactly 10 digits');
            setErrorSignUp('Phone number must contain exactly 10 digits');
            return;
        }

        if (!date) {
            console.error('Invalid date of birth');
            setErrorSignUp('Invalid date of birth');
            return;
        }
        const isOver16 = (dateOfBirth) => {
            const birthDate = new Date(dateOfBirth);
            const currentDate = new Date();

            let age = currentDate.getFullYear() - birthDate.getFullYear();
            const monthDifference = currentDate.getMonth() - birthDate.getMonth();

            if (monthDifference < 0 || (monthDifference === 0 && currentDate.getDate() < birthDate.getDate())) {
                age--;
            }
            return age >= 16;
        }
        if (!isOver16(date)) {
            console.error('You must be at least 16');
            setErrorSignUp('You must be at least 16');
            return;
        }

        if (!gender) {
            console.error('Invalid gender');
            setErrorSignUp('Invalid gender');
            return;
        }

        if (!password) {
            console.error('Invalid password');
            setErrorSignUp('Invalid password');
            return;
        }
        if (password.length < 6) {
            console.error('Password must be at least 6 characters long');
            setErrorSignUp('Password must be at least 6 characters long');
            return;
        }

        if (!confirm) {
            console.error('Invalid password confirmation');
            setErrorSignUp('Invalid password confirmation');
            return;
        }
        if (password != confirm) {
            console.error('Wrong password confirmation');
            setErrorSignUp('Wrong password confirmation');
            return;
        }

        if (Accept === false) {
            console.error('You must accept the provision to sign up');
            setErrorSignUp('You must accept the provision to sign up');
            return;
        }

        const account = {
            name: name,
            image: '',
            gender: gender,
            email: email,
            phone: phone,
            password: password,
            role: 'Customer'
        };
        // const customer = {
        //     accountId: accountId,
        //     dateOfBirth: date,
        //     address: '',
        // };
        console.log('Sign Up Data:', account);

        // const isExist = localStorage.getItem(`id${SignUpPhoneNumber}`);
        // if (isExist == SignUpPhoneNumber) {
        //     setErrorSignUp('Your email has been signed in');
        //     return;
        // }

        setSuccessSignUp('Sign up success!');
        const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
        await sleep(1500);
        console.log('Sign up success!');
    };

    const handleSignUp = (e) => {
        e.preventDefault();
        console.log('Sign Up');
        setSuccessSignUp(null);
        setErrorSignUp(null);
        const name = e.target.name.value;
        const email = e.target.email.value;
        const phone = e.target.phone.value;
        const date = e.target.date.value;
        const gender = e.target.gender.value;
        const password = e.target.password.value;
        const confirm = e.target.confirm.value;
        console.log({
            name,
            email,
            phone,
            date,
            gender,
            password,
            confirm,
        });
        SignUp(
            name,
            email,
            phone,
            date,
            gender,
            password,
            confirm,
        );
    }

    return (
        <div className='register-container'>
            <div className='register-card'>
                <div className='card-heading'>
                    <i className='fa-regular fa-heart'></i>
                    <div className='welcome'>Join HeartHealing</div>
                    <div className='text'>Create your account to get started</div>
                </div>

                <div className='card-body'>
                    <form onSubmit={handleSignUp}>

                        <div className='form-name form-group'>
                            <label htmlFor='name'>Name</label>
                            <input type='text' id='name' name='name' placeholder='Enter your name'
                                style={{
                                    border: errorSignUp && (
                                        errorSignUp == 'Invalid name'
                                    ) && '1px solid #dc3545',
                                }} />
                        </div>

                        <div className='form-email form-group'>
                            <label htmlFor='email'>Email</label>
                            <input type='text' id='email' name='email' placeholder='Enter your email'
                                style={{
                                    border: errorSignUp && (
                                        errorSignUp == 'Invalid email'
                                    ) && '1px solid #dc3545',
                                }} />
                        </div>

                        <div className='form-phone form-group'>
                            {/* <i className='fa-solid fa-phone'></i> */}
                            <label htmlFor='phone'>Phone Number</label>
                            <input type='text' id='phone' name='phone' placeholder='Enter your phone number'
                                style={{
                                    border: errorSignUp && (
                                        errorSignUp == 'Invalid phone number' ||
                                        errorSignUp == 'Phone number must contain only digits' ||
                                        errorSignUp == 'Phone number must contain exactly 10 digits'
                                    ) && '1px solid #dc3545',
                                }} />
                        </div>

                        <div className='form-date form-group'>
                            <label htmlFor='date'>Date of birth</label>
                            <input type='date' id='date' name='date'
                                style={{
                                    border: errorSignUp && (
                                        errorSignUp == 'Invalid date of birth' ||
                                        errorSignUp == 'You must be at least 16'
                                    ) && '1px solid #dc3545',
                                }} />
                        </div>

                        <div className='form-gender form-group'>
                            <label>Gender</label>
                            <div className='gender-toggle'>
                                <label htmlFor='male'
                                    style={{
                                        borderBottom: errorSignUp && (
                                            errorSignUp == 'Invalid gender'
                                        ) && '2px solid #dc3545',
                                    }} >
                                    <input type='radio' id='male' name='gender' value='Male' />
                                    Male
                                </label>
                                <label htmlFor='female'
                                    style={{
                                        borderBottom: errorSignUp && (
                                            errorSignUp == 'Invalid gender'
                                        ) && '2px solid #dc3545',
                                    }} >
                                    <input type='radio' id='female' name='gender' value='Female' />
                                    Female
                                </label>
                                <label htmlFor='other'
                                    style={{
                                        borderBottom: errorSignUp && (
                                            errorSignUp == 'Invalid gender'
                                        ) && '2px solid #dc3545',
                                    }} >
                                    <input type='radio' id='other' name='gender' value='Other' />
                                    Other
                                </label>
                            </div>
                        </div>

                        <div className='form-password form-group'>
                            <label htmlFor='password'>Password</label>
                            <input type='password' id='password' name='password' placeholder='Enter your password'
                                style={{
                                    border: errorSignUp && (
                                        errorSignUp == 'Invalid password' ||
                                        errorSignUp == 'Password must be at least 6 characters long'
                                    ) && '1px solid #dc3545',
                                }} />
                        </div>

                        <div className='form-confirm form-group'>
                            <label htmlFor='confirm'>Confirm</label>
                            <input type='password' id='confirm' name='confirm' placeholder='Confirm your password'
                                style={{
                                    border: errorSignUp && (
                                        errorSignUp == 'Invalid password confirmation' ||
                                        errorSignUp == 'Wrong password confirmation'
                                    ) && '1px solid #dc3545',
                                }} />
                        </div>

                        <div className='last-form'>
                            <a href='https://hotro.tiki.vn/s/article/dieu-khoan-su-dung' className='provision' target='_blank'>
                                Provision
                            </a>
                            <div className='form-accept'>
                                <label
                                    style={{
                                        borderBottom: errorSignUp && (
                                            errorSignUp == 'You must accept the provision to sign up'
                                        ) && '2px solid #dc3545',
                                    }}>
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

                    <div className='signin-link link'>Have an account? <Link to='/login'>Sign in here!</Link></div>
                </div>
            </div>
        </div>
    )
}
