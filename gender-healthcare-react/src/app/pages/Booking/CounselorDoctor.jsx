import React from 'react';
import './CounselorDoctor.css';

export default function CounselorDoctor() {
    return (
        <div className='counselor-doctor-content'>
            <h1 className='title'>Choose Your Consultant</h1>
            <p className='script'>Select from our qualified healthcare professionals</p>
            <span>Showing 4-6 of 6 providers</span>
            <div className='cards'>
                {[...Array(5)].map((_, i) => (
                    <div key={i} className='card'>
                        <img></img>
                        <div className='information'>
                            <h3>Dr. David Park</h3>
                            <p>Preventive Medicine</p>
                            <div className='row1'>
                                <div className='rating'>★★★★★4.7</div>
                                <div className='available'>Available Today</div>
                            </div>
                            <div className='row2'>
                                <i className='fa-solid fa-circle-check'></i>
                                <div>Next available: Today</div>
                            </div>
                        </div>
                        <div className='buttons'>
                            <div>$150</div>
                            <button className='btn'>Select Provider</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
