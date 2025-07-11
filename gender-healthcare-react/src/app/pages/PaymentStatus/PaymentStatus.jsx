import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './PaymentStatus.css';

export default function PaymentStatus() {

    const [Message, setMessage] = useState('');

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const MessageParam = urlParams.get('message');
        console.log('MessageParam', MessageParam);
        setMessage(MessageParam);
    }, []);

    return (
        <div className='payment-status'>
            <div className='payment-status-content'>
                <div className='payment-status-card'
                    style={{
                        boxShadow: Message && decodeURIComponent(Message) === 'Thanh toán thành công' ? '5px 5px 10px 0 #28a74550' : '5px 5px 10px 0 #dc354550',
                        color: Message && decodeURIComponent(Message) === 'Thanh toán thành công' ? '#28a745' : '#dc3545'
                    }}>

                    {Message &&
                        (decodeURIComponent(Message) === 'Thanh toán thành công' ?
                            <>
                                <h1><b>{decodeURIComponent(Message)}</b></h1>
                                <i className='fa-solid fa-circle-check icon-check'></i>
                            </>
                            :
                            <>
                                <h1><b>{decodeURIComponent(Message)}</b></h1>
                                <i className='fa-solid fa-circle-xmark icon-xmark'></i>
                            </>
                        )
                    }

                    <div className='payment-active-button'>
                        <Link to='/'><button className='btn'>VỀ TRANG CHỦ</button></Link>
                        <Link to='/user/booking'><button className='btn'>XEM CHI TIẾT</button></Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
