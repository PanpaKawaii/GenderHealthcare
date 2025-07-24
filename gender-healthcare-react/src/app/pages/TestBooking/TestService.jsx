import React, { useEffect, useState } from 'react';
import './TestService.css';
import { fetchData } from '../LoginRegister/api_register';

export default function TestService({ S_Test, setS_Test, S_Doctor }) {

    const [TestService, setTestService] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const GetTest = async () => {
            const token = localStorage.getItem('token');
            try {
                const result = await fetchData('/testservices', token);
                console.log('resultTestService', result);
                setTestService(result);
            } catch (error) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        GetTest();
    }, []);

    return (
        <div className={`test-service-content booking-content ${!S_Doctor ? '' : 'blured'}`}>
            <h1 className='title'>Tell Us Your Problem</h1>
            <p className='script'>Select from our qualified healthcare test services</p>
            <div className='cards'>
                {TestService.map((ts, i) => (
                    <div key={i} className='card' style={{ backgroundColor: ts._id == S_Test?._id ? '#28a74540' : '' }}>
                        <div className='information'>
                            <h3>{ts.name}</h3>
                            <p>{ts.description}</p>
                            <div>Thời gian xét nghiệm: {ts.processingTime} phút</div>
                            <div>Mẫu xét nghiệm: {ts.sampleType}</div>
                            <div>*{ts.instructions}*</div>
                        </div>
                        <div className='buttons'>
                            <div>{ts.price.toLocaleString('vn')}.000 VND</div>
                            <button className='btn' onClick={() => setS_Test(p => p?._id == ts?._id ? null : ts)}>Select</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
