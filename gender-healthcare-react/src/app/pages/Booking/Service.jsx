import React from 'react';
import './Service.css';

export default function Service() {
    return (
        <div className='service-content booking-content'>
            <h1 className='title'>Professional Healthcare Services</h1>
            <p className='script'>Choose from our comprehensive range of medical services provided by board-certified healthcare professionals</p>
            <div className='card-container'>
                <div className='card'>
                    <i className='fa-solid fa-circle-check'></i>
                    <h2>Medical Consultation</h2>
                    <p>Comprehensive medical evaluations with experienced physicians. Get expert diagnosis, treatment plans, and health guidance tailored to your needs.</p>
                    <ul>
                        <li>Board-certified physicians</li>
                        <li>Comprehensive health assessment</li>
                        <li>Personalized treatment plans</li>
                        <li>Follow-up care coordination</li>
                    </ul>
                    <div className='line'></div>
                    <div><span>$150</span> starting from</div>
                    <div>45-60 minute comprehensive session</div>
                    <div>Most Popular</div>
                </div>
                <div className='card'>
                    <i className='fa-solid fa-circle-check'></i>
                    <h2>STI Testing & Screening</h2>
                    <p>Confidential and comprehensive sexually transmitted infection testing with rapid results. Professional, discreet service in a comfortable environment.</p>
                    <ul>
                        <li>Complete confidentiality guaranteed</li>
                        <li>Comprehensive panel testing</li>
                        <li>Rapid result turnaround</li>
                        <li>Post-test counseling available</li>
                    </ul>
                    <div className='line'></div>
                    <div><span>$110</span> starting from</div>
                    <div>Quick, discreet, and professional</div>
                    <div>Same Day Results</div>
                </div>
            </div>
            <div className='why-choose'>
                <h3>Why Choose Our Healthcare Services?</h3>
                <div className='items'>
                    <div className='item'>
                        <i className='fa-solid fa-circle-check'></i>
                        <div className='name'>Licensed Professionals</div>
                        <p>All our healthcare providers are board-certified and experienced</p>
                    </div>
                    <div className='item'>
                        <i className='fa-solid fa-circle-check'></i>
                        <div className='name'>Complete Privacy</div>
                        <p>Your health information is protected with the highest security standards</p>
                    </div>
                    <div className='item'>
                        <i className='fa-solid fa-circle-check'></i>
                        <div className='name'>Convenient Scheduling</div>
                        <p>Flexible appointment times that work with your schedule</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
