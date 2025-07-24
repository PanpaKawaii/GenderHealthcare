import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import {
  counselorScheduleAPI,
  counselorBookAPI,
} from '../../../services/api';
import accountAPI from '../../../services/accountAPI';

export default function PaymentConfirm({ doctor, date, slot, onBack }) {
  const navigate = useNavigate();
  const [user, setUser] = useState([])

  const start = slot?.startTime ? dayjs(slot.startTime) : null;
  const end = slot?.endTime ? dayjs(slot.endTime) : null;

  const accountId = localStorage.getItem('UserId');

  const handleSubmit = async (e) => {
    console.log('🚀 Bắt đầu thanh toán');
    e.preventDefault();

    const price = slot?.price || 0;
  if (user.wallet < price) {
    alert('Wallet balance is not enough to pay.');
    navigate('/'); 
    return; 
  }

    if (!accountId || !slot?._id || !doctor?._id) {
      console.warn('❗Thiếu thông tin:', {
        accountId,
        doctorId: doctor?._id,
        scheduleId: slot?._id,
      });
      alert('Vui lòng chọn đầy đủ thông tin để thanh toán.');
      return;
    }

    try {
      const res = await counselorBookAPI.getCustomerIdByAccountId(accountId);
      const customerId = res.data._id;

      const payload = {
        customerId,
        counselorId: doctor._id,
        scheduleId: slot._id,
        bookingDate: start ? start.toISOString() : new Date().toISOString(),
        status: 'confirmed',
        note: '',
      };

      console.log('📤 Booking payload gửi lên:', payload);
      await counselorBookAPI.create(payload);
      console.log('✅ Booking created');

      await counselorScheduleAPI.update(slot._id, { status: 'booked' });
      console.log('✔ Schedule updated → booked');

      const newBalance = user.wallet - slot.price;
      await accountAPI.updateProfile(accountId, { wallet: newBalance });

      // ✅ Navigate to PaymentStatus with type=consultation
      navigate('/paymentstatus/?message=Thanh%20to%C3%A1n%20th%C3%A0nh%20c%C3%B4ng&type=consultation');
    } catch (err) {
      console.error('❌ Lỗi khi thanh toán:', err);
      if (err.response) {
        console.error('🛑 Response data:', err.response.data);
        console.error('🛑  Status:', err.response.status);
        console.error('🛑 Headers:', err.response.headers);
      }
      alert('❌ Đã xảy ra lỗi khi thanh toán!');
    }
  };

  useEffect(() => {
        const fetchUserInfo = async () => {
          try {
            const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
            const userId = localStorage.getItem("UserId");
            const token = localStorage.getItem("token");
    
            const res = await fetch(`${API_URL}/accounts/${userId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            const data = await res.json()
            setUser(data)
          } catch (err) {
            console.error("❌ Error fetching user info:", err);
          }
        };
    
        fetchUserInfo();
      }, []);

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-xl p-8 mt-10">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
        Confirm &amp; Pay
      </h1>
      <p className="text-center text-gray-500 mb-6">
        Review your booking details and complete payment
      </p>

      <div className="bg-gray-100 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <i className="fa-regular fa-calendar"></i> Booking Summary
        </h3>

        <div className="space-y-2 text-gray-700 text-sm">
          <div className="flex justify-between">
            <span>Service:</span>
            <span className="font-medium"></span>
          </div>
          <div className="flex justify-between">
            <span>Counselor:</span>
            <span className="font-medium">{doctor?.accountId?.name || '---'}</span>
          </div>
          <div className="flex justify-between">
            <span>Date:</span>
            <span className="font-medium">{start ? start.format('DD/MM/YYYY') : '---'}</span>
          </div>
          <div className="flex justify-between">
            <span>Time:</span>
            <span className="font-medium">
              {start && end ? `${start.format('HH:mm')} - ${end.format('HH:mm')}` : '---'}
            </span>
          </div>

          <div className="flex justify-between font-bold mt-4 border-t pt-3 text-base">
            <span>Total:</span>
            <span>{slot?.price || 0}.000 VND</span>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-lg transition"
        >
          Pay {slot?.price || 0}.000 VND
        </button>

        <button
          onClick={onBack}
          className="w-full mt-3 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg text-base transition"
        >
          ← Choose another counselor
        </button>
      </div>
    </div>
  );
}
