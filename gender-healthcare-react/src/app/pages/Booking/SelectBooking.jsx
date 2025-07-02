import React from 'react';
import './SelectBooking.css';
import Service from './Service';
import CounselorDoctor from './CounselorDoctor';
import PickingDate from './PickingDate';
import TimeSlots from './TimeSlots';
import PaymentConfirm from './PaymentConfirm';

export default function SelectBooking() {
    return (
        <div className='selectbooking-container'>
            <PaymentConfirm />
            <TimeSlots />
            <PickingDate />
            <CounselorDoctor />
            <Service />
        </div>
    )
}
