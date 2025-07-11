import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { counselorBookAPI } from '../../../../services/api';
import dayjs from 'dayjs';

export default function TodayBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

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
        console.error('Error fetching today\'s bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <p className="text-center text-sm text-gray-500">Loading...</p>;

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800">Today's Bookings</h3>

      {bookings.length === 0 ? (
        <p className="text-gray-500 text-center">You have no appointments today.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {bookings.map((b) => {
            const startTime = dayjs(b.scheduleId?.startTime);
            const endTime = dayjs(b.scheduleId?.endTime);
            const duration = endTime.diff(startTime, 'minute') || 60;

            return (
              <div
                key={b._id}
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-medium text-gray-800">
                      {b.customerId?.accountId?.name || 'Customer'}
                    </h4>
                    <p className="text-sm text-gray-500">{b.serviceName || 'Consultation'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">
                      {startTime.format('DD/MM/YYYY')}
                    </p>
                    <p className="text-sm text-gray-500">
                      {startTime.format('HH:mm')} - {endTime.format('HH:mm')}
                    </p>
                    <span className="inline-block mt-1 text-xs text-gray-400">{duration} minutes</span>
                  </div>
                </div>

                <div className="mt-4 text-right">
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
