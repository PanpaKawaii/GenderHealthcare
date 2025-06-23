import React, { useEffect, useState } from 'react';
import { counselorScheduleAPI } from '../../../services/api';
import dayjs from 'dayjs';

export default function CounselorDoctor({ date, slot, onSelectDoctor }) {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);

    const formattedDate = dayjs(date).format('YYYY-MM-DD');

    useEffect(() => {
        const fetchAvailableDoctors = async () => {
            if (!date || !slot?.startTime || !slot?.endTime) return;

            setLoading(true);
            try {
                const res = await counselorScheduleAPI.getAvailableCounselors(
                    formattedDate,
                    slot.startTime,
                    slot.endTime
                );
                setDoctors(res.data);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách bác sĩ:', error);
                setDoctors([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAvailableDoctors();
    }, [date, slot]);

    const handleSelectDoctor = async (doctor) => {
        try {
            const res = await counselorScheduleAPI.getByCounselorAndDate(
                doctor._id,
                formattedDate
            );

            const schedules = res.data;

            // 👉 Tạo expectedStartTime theo UTC để so khớp với DB
            const [hour, minute] = slot.startTime.split(':').map(Number);
            const expectedStartTime = new Date(Date.UTC(
                date.getFullYear(),
                date.getMonth(),
                date.getDate(),
                hour,
                minute,
                0
            ));

            const matchedSchedule = schedules.find((s) => {
                const dbTime = new Date(s.startTime);
                console.log('🔍 So sánh:', dbTime.toISOString(), expectedStartTime.toISOString());

                return dbTime.getTime() === expectedStartTime.getTime() && s.status === 'available';
            });

            if (matchedSchedule) {
                onSelectDoctor(doctor, matchedSchedule);
            } else {
                alert('❌ Bác sĩ này không còn slot trống vào giờ đã chọn.');
            }
        } catch (err) {
            console.error('❌ Lỗi khi tìm slot:', err);
            alert('Đã xảy ra lỗi khi kiểm tra slot');
        }
    };

    return (
        <div>
            <h3>Chọn bác sĩ còn trống:</h3>
            {loading ? (
                <p>Đang tải danh sách bác sĩ...</p>
            ) : doctors.length === 0 ? (
                <p>Không có bác sĩ nào trống trong khung giờ đã chọn.</p>
            ) : (
                <div className="counselor-doctor-content booking-content">
                    <div className="cards">
                        {doctors.map((doctor) => (
                            <div key={doctor._id} className="card">
                                <img
                                    src={doctor.accountId.image || '/default-doctor.jpg'}
                                    alt={doctor.accountId.name}
                                />
                                <div className="information">
                                    <h3>{doctor.accountId.name}</h3>
                                    <p>{doctor.degree}</p>
                                    <div className="row1">
                                        <div className="rating">★ {doctor.experience} năm kinh nghiệm</div>
                                        <div className="available">Có thể tư vấn hôm nay</div>
                                    </div>
                                    <div className="row2">
                                        <i className="fa-regular fa-calendar"></i>
                                        <div>Tiểu sử: {doctor.bio}</div>
                                    </div>
                                </div>
                                <div className="buttons">
                                    <div>${doctor.price}</div>
                                    <button
                                        className="btn"
                                        onClick={() => handleSelectDoctor(doctor)}
                                    >
                                        Chọn tư vấn viên
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
