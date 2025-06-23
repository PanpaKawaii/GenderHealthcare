import React from 'react';
import './PaymentConfirm.css';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { counselorScheduleAPI } from '../../../services/api'; // ✅ import đúng API

export default function PaymentConfirm({ doctor, date, slot }) {
    const navigate = useNavigate();

    const getFormattedTime = (timeStr) => {
        if (!date || !timeStr) return null;
        const dateStr = dayjs(date).format('YYYY-MM-DD');
        return dayjs(`${dateStr}T${timeStr}`);
    };

    const start = getFormattedTime(slot?.startTime);
    const end = getFormattedTime(slot?.endTime);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            console.log('📤 Gửi cập nhật slot ID:', slot?._id);
            // ✅ Gọi API cập nhật trạng thái slot thành 'booked'
            if (slot?._id) {
                await counselorScheduleAPI.update(slot._id, {
                    status: 'booked',
                });
                console.log('✔ Slot đã được cập nhật thành booked');
            }

            alert('✅ Thanh toán thành công!');
            navigate('/booking'); 
        } catch (err) {
            console.error('❌ Lỗi khi cập nhật trạng thái slot:', err);
            alert('❌ Đã xảy ra lỗi khi thanh toán!');
        }
    };

    return (
        <div className='paymentconfirm-content booking-content'>
            <h1 className='title'>Confirm & Pay</h1>
            <p className='script'>Review your booking details and complete payment</p>

            <div className='checkout-container'>
                <div className='box summary-box'>
                    <h3><i className='fa-regular fa-calendar'></i> Booking Summary</h3>
                    <div className='rows'>
                        <div className='row'>
                            Service: <span>Consultation Booking</span>
                        </div>
                        <div className='row'>
                            Provider: <span>{doctor?.accountId?.name || '---'}</span>
                        </div>
                        <div className='row'>
                            Date: <span>{start ? start.format('DD/MM/YYYY') : '---'}</span>
                        </div>
                        <div className='row'>
                            Time: <span>
                                {start && end
                                    ? `${start.format('HH:mm')} - ${end.format('HH:mm')}`
                                    : '---'}
                            </span>
                        </div>
                    </div>
                    <div className='total'>
                        Total: <span>${doctor?.price || 0}</span>
                    </div>
                    <hr />
                    <button onClick={handleSubmit} className='pay-btn'>
                        Pay ${doctor?.price || 0}
                    </button>
                </div>
            </div>
        </div>
    );
}
