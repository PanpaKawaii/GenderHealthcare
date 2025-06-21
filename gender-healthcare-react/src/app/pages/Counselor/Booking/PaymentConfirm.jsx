import React from 'react';
import './PaymentConfirm.css';

export default function PaymentConfirm({ doctor, date, slot }) {
    console.log('🔍 PaymentConfirm props:', { doctor, date, slot });
    const handleSubmit = (e) => {
        e.preventDefault();

        // TODO: Gửi API booking hoặc thanh toán
        console.log('🔐 Đã gửi thanh toán với thông tin:', {
            doctor,
            date,
            slot,
        });

        alert('✅ Thanh toán thành công!');
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
                            Date: <span>{new Date(date).toLocaleDateString()}</span>
                        </div>
                        <div className='row'>
                            Time: <span>{slot[0]?.time || '---'}</span>
                        </div>
                    </div>
                    <hr />
                    <div className='total'>
                        Total: <span>${doctor?.price || 0}</span>
                    </div>
                </div>

                <div className='box payment-box'>
                    <h3><i className='fa-regular fa-credit-card'></i> Payment Details</h3>
                    <form>
                        <div>
                            <label>Card Number</label>
                            <input type='text' placeholder='1234 5678 9012 3456' />
                        </div>
                        <div className='row2'>
                            <div>
                                <label>Expiry Date</label>
                                <input type='text' placeholder='MM/YY' />
                            </div>
                            <div>
                                <label>CVV</label>
                                <input type='text' placeholder='123' />
                            </div>
                        </div>
                        <div>
                            <label>Cardholder Name</label>
                            <input type='text' placeholder='John Doe' />
                        </div>

                       <button type='submit' className='pay-btn'>Pay ${doctor?.price || 0}</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
