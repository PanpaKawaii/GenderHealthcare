import React from 'react';
import { Link } from 'react-router-dom';
import './Service.css';

export default function Service() {
    return (
        <div className='service-content booking-content'>
            <h1 className='title'>Professional Healthcare Services</h1>
            <p className='script'>Choose from our comprehensive range of medical services provided by board-certified healthcare professionals</p>
            <div className='card-container'>
                <Link to="/booking" className='card card-stethoscope' style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className='icon icon-stethoscope'><i className='fa-solid fa-stethoscope'></i></div>
                    <h2>Medical Consultation</h2>
                    <p>Comprehensive medical evaluations with experienced physicians. Get expert diagnosis, treatment plans, and health guidance tailored to your needs.</p>
                    <ul className='ul-1'>
                        <li>Board-certified physicians</li>
                        <li>Comprehensive health assessment</li>
                        <li>Personalized treatment plans</li>
                        <li>Follow-up care coordination</li>
                    </ul>
                    <div className='line'></div>
                    <div className='price-1'><span>100.000 VND</span> starting from</div>
                    <div className='convenient'>45-60 minute comprehensive session</div>
                    <div className='note-1'>Most Popular</div>
                </Link>
                <Link to="/couselortestbooking" className='card card-hospital' style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className='icon icon-hospital'><i className='fa-solid fa-hospital'></i></div>
                    <h2>STI Testing & Screening</h2>
                    <p>Confidential and comprehensive sexually transmitted infection testing with rapid results. Professional, discreet service in a comfortable environment.</p>
                    <ul className='ul-2'>
                        <li>Complete confidentiality guaranteed</li>
                        <li>Comprehensive panel testing</li>
                        <li>Rapid result turnaround</li>
                        <li>Post-test counseling available</li>
                    </ul>
                    <div className='line'></div>
                    <div className='price-2'><span>120.000 VND</span> starting from</div>
                    <div className='convenient'>Quick, discreet, and professional</div>
                    <div className='note-2'>Same Day Results</div>
                </Link>
            </div>
            <div className='why-choose'>
                <div className='items'>
                    <div className='item'>
                        <div className='icon icon-stethoscope'><i className='fa-solid fa-stethoscope'></i></div>
                        <div className='icon icon-stethoscope'><i className='fa-solid fa-stethoscope'></i></div>
                        <div className='name'>Licensed Professionals</div>
                        <p>All our healthcare providers are board-certified and experienced</p>
                    </div>
                    <div className='item'>
                        <div className='icon icon-stethoscope'><i className='fa-solid fa-hospital'></i></div>
                        <div className='name'>Complete Privacy</div>
                        <p>Your health information is protected with the highest security standards</p>
                    </div>
                    <div className='item'>
                        <div className='icon icon-bolt'><i className='fa-solid fa-bolt'></i></div>
                        <div className='name'>Convenient Scheduling</div>
                        <p>Flexible appointment times that work with your schedule</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
