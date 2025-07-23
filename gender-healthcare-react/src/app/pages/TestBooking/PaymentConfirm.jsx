import React from 'react';
import './PaymentConfirm.css';

export default function PaymentConfirm({ loading, S_Test, S_Doctor, S_Date, S_Slot, handleBooking }) {
    return (
        <div className={`paymentconfirm-content booking-content ${S_Slot ? '' : 'blured'}`}>
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
                        Total: <span>{S_Slot?.testServiceId?.price.toLocaleString('vn')}.000 VND</span>
                    </div>
                    <button type='submit' className='pay-btn' onClick={() => handleBooking()} disabled={loading}>Pay {S_Slot?.testServiceId?.price.toLocaleString('vn')}.000 VND</button>
                </div>
            </div>
        </div>
    )
}
