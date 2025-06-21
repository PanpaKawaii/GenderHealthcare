import React from 'react';
import './CounselorDoctor.css';
import { useState, useEffect } from 'react';
import { counselorAPI } from '../../../services/api';

export default function CounselorDoctor({ onSelectDoctor }) {
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
    const fetchCounselors = async () => {
        try {
            const response = await counselorAPI.getAll('/counselors');
            const doctorsWithPrice = response.data.map(doctor => ({
                ...doctor,
                price: 150, //giá tiền cố định
            }));
            setDoctors(doctorsWithPrice);
            console.log('Fetched doctors:', doctorsWithPrice);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    };
    fetchCounselors();
}, []);


    return (
        <div className='counselor-doctor-content booking-content'>
            <h1 className='title'>Choose Your Consultant</h1>
            <p className='script'>Select from our qualified healthcare professionals</p>
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
    )
}
