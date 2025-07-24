import { useEffect, useState } from 'react';
import { fetchData } from '../LoginRegister/api_register';
import './TimeSlots.css';

export default function TimeSlots({ S_Test, S_Doctor, S_Date, S_Slot, setS_Slot, setSameTime, setSameTimeBooking }) {
    console.log('Slot Rerender');
    const CustomerId = localStorage.getItem('CustomerId') || '';

    const [Slot, setSlot] = useState([]);
    const [TestBooking, setTestBooking] = useState([]);
    const [UserTestBooking, setUserTestBooking] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        console.log('useEffect');
        setSameTime(false);
        console.log('S_Slot', S_Slot);
        const User_NoCancel_Booking = UserTestBooking.filter(booking => booking.status != 'Cancelled' && booking.status != 'cancelled' && booking.status != 'Canceled' && booking.status != 'canceled');
        console.log('User_NoCancel_Booking', User_NoCancel_Booking);
        const User_SameDate_Booking = User_NoCancel_Booking.filter(booking => booking.bookingDate?.split('T')[0] == S_Date);
        console.log('User_SameDate_Booking', User_SameDate_Booking);
        const User_SameTime_Booking = User_SameDate_Booking.filter(booking => booking.doctorTestServiceId?.startTime == S_Slot?.startTime);
        console.log('User_SameTime_Booking', User_SameTime_Booking);
        if (User_SameTime_Booking?.length > 0) {
            setSameTime(true);
            setSameTimeBooking(User_SameTime_Booking);
        }
        console.log('useEffect End');
    }, [S_Slot, S_Date]);

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
                setUserTestBooking(testbooking.filter(booking => booking.customerId?._id == CustomerId));
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


    const today = new Date();
    const inputDate = new Date(S_Date);
    const isToday =
        today.getFullYear() === inputDate.getFullYear() &&
        today.getMonth() === inputDate.getMonth() &&
        today.getDate() === inputDate.getDate();
    console.log(isToday);


    const SameDate_Booking = TestBooking.filter(booking => booking.bookingDate?.split('T')[0] == S_Date);
    const User_SameDate_Booking = UserTestBooking.filter(booking => booking.bookingDate?.split('T')[0] == S_Date);
    const NoCancel_Booking = SameDate_Booking.filter(booking => booking.status != 'Cancelled' && booking.status != 'cancelled' && booking.status != 'Canceled' && booking.status != 'canceled');
    console.log('NoCancel_Booking', NoCancel_Booking);


    return (
        <div className={`timeslots-content booking-content ${(S_Test && S_Doctor && S_Date) ? '' : 'blured'}`}>
            <h1 className='title'>Select Time</h1>
            <p className='script'>Available time slots for {S_Date}</p>
            <div className='timeslots-form'>
                <div className='time-grid'>
                    {Slot?.sort((a, b) => a.startTime?.split(':')[0] - b.startTime?.split(':')[0]).map((slot, i) => (
                        <div
                            title={User_SameDate_Booking.filter(sdb => sdb.doctorTestServiceId?._id == slot._id)?.length >= 2 ? 'This slot was cancelled twice or more, you cannot book this slot anymore!' : ''}>
                            <button
                                key={i}
                                className={`time-slot ${NoCancel_Booking.some(sdb => sdb.doctorTestServiceId?._id == slot._id) ? 'booked' : ''} ${new Date(`${S_Date}T${slot.startTime}`) <= today ? 'booked' : ''} ${User_SameDate_Booking.filter(sdb => sdb.doctorTestServiceId?._id == slot._id)?.length >= 2 ? 'booked' : ''}`}
                                style={{ backgroundColor: slot._id == S_Slot?._id ? '#28a74540' : '' }}
                                onClick={() => setS_Slot(p => p?._id == slot?._id ? null : slot)}
                                disabled={
                                    NoCancel_Booking.some(sdb => sdb.doctorTestServiceId?._id == slot._id) ||
                                    User_SameDate_Booking.filter(sdb => sdb.doctorTestServiceId?._id == slot._id)?.length >= 2 ||
                                    new Date(`${S_Date}T${slot.startTime}`) <= today}
                            >
                                <i className='fa-regular fa-clock'></i> {slot.startTime} - {slot.endTime}
                            </button>
                        </div>
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
