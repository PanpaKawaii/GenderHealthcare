import React from 'react';
import './SameTimePopup.css';

export default function SameTimePopup({ Type, SameTimeBooking, setSameTime }) {
    return (
        <div className='sametimepopup-container'>
            <div className='card'>
                <div className='alert'>You have already had the booking(s) with the same time</div>
                {SameTimeBooking?.length > 0 && (
                    SameTimeBooking.slice(0, 1)?.map((booking, i) => (
                        <React.Fragment key={i}>
                            {Type == 'Test' ?
                                <div className="space-y-2 text-sm text-gray-700 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                    
                                    <div className="flex justify-between">
                                        <span className="font-medium text-gray-600">Date:</span>
                                        <span>{booking.bookingDate?.split('T')[0]}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium text-gray-600">Time:</span>
                                        <span>{booking.doctorTestServiceId?.startTime} - {booking.doctorTestServiceId?.endTime}</span>
                                    </div>
                                   
                                    <div className="flex justify-between">
                                        <span className="font-medium text-gray-600">Price:</span>
                                        <span className="text-green-600 font-semibold">
                                            {booking.doctorTestServiceId?.testServiceId?.price?.toLocaleString('vi-VN')} VND
                                        </span>
                                    </div>
                                </div>

                                :
                                <div className="space-y-2 text-sm text-gray-700 bg-gray-50 p-4 rounded-lg shadow-sm">
                                    <div className="flex justify-between">
                                        <span className="font-medium text-gray-600">Date:</span>
                                        <span>{booking.bookingDate?.split('T')[0]}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium text-gray-600">Time:</span>
                                        <span>
                                            {new Date(booking.scheduleId?.startTime).toLocaleTimeString('en-GB', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                timeZone: 'Asia/Bangkok',
                                            })} -{' '}
                                            {new Date(booking.scheduleId?.endTime).toLocaleTimeString('en-GB', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                timeZone: 'Asia/Bangkok',
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium text-gray-600">Price:</span>
                                        <span className="text-green-600 font-semibold">
                                            {booking.scheduleId?.price?.toLocaleString()} VND
                                        </span>
                                    </div>
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
