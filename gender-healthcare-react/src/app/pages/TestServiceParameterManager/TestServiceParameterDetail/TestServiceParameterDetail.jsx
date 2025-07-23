import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchData, postData, putData, deleteData } from '../../LoginRegister/api_register';
import '../../ParameterManager/ManagerStyles.css';
import { 
  Microscope, 
  Plus, 
  Edit3, 
  Trash2, 
  Calendar,
  Activity,
  Target,
  Ruler,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

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
        const token = localStorage.getItem('token');
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
        const token = localStorage.getItem('token');
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
        const token = localStorage.getItem('token');
        console.log('paramId', paramId);

        if (window.confirm('Xoá thông số này khỏi dịch vụ?')) {
            await deleteData(`/testserviceparameters/${paramId}`, token);
            setRefresh(r => r + 1);
        }
    };

    console.log('assignedParams', assignedParams);

    if (loading) return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent mb-4"></div>
                <p className="text-gray-600 text-lg font-medium">Loading service details...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <button className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                            <ArrowLeft className="h-5 w-5 text-gray-600" />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl">
                                <Microscope className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-gray-900">Service Details</h1>
                                <p className="text-emerald-600 text-xl font-semibold mt-1">{service?.name}</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Service Info Card */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-emerald-100 rounded-lg">
                                    <Target className="h-6 w-6 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Service Name</p>
                                    <p className=" font-bold text-gray-900">{service?.name}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <Activity className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Active Parameters</p>
                                    <p className="text-lg font-bold text-gray-900">{assignedParams.length}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-purple-100 rounded-lg">
                                    <CheckCircle2 className="h-6 w-6 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Status</p>
                                    <p className="text-lg font-bold text-emerald-600">Active</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Add Parameter Form */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-8 overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
                        <div className="flex items-center gap-2">
                            <Plus className="h-5 w-5 text-white" />
                            <h2 className="text-xl font-semibold text-white">
                                {editing ? 'Update Parameter' : 'Add New Parameter'}
                            </h2>
                        </div>
                    </div>
                    
                    <form className="p-6" onSubmit={handleSubmit}>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Parameter
                                </label>
                                <select 
                                    required 
                                    value={formData.parameterId} 
                                    onChange={(e) => setFormData({ parameterId: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-gray-900 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all duration-200"
                                >
                                    <option value="">-- Choose Parameter --</option>
                                    {allParams.map(p => (
                                        <option key={p._id} value={p._id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-end">
                                <button 
                                    type="submit"
                                    className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105"
                                >
                                    <Plus className="h-5 w-5 inline mr-2" />
                                    {editing ? 'Update' : 'Add Parameter'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Parameters Table */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Activity className="h-5 w-5 text-white" />
                                <h3 className="text-xl font-semibold text-white">Service Parameters</h3>
                            </div>
                            <span className="px-3 py-1 bg-white/20 text-white rounded-full text-sm font-medium">
                                {assignedParams.length} parameters
                            </span>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">#</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                        <div className="flex items-center gap-2">
                                            <Target className="h-4 w-4" />
                                            Parameter Name
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                        <div className="flex items-center gap-2">
                                            <Ruler className="h-4 w-4" />
                                            Unit
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                        Reference Range
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            Created
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-sm text-center font-semibold text-gray-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {assignedParams.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <Activity className="h-12 w-12 text-gray-300" />
                                                <p className="text-gray-500 text-lg font-medium">No parameters assigned</p>
                                                <p className="text-gray-400">Add parameters to configure this test service</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    assignedParams.map((item, index) => (
                                        <tr key={item._id} className="hover:bg-emerald-50 transition-colors duration-200 group">
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center justify-center w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full text-sm font-semibold group-hover:bg-emerald-200 transition-colors">
                                                    {index + 1}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                                    <span className="font-medium text-gray-900 ">
                                                        {item.parameterId?.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                                    {item.parameterId?.unit || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm font-medium">
                                                        {item.parameterId?.referenceMin ?? 'N/A'}
                                                    </span>
                                                    <span className="text-gray-400">-</span>
                                                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm font-medium">
                                                        {item.parameterId?.referenceMax ?? 'N/A'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-gray-400" />
                                                    <span className="text-gray-600 font-medium">
                                                        {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 flex justify-center items-center">
                                                <div className="flex items-center  gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setEditing(item);
                                                            setFormData({ parameterId: item.parameterId?._id });
                                                        }}
                                                        className="inline-flex items-center gap-1 px-3 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105"
                                                    >
                                                        <Edit3 className="h-4 w-4" />
                                                        Edit
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(item._id)}
                                                        className="inline-flex items-center gap-1 px-3 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer Info */}
                {assignedParams.length > 0 && (
                    <div className="mt-6 text-center text-gray-500">
                        <p className="text-sm">
                            Managing {assignedParams.length} parameter{assignedParams.length !== 1 ? 's' : ''} for {service?.name} • 
                            Edit or remove parameters as needed
                        </p>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {editing && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
                            <h3 className="text-xl font-semibold text-white">Update Parameter</h3>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Parameter
                                </label>
                                <select 
                                    required 
                                    value={formData.parameterId} 
                                    onChange={(e) => setFormData({ parameterId: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-gray-900 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all duration-200"
                                >
                                    {allParams.map(p => (
                                        <option key={p._id} value={p._id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="flex gap-3">
                                <button 
                                    type="submit"
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200"
                                >
                                    Save Changes
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setEditing(null)}
                                    className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                /* Custom scrollbar for the table */
                .overflow-x-auto::-webkit-scrollbar {
                    height: 8px;
                }

                .overflow-x-auto::-webkit-scrollbar-track {
                    background: #f1f5f9;
                    border-radius: 4px;
                }

                .overflow-x-auto::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 4px;
                }

                .overflow-x-auto::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
            `}</style>
        </div>
    );
}