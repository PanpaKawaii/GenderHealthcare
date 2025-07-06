// Booking/TimeSlots.jsx
import React, { useState } from 'react';
import './TimeSlots.css';
import dayjs from 'dayjs';

export default function TimeSlots({ date, onSelectSlot }) {
    const [selectedSlot, setSelectedSlot] = useState(null);

    const now = dayjs();

    const slotTimes = [
        { startTime: '09:00', endTime: '09:30' },
        { startTime: '09:30', endTime: '10:00' },
        { startTime: '10:00', endTime: '10:30' },
        { startTime: '10:30', endTime: '11:00' },
        { startTime: '11:00', endTime: '11:30' },
        { startTime: '11:30', endTime: '12:00' },
        { startTime: '14:00', endTime: '14:30' },
        { startTime: '14:30', endTime: '15:00' },
        { startTime: '15:00', endTime: '15:30' },
        { startTime: '15:30', endTime: '16:00' },
        { startTime: '16:00', endTime: '16:30' },
        { startTime: '16:30', endTime: '17:00' },
    ];

    // Hàm này chỉ kiểm tra xem slot có nằm trong quá khứ so với ngày đã chọn (hoặc hiện tại nếu chưa chọn ngày) hay không
     const isSlotPast = (slotTime) => {
        // Xác định ngày tham chiếu để so sánh:
        // Nếu prop 'date' là NULL, sử dụng ngày hiện tại để kiểm tra các slot đã qua.
        // Ngược lại, sử dụng ngày được chọn.
        const referenceDate = date ? dayjs(date) : dayjs(); // THAY ĐỔI Ở ĐÂY

        const slotDateTime = dayjs(`${referenceDate.format('YYYY-MM-DD')}T${slotTime}`);
        
        // So sánh thời điểm của slot với thời điểm hiện tại.
        return slotDateTime.isBefore(now);
    };

    

    const handleClick = (slot) => {
        // Chỉ ngăn chặn click nếu slot đó thực sự đã trôi qua
        if (isSlotPast(slot.startTime)) return;

        setSelectedSlot(slot);
        onSelectSlot(slot);
    };

    return (
        <div className='timeslots-content booking-content'>
            <h1 className='title'>Select Time</h1>
            {/* <p className='script'>
                Available time slots for {date ? new Date(date).toLocaleDateString() : '...'}
            </p> */}
            <div className='timeslots-form'>
                {/* Thêm thông báo nhẹ nhàng nếu chưa chọn ngày */}

                <div className='time-grid'>
                    {slotTimes.map((slot, i) => {
                        const disabled = isSlotPast(slot.startTime); // Kiểm tra disabled chỉ dựa trên việc slot có phải trong quá khứ không
                        // SỬA DÒNG NÀY: So sánh theo startTime thay vì toàn bộ đối tượng
                        const isSelected = selectedSlot && selectedSlot.startTime === slot.startTime; 

                        return (
                            <button
                                key={i}
                                className={`time-slot ${isSelected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
                                onClick={() => handleClick(slot)}
                                disabled={disabled}
                            >
                                {/* <i className='fa-regular fa-clock'></i>  */}
                                {slot.startTime} - {slot.endTime}
                            </button>
                        );
                    })}
                </div>

                <div className='legend'>
                    <span><span className='box available'></span> Available</span>
                    <span><span className='box booked'></span> Past</span>
                </div>
            </div>
        </div>
    );
}