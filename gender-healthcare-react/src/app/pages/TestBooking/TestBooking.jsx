import React from 'react';
import CounselorDoctor from './CounselorDoctor';
import PaymentConfirm from './PaymentConfirm';
import PickingDate from './PickingDate';
import Service from './Service';
import TestService from './TestService';
import TimeSlots from './TimeSlots';

import './TestBooking.css';

export default function TestBooking() {

    const [S_Service, setS_Service] = React.useState(null);
    const [S_Test, setS_Test] = React.useState(null);
    const [S_Doctor, setS_Doctor] = React.useState(null);
    const [S_Date, setS_Date] = React.useState(null);
    const [S_Slot, setS_Slot] = React.useState(null);

    return (
        <div className='testbooking-container'>
            <Service S_Service={S_Service} setS_Service={setS_Service} />
            <TestService S_Test={S_Test} setS_Test={setS_Test} />
            <CounselorDoctor S_Doctor={S_Doctor} setS_Doctor={setS_Doctor} />
            <PickingDate S_Date={S_Date} setS_Date={setS_Date} />
            <TimeSlots S_Slot={S_Slot} setS_Slot={setS_Slot} />
            <PaymentConfirm />
        </div>
    )
}
