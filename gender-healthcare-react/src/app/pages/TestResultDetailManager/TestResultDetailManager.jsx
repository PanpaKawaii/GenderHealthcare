import { useEffect, useState } from 'react';
import { deleteData, fetchData, postData, putData } from '../LoginRegister/api_register';
import '../ParameterManager/ManagerStyles.css';
import { FileSpreadsheet, Clock, Hash, Target } from 'lucide-react';

export default function TestResultDetailManager({ resultId }) {
    const [testResultDetails, setTestResultDetails] = useState([]);
    const [parameters, setParameters] = useState([]);
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
                setTestResultDetails(details.filter(trd => trd.testResultId?._id.toString() === resultId.toString()));
                setParameters(params);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [refresh]);

    const handleBlur = async (id, newValue) => {
        const token = localStorage.getItem('token');
        const detail = testResultDetails.find(d => d._id === id);
        if (!detail || newValue === '' || isNaN(newValue)) return;

        const valueNum = parseFloat(newValue);
        if (valueNum === detail.value) return; // không thay đổi thì không gọi PUT

        try {
            await putData(`/testresultdetails/${id}`, token, {
                testResultId: detail.testResultId._id,
                parameterId: detail.parameterId._id,
                value: valueNum
            });
            // cập nhật lại value mới
            setTestResultDetails(prev =>
                prev.map(d => d._id === id ? { ...d, value: valueNum } : d)
            );
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
                <p className="text-gray-600 text-lg font-medium">Loading test results...</p>
            </div>
        </div>
    );

    return (
        <div className="n bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className=" mx-auto">
                {/* Table Container */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                                    <th className="px-6 py-4 text-left">
                                        <div className="flex items-center gap-2">
                                            <Hash className="h-4 w-4" />
                                            <span className="font-semibold">#</span>
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <div className="flex items-center gap-2">
                                            <Target className="h-4 w-4" />
                                            <span className="font-semibold">Parameter</span>
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold">Value</span>
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            <span className="font-semibold">Created At</span>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {testResultDetails.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <FileSpreadsheet className="h-12 w-12 text-gray-300" />
                                                <p className="text-gray-500 text-lg font-medium">No test results found</p>
                                                <p className="text-gray-400">Test result details will appear here once available</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    testResultDetails.map((item, index) => {
                                        const referenceMin = item.parameterId?.referenceMin;
                                        const referenceMax = item.parameterId?.referenceMax;
                                        const value = item.value;

                                        const isOutOfRange =
                                            typeof value === 'number' &&
                                            (value < referenceMin || value > referenceMax);

                                        return (
                                            <tr
                                                key={item._id}
                                                className={`hover:bg-blue-50 transition-colors duration-200 group ${isOutOfRange ? 'bg-red-50 text-red-700 font-semibold border-l-4 border-red-400' : ''
                                                    }`}
                                            >
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold group-hover:bg-blue-200 transition-colors">
                                                        {index + 1}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                        <span className="font-medium text-gray-900 text-lg">
                                                            {item.parameterId?.name}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="relative">
                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                type="number"
                                                                defaultValue={item.value}
                                                                onBlur={(e) => handleBlur(item._id, e.target.value)}
                                                                className="w-28 px-4 py-2 border-2 border-gray-200 rounded-lg text-lg font-semibold text-gray-900 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 hover:border-gray-300"
                                                                step="any"
                                                            />
                                                            <span className="text-gray-500 font-medium text-sm">{item.parameterId?.unit || ''}</span>
                                                        </div>

                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="h-4 w-4 text-gray-400" />
                                                        <span className="text-gray-600 font-medium">
                                                            {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })

                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
