import React from 'react';
import './SameTimePopup.css';

export default function SameTimePopup({ Type, SameTimeBooking, setSameTime }) {
    return (
        <div className='sametimepopup-container'>
            <div className='card'>
                <div className='alert'>You have already had the booking(s) with the same time</div>
                {SameTimeBooking?.length > 0 && (
                    SameTimeBooking?.map((booking, i) => (
                        <React.Fragment key={i}>
                            {Type == 'Test' ?
                                <div>
                                    <div>Created: {booking.createdAt?.split('T')[0]}</div>
                                    <div>Date: {booking.bookingDate?.split('T')[0]}</div>
                                    <div>Time: {booking.doctorTestServiceId?.startTime} - {booking.doctorTestServiceId?.endTime}</div>
                                    <div>Test: {booking.doctorTestServiceId?.testServiceId?.name}</div>
                                    <div>Price: {booking.doctorTestServiceId?.testServiceId?.price?.toLocaleString('vi-VN')} VND</div>
                                    <div>Status: {booking.status}</div>
                                    <div>Doctor note: {booking.note || <span className='note'>No note</span>}</div>
                                </div>
                                :
                                <div>
                                    <div>Created: {booking.createdAt?.split('T')[0]}</div>
                                    <div>Date: {booking.bookingDate?.split('T')[0]}</div>
                                    <div>Time: {new Date(booking.scheduleId?.startTime)?.toLocaleTimeString('en-GB', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        timeZone: 'Asia/Bangkok',
                                    })} - {new Date(booking.scheduleId?.endTime)?.toLocaleTimeString('en-GB', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        timeZone: 'Asia/Bangkok',
                                    })}</div>
                                    <div>Price: {booking.scheduleId?.price}.000 VND</div>
                                    <div>Status: {booking.status}</div>
                                    <div>Note: {booking.note || <span className='note'>No note</span>}</div>
                                </div>
                            }
                        </React.Fragment>
                    ))
                )}
                <button className='btn' onClick={() => setSameTime(false)}>Continue?</button>
            </div>
        </div>
    )
}
