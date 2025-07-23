import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchData, postData, putData, deleteData } from '../LoginRegister/api_register';
import TestResultDetailManager from '../TestResultDetailManager/TestResultDetailManager';
import TestResults from '../ProfilePage/TestResult';
import { FileText, Edit3, X, Save, TestTube, Activity, Beaker, ClipboardList } from 'lucide-react';

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

    const doctorTestServiceId = testResults[0]?.testBookingId?.doctorTestServiceId._id || testResults[0]?.testBookingId?.doctorTestServiceId;
    // console.log('doctorTestServiceId', doctorTestServiceId);
    const testServiceId = testBookings.find(tb => tb.doctorTestServiceId?._id == doctorTestServiceId?.toString())?.doctorTestServiceId?.testServiceId._id
    // console.log('testServiceId', testServiceId);
    const Parameter = testServiceParameters.filter(tsp => tsp.testServiceId?._id.toString() == testServiceId.toString());
    // console.log('Parameter', Parameter);


    const testBookingId = testResults[0]?.testBookingId?._id;
    console.log('testBookingId', testBookingId);
    const ServiceName = testServiceParameters.find(tsp => tsp.testServiceId?._id?.toString() == testServiceId?.toString())?.testServiceId?.name || 'N/A';
    console.log('ServiceName', ServiceName);

    const getStatusBadge = (status) => {
        const statusConfig = {
            'Pending': 'bg-amber-100 text-amber-800 border-amber-200',
            'Negative': 'bg-green-100 text-green-800 border-green-200',
            'Positive': 'bg-red-100 text-red-800 border-red-200'
        };
        return statusConfig[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-pulse">
                        <TestTube className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    </div>
                    <p className="text-slate-600 text-lg font-medium">Loading test results...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-600 rounded-lg">
                            <FileText className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900">Test Result Manager</h1>
                    </div>
                    <p className="text-slate-600">Manage and review laboratory test results</p>
                </div>

                {/* Test Results Section */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden mb-8">
                    <div className="p-6 border-b border-slate-200 bg-slate-50">
                        <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-blue-600" />
                            Test Results Overview
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Service Name</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-4 h-4" />
                                            Result File
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Updated</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {testResults.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <TestTube className="w-12 h-12 text-slate-300" />
                                                <p className="text-slate-500 text-lg font-medium">No test results found</p>
                                                <p className="text-slate-400 text-sm">No data available</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    testResults.map((res, i) => (
                                        <tr key={res._id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                                                <div className="flex items-center gap-2">
                                                    <Beaker className="w-4 h-4 text-blue-600" />
                                                    {ServiceName || 'N/A'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                {res.resultFile ? (
                                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                                        {res.resultFile}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400 italic">No file</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(res.status)}`}>
                                                    {res.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500">
                                                {new Date(res.resultDate).toLocaleDateString('vi-VN')}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center">
                                                    <button
                                                        className="p-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors group"
                                                        onClick={() => {
                                                            setEditing(res);
                                                            setFormData({
                                                                testBookingId: res.testBookingId?._id,
                                                                resultFile: res.resultFile,
                                                                status: res.status
                                                            });
                                                        }}
                                                    >
                                                        <Edit3 className="w-4 h-4 group-hover:scale-110 transition-transform" />
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

                {/* Test Result Detail Manager Component */}
                <div className="mb-8">
                    <TestResultDetailManager resultId={resultId} />
                </div>

                {/* Parameters Reference Section */}
                {/* <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-200 bg-slate-50">
                        <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                            <ClipboardList className="w-5 h-5 text-blue-600" />
                            Test Parameters Reference
                        </h2>
                        <p className="text-slate-600 text-sm mt-1">Reference ranges for test parameters</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">#</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Parameter Name</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Unit</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Reference Range</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {Parameter.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <ClipboardList className="w-12 h-12 text-slate-300" />
                                                <p className="text-slate-500 text-lg font-medium">No parameters found</p>
                                                <p className="text-slate-400 text-sm">No data available</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    Parameter.map((para, i) => (
                                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 text-sm text-slate-600 font-medium">{i + 1}</td>
                                            <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                                    {para.parameterId?.name || 'N/A'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                                    {para.parameterId?.unit || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                                                <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-lg text-xs">
                                                    {para.parameterId?.referenceMin} - {para.parameterId?.referenceMax}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div> */}

                {/* Edit Modal */}
                {editing && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b border-slate-200">
                                <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                                    <Edit3 className="w-5 h-5 text-blue-600" />
                                    Cập nhật kết quả
                                </h3>
                                <button
                                    onClick={() => setEditing(null)}
                                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-slate-500" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-slate-500" />
                                        Result file
                                    </label>
                                    <input
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="Enter result file path or name"
                                        value={formData.resultFile}
                                        onChange={(e) => setFormData({ ...formData, resultFile: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                        <Activity className="w-4 h-4 text-slate-500" />
                                        Status
                                    </label>
                                    <select
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        required
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Negative">Negative</option>
                                        <option value="Positive">Positive</option>
                                    </select>
                                </div>

                                {/* Modal Footer */}
                                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                                    <button
                                        type="button"
                                        onClick={() => setEditing(null)}
                                        className="px-6 py-2 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium flex items-center gap-2 shadow-lg hover:shadow-xl"
                                    >
                                        <Save className="w-4 h-4" />
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}