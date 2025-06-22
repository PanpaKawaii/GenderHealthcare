import React, { useState } from 'react';
import './TimeSlots.css';

export default function TimeSlots({ date, onSelectSlot }) {
    const [selectedSlot, setSelectedSlot] = useState(null);

    const slotTimes = [
        { startTime: '09:00', endTime: '09:30' },
        { startTime: '09:30', endTime: '10:00' },
        { startTime: '10:00', endTime: '10:30' },
        { startTime: '10:30', endTime: '11:00' },
        { startTime: '11:00', endTime: '11:30' },
        { startTime: '11:30', endTime: '12:00' },
        { startTime: '14:00', endTime: '14:30' },
        { startTime: '14:30', endTime: '15:00' },
        { startTime: '15:00', endTime: '15:30' },
        { startTime: '15:30', endTime: '16:00' },
        { startTime: '16:00', endTime: '16:30' },
        { startTime: '16:30', endTime: '17:00' },
    ];



    const handleClick = (slot) => {
        console.log('✅ Slot được chọn:', slot); // thêm dòng này
        setSelectedSlot(slot);
        onSelectSlot(slot);
    };



    return (
        <div className='timeslots-content booking-content'>
            <h1 className='title'>Select Time</h1>
            <p className='script'>
                Available time slots for {date ? new Date(date).toLocaleDateString() : '...'}
            </p>
            <div className='timeslots-form'>
                <div className='time-grid'>
                    {slotTimes.map((slot, i) => (
                        <button
                            key={i}
                            className={`time-slot ${selectedSlot === slot ? 'selected' : ''}`}
                            onClick={() => handleClick(slot)}
                        >
                            <i className='fa-regular fa-clock'></i> {slot.startTime} - {slot.endTime}
                        </button>
                    ))}

                </div>

                <div className='legend'>
                    <span><span className='box available'></span> Available</span>
                    <span><span className='box booked'></span> Booked</span>
                </div>
            </div>
        </div>
    );
}
