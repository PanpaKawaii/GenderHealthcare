import React from 'react';
import './PaymentConfirm.css';

export default function PaymentConfirm({ loading, S_Test, S_Doctor, S_Date, S_Slot, handleBooking }) {
    return (
        <div className='paymentconfirm-content booking-content'>
            <h1 className='title'>Confirm & Pay</h1>
            <p className='script'>Review your booking details and complete payment</p>
            <div className='checkout-container'>
                <div className='box summary-box'>
                    <h3><i className='fa-regular fa-calendar'></i> Booking Summary</h3>
                    <div className='rows'>
                        <div className='row'>
                            Service: <span>{S_Test?.name}</span>
                        </div>
                        <div className='row'>
                            Provider: <span>{S_Doctor?.name}</span>
                        </div>
                        <div className='row'>
                            Date: <span>{S_Date}</span>
                        </div>
                        <div className='row'>
                            Time: <span>{S_Slot?.startTime} - {S_Slot?.endTime}</span>
                        </div>
                    </div>
                    <hr />
                    <div className='total'>
                        Total: <span>{S_Slot?.testServiceId?.price.toLocaleString('vn')} VND</span>
                    </div>
                </div>

                <div className='box payment-box'>
                    <h3><i className='fa-regular fa-credit-card'></i> Payment Details</h3>
                    <div className='formbooking'>
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

                        <button type='submit' className='pay-btn' onClick={() => handleBooking()} disabled={loading}>Pay {S_Slot?.testServiceId?.price.toLocaleString('vn')} VND</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
