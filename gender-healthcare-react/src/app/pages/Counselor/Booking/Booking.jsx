import React, { useState, useEffect } from 'react';
import './Booking.css';
import CounselorDoctor from './CounselorDoctor';
import PickingDate from './PickingDate';
import TimeSlots from './TimeSlots';
import PaymentConfirm from './PaymentConfirm';

export default function TestBooking() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);     // slot tĩnh (chỉ có time)
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [finalSlot, setFinalSlot] = useState(null);           // ✅ slot từ DB (có _id)

  useEffect(() => {
    console.log('🔎 selectedDate:', selectedDate);
    console.log('🔎 selectedSlot:', selectedSlot);
    console.log('🔎 selectedDoctor:', selectedDoctor);
    console.log('✅ finalSlot:', finalSlot);
  }, [selectedDate, selectedSlot, selectedDoctor, finalSlot]);

  return (
    <div className='testbooking-container'>
      <div>
        {/* 1. Chọn ngày */}
        {!selectedDate && (
          <PickingDate onSelectDate={setSelectedDate} />
        )}

        {/* 2. Chọn slot */}
        {selectedDate && !selectedSlot && (
          <TimeSlots
            date={selectedDate}
            onSelectSlot={setSelectedSlot} // slot tĩnh: { time: "09:00" }
          />
        )}

        {/* 3. Chọn bác sĩ */}
        {selectedDate && selectedSlot && !selectedDoctor && (
          <CounselorDoctor
            date={selectedDate}
            slot={selectedSlot}
            onSelectDoctor={(doctor, realSlotFromDB) => {
              setSelectedDoctor(doctor);
              setFinalSlot(realSlotFromDB); // ✅ có _id để dùng ở bước sau
            }}
          />
        )}

        {/* 4. Thanh toán */}
        {selectedDate && selectedSlot && selectedDoctor && finalSlot && (
          <PaymentConfirm
            doctor={selectedDoctor}
            date={selectedDate}
            slot={finalSlot} // ✅ dùng slot có _id
          />
        )}
      </div>
    </div>
  );
}
