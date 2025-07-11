import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { counselorBookAPI } from '../../../../services/api';
import dayjs from 'dayjs';

export default function HistoryBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const accountId = localStorage.getItem('UserId');
        if (!accountId) return;

        const res = await counselorBookAPI.getByCounselorAccountId(accountId);
        const allBookings = res?.data || res;

        const history = allBookings.filter(
          (b) => b.status === 'completed' || b.status === 'cancelled'
        );

        setBookings(history);
      } catch (err) {
        console.error('Error fetching history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading)
    return <p className="text-center text-gray-500 text-sm mt-6">Loading history...</p>;

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800">Consultation History</h3>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-500">No consultation history available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {bookings.map((b) => {
            const start = dayjs(b.scheduleId?.startTime);
            const end = dayjs(b.scheduleId?.endTime);
            const duration = end.diff(start, 'minute') || 60;

            return (
              <div
                key={b._id}
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-medium text-gray-800">
                      {b.customerId?.accountId?.name || 'Customer'}
                    </h4>
                    <p className="text-sm text-gray-500">{b.serviceName || 'Consultation'}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        b.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {b.status === 'completed' ? 'Completed' : 'Cancelled'}
                    </span>
                    <p className="text-sm text-gray-600">
                      {start.format('DD/MM/YYYY')}<br />
                      {start.format('HH:mm')} – {end.format('HH:mm')} ({duration} min)
                    </p>
                  </div>
                </div>

                <div className="text-sm text-gray-700 space-y-1">
                  {b.result && (
                    <p>
                      <span className="font-medium text-gray-800">Result:</span> {b.result}
                    </p>
                  )}
                  {b.note && (
                    <p>
                      <span className="font-medium text-gray-800">Note:</span> {b.note}
                    </p>
                  )}
                  {b.feedback && (
                    <p>
                      <span className="font-medium text-gray-800">Customer Feedback:</span> {b.feedback}
                    </p>
                  )}
                  {b.rating && (
                    <p>
                      <span className="font-medium text-gray-800">Rating:</span>{' '}
                      <span className="text-yellow-500">{b.rating} ★</span>
                    </p>
                  )}
                </div>

                <div className="text-right">
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
