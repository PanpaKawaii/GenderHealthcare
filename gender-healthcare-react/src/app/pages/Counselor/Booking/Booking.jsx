import React, { useState } from 'react';
import './Booking.css';
import CounselorDoctor from './CounselorDoctor';
import PickingDate from './PickingDate';
import TimeSlots from './TimeSlots';
import PaymentConfirm from './PaymentConfirm';
import { useEffect } from 'react';

export default function TestBooking() {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    useEffect(() => {
  console.log("🔎 selectedDate:", selectedDate);
  console.log("🔎 selectedSlot:", selectedSlot);
  console.log("🔎 selectedDoctor:", selectedDoctor);
}, [selectedDate, selectedSlot, selectedDoctor]);


    return (
        <div className='testbooking-container'>
            <div>
                {/* 1. Chọn ngày */}
                {!selectedDate && (
                    <PickingDate onSelectDate={setSelectedDate} />
                )}

                {/* 2. Chọn slot (phụ thuộc ngày) */}
                {selectedDate && !selectedSlot && (
                    <TimeSlots date={selectedDate} onSelectSlot={setSelectedSlot} />
                )}

                {/* 3. Chọn bác sĩ (phụ thuộc ngày + slot) */}
                {selectedDate && selectedSlot && !selectedDoctor && (
                    <CounselorDoctor
                        date={selectedDate}
                        slot={selectedSlot}
                        onSelectDoctor={setSelectedDoctor}
                    />
                )}

                {/* 4. Xác nhận thanh toán */}
                {selectedDate && selectedSlot && selectedDoctor && (
                    <PaymentConfirm
                        doctor={selectedDoctor}
                        date={selectedDate}
                        slot={selectedSlot}
                    />
                )}
            </div>
        </div>
    );
}
