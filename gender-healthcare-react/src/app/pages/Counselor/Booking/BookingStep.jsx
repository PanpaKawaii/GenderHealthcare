// import React, { useState, useEffect } from 'react';
// import PickingDate from './PickingDate';
// import TimeSlots from './TimeSlots';
// import { counselorAPI, counselorScheduleAPI } from '../../../services/api';
// import './Booking.css';
// import PaymentConfirm from './PaymentConfirm';

// export default function BookingStep() {
//     const [selectedDate, setSelectedDate] = useState(null);
//     const [selectedSlot, setSelectedSlot] = useState(null);
//     const [availableDoctors, setAvailableDoctors] = useState([]);
//     const [selectedDoctor, setSelectedDoctor] = useState(null);
//     const [loading, setLoading] = useState(false);

//     // Khi đã chọn ngày và slot, lọc bác sĩ phù hợp
//     useEffect(() => {
//         const fetchAvailableDoctors = async () => {
//             if (!selectedDate || !selectedSlot) {
//                 setAvailableDoctors([]);
//                 return;
//             }

//             setLoading(true);
//             try {
//                 const allDoctors = await counselorAPI.getAll('/counselors');
//                 console.log('Tất cả bác sĩ:', allDoctors.data);
//                 const filtered = [];

//                 const formattedDate = selectedDate.toISOString().split('T')[0];

//                 for (const doctor of allDoctors.data) {
//                     const res = await counselorScheduleAPI.getByCounselorAndDate(doctor._id, formattedDate);
//                     const hasAvailableSlot = res.data.some(slot =>
//                         new Date(slot.startTime).toLocaleTimeString([], {
//                             hour: '2-digit',
//                             minute: '2-digit',
//                         }) === selectedSlot.time && slot.status !== 'booked'
//                     );
//                     if (hasAvailableSlot) {
//                         filtered.push({ ...doctor, price: 150 });
//                     }
//                 }

//                 setAvailableDoctors(filtered);
//             } catch (err) {
//                 console.error('Lỗi khi lọc bác sĩ:', err);
//             }
//             setLoading(false);
//         };

//         fetchAvailableDoctors();
//     }, [selectedDate, selectedSlot]);

//     // Nếu đã chọn xong thì sang thanh toán
//     if (selectedDoctor) {
//         return (
//             <PaymentConfirm doctor={selectedDoctor} date={selectedDate} slot={selectedSlot} />
//         );
//     }

//     return (
//         <div className="booking-step-container" style={{ display: 'flex', gap: '2rem' }}>
//             {/* BÊN TRÁI: Chọn ngày & slot */}
//             <div style={{ flex: 1 }}>
//                 <PickingDate doctor={null} onSelectDate={setSelectedDate} />
//                 {selectedDate && (
//                     <TimeSlots date={selectedDate} onSelectSlot={setSelectedSlot} />
//                 )}
//             </div>

//             {/* BÊN PHẢI: Danh sách bác sĩ */}
//             <div style={{ flex: 1 }}>
//                 <h2>Danh sách tư vấn viên phù hợp</h2>
//                 {(!selectedDate || !selectedSlot) && <p>Vui lòng chọn ngày và khung giờ.</p>}
//                 {loading && <p>Đang tải dữ liệu...</p>}
//                 {!loading && selectedDate && selectedSlot && availableDoctors.length === 0 && (
//                     <p>❌ Không có tư vấn viên nào trống vào khung giờ này.</p>
//                 )}
//                 <div className="cards">
//                     {availableDoctors.map((doctor) => (
//                         <div key={doctor._id} className="card">
//                             <img
//                                 src={doctor.accountId.image || '/default-doctor.jpg'}
//                                 alt={doctor.accountId.name}
//                             />
//                             <div className="information">
//                                 <h3>{doctor.accountId.name}</h3>
//                                 <p>{doctor.degree}</p>
//                                 <div className="row1">
//                                     <div className="rating">★ {doctor.experience} năm kinh nghiệm</div>
//                                     <div className="available">Rảnh giờ đã chọn</div>
//                                 </div>
//                                 <div className="row2">
//                                     <i className="fa-regular fa-calendar"></i>
//                                     <div>Tiểu sử: {doctor.bio}</div>
//                                 </div>
//                             </div>
//                             <div className="buttons">
//                                 <div>${doctor.price}</div>
//                                 <button className="btn" onClick={() => setSelectedDoctor(doctor)}>
//                                     Chọn tư vấn viên
//                                 </button>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// }
