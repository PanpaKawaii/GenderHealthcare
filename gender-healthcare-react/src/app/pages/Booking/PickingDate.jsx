import React, { useState } from 'react';
import './PickingDate.css';

export default function PickingDate() {

    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    const today = new Date();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth(); // 0-indexed
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const totalDays = lastDay.getDate();
    const startDay = firstDay.getDay(); // 0=Sun, 1=Mon...

    // Tạo mảng các ô trong lịch (bao gồm các ô trống đầu tuần)
    const calendarCells = [];
    for (let i = 0; i < startDay; i++) {
        calendarCells.push(null); // các ô trống đầu tháng
    }
    for (let d = 1; d <= totalDays; d++) {
        calendarCells.push(new Date(year, month, d));
    }

    const handlePrev = () => {
        const prev = new Date(year, month - 1, 1);
        setCurrentDate(prev);
    };

    const handleNext = () => {
        const next = new Date(year, month + 1, 1);
        setCurrentDate(next);
    };

    const formatDate = (date) => date.toISOString().split('T')[0];

    return (
        <div className='pickingdate-content booking-content'>
            <h1 className='title'>Select Your Appointment Date</h1>
            <p className='script'>Choose your preferred date with Dr. David Park</p>
            <div className='calendar-form'>
                <div className='calendar-header'>
                    <div>
                        <h2>Select Date</h2>
                        <p>Available appointments with Dr. David Park</p>
                    </div>
                    <div className='price'>
                        <h2>$165</h2>
                        <p>Preventive Medicine</p>
                    </div>
                </div>

                <div className='calendar-box'>
                    <div className='calendar-title'>
                        <span className='arrow' onClick={handlePrev}>&#8249;</span>
                        <strong>
                            {currentDate.toLocaleString('default', { month: 'long' })} {year}
                        </strong>
                        <span className='arrow' onClick={handleNext}>&#8250;</span>
                    </div>

                    <div className='calendar-grid'>
                        {days.map((day) => (
                            <div key={day} className='day-label'>{day}</div>
                        ))}

                        {calendarCells.map((date, index) => {
                            if (!date) return <div key={index} className='date empty' />;
                            const isToday = formatDate(date) === formatDate(today);
                            const isSelected = selectedDate && formatDate(date) === formatDate(selectedDate);
                            let className = 'date';
                            if (isToday) className += ' today';
                            if (isSelected) className += ' selected';

                            return (
                                <div
                                    key={index}
                                    className={className}
                                    onClick={() => setSelectedDate(date)}
                                >
                                    {date.getDate()}
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
    )
}
