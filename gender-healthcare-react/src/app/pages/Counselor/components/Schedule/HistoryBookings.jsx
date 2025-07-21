import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { counselorBookAPI } from '../../../../services/api';
import dayjs from 'dayjs';
import { Star } from 'lucide-react';

export default function HistoryBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const accountId = localStorage.getItem('UserId');
        if (!accountId) return;

        const res = await counselorBookAPI.getByCounselorAccountId(accountId);
        const allBookings = res?.data || res;

        const history = allBookings.filter(
          (b) =>
            b.status === 'completed' ||
            b.status === 'cancelled' ||
            b.status === 'missed'
        );

        // 🔁 Sort by latest startTime
        const sorted = history.sort((a, b) => {
          const aTime = new Date(a.scheduleId?.startTime);
          const bTime = new Date(b.scheduleId?.startTime);
          return bTime - aTime;
        });

        setBookings(sorted);
      } catch (err) {
        console.error('Error fetching history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const filteredBookings = bookings.filter(
    (b) => filterStatus === 'all' || b.status === filterStatus
  );

  const renderStars = (count) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={16}
          strokeWidth={1.5}
          className={`${
            i <= count ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );

  if (loading)
    return <p className="text-center text-gray-500 text-sm mt-6">Loading history...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-800">Consultation History</h3>
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="missed">Missed</option>
        </select>
      </div>

      {filteredBookings.length === 0 ? (
        <p className="text-center text-gray-500">No consultation history available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredBookings.map((b) => {
            const start = dayjs(b.scheduleId?.startTime);
            const end = dayjs(b.scheduleId?.endTime);
            const duration = end.diff(start, 'minute') || 60;

            return (
              <div
                key={b._id}
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex justify-between items-start">
                  {/* Left - Customer Info */}
                  <div>
                    <h4 className="text-base font-semibold text-gray-900">
                      {b.customerId?.accountId?.name || 'Customer'}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {b.customerId?.accountId?.email || ''}
                    </p>
                  </div>

                  {/* Right - Status + Time */}
                  <div className="text-right space-y-1">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        b.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : b.status === 'cancelled'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                    </span>
                    <p className="text-sm text-gray-600">
                      {start.format('DD/MM/YYYY')}<br />
                      {start.format('HH:mm')} - {end.format('HH:mm')} ({duration} min)
                    </p>
                  </div>
                </div>

                {/* Rating + View Detail */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    {b.rating > 0 && renderStars(b.rating)}
                  </div>
                  <button
                    onClick={() => navigate(`/counselor/bookings/${b._id}`)}
                    className="text-sm text-indigo-600 font-medium hover:underline"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
