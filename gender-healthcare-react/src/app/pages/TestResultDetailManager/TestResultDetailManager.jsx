import { useEffect, useState } from 'react';
import { deleteData, fetchData, postData, putData } from '../LoginRegister/api_register';
import '../ParameterManager/ManagerStyles.css';

export default function TestResultDetailManager({ resultId }) {
    const [testResultDetails, setTestResultDetails] = useState([]);
    const [parameters, setParameters] = useState([]);

    const [formData, setFormData] = useState({ testResultId: '', parameterId: '', value: '' });
    const [editing, setEditing] = useState(null);
    const [refresh, setRefresh] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            const token = localStorage.getItem('token');
            try {
                const [details, params] = await Promise.all([
                    fetchData('/testresultdetails', token),
                    fetchData('/parameters', token),
                ]);
                console.log('details', details);

                setTestResultDetails(details.filter(trd => trd.testResultId?._id.toString() == resultId.toString()));
                setParameters(params);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [refresh]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const payload = {
            ...formData,
            value: parseFloat(formData.value)
        };

        try {
            if (editing) {
                await putData(`/testresultdetails/${editing._id}`, token, payload);
            } else {
                await postData('/testresultdetails', token, payload);
            }
            setFormData({ testResultId: '', parameterId: '', value: '' });
            setEditing(null);
            setRefresh(r => r + 1);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        if (window.confirm('Bạn có chắc muốn xoá chi tiết này?')) {
            await deleteData(`/testresultdetails/${id}`, token);
            setRefresh(r => r + 1);
        }
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div>
            {/* <h2 className="title">📑 Test Result Detail Manager</h2> */}

            {/* <form className="form" onSubmit={handleSubmit}>
                <select required value={formData.testResultId} onChange={e => setFormData({ ...formData, testResultId: e.target.value })}>
                    <option value="">-- Test Service --</option>
                    {testResults.map(res => (
                        <option key={res._id} value={res._id}>
                            {res.testBookingId?._id} - {res.status} - {res.testBookingId?.customerId?.accountId?.name}
                        </option>
                    ))}
                </select>
                <select required value={formData.parameterId} onChange={e => setFormData({ ...formData, parameterId: e.target.value })}>
                    <option value="">-- Parameter --</option>
                    {parameters.map(p => (
                        <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                </select>
                <input type="number" placeholder="Value" required value={formData.value} onChange={e => setFormData({ ...formData, value: e.target.value })} />
                <button type="submit">{editing ? 'Update' : 'Save'}</button>
            </form> */}

            <table className="table">
                <thead>
                    <tr>
                        <th>#</th>
                        {/* <th>Service Name</th> */}
                        {/* <th>Patient</th> */}
                        <th>Parameter</th>
                        <th>Value</th>
                        <th>Created At</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {testResultDetails.length === 0 ? (
                        <tr><td colSpan="7">No data</td></tr>
                    ) : (
                        testResultDetails.map((item, index) => (
                            <tr key={item._id}>
                                <td>{index + 1}</td>
                                {/* <td>{item.testResultId?.testBookingId?.testServiceId?.name || 'N/A'}</td> */}
                                {/* <td>{item.testResultId?.testBookingId?.customerId?.accountId?.name || 'N/A'}</td> */}
                                <td>{item.parameterId?.name}</td>
                                <td>{item.value}</td>
                                <td>{new Date(item.createdAt).toLocaleDateString('vi-VN')}</td>
                                <td>
                                    <div className='btn-box'>
                                        <button className='btn' onClick={() => {
                                            setEditing(item);
                                            setFormData({
                                                testResultId: item.testResultId?._id,
                                                parameterId: item.parameterId?._id,
                                                value: item.value
                                            });
                                        }}>Edit</button>
                                        {/* <button className='btn dlt-btn' onClick={() => handleDelete(item._id)}>Delete</button> */}
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {editing && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Cập nhật chi tiết kết quả</h3>
                        <form onSubmit={handleSubmit}>
                            {/* <select required value={formData.testResultId} onChange={e => setFormData({ ...formData, testResultId: e.target.value })}>
                                {testResults.map(res => (
                                    <option key={res._id} value={res._id}>
                                        {res.testBookingId?._id} - {res.status}
                                    </option>
                                ))}
                            </select> */}
                            {/* <select required value={formData.parameterId} onChange={e => setFormData({ ...formData, parameterId: e.target.value })} disabled>
                                {parameters.map(p => (
                                    <option key={p._id} value={p._id}>{p.name}</option>
                                ))}
                            </select> */}
                            <input type="text" value={parameters.find(p => p._id == formData.parameterId)?.name} disabled />
                            <input type="number" value={formData.value} placeholder='Value' onChange={(e) => setFormData({ ...formData, value: e.target.value })} required />
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
