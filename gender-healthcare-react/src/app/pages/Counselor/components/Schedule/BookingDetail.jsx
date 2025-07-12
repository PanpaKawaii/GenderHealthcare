import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { counselorBookAPI } from '../../../../services/api';
import dayjs from 'dayjs';
import CustomerDetail from './CustomerDetail';

export default function BookingDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ result: '', note: '' });

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await counselorBookAPI.getById(id);
        const data = res?.data || res;
        setBooking(data);
        setForm({ result: data.result || '', note: data.note || '' });
      } catch (err) {
        console.error('Error fetching booking detail:', err);
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
      alert('✅ Booking updated successfully');
      navigate('/counselor/schedule?tab=history');
    } catch (err) {
      console.error('❌ Error updating booking:', err);
      alert('Failed to update booking');
    }
  };

  if (loading)
    return <div className="text-center text-gray-500 mt-10">Loading booking details...</div>;

  if (!booking)
    return <div className="text-center text-gray-500 mt-10">Booking not found.</div>;

  const start = dayjs(booking.scheduleId?.startTime);
  const end = dayjs(booking.scheduleId?.endTime);
  const duration = end.diff(start, 'minute') || 60;
  const isReadOnly = booking.status !== 'confirmed';

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Booking Details</h1>
        <button
          onClick={() => navigate('/counselor/schedule?tab=' + (isReadOnly ? 'history' : 'today'))}
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back to {isReadOnly ? 'History' : "Today's"} Bookings
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1">
          <CustomerDetail customer={booking.customerId} />
        </div>

        <div className="col-span-2 space-y-6">
          <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Session Information</h2>
            <ul className="text-sm text-gray-700 space-y-2">
              <li><strong>Date:</strong> {start.format('DD/MM/YYYY')}</li>
              <li><strong>Time:</strong> {start.format('HH:mm')} ~ {end.format('HH:mm')} ({duration} minutes)</li>
              <li>
                <strong>Status:</strong>{' '}
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${booking.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : booking.status === 'cancelled'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                >
                  {booking.status}
                </span>
              </li>
              <li><strong>Service:</strong> {booking.serviceName || 'Consultation'}</li>
            </ul>
          </div>

          {/* Outcome Block */}
          <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Session Outcome</h2>

            {isReadOnly ? (
              <div className="text-sm text-gray-700 space-y-2">
                <p><strong>Result:</strong> {form.result || <em>Not provided</em>}</p>
                <p><strong>Note:</strong> {form.note || <em>None</em>}</p>
                {booking.feedback && (
                  <p><strong>Customer Feedback:</strong> {booking.feedback}</p>
                )}
                {booking.rating && (
                  <p>
                    <strong>Rating:</strong>{' '}
                    <span className="text-yellow-500">{booking.rating} ★</span>
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Result</label>
                  <textarea
                    name="result"
                    placeholder="Describe the consultation result..."
                    value={form.result}
                    onChange={handleChange}
                    rows={4}
                    className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <input
                    name="note"
                    placeholder="Additional notes (optional)"
                    value={form.note}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="flex flex-wrap justify-end gap-3 pt-4">
                  <button
                    onClick={() => handleUpdateBooking('missed')}
                    className="px-4 py-2 rounded-lg text-sm bg-yellow-50 text-yellow-600 hover:bg-yellow-100 transition"
                  >
                    Mark as Missed
                  </button>

                  <button
                    onClick={() => handleUpdateBooking('cancelled')}
                    className="px-4 py-2 rounded-lg text-sm bg-red-50 text-red-600 hover:bg-red-100 transition"
                  >
                    Cancel Booking
                  </button>

                  <button
                    onClick={() => handleUpdateBooking('completed')}
                    className="px-4 py-2 rounded-lg text-sm bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    Mark as Completed
                  </button>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
