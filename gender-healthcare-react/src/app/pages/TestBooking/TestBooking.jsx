import React, { useState } from 'react';
import CounselorDoctor from './CounselorDoctor';
import PaymentConfirm from './PaymentConfirm';
import PickingDate from './PickingDate';
import Service from './Service';
import TestService from './TestService';
import TimeSlots from './TimeSlots';
import { postData } from '../LoginRegister/api_register';
import { useNavigate } from 'react-router-dom';

import './TestBooking.css';

export default function TestBooking() {
    const navigate = useNavigate();

    const [S_Service, setS_Service] = React.useState(null);
    const [S_Test, setS_Test] = React.useState(null);
    const [S_Doctor, setS_Doctor] = React.useState(null);
    const [S_Date, setS_Date] = React.useState(null);
    const [S_Slot, setS_Slot] = React.useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const BookingTestFunction = async (S_Date, S_Slot) => {

        const BookingData = {
            customerId: localStorage.getItem('UserId'),
            doctorTestServiceId: S_Slot?._id,
            bookingDate: S_Date,
            status: 'Pending',
            note: '',
        };
        console.log('BookingData:', BookingData);

        const token = '';
        try {
            const result = await postData('/testbookings', token, BookingData);
            console.log('result', result);
            navigate('/');
        } catch (error) {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    const handleBooking = () => {
        console.log('handleBooking');
        BookingTestFunction(
            S_Date,
            S_Slot,
        );
    }

    return (
        <div className='testbooking-container'>
            <Service S_Service={S_Service} setS_Service={setS_Service} />
            {!S_Doctor && <TestService S_Test={S_Test} setS_Test={setS_Test} />}
            {S_Test && !S_Slot && <CounselorDoctor S_Test={S_Test} S_Doctor={S_Doctor} setS_Doctor={setS_Doctor} />}
            {S_Doctor && !S_Slot && <PickingDate S_Doctor={S_Doctor} S_Date={S_Date} setS_Date={setS_Date} />}
            {S_Test && S_Doctor && S_Date && <TimeSlots S_Test={S_Test} S_Doctor={S_Doctor} S_Date={S_Date} S_Slot={S_Slot} setS_Slot={setS_Slot} />}
            {S_Slot && <PaymentConfirm S_Test={S_Test} S_Doctor={S_Doctor} S_Date={S_Date} S_Slot={S_Slot} handleBooking={handleBooking} />}
        </div>
    )
}
