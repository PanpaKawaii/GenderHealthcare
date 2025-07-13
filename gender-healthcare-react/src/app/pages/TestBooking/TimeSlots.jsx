import React, { useEffect, useState } from 'react';
import './TimeSlots.css';
import { fetchData } from '../LoginRegister/api_register';

export default function TimeSlots({ S_Test, S_Doctor, S_Date, S_Slot, setS_Slot }) {

    const [Slot, setSlot] = useState([]);
    const [TestBooking, setTestBooking] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const GetSlot = async () => {
            const token = localStorage.getItem('token');
            try {
                const testbooking = await fetchData('/testbookings', token);
                const doctortestservices = await fetchData('/doctortestservices', token);
                console.log('doctortestservices', doctortestservices.filter(
                    dts => dts.doctorId._id == S_Doctor?._id && dts.testServiceId._id == S_Test?._id
                ));
                setTestBooking(testbooking);
                setSlot(doctortestservices.filter(
                    dts => dts.doctorId._id == S_Doctor?._id && dts.testServiceId._id == S_Test?._id
                ));
            } catch (error) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        GetSlot();
    }, [S_Test, S_Doctor, S_Date]);

    const SameDate_Booking = TestBooking.filter(booking => booking.bookingDate?.split('T')[0] == S_Date);
    const NoCancel_Booking = SameDate_Booking.filter(booking => booking.status != 'Cancelled');
    console.log('NoCancel_Booking', NoCancel_Booking);


    return (
        <div className={`timeslots-content booking-content ${(S_Test && S_Doctor && S_Date) ? '' : 'blured'}`}>
            <h1 className='title'>Select Time</h1>
            <p className='script'>Available time slots for {S_Date}</p>
            <div className='timeslots-form'>
                <div className='time-grid'>
                    {Slot?.sort((a, b) => a.startTime - b.startTime).map((slot, i) => (
                        <button
                            key={i}
                            className={`time-slot ${NoCancel_Booking.some(sdb => sdb.doctorTestServiceId?._id == slot._id) ? 'booked' : ''}`}
                            style={{ backgroundColor: slot._id == S_Slot?._id ? '#28a74540' : '' }}
                            onClick={() => setS_Slot(p => p?._id == slot?._id ? null : slot)}
                            disabled={NoCancel_Booking.some(sdb => sdb.doctorTestServiceId?._id == slot._id)}
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
    )
}
