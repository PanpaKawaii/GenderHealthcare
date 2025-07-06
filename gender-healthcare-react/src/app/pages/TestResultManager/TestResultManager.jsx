import React, { useEffect, useState } from 'react';
import { fetchData, postData, putData, deleteData } from '../LoginRegister/api_register';
import '../ParameterManager/ManagerStyles.css';

export default function TestResultManager() {
    const [testResults, setTestResults] = useState([]);
    const [testBookings, setTestBookings] = useState([]);
    const [formData, setFormData] = useState({ testBookingId: '', resultFile: '', status: 'Negative' });
    const [editing, setEditing] = useState(null);
    const [refresh, setRefresh] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = '';
        const fetchAll = async () => {
            try {
                const [results, bookings] = await Promise.all([
                    fetchData('/testresults', token),
                    fetchData('/testbookings', token),
                ]);
                console.log('testresults', results);
                console.log('bookings', bookings);
                setTestResults(results);
                setTestBookings(bookings);
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
        const token = '';
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
        const token = '';
        if (window.confirm('Bạn có chắc muốn xoá kết quả này?')) {
            try {
                await deleteData(`/testresults/${id}`, token);
                setRefresh(r => r + 1);
            } catch (error) {
                console.error(error);
            }
        }
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="container">
            <h2 className="title">📑 Test Result Manager</h2>

            <form className="form" onSubmit={handleSubmit}>
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
            </form>

            <table className="table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Service Name</th>
                        <th>Patient</th>
                        <th>Result file</th>
                        <th>Status</th>
                        <th>Updated</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {testResults.length === 0 ? (
                        <tr><td colSpan="8">No data</td></tr>
                    ) : (
                        testResults.map((res, i) => (
                            <tr key={res._id}>
                                <td>{i + 1}</td>
                                <td>{res.testBookingId?.testServiceId?.name || 'N/A'}</td>
                                <td>{res.testBookingId?.customerId?.accountId?.name || 'N/A'}</td>
                                <td>{res.resultFile}</td>
                                <td>{res.status}</td>
                                <td>{new Date(res.resultDate).toLocaleDateString('vi-VN')}</td>
                                <td>
                                    <button onClick={() => {
                                        setEditing(res);
                                        setFormData({
                                            testBookingId: res.testBookingId?._id,
                                            resultFile: res.resultFile,
                                            status: res.status
                                        });
                                    }}>Edit</button>
                                    <button onClick={() => handleDelete(res._id)}>Delete</button>
                                </td>
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
                            <select required value={formData.testBookingId} onChange={e => setFormData({ ...formData, testBookingId: e.target.value })}>
                                {testBookings.map(b => (
                                    <option key={b._id} value={b._id}>{b._id} - {b.customerId?.accountId?.name || 'N/A'}</option>
                                ))}
                            </select>
                            <input value={formData.resultFile} onChange={(e) => setFormData({ ...formData, resultFile: e.target.value })} required />
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
