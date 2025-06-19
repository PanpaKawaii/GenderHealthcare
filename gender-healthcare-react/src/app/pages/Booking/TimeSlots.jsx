import React from 'react';
import './TimeSlots.css';

export default function TimeSlots() {

    const times = [
        { time: '09:00', booked: false },
        { time: '09:30', booked: true },
        { time: '10:00', booked: false },
        { time: '10:30', booked: false },
        { time: '11:00', booked: true },
        { time: '11:30', booked: false },
        { time: '14:00', booked: false },
        { time: '14:30', booked: true },
        { time: '15:00', booked: false },
        { time: '15:30', booked: false },
        { time: '16:00', booked: false },
        { time: '16:30', booked: true },
    ];

    return (
        <div className='timeslots-content booking-content'>
            <h1 className='title'>Select Time</h1>
            <p className='script'>Available time slots for Friday, June 20, 2025</p>
            <div className='timeslots-form'>
                <div className='time-grid'>
                    {times.map(({ time, booked }, i) => (
                        <button
                            key={i}
                            className={`time-slot ${booked ? 'booked' : ''}`}
                            disabled={booked}
                        >
                            <i className='fa-regular fa-clock'></i> {time}
                        </button>
                    ))}
                </div>

                <div className='legend'>
                    <span><span className='box available'></span> Available</span>
                    <span><span className='box booked'></span> Booked</span>
                </div>
            </div>
        </div>
    )
}
