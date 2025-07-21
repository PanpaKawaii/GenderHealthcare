import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './PaymentStatus.css';

export default function PaymentStatus() {
  const [message, setMessage] = useState('');
  const [type, setType] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const messageParam = urlParams.get('message');
    const typeParam = urlParams.get('type');
    console.log('MessageParam', messageParam);
    console.log('TypeParam', typeParam);
    setMessage(messageParam);
    setType(typeParam);
  }, []);

  const decodedMessage = message && decodeURIComponent(message);
  const isSuccess = decodedMessage === 'Thanh toán thành công';

  return (
    <div className="payment-status">
      <div className="payment-status-content">
        <div
          className="payment-status-card"
          style={{
            boxShadow: isSuccess
              ? '5px 5px 10px 0 #28a74550'
              : '5px 5px 10px 0 #dc354550',
            color: isSuccess ? '#28a745' : '#dc3545',
          }}
        >
          {decodedMessage && (
            <>
              <h1>
                <b>{decodedMessage}</b>
              </h1>
              {isSuccess ? (
                <i className="fa-solid fa-circle-check icon-check"></i>
              ) : (
                <i className="fa-solid fa-circle-xmark icon-xmark"></i>
              )}
            </>
          )}

          <div className="payment-active-button">
            <Link to="/">
              <button className="btn">VỀ TRANG CHỦ</button>
            </Link>
            <Link to={type === 'tests' ? '/profile?tab=tests' : '/profile?tab=appointments'}>
              <button className="btn">XEM CHI TIẾT</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
