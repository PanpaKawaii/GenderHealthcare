import React from 'react';
import './TestService.css';

export default function TestService() {
    return (
        <div className='test-service-content booking-content'>
            <h1 className='title'>Tell Us Your Problem</h1>
            <p className='script'>Select from our qualified healthcare test services</p>
            <div className='cards'>
                {[...Array(5)].map((_, i) => (
                    <div key={i} className='card'>
                        <div className='information'>
                            <h3>Dr. David Park</h3>
                            <p>Preventive Medicine</p>
                            <div className='row1'>
                                <div className='rating'>★★★★★4.7</div>
                                <div className='available'>Available Today</div>
                            </div>
                            <div className='row2'>
                                <i className='fa-regular fa-calendar'></i>
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
