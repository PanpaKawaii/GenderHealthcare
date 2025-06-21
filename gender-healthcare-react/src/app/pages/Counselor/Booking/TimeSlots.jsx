import React from 'react';
import './TimeSlots.css';
import { useState, useEffect } from 'react';
import { counselorScheduleAPI } from '../../../services/api';
import { useParams } from 'react-router-dom';


export default function TimeSlots({ doctor, date, onSelectSlot  }) {
    const [slots, setSlots] = useState([]);

    useEffect(() => {
        const fetchSlots = async () => {
            try {
                const formattedDate = date.toISOString().split('T')[0];
                const res = await counselorScheduleAPI.getByCounselorAndDate(doctor._id, formattedDate);

                const data = res.data;

                const parsedSlots = data.map((item) => ({
                    time: new Date(item.startTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    }),
                    status: item.status,
                }));

                setSlots(parsedSlots);
            } catch (error) {
                console.error('Lỗi khi lấy lịch tư vấn:', error);
            }
        };

        fetchSlots();
    }, [doctor, date]);

    return (
        <div className='timeslots-content booking-content'>
            <h1 className='title'>Select Time</h1>
            <p className='script'>Available time slots for Friday, June 20, 2025</p>
            <div className='timeslots-form'>
                <div className='time-grid'>
                    {slots.map(({ time, booked }, i) => (
                        <button
                            key={i}
                            className={`time-slot ${booked ? 'booked' : ''}`}
                            disabled={booked}
                            onClick={() => onSelectSlot(slots)}
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
