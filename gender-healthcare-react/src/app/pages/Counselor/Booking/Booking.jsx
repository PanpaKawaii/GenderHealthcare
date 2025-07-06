import React, { useState, useEffect } from 'react';
import './Booking.css';
import PickingDate from './PickingDate';
import TimeSlots from './TimeSlots';
import CounselorDoctor from './CounselorDoctor';
import PaymentConfirm from './PaymentConfirm';

export default function Booking() {
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

  // Handler cho việc chọn ngày
  const handleSelectDate = (date) => {
    setSelectedDate(date);
    // KHÔNG reset selectedSlot ở đây nữa để giữ lựa chọn của người dùng
    // selectedDoctor và finalSlot vẫn cần reset vì chúng phụ thuộc vào cả ngày và slot
    setSelectedDoctor(null);
    setFinalSlot(null);
  };

  // Handler cho việc chọn slot
  const handleSelectSlot = (slot) => {
    setSelectedSlot(slot);
    // KHÔNG reset selectedDoctor và finalSlot ở đây nữa
    // selectedDoctor và finalSlot sẽ tự động được cập nhật/reset khi CounselorDoctor re-render
  };

  // Handler cho việc chọn bác sĩ
  const handleSelectDoctor = (doctor, realSlotFromDB) => {
    setSelectedDoctor(doctor);
    setFinalSlot(realSlotFromDB); // Lưu slot từ DB để dùng cho thanh toán
  };

  // Nếu đã chọn đủ ngày, slot và bác sĩ, chuyển sang trang PaymentConfirm
  if (selectedDate && selectedSlot && selectedDoctor && finalSlot) {
    return (
      <PaymentConfirm
        doctor={selectedDoctor}
        date={selectedDate}
        slot={finalSlot}
      />
    );
  }

  // Hiển thị các bước chọn trên cùng một màn hình với bố cục 2 cột
  return (
    <div className='booking-main-container'>
      <h1 className='title'>Đặt lịch tư vấn</h1>
      <p className='script'>Chọn ngày, khung giờ và tư vấn viên phù hợp với bạn.</p>

      <div className='booking-content-wrapper'>
        {/* Cột trái: Chọn ngày và khung giờ */}
        <div className='booking-left-column'>
          <PickingDate onSelectDate={handleSelectDate} />
          <TimeSlots
            date={selectedDate}
            onSelectSlot={handleSelectSlot}
          />
        </div>

        {/* Cột phải: Danh sách bác sĩ */}
        <div className='booking-right-column'>
          {(!selectedDate || !selectedSlot) && (
            <p className='placeholder-text'>Vui lòng chọn ngày và khung giờ để xem danh sách tư vấn viên.</p>
          )}
          {/* Hiển thị CounselorDoctor nếu đã có ngày và slot được chọn */}
          {selectedDate && selectedSlot && (
            <CounselorDoctor
              date={selectedDate}
              slot={selectedSlot}
              onSelectDoctor={handleSelectDoctor}
            />
          )}
        </div>
      </div>
    </div>
  );
}