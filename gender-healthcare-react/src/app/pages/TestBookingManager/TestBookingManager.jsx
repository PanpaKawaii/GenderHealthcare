import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  fetchData,
  postData,
  putData,
  deleteData,
} from "../LoginRegister/api_register";
import { Calendar, Clock, FileText, Edit3, Eye, TestTube, AlertCircle } from "lucide-react";

export default function TestBookingManager() {
  const [bookings, setBookings] = useState([]);
  const [formData, setFormData] = useState({
    doctorTestServiceId: '',
    bookingDate: '',
    status: 'Pending',
    note: '',
  });
  const [editingBooking, setEditingBooking] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const GetBooking = async () => {
      const token = localStorage.getItem('token');
      try {
        const BookingData = await fetchData('/testbookings', token);
        const ResultData = await fetchData('/testresults', token);

        const mergedBookings = BookingData.map(booking => {
          const result = ResultData.find(r => r.testBookingId?._id == booking._id);
          return { ...booking, result: result || null };
        });

        setBookings(mergedBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    GetBooking();
  }, [refresh]);

  const AddBooking = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const AddBookingData = {
      doctorTestServiceId: formData.doctorTestServiceId,
      bookingDate: formData.bookingDate || null,
      status: formData.status || 'Pending',
      note: formData.note || '',
    };

    try {
      setLoading(true);
      await postData('/testbookings', token, AddBookingData);
      setFormData({ doctorTestServiceId: '', bookingDate: '', status: 'Pending', note: '' });
    } catch (error) {
      console.error(error);
      setError(true);
    } finally {
      setLoading(false);
      setRefresh((p) => p + 1);
    }
  };

  const DeleteBooking = async (id) => {
    const token = localStorage.getItem("token");
    try {
      setLoading(true);
      if (window.confirm("Xoá lịch đặt này?")) {
        await deleteData(`/testbookings/${id}`, token);
      }
    } catch (error) {
      console.error(error);
      setError(true);
    } finally {
      setLoading(false);
      setRefresh((p) => p + 1);
    }
  };

  const EditBooking = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const EditBookingData = {
      bookingDate: editingBooking.bookingDate || null,
      status: editingBooking.status || "Pending",
      note: editingBooking.note || "",
    };

    try {
      setLoading(true);
      await putData(`/testbookings/${editingBooking._id}`, token, EditBookingData);
      setEditingBooking(null);
    } catch (error) {
      console.error(error);
      setError(true);
    } finally {
      setLoading(false);
      setRefresh((p) => p + 1);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Pending': 'bg-amber-100 text-amber-800 border-amber-200',
      'Approved': 'bg-green-100 text-green-800 border-green-200',
      'Cancelled': 'bg-red-100 text-red-800 border-red-200'
    };
    return statusConfig[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <TestTube className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          </div>
          <p className="text-slate-600 text-lg font-medium">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <TestTube className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Test Booking Manager</h1>
          </div>
          <p className="text-slate-600">Manage laboratory test bookings and appointments</p>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          {/* Table Header */}
          <div className="p-6 border-b border-slate-200 bg-slate-50">
            <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Booking List
            </h2>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">#</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Booking Date
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Time Slot
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Created At</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Note
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <TestTube className="w-12 h-12 text-slate-300" />
                        <p className="text-slate-500 text-lg font-medium">No bookings found</p>
                        <p className="text-slate-400 text-sm">Không có dữ liệu</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking, index) => (
                    <tr key={booking._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-600 font-medium">{index + 1}</td>
                      <td className="px-6 py-4 text-sm text-slate-900 font-medium">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          {new Date(booking.bookingDate).toISOString().split('T')[0]}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-full text-xs font-medium">
                            {booking.doctorTestServiceId?.startTime} - {booking.doctorTestServiceId?.endTime}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {new Date(booking.createdAt).toISOString().split('T')[0]}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 max-w-xs">
                        <div className="truncate" title={booking.note}>
                          {booking.note || '—'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            className="p-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors group"
                            onClick={() => setEditingBooking(booking)}
                          >
                            <Edit3 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          </button>
                          <Link to={`/doctor/testresultmanager/${booking.result?._id}`}>
                            <button className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors group">
                              <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            </button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Modal */}
        {editingBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-blue-600" />
                  Cập nhật lịch đặt
                </h3>
                <button
                  onClick={() => setEditingBooking(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <AlertCircle className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={EditBooking} className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    Trạng thái
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                    value={editingBooking.status}
                    onChange={(e) => setEditingBooking({ ...editingBooking, status: e.target.value })}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-500" />
                    Ghi chú
                  </label>
                  <textarea
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    rows="3"
                    placeholder="Enter additional notes..."
                    value={editingBooking.note || ""}
                    onChange={(e) => setEditingBooking({ ...editingBooking, note: e.target.value })}
                  />
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setEditingBooking(null)}
                    className="px-6 py-2 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium flex items-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    <Edit3 className="w-4 h-4" />
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}