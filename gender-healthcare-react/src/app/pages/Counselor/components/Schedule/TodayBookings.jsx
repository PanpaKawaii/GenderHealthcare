import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { counselorBookAPI } from '../../../../services/api';
import dayjs from 'dayjs';

export default function TodayBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);


  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const accountId = localStorage.getItem('UserId');
        if (!accountId) return;

        const res = await counselorBookAPI.getByCounselorAccountId(accountId);
        const allBookings = res?.data || res;

        const today = dayjs().format('YYYY-MM-DD');

        const filtered = allBookings.filter((b) => {
          const startTime = b?.scheduleId?.startTime;
          const formattedDate = startTime ? dayjs(startTime).format('YYYY-MM-DD') : null;
          return formattedDate === today && b.status === 'confirmed';
        });

        setBookings(filtered);
      } catch (err) {
        console.error('Lỗi khi lấy booking hôm nay:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleOpenForm = (booking) => {
    if (selectedBooking?._id === booking._id) {
      setSelectedBooking(null);
    } else {
      setSelectedBooking(booking);
      setForm({
        result: booking.result || '',
        note: booking.note || '',
      });
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdateBooking = async (status) => {
    if (!selectedBooking) return;

    try {
      await counselorBookAPI.update(selectedBooking._id, {
        ...form,
        status,
      });

      alert('✅ Cập nhật booking thành công');
      setSelectedBooking(null);
      setBookings((prev) => prev.filter((b) => b._id !== selectedBooking._id));
    } catch (err) {
      console.error('Lỗi khi cập nhật booking:', err);
      alert('❌ Lỗi khi cập nhật booking');
    }
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Booking hôm nay (chưa diễn ra)</h3>

      {bookings.length === 0 ? (
        <p className="text-gray-500">Không có lịch hẹn nào hôm nay.</p>
      ) : (
        bookings.map((b) => {
          const startTime = dayjs(b.scheduleId?.startTime);
          const endTime = dayjs(b.scheduleId?.endTime);

          return (
            <div key={b._id} className="rounded-md border p-4 space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">
                    {b.customerId?.accountId?.name || 'Khách hàng'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {b.serviceName || 'Tư vấn'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {startTime.format('DD/MM/YYYY')} - {startTime.format('HH:mm')} ~ {endTime.format('HH:mm')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {(endTime.diff(startTime, 'minute')) || 60} phút
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button onClick={() => navigate(`/counselor/bookings/${b._id}`)} className="underline text-blue-500">
                  Xem chi tiết
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
