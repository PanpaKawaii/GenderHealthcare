import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  fetchData,
  postData,
  putData,
  deleteData,
} from "../LoginRegister/api_register";
import "../ParameterManager/ManagerStyles.css";

export default function TestBookingManager() {
  const [bookings, setBookings] = useState([]);
  const [formData, setFormData] = useState({
    doctorTestServiceId: "",
    bookingDate: "",
    status: "Pending",
    note: "",
  });
  const [editingBooking, setEditingBooking] = useState(null);
  const [doctorTestServices, setDoctorTestServices] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const GetBooking = async () => {
      const token = localStorage.getItem("token");
      try {
        const BookingData = await fetchData("/testbookings", token);
        console.log("BookingData", BookingData);
        const ResultData = await fetchData("/testresults", token);
        console.log("ResultData", ResultData);

        const mergedBookings = BookingData.map((booking) => {
          const result = ResultData.find(
            (r) => r.testBookingId?._id == booking._id
          );
          return {
            ...booking,
            result: result || null, // hoặc gộp từng thuộc tính cụ thể nếu muốn
          };
        });
        console.log("mergedBookings", mergedBookings);

        setBookings(mergedBookings);
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    GetBooking();
  }, [refresh]);

  useEffect(() => {
    const fetchDoctors = async () => {
      const data = await fetchData("/doctortestservices", "");
      setDoctorTestServices(data);
    };
    fetchDoctors();
  }, []);

  const AddBooking = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const AddBookingData = {
      doctorTestServiceId: formData.doctorTestServiceId,
      bookingDate: formData.bookingDate || null,
      status: formData.status || "Pending",
      note: formData.note || "",
    };

    try {
      setLoading(true);
      const BookingData = await postData(
        "/testbookings",
        token,
        AddBookingData
      );
      console.log("Add result:", BookingData);
      setFormData({
        doctorTestServiceId: "",
        bookingDate: "",
        status: "Pending",
        note: "",
      });
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
        const BookingData = await deleteData(`/testbookings/${id}`, token);
        console.log("Delete result:", BookingData);
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
      const BookingData = await putData(
        `/testbookings/${editingBooking._id}`,
        token,
        EditBookingData
      );
      console.log("Edit result:", BookingData);
      setEditingBooking(null);
    } catch (error) {
      console.error(error);
      setError(true);
    } finally {
      setLoading(false);
      setRefresh((p) => p + 1);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="container">
      <h2 className="title">🧪 Booking Manager</h2>

      {/* <form className='form' onSubmit={AddBooking}>
                <select required value={formData.doctorTestServiceId} onChange={(e) => setFormData({ ...formData, doctorTestServiceId: e.target.value })} >
                    <option value=''>-- Chọn khung giờ bác sĩ --</option>
                    {doctorTestServices.map((slot) => (
                        <option key={slot._id} value={slot._id}>
                            {slot.startTime} - {slot.endTime}
                        </option>
                    ))}
                </select>
                <input type='date' required value={formData.bookingDate} onChange={(e) => setFormData({ ...formData, bookingDate: e.target.value })} />
                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} >
                    <option value='Pending'>Pending</option>
                    <option value='Approved'>Approved</option>
                    <option value='Cancelled'>Cancelled</option>
                </select>
                <input type='text' placeholder='Ghi chú' value={formData.note} onChange={(e) => setFormData({ ...formData, note: e.target.value })} />
                <button type='submit'>Lưu</button>
            </form> */}

      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            {/* <th>ID</th> */}
            <th>Ngày xét nghiệm</th>
            <th>Thời gian</th>
            <th>Ngày tạo</th>
            <th>Trạng thái</th>
            <th>Ghi chú</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length === 0 ? (
            <tr>
              <td colSpan="8">Không có dữ liệu</td>
            </tr>
          ) : (
            bookings.map((booking, index) => (
              <tr key={booking._id}>
                <td>{index + 1}</td>
                {/* <td>{booking._id}</td> */}
                <td>
                  {new Date(booking.bookingDate).toLocaleDateString("vi-VN")}
                </td>
                <td>
                  {booking.doctorTestServiceId?.startTime} -{" "}
                  {booking.doctorTestServiceId?.endTime}
                </td>
                <td>
                  {new Date(booking.createdAt).toLocaleDateString("vi-VN")}
                </td>
                <td>{booking.status}</td>
                <td>{booking.note || "—"}</td>
                <td>
                  <div className="btn-box">
                    <button
                      className="btn"
                      onClick={() => setEditingBooking(booking)}
                    >
                      Edit
                    </button>
                    {/* <button className='dlt-btn' onClick={() => DeleteBooking(booking._id)}>Delete</button> */}
                    <Link
                      to={`/doctor/testresultmanager/${booking.result?._id}`}
                    >
                      <button className="btn detail-btn">Detail</button>
                    </Link>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {editingBooking && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Cập nhật lịch đặt</h3>
            <form onSubmit={EditBooking}>
              {/* <label>Ngày đặt</label>
                            <input
                                type='date'
                                value={editingBooking.bookingDate ? editingBooking.bookingDate.split('T')[0] : ''}
                                onChange={(e) =>
                                    setEditingBooking({ ...editingBooking, bookingDate: e.target.value })
                                }
                            /> */}

              <label>Trạng thái</label>
              <select
                value={editingBooking.status}
                onChange={(e) =>
                  setEditingBooking({
                    ...editingBooking,
                    status: e.target.value,
                  })
                }
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              <label>Ghi chú</label>
              <input
                type="text"
                value={editingBooking.note || ""}
                onChange={(e) =>
                  setEditingBooking({ ...editingBooking, note: e.target.value })
                }
              />

              <div className="modal-actions">
                <button type="submit">Save</button>
                <button type="button" onClick={() => setEditingBooking(null)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
