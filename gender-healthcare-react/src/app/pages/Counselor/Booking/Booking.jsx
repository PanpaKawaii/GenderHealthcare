import React from 'react';
import './Booking.css';
// import Service from './Service';
import CounselorDoctor from './CounselorDoctor';
import PickingDate from './PickingDate';
import TimeSlots from './TimeSlots';
import PaymentConfirm from './PaymentConfirm';
import { useState } from 'react';


export default function TestBooking() {
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    return (
        <div className='testbooking-container'>
            <div>
                {!selectedDoctor && (
                    <CounselorDoctor onSelectDoctor={setSelectedDoctor} />
                )}

                {selectedDoctor && !selectedDate && (
                    <PickingDate doctor={selectedDoctor} onSelectDate={setSelectedDate} />
                )}

                {selectedDoctor && selectedDate && !selectedSlot && (
                    <TimeSlots doctor={selectedDoctor} date={selectedDate} onSelectSlot={setSelectedSlot} />
                )}
            
            {selectedDoctor && selectedDate && selectedSlot && (
                <PaymentConfirm
                    doctor={selectedDoctor}
                    date={selectedDate}
                    slot={selectedSlot}
                />
            )}
            </div>
            {/* <Service /> */}
        </div>
    )
}
