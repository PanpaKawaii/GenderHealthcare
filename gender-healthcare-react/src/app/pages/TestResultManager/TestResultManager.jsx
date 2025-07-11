import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchData, postData, putData, deleteData } from '../LoginRegister/api_register';
import TestResultDetailManager from '../TestResultDetailManager/TestResultDetailManager';
import '../ParameterManager/ManagerStyles.css';
import TestResults from '../ProfilePage/TestResult';

export default function TestResultManager() {
    const param = useParams();
    const resultId = param?.id;

    const [testResults, setTestResults] = useState([]);
    const [testBookings, setTestBookings] = useState([]);
    const [testServiceParameters, setTestServiceParameters] = useState([]);
    const [formData, setFormData] = useState({ testBookingId: '', resultFile: '', status: 'Negative' });
    const [editing, setEditing] = useState(null);
    const [refresh, setRefresh] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const fetchAll = async () => {
            try {
                const [TestResult, TestBooking, TestServiceParameter] = await Promise.all([
                    fetchData('/testresults', token),
                    fetchData('/testbookings', token),
                    fetchData('/testserviceparameters', token),
                ]);
                // console.log('TestResult', TestResult);
                console.log('TestResult', TestResult.filter(r => r._id === resultId));
                console.log('TestBooking', TestBooking);
                console.log('TestServiceParameter', TestServiceParameter);
                console.log('=============================');


                setTestResults(TestResult.filter(r => r._id === resultId));
                setTestBookings(TestBooking);
                setTestServiceParameters(TestServiceParameter);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [refresh]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            if (editing) {
                await putData(`/testresults/${editing._id}`, token, formData);
            } else {
                await postData('/testresults', token, formData);
            }
            setFormData({ testBookingId: '', resultFile: '', status: 'Negative' });
            setEditing(null);
            setRefresh(r => r + 1);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        if (window.confirm('Bạn có chắc muốn xoá kết quả này?')) {
            try {
                await deleteData(`/testresults/${id}`, token);
                setRefresh(r => r + 1);
            } catch (error) {
                console.error(error);
            }
        }
    };

    const doctorTestServiceId = testResults[0]?.testBookingId?.doctorTestServiceId;
    // console.log('doctorTestServiceId', doctorTestServiceId);
    const testServiceId = testBookings.find(tb => tb.doctorTestServiceId?._id == doctorTestServiceId)?.doctorTestServiceId?.testServiceId
    // console.log('testServiceId', testServiceId);
    const Parameter = testServiceParameters.filter(tsp => tsp.testServiceId?._id == testServiceId);
    // console.log('Parameter', Parameter);


    const testBookingId = testResults[0]?.testBookingId?._id;
    console.log('testBookingId', testBookingId);
    const ServiceName = testServiceParameters.find(tsp => tsp.testServiceId?._id == testServiceId)?.testServiceId?.name;
    console.log('ServiceName', ServiceName);


    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="container">
            <h2 className="title">📑 Test Result Manager</h2>

            {/* <form className="form" onSubmit={handleSubmit}>
                <select required value={formData.testBookingId} onChange={e => setFormData({ ...formData, testBookingId: e.target.value })}>
                    <option value=''>-- Test Service --</option>
                    {testBookings.map(b => (
                        <option key={b._id} value={b._id}>{b._id} - {b.customerId?.accountId?.name || 'N/A'}</option>
                    ))}
                </select>
                <input type="text" placeholder="Result file" required value={formData.resultFile} onChange={e => setFormData({ ...formData, resultFile: e.target.value })} />
                <select required value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                    <option value="Negative">Negative</option>
                    <option value="Positive">Positive</option>
                </select>
                <button type="submit">{editing ? 'Cập nhật' : 'Save'}</button>
            </form> */}

            <table className="table">
                <thead>
                    <tr>
                        {/* <th>#</th> */}
                        <th>Service Name</th>
                        {/* <th>Patient</th> */}
                        <th>Result file</th>
                        <th>Status</th>
                        <th>Updated</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {testResults.length === 0 ? (
                        <tr><td colSpan='7'><i>No data</i></td></tr>
                    ) : (
                        testResults.map((res, i) => (
                            <tr key={res._id}>
                                {/* <td>{i + 1}</td> */}
                                <td>{ServiceName || 'N/A'}</td>
                                {/* <td>{res.testBookingId?.testServiceId?.name || 'N/A'}</td> */}
                                {/* <td>{res.testBookingId?.customerId?.accountId?.name || 'N/A'}</td> */}
                                <td>{res.resultFile ? res.resultFile : <i>No file</i>}</td>
                                <td>{res.status}</td>
                                <td>{new Date(res.resultDate).toLocaleDateString('vi-VN')}</td>
                                <td>
                                    <div className='btn-box'>
                                        <button className='btn' onClick={() => {
                                            setEditing(res);
                                            setFormData({
                                                testBookingId: res.testBookingId?._id,
                                                resultFile: res.resultFile,
                                                status: res.status
                                            });
                                        }}>Edit</button>
                                        {/* <button className='btn dlt-btn' onClick={() => handleDelete(res._id)}>Delete</button> */}
                                        {/* <button className='btn add-btn' onClick={() => setRefresh(p => p + 1)}>Refresh</button> */}
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <TestResultDetailManager resultId={resultId} />

            <table className="table small-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Parameter Name</th>
                        <th>Unit</th>
                        <th>Reference</th>
                    </tr>
                </thead>
                <tbody>
                    {Parameter.length === 0 ? (
                        <tr><td colSpan='6'><i>No data</i></td></tr>
                    ) : (
                        Parameter.map((para, i) => (
                            <tr key={i}>
                                <td>{i + 1}</td>
                                <td>{para.parameterId?.name || 'N/A'}</td>
                                <td>{para.parameterId?.unit || 'N/A'}</td>
                                <td>{para.parameterId?.referenceMin} - {para.parameterId?.referenceMax}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {editing && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Cập nhật kết quả</h3>
                        <form onSubmit={handleSubmit}>
                            {/* <select required value={formData.testBookingId} onChange={e => setFormData({ ...formData, testBookingId: e.target.value })}>
                                {testBookings.map(b => (
                                    <option key={b._id} value={b._id}>{b._id} - {b.customerId?.accountId?.name || 'N/A'}</option>
                                ))}
                            </select> */}
                            <input value={formData.resultFile} placeholder='Result file' onChange={(e) => setFormData({ ...formData, resultFile: e.target.value })} required />
                            <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} required>
                                <option value="Negative">Negative</option>
                                <option value="Positive">Positive</option>
                            </select>
                            <div className="modal-actions">
                                <button type="submit">Save</button>
                                <button type="button" onClick={() => setEditing(null)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
