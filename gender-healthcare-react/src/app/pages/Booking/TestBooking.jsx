import React from 'react';
import './TestBooking.css';
import Service from './Service';
import CounselorDoctor from './CounselorDoctor';
import PickingDate from './PickingDate';
import TimeSlots from './TimeSlots';
import PaymentConfirm from './PaymentConfirm';

export default function TestBooking() {
    return (
        <div className='testbooking-container'>
            <PaymentConfirm />
            <TimeSlots />
            <PickingDate />
            <CounselorDoctor />
            <Service />
        </div>
    )
}
