// Booking.jsx
import React, { useState, useEffect } from 'react';
import './Booking.css';
import dayjs from 'dayjs';
import PickingDate from './PickingDate';
import TimeSlots from './TimeSlots';
import CounselorDoctor from './CounselorDoctor';
import PaymentConfirm from './PaymentConfirm';

export default function Booking() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [finalSlot, setFinalSlot] = useState(null);

  useEffect(() => {
    console.log({ selectedDate, selectedSlot, selectedDoctor, finalSlot });
  }, [selectedDate, selectedSlot, selectedDoctor, finalSlot]);

  const handleSelectDate = (date) => {
    setSelectedDate(date);
    setSelectedDoctor(null);
    setFinalSlot(null);

    if (date && selectedSlot) {
      const slotDateTime = dayjs(
        `${dayjs(date).format('YYYY-MM-DD')}T${selectedSlot.startTime}`
      ).tz('Asia/Ho_Chi_Minh');
      const nowVN = dayjs().tz('Asia/Ho_Chi_Minh');
      if (slotDateTime.isBefore(nowVN)) {
        setSelectedSlot(null);
      }
    }
  };

 const handleSelectSlot = (slot) => {
  if (!slot) {
    setSelectedSlot(null);
    setSelectedDoctor(null);
    setFinalSlot(null);
    return;
  }

  if (selectedSlot && selectedSlot.startTime === slot.startTime) {
    setSelectedSlot(null);
    setSelectedDoctor(null);
    setFinalSlot(null);
  } else {
    setSelectedSlot(slot);
    setSelectedDoctor(null);
    setFinalSlot(null);
  }
};


  const handleSelectDoctor = (doctor, realSlotFromDB) => {
    setSelectedDoctor(doctor);
    setFinalSlot(realSlotFromDB);
  };

  if (selectedDate && selectedSlot && selectedDoctor && finalSlot) {
    return (
      <PaymentConfirm doctor={selectedDoctor} date={selectedDate} slot={finalSlot} />
    );
  }

  return (
    <div className="counselor-booking-main-container">
      <h1 className="counselor-title">Consultation Booking</h1>

      <div className="counselor-booking-row">
        <div className="counselor-booking-left-column">
          <div className="counselor-step-box">
            <PickingDate onSelectDate={handleSelectDate} />
          </div>

          <div className="counselor-step-box">
            <TimeSlots date={selectedDate} onSelectSlot={handleSelectSlot} />
          </div>
        </div>

        <div className="counselor-booking-right-column">
          <div className="m-6 rounded-xl border border-gray-300 counselor-step-box">
            <h2 className="counselor-step-title">3. Choose a Counselor</h2>
            {(!selectedDate || !selectedSlot) ? (
              <p className="counselor-placeholder-text">
                Please select a date and time slot to view available counselors.
              </p>
            ) : (
              <CounselorDoctor
                date={selectedDate}
                slot={selectedSlot}
                onSelectDoctor={handleSelectDoctor}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
