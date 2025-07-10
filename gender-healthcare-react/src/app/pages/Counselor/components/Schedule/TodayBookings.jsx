import { useEffect, useState } from 'react';
import { counselorBookAPI } from '../../../../services/api'; // ← Đảm bảo đúng đường dẫn
import dayjs from 'dayjs';

export default function TodayBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const accountId = localStorage.getItem('UserId');
        if (!accountId) return;

        const res = await counselorBookAPI.getByCounselorAccountId(accountId);
        const allBookings = res.data || res;

        const today = dayjs().format('YYYY-MM-DD');

        const filtered = allBookings.filter((b) => {
          if (!b.scheduleId?.date) return false;
          const bookingDate = dayjs(b.scheduleId.date).format('YYYY-MM-DD');
          return bookingDate === today && b.status !== 'đã hoàn thành';
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

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Booking hôm nay (chưa diễn ra)</h3>

      {bookings.length === 0 ? (
        <p className="text-gray-500">Không có lịch hẹn nào hôm nay.</p>
      ) : (
        bookings.map((b) => (
          <div key={b._id} className="rounded-md border p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{b.customerId?.accountId?.fullName || 'Khách hàng'}</p>
                <p className="text-sm text-muted-foreground">
                  {b.serviceName || 'Tư vấn'}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  {dayjs(b.scheduleId?.date).format('DD/MM/YYYY')} - {b.scheduleId?.time}
                </p>
                <p className="text-sm text-muted-foreground">{b.scheduleId?.duration || 60} phút</p>
              </div>
            </div>
            <div className="mt-2 text-right">
              <button className="underline text-blue-500">Điền kết quả</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
