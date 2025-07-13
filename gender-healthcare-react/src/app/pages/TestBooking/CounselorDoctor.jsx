import React, { useEffect, useState } from 'react';
import './CounselorDoctor.css';
import { fetchData } from '../LoginRegister/api_register';

export default function CounselorDoctor({ S_Test, S_Doctor, setS_Doctor, S_Slot }) {

    const [Doctor, setDoctor] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const GetDoctor = async () => {
            const token = localStorage.getItem('token');
            try {
                const resultdoctorTestServices = await fetchData('/doctortestservices', token);
                const resultDoctor = await fetchData('/doctors', token);
                console.log('doctorTestServices', resultdoctorTestServices);
                console.log('resultDoctor', resultDoctor.filter(doctor =>
                    resultdoctorTestServices
                        .filter(link => link.testServiceId._id == S_Test?._id)
                        .map(link => link.doctorId._id)
                        .includes(doctor._id)
                ));
                setDoctor(resultDoctor.filter(doctor =>
                    resultdoctorTestServices
                        .filter(link => link.testServiceId._id == S_Test?._id)
                        .map(link => link.doctorId._id)
                        .includes(doctor._id)
                ));
            } catch (error) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        GetDoctor();
    }, [S_Test]);

    return (
        <div className={`counselor-doctor-content booking-content ${(S_Test && !S_Slot) ? '' : 'blured'}`}>
            <h1 className='title'>Choose Your Doctor</h1>
            <p className='script'>Select from our qualified healthcare professionals</p>
            <div className='cards'>
                {Doctor.map((dt, i) => (
                    <div key={i} className='card' style={{ backgroundColor: dt._id == S_Doctor?._id ? '#28a74540' : '' }}>
                        <img src={dt.avatar}></img>
                        <div className='information'>
                            <h3>{dt.name}</h3>
                            <p>{dt.degree}</p>
                            <div className='row1'>
                                <div className='rating'>★★★★★</div>
                                <div className='available'>Available Today</div>
                            </div>
                            <div className='row2'>
                                <i className='fa-regular fa-calendar'></i>
                                <div>Next available: Today</div>
                            </div>
                            <div>{dt.bio}</div>
                        </div>
                        <div className='buttons'>
                            <button className='btn' onClick={() => setS_Doctor(p => p?._id == dt?._id ? null : dt)}>Select</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
