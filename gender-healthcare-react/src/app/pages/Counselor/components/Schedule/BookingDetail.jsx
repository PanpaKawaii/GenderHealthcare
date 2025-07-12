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
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-medium">Loading booking details...</p>
        </div>
      </div>
    );

  if (!booking)
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-500">
        <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <p className="text-lg font-medium">Booking not found.</p>
      </div>
    );

  const start = dayjs(booking.scheduleId?.startTime);
  const end = dayjs(booking.scheduleId?.endTime);
  const duration = end.diff(start, 'minute') || 60;
  const isReadOnly = booking.status !== 'confirmed';

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      <div className="flex justify-between items-center border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
          <span className="bg-blue-100 p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </span>
          Booking Details
        </h1>
        <button
          onClick={() => navigate('/counselor/schedule?tab=' + (isReadOnly ? 'history' : 'today'))}
          className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to {isReadOnly ? 'History' : "Today's"} Bookings</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-1">
          <CustomerDetail customer={booking.customerId} />
        </div>

        <div className="col-span-2 space-y-8">
          <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:border-blue-200 transition">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Session Information
            </h2>
            <ul className="text-sm text-gray-700 space-y-4">
              <li className="flex items-center">
                <span className="w-24 font-medium">Date:</span> 
                <span className="bg-blue-50 px-3 py-1 rounded-lg">{start.format('DD/MM/YYYY')}</span>
              </li>
              <li className="flex items-center">
                <span className="w-24 font-medium">Time:</span> 
                <div className="flex items-center">
                  <span className="bg-blue-50 px-3 py-1 rounded-lg">{start.format('HH:mm')}</span>
                  <span className="mx-2">~</span>
                  <span className="bg-blue-50 px-3 py-1 rounded-lg">{end.format('HH:mm')}</span>
                  <span className="ml-2 text-gray-500">({duration} minutes)</span>
                </div>
              </li>
              <li className="flex items-center">
                <span className="w-24 font-medium">Status:</span> 
                <span
                  className={`inline-block px-3 py-1 rounded-lg text-sm font-medium ${booking.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : booking.status === 'cancelled'
                        ? 'bg-red-100 text-red-700'
                        : booking.status === 'missed'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-blue-100 text-blue-700'
                    }`}
                >
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </li>
              <li className="flex items-center">
                <span className="w-24 font-medium">Service:</span> 
                <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-lg">{booking.serviceName || 'Consultation'}</span>
              </li>
            </ul>
          </div>

          {/* Outcome Block */}
          <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:border-blue-200 transition">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Session Outcome
            </h2>

            {isReadOnly ? (
              <div className="text-sm text-gray-700 space-y-4 bg-gray-50 p-5 rounded-xl">
                <div className="flex">
                  <span className="w-32 font-medium">Result:</span> 
                  <span className="flex-1">{form.result || <em className="text-gray-400">Not provided</em>}</span>
                </div>
                <div className="flex">
                  <span className="w-32 font-medium">Note:</span> 
                  <span className="flex-1">{form.note || <em className="text-gray-400">None</em>}</span>
                </div>
                {booking.feedback && (
                  <div className="flex">
                    <span className="w-32 font-medium">Feedback:</span> 
                    <span className="flex-1">{booking.feedback}</span>
                  </div>
                )}
                {booking.rating && (
                  <div className="flex">
                    <span className="w-32 font-medium">Rating:</span> 
                    <span className="flex-1 flex">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${i < booking.rating ? 'text-yellow-500' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Result</label>
                  <textarea
                    name="result"
                    placeholder="Describe the consultation result..."
                    value={form.result}
                    onChange={handleChange}
                    rows={4}
                    className="w-full border border-gray-300 rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <input
                    name="note"
                    placeholder="Additional notes (optional)"
                    value={form.note}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
                  />
                </div>

                <div className="flex flex-wrap justify-end gap-3 pt-6">
                  <button
                    onClick={() => handleUpdateBooking('missed')}
                    className="px-5 py-2.5 rounded-lg text-sm bg-yellow-50 text-yellow-600 hover:bg-yellow-100 transition flex items-center gap-2 border border-yellow-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Mark as Missed
                  </button>

                  <button
                    onClick={() => handleUpdateBooking('cancelled')}
                    className="px-5 py-2.5 rounded-lg text-sm bg-red-50 text-red-600 hover:bg-red-100 transition flex items-center gap-2 border border-red-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancel Booking
                  </button>

                  <button
                    onClick={() => handleUpdateBooking('completed')}
                    className="px-5 py-2.5 rounded-lg text-sm bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
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
