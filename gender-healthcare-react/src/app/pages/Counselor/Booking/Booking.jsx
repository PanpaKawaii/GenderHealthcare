import React, { useState, useEffect } from 'react';
import './Booking.css';
import dayjs from 'dayjs';
import PickingDate from './PickingDate';
import TimeSlots from './TimeSlots';
import CounselorDoctor from './CounselorDoctor';
import PaymentConfirm from './PaymentConfirm';
import SameTimePopup from '../../../components/SameTimePopup/SameTimePopup';
import { fetchData } from '../../LoginRegister/api_register';

export default function Booking() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [finalSlot, setFinalSlot] = useState(null);

  const [SameTime, setSameTime] = useState(false);
  const [SameTimeBooking, setSameTimeBooking] = useState([]);
  const [UserConsultationBooking, setUserConsultationBooking] = useState([]);
  const CustomerId = localStorage.getItem('CustomerId') || '';
  useEffect(() => {
    const GetSlot = async () => {
      const token = localStorage.getItem('token') || '';
      try {
        const consultationbooking = await fetchData('/consultationbooking', token);
        console.log('consultationbooking', consultationbooking);
        setUserConsultationBooking(consultationbooking.filter(booking => booking.customerId?._id == CustomerId));
        console.log('consultationbooking-F', consultationbooking.filter(booking => booking.customerId?._id == CustomerId));
      } catch (error) { }
    };

    GetSlot();
  }, [selectedDate, selectedSlot]);

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

  const handleGoBack = () => {
    setSelectedDoctor(null);
    setFinalSlot(null);
  };

  if (selectedDate && selectedSlot && selectedDoctor && finalSlot) {
    return (
      <PaymentConfirm
        doctor={selectedDoctor}
        date={selectedDate}
        slot={finalSlot}
        onBack={handleGoBack}
      />
    );
  }

  return (
    <div className="counselor-booking-main-container">
      <h1 className="counselor-title">Consultation Booking</h1>

      <div className="counselor-booking-row">
        <div className="counselor-booking-left-column">
          <div className="counselor-step-box">
            <PickingDate
              onSelectDate={handleSelectDate}
              selectedDate={selectedDate}
            />
          </div>

          <div className="counselor-step-box">
            <TimeSlots
              date={selectedDate}
              onSelectSlot={handleSelectSlot}
              selectedSlot={selectedSlot}
              UserConsultationBooking={UserConsultationBooking}
              setSameTime={setSameTime}
              setSameTimeBooking={setSameTimeBooking}
            />
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

      {SameTime && <SameTimePopup Type={'Consultation'} SameTimeBooking={SameTimeBooking} setSameTime={setSameTime} />}
    </div>
  );
}
