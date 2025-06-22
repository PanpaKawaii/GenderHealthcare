import React, { useEffect, useState } from 'react';
import { counselorScheduleAPI } from '../../../services/api';

export default function CounselorDoctor({ date, slot, onSelectDoctor }) {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const formattedDate = new Date(date).toISOString().split('T')[0];

    useEffect(() => {
        const fetchAvailableDoctors = async () => {
            if (!date || !slot?.startTime || !slot?.endTime) return;
            console.log('Fetching available doctors for:', date, slot);
            setLoading(true);
            try {
                const response = await counselorScheduleAPI.getAvailableCounselors(
                    formattedDate,
                    slot.startTime,
                    slot.endTime
                );
                setDoctors(response.data);
                console.log('Available doctors:', response.data);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách bác sĩ:', error);
                setDoctors([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAvailableDoctors();
    }, [date, slot]);

    return (
        <div>
            <h3>Chọn bác sĩ còn trống:</h3>

            {loading ? (
                <p>Đang tải danh sách bác sĩ...</p>
            ) : doctors.length === 0 ? (
                <p>Không có bác sĩ nào trống trong khung giờ đã chọn.</p>
            ) : (
                <div className='counselor-doctor-content booking-content'>
                    <div className='cards'>
                        {doctors.map((doctor, i) => (
                            <div key={doctor._id} className='card'>
                                <img
                                    src={doctor.accountId.image || '/default-doctor.jpg'}
                                    alt={doctor.accountId.name}
                                />
                                <div className='information'>
                                    <h3>{doctor.accountId.name}</h3>
                                    <p>{doctor.degree}</p>
                                    <div className='row1'>
                                        <div className='rating'>★ {doctor.experience} năm kinh nghiệm</div>
                                        <div className='available'>Có thể tư vấn hôm nay</div>
                                    </div>
                                    <div className='row2'>
                                        <i className='fa-regular fa-calendar'></i>
                                        <div>Tiểu sử: {doctor.bio}</div>
                                    </div>
                                </div>
                                <div className='buttons'>
                                    <div>${doctor.price}</div>
                                    <button className='btn' onClick={() => onSelectDoctor(doctor)}>Chọn tư vấn viên</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
