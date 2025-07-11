import { useEffect, useState } from 'react';
import { counselorBookAPI } from '../../../../services/api';
import dayjs from 'dayjs';

export default function HistoryBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const accountId = localStorage.getItem('UserId');
        if (!accountId) return;

        const res = await counselorBookAPI.getByCounselorAccountId(accountId);
        const allBookings = res?.data || res;

        const history = allBookings.filter((b) =>
          b.status === 'completed' || b.status === 'cancelled'
        );

        setBookings(history);
      } catch (err) {
        console.error('Lỗi khi lấy lịch sử tư vấn:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) return <p>Đang tải lịch sử...</p>;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Lịch sử tư vấn</h3>

      {bookings.length === 0 ? (
        <p className="text-gray-500">Chưa có lịch sử tư vấn.</p>
      ) : (
        bookings.map((b) => {
          const start = dayjs(b.scheduleId?.startTime);
          const end = dayjs(b.scheduleId?.endTime);

          return (
            <div key={b._id} className="rounded-md border p-4 space-y-1">
              <div className="flex justify-between">
                <p className="font-medium">{b.customerId?.accountId?.fullName || 'Khách hàng'}</p>
                <p className={`text-sm ${b.status === 'completed' ? 'text-green-600' : 'text-red-600'}`}>
                  {b.status === 'completed' ? 'Đã hoàn thành' : 'Đã huỷ'}
                </p>
              </div>

              <p className="text-sm text-muted-foreground">
                {start.format('DD/MM/YYYY')} – {start.format('HH:mm')} ~ {end.format('HH:mm')}
              </p>

              {b.result && (
                <p>
                  <span className="font-medium">Kết quả: </span>
                  {b.result}
                </p>
              )}
              {b.note && (
                <p>
                  <span className="font-medium">Ghi chú: </span>
                  {b.note}
                </p>
              )}
              {b.feedback && (
                <p>
                  <span className="font-medium">Phản hồi KH: </span>
                  {b.feedback}
                </p>
              )}
              {b.rating && (
                <p>
                  <span className="font-medium">Đánh giá: </span>
                  {b.rating} ★
                </p>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
