import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  fetchData,
  postData,
  putData,
  deleteData,
} from "../LoginRegister/api_register";
import "../ParameterManager/ManagerStyles.css";
import { 
  TestTube, 
  Plus, 
  Search, 
  Settings, 
  Calendar,
  Eye,
  Filter,
  Database,
  Activity
} from "lucide-react";

export default function TestServiceParameterManager() {
  const [list, setList] = useState([]);
  const [testServices, setTestServices] = useState([]);
  const [parameters, setParameters] = useState([]);
  const [formData, setFormData] = useState({
    testServiceId: "",
    parameterId: "",
  });
  const [editing, setEditing] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchServiceName, setSearchServiceName] = useState("");
  const [searchParameter, setSearchParameter] = useState("");

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchAll = async () => {
      try {
        const [dataList, serviceList, paramList] = await Promise.all([
          fetchData("/testserviceparameters", token),
          fetchData("/testservices", token),
          fetchData("/parameters", token),
        ]);
        setList(dataList);
        setTestServices(serviceList);
        setParameters(paramList);
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

    if (
      list.some(
        (tsp) =>
          tsp.testServiceId._id == formData.testServiceId &&
          tsp.parameterId._id == formData.parameterId
      )
    ) {
      alert("Dịch vụ xét nghiệm đã có thông số này!");
      return;
    }

    const token = localStorage.getItem('token');
    try {
      await postData("/testserviceparameters", token, formData);
      setFormData({ testServiceId: "", parameterId: "" });
      setEditing(null);
      setRefresh((r) => r + 1);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredList = list.filter((item) => {
    const serviceName = item.testServiceId?.name?.toLowerCase() || "";
    const parameterName = item.parameterId?.name?.toLowerCase() || "";
    return (
      serviceName.includes(searchServiceName.toLowerCase()) &&
      parameterName.includes(searchParameter.toLowerCase())
    );
  });

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mb-4"></div>
        <p className="text-gray-600 text-lg font-medium">Loading test services...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl">
              <TestTube className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Test Service Parameter Manager</h1>
              <p className="text-gray-600 text-lg mt-1">Manage test service parameters and configurations</p>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Database className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Configurations</p>
                  <p className="text-2xl font-bold text-gray-900">{list.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <TestTube className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Test Services</p>
                  <p className="text-2xl font-bold text-gray-900">{testServices.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Activity className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Parameters</p>
                  <p className="text-2xl font-bold text-gray-900">{parameters.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add New Configuration Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
            <div className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-white" />
              <h2 className="text-xl font-semibold text-white">Add New Configuration</h2>
            </div>
          </div>
          
          <form className="p-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Test Service
                </label>
                <select
                  required
                  value={formData.testServiceId}
                  onChange={(e) =>
                    setFormData({ ...formData, testServiceId: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-gray-900 bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all duration-200"
                >
                  <option value="">-- Select Test Service --</option>
                  {testServices.map((ts) => (
                    <option key={ts._id} value={ts._id}>
                      {ts.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parameter
                </label>
                <select
                  required
                  value={formData.parameterId}
                  onChange={(e) =>
                    setFormData({ ...formData, parameterId: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-gray-900 bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all duration-200"
                >
                  <option value="">-- Select Parameter --</option>
                  {parameters.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mt-6">
              <button 
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105"
              >
                <Plus className="h-5 w-5 inline mr-2" />
                {editing ? "Update Configuration" : "Add Configuration"}
              </button>
            </div>
          </form>
        </div>

        {/* Search Filters */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-8 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Search & Filter</h3>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by service name..."
                  value={searchServiceName}
                  onChange={(e) => setSearchServiceName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg text-gray-900 bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all duration-200"
                />
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by parameter..."
                  value={searchParameter}
                  onChange={(e) => setSearchParameter(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg text-gray-900 bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all duration-200"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-white" />
                <h3 className="text-xl font-semibold text-white">Service Parameter Configurations</h3>
              </div>
              <span className="px-3 py-1 bg-white/20 text-white rounded-full text-sm font-medium">
                {filteredList.length} configurations
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
                      <TestTube className="h-4 w-4" />
                      Service Name
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Parameter
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Updated
                    </div>
                  </th>
                  <th className="px-6 py-4 texttext-center text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredList.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <TestTube className="h-12 w-12 text-gray-300" />
                        <p className="text-gray-500 text-lg font-medium">No configurations found</p>
                        <p className="text-gray-400">Add a new configuration to get started</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredList
                    .sort((a, b) => {
                      const nameA = a.testServiceId?.name?.toLowerCase() || "";
                      const nameB = b.testServiceId?.name?.toLowerCase() || "";
                      return nameA.localeCompare(nameB);
                    })
                    .map((item, i) => (
                      <tr key={item._id} className="hover:bg-purple-50 transition-colors duration-200 group">
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-600 rounded-full text-sm font-semibold group-hover:bg-purple-200 transition-colors">
                            {i + 1}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span className="font-medium text-gray-900 ">
                              {item.testServiceId?.name || item.testServiceId?._id}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                            {item.parameterId?.name || item.parameterId?._id}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600 font-medium">
                              {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 flex items-center justify-center gap-3">
                          <Link
                            to={`/doctor/testserviceparametermanager/${item.testServiceId?._id}`}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105"
                          >
                            <Eye className="h-4 w-4" />
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Info */}
        {filteredList.length > 0 && (
          <div className="mt-6 text-center text-gray-500">
            <p className="text-sm">
              Showing {filteredList.length} of {list.length} configurations • 
              Use search filters to find specific services or parameters
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
              <h3 className="text-xl font-semibold text-white">Update Configuration</h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Test Service
                  </label>
                  <select
                    required
                    value={formData.testServiceId}
                    onChange={(e) =>
                      setFormData({ ...formData, testServiceId: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-gray-900 bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all duration-200"
                  >
                    {testServices.map((ts) => (
                      <option key={ts._id} value={ts._id}>
                        {ts.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parameter
                  </label>
                  <select
                    required
                    value={formData.parameterId}
                    onChange={(e) =>
                      setFormData({ ...formData, parameterId: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-gray-900 bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all duration-200"
                  >
                    {parameters.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button 
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200"
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