import React, { useState } from 'react';
import './PickingDate.css';
import dayjs from 'dayjs';

export default function PickingDate({ onSelectDate }) {
    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const today = dayjs();
    const minDate = today.startOf('day');
    const maxDate = today.add(7, 'day').endOf('day');

    const [currentDate, setCurrentDate] = useState(dayjs());
    const [selectedDate, setSelectedDate] = useState(null);

    const year = currentDate.year();
    const month = currentDate.month();
    const firstDay = dayjs().year(year).month(month).date(1);
    const totalDays = currentDate.daysInMonth();
    const startDay = firstDay.day();

    const calendarCells = [];
    for (let i = 0; i < startDay; i++) {
        calendarCells.push(null);
    }
    for (let d = 1; d <= totalDays; d++) {
        calendarCells.push(dayjs().year(year).month(month).date(d));
    }

    const handleDateClick = (date) => {
        if (selectedDate && date.isSame(selectedDate, 'day')) {
            setSelectedDate(null);
            onSelectDate(null);
        } else {
            setSelectedDate(date);
            onSelectDate(date.toDate());
        }
    };


    const handlePrev = () => {
        setCurrentDate(currentDate.subtract(1, 'month'));
    };

    const handleNext = () => {
        setCurrentDate(currentDate.add(1, 'month'));
    };

    return (
        <div className='pickingdate-content-counselor booking-content'>
            <div className='counselor-calendar-form'>
                <div className='counselor-calendar-header'>
                    <div><h2>1. Select Date</h2></div>
                </div>

                <div className='calendar-box'>
                    <div className='calendar-title'>
                        <span className='arrow' onClick={handlePrev}>&#8249;</span>
                        <span>{currentDate.format('MMMM YYYY')}</span>
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
                            const isOutOfRange = date.isBefore(minDate) || date.isAfter(maxDate);

                            let className = 'date';
                            if (isToday) className += ' counselor-today';
                            if (isSelected) className += ' selected';
                            if (isOutOfRange) className += ' disabled';

                            return (
                                <div
                                    key={index}
                                    className={className}
                                    onClick={() => {
                                        if (!isOutOfRange) handleDateClick(date);
                                    }}
                                >
                                    {date.date()}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className='counselor-calendar-footer'>
                    <div className='legend'>
                        <span className='legend-item'>
                            <span className='dot selected-dot'></span> Selected
                        </span>
                        <span className='legend-item'>
                            <span className='dot today-dot'></span> Today
                        </span>
                        <span className='legend-item'>
                            <span className='dot unavailable-dot'></span> Unavailable
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
