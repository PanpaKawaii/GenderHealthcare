import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { counselorBookAPI } from '../../../../services/api';
import dayjs from 'dayjs';
import CustomerDetail from './CustomerDetail';
import { useNavigate } from 'react-router-dom';

export default function BookingDetail() {
  const navigate = useNavigate();

  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    result: '',
    note: ''
  });

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await counselorBookAPI.getById(id);
        const data = res?.data || res;
        setBooking(data);
        setForm({
          result: data.result || '',
          note: data.note || ''
        });
      } catch (err) {
        console.error('Lỗi khi lấy chi tiết booking:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdateBooking = async (status) => {
    try {
      await counselorBookAPI.update(booking._id, {
        result: form.result,
        note: form.note,
        status,
      });
      alert('✅ Cập nhật booking thành công');
    } catch (err) {
      console.error('❌ Lỗi khi cập nhật booking:', err);
      alert('Lỗi khi cập nhật booking');
    }
  };

  if (loading) return <p>Đang tải chi tiết booking...</p>;
  if (!booking) return <p>Không tìm thấy booking.</p>;

  const start = dayjs(booking.scheduleId?.startTime);
  const end = dayjs(booking.scheduleId?.endTime);

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4">
      <h2 className="text-2xl font-bold">Chi tiết Booking</h2>
      <button
        onClick={() => navigate('/counselor/schedule?tab=today')}
        className="mt-2 mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
      >
        ← Quay lại danh sách hôm nay
      </button>

      <CustomerDetail customer={booking.customerId} />

      <div className="border p-4 rounded-md bg-white shadow space-y-2">
        <p><strong>Thời gian:</strong> {start.format('DD/MM/YYYY')} {start.format('HH:mm')} ~ {end.format('HH:mm')}</p>
        <p><strong>Trạng thái:</strong> {booking.status}</p>

        <textarea
          name="result"
          placeholder="Nhập kết quả tư vấn..."
          value={form.result}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="note"
          placeholder="Ghi chú"
          value={form.note}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <div className="flex justify-end gap-4 mt-2">
          <button
            onClick={() => handleUpdateBooking('cancelled')}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Huỷ tư vấn
          </button>
          <button
            onClick={() => handleUpdateBooking('completed')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Hoàn tất tư vấn
          </button>
        </div>
      </div>
    </div>
  );
}
