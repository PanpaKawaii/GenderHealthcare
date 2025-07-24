import React, { useEffect } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export default function TimeSlots({ date, onSelectSlot, selectedSlot, UserConsultationBooking, setSameTime, setSameTimeBooking }) {
  const slotTimes = [
    { startTime: '09:00', endTime: '10:00' },
    { startTime: '10:00', endTime: '11:00' },
    { startTime: '11:00', endTime: '12:00' },
    { startTime: '14:00', endTime: '15:00' },
    { startTime: '15:00', endTime: '16:00' },
    { startTime: '16:00', endTime: '17:00' },
  ];

  useEffect(() => {
    console.log('useEffect');
    setSameTime(false);
    console.log('date', date);
    const vnDate = new Date(date).toLocaleDateString('en-CA')
    console.log('vnDate', vnDate);
    console.log('selectedSlot', selectedSlot);
    const User_NoCancel_Booking = UserConsultationBooking.filter(booking => booking.status != 'Cancelled' && booking.status != 'cancelled' && booking.status != 'Canceled' && booking.status != 'canceled');
    console.log('User_NoCancel_Booking', User_NoCancel_Booking);
    const User_SameDate_Booking = User_NoCancel_Booking.filter(booking => booking.bookingDate?.split('T')[0] == vnDate);
    console.log('User_SameDate_Booking', User_SameDate_Booking);
    // const User_SameTime_Booking = User_SameDate_Booking.filter(booking => booking.scheduleId?.startTime?.split('T')?[1]?.split(':00.') == selectedSlot?.startTime);
    const User_SameTime_Booking = User_SameDate_Booking.filter(booking => {
      const utcString = booking.scheduleId?.startTime;
      if (!utcString) return false;

      const date = new Date(utcString);
      const timeInPlus7 = date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Bangkok',
      });

      return timeInPlus7 == selectedSlot?.startTime;
    });
    console.log('User_SameTime_Booking', User_SameTime_Booking);
    if (User_SameTime_Booking?.length > 0) {
      setSameTime(true);
      setSameTimeBooking(User_SameTime_Booking);
    }
    console.log('useEffect End');
  }, [selectedSlot, date]);

  const isSlotPast = (slotTime) => {
    if (!date) return false;
    const slotDateTime = dayjs.tz(
      `${dayjs(date).format('YYYY-MM-DD')}T${slotTime}`,
      'Asia/Ho_Chi_Minh'
    );
    const nowVN = dayjs().tz('Asia/Ho_Chi_Minh');
    return slotDateTime.isBefore(nowVN);
  };

  const handleClick = (slot) => {
    if (isSlotPast(slot.startTime)) return;

    if (selectedSlot && selectedSlot.startTime === slot.startTime) {
      onSelectSlot(null);
    } else {
      onSelectSlot(slot);
    }
  };

  return (
    <div className="max-w-[900px] mx-auto rounded-xl border border-gray-300 bg-white overflow-hidden">
      <div className="bg-blue-100 px-5 py-2">
        <h2 className="text-lg font-bold text-gray-800">2. Select Slot</h2>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-6 gap-4 mb-6">
          {slotTimes.map((slot, i) => {
            const disabled = isSlotPast(slot.startTime);
            const isSelected = selectedSlot && selectedSlot.startTime === slot.startTime;

            const base = 'py-1 px-3 rounded-full font-medium border text-center transition';
            const selected = 'bg-blue-600 text-white border-blue-600 shadow';
            const disabledCls = 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed';
            const normal = 'bg-white text-gray-800 border-gray-300 hover:bg-blue-50';

            return (
              <button
                key={i}
                className={`${base} ${disabled ? disabledCls : isSelected ? selected : normal}`}
                onClick={() => handleClick(slot)}
                disabled={disabled}
              >
                {slot.startTime}
              </button>
            );
          })}
        </div>

        <div className="flex justify-center gap-8 text-sm text-gray-600">
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border border-gray-300 rounded bg-[#2563eb]" />
            Selected
          </span>
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border border-gray-300 rounded bg-white" />
            Available
          </span>
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border border-gray-300 rounded bg-gray-300" />
            Past
          </span>
        </div>
      </div>
    </div>
  );
}
