import React, { useState } from 'react';
import './PickingDate.css';
import dayjs from 'dayjs';

export default function PickingDate({onSelectDate }) {
    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const today = dayjs();
    const [currentDate, setCurrentDate] = useState(dayjs());
    const [selectedDate, setSelectedDate] = useState(null);
    

    const year = currentDate.year();
    const month = currentDate.month(); // 0-indexed

    const firstDay = dayjs().year(year).month(month).date(1);
    const totalDays = currentDate.daysInMonth();
    const startDay = firstDay.day(); // 0 = Sunday

    // Tạo mảng ngày
    const calendarCells = [];
    for (let i = 0; i < startDay; i++) {
        calendarCells.push(null);
    }
    for (let d = 1; d <= totalDays; d++) {
        calendarCells.push(dayjs().year(year).month(month).date(d));
    }

    const handleDateClick = (date) => {
        setSelectedDate(date);
        onSelectDate(date.toDate());
    };

    const handlePrev = () => {
        setCurrentDate(currentDate.subtract(1, 'month'));
    };

    const handleNext = () => {
        setCurrentDate(currentDate.add(1, 'month'));
    };

    return (
        <div className='pickingdate-content booking-content'>
            <h1 className='title'>Select Your Appointment Date</h1>
            <div className='calendar-form'>
                <div className='calendar-header'>
                    <div>
                        <h2>Select Date</h2>
                    </div>
                    <div className='price'>
                    </div>
                </div>

                <div className='calendar-box'>
                    <div className='calendar-title'>
                        <span className='arrow' onClick={handlePrev}>&#8249;</span>
                        <strong>
                            {currentDate.format('MMMM YYYY')}
                        </strong>
                        <span className='arrow' onClick={handleNext}>&#8250;</span>
                    </div>

                    <div className='calendar-grid'>
                        {days.map((day) => (
                            <div key={day} className='day-label'>{day}</div>
                        ))}

                        {calendarCells.map((date, index) => {
                            if (!date) return <div key={index} className='date empty' />;

                            const isToday = date.isSame(today, 'day');
                            const isSelected = selectedDate && date.isSame(selectedDate, 'day');
                            let className = 'date';
                            if (isToday) className += ' today';
                            if (isSelected) className += ' selected';

                            return (
                                <div
                                    key={index}
                                    className={className}
                                    onClick={() => handleDateClick(date)}
                                >
                                    {date.date()}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className='calendar-footer'>
                    <div className='legend'>
                        <span className='legend-item'>
                            <span className='dot selected-dot'></span> Selected
                        </span>
                        <span className='legend-item'>
                            <span className='dot today-dot'></span> Today
                        </span>
                    </div>
                    <div className='timezone'>
                        <span><i className='fa-regular fa-clock'></i> Timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
