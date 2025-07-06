import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchData, postData, putData, deleteData } from '../../LoginRegister/api_register';
import '../../ParameterManager/ManagerStyles.css';

export default function TestServiceParameterDetail() {
    const { id } = useParams(); // lấy testServiceId từ URL
    const [service, setService] = useState(null);
    const [assignedParams, setAssignedParams] = useState([]);
    const [allParams, setAllParams] = useState([]);
    const [formData, setFormData] = useState({ parameterId: '' });
    const [editing, setEditing] = useState(null);
    const [refresh, setRefresh] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = '';
        const fetchAll = async () => {
            try {
                const [testservice, parameters, testserviceparameters] = await Promise.all([
                    fetchData(`/testservices/${id}`, token),
                    fetchData('/parameters', token),
                    fetchData('/testserviceparameters', token),
                ]);
                // const relatedParameters = parameters.filter(param =>
                //     testserviceparameters.some(tsp =>
                //         tsp.testServiceId._id == testservice._id && tsp.parameterId._id == param._id
                //     )
                // );
                const relatedParameters = testserviceparameters.filter(tsp =>
                    tsp.testServiceId._id == testservice._id
                );
                console.log('testservice, parameters, testserviceparameters', testservice, parameters, testserviceparameters);
                console.log('relatedParameters', relatedParameters);


                setService(testservice);
                setAllParams(parameters);
                setAssignedParams(relatedParameters);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [id, refresh]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = '';
        const payload = { testServiceId: id, parameterId: formData.parameterId };
        if (assignedParams.some(
            tsp => tsp.testServiceId._id == service._id && tsp.parameterId._id == formData.parameterId
        )) {
            alert('Dịch vụ xét nghiệm đã có thông số này!');
            return;
        }
        try {
            if (editing) {
                await putData(`/testserviceparameters/${editing._id}`, token, payload);
            } else {
                await postData('/testserviceparameters', token, payload);
            }
            setFormData({ parameterId: '' });
            setEditing(null);
            setRefresh(r => r + 1);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (paramId) => {
        const token = '';
        console.log('paramId', paramId);

        if (window.confirm('Xoá thông số này khỏi dịch vụ?')) {
            await deleteData(`/testserviceparameters/${paramId}`, token);
            setRefresh(r => r + 1);
        }
    };

    console.log('assignedParams', assignedParams);


    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="container">
            <h2 className="title">🔬 Chi tiết dịch vụ: {service?.name}</h2>

            <form className="form" onSubmit={handleSubmit}>
                <select required value={formData.parameterId} onChange={(e) => setFormData({ parameterId: e.target.value })}>
                    <option value="">-- Chọn thông số --</option>
                    {allParams.map(p => (
                        <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                </select>
                <button type="submit">{editing ? 'Cập nhật' : 'Thêm'}</button>
            </form>

            <table className="table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Thông số</th>
                        <th>Đơn vị</th>
                        <th>Tham chiếu</th>
                        <th>Ngày tạo</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {assignedParams.length === 0 ? (
                        <tr><td colSpan="6">Không có dữ liệu</td></tr>
                    ) : (
                        assignedParams.map((item, index) => (
                            <tr key={item._id}>
                                <td>{index + 1}</td>
                                <td>{item.parameterId?.name}</td>
                                <td>{item.parameterId?.unit}</td>
                                <td>{item.parameterId?.referenceMin ?? 'N/A'} - {item.parameterId?.referenceMax ?? 'N/A'}</td>
                                <td>{new Date(item.createdAt).toLocaleDateString('vi-VN')}</td>
                                <td>
                                    <button onClick={() => {
                                        setEditing(item);
                                        setFormData({ parameterId: item.parameterId?._id });
                                    }}>Edit</button>
                                    <button className='dlt-btn' onClick={() => handleDelete(item._id)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {editing && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Cập nhật thông số</h3>
                        <form onSubmit={handleSubmit}>
                            <select required value={formData.parameterId} onChange={(e) => setFormData({ parameterId: e.target.value })}>
                                {allParams.map(p => (
                                    <option key={p._id} value={p._id}>{p.name}</option>
                                ))}
                            </select>
                            <div className="modal-actions">
                                <button type="submit">Lưu</button>
                                <button type="button" onClick={() => setEditing(null)}>Huỷ</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

