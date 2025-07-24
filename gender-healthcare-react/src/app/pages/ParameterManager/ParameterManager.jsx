import React, { useEffect, useState } from "react";
import {
  fetchData,
  postData,
  putData,
  deleteData,
} from "../LoginRegister/api_register";
import { Link } from "react-router-dom";
import { Search, Plus, Edit3, Trash2, X, Save, Beaker } from "lucide-react";

export default function ParameterManager() {
  const [parameters, setParameters] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    unit: "",
    referenceMin: "",
    referenceMax: "",
  });
  const [editingParam, setEditingParam] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const GetParameter = async () => {
      const token = localStorage.getItem("token");
      try {
        const ParameterData = await fetchData("/parameters", token);
        console.log("ParameterData", ParameterData);
        setParameters(ParameterData);
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    GetParameter();
  }, [refresh]);

  const AddParameter = async (e) => {
    e.preventDefault();
    const AddParameterData = {
      ...formData,
      referenceMin: formData.referenceMin || null,
      referenceMax: formData.referenceMax || null,
    };
    console.log(AddParameterData);
    const token = localStorage.getItem("token");
    try {
      setLoading(true);
      const ParameterData = await postData(`/parameters`, token, AddParameterData);
      console.log("Add result:", ParameterData);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
      setRefresh((p) => p + 1);
    }
  };

  const DeleteParameter = async (id) => {
    const token = localStorage.getItem("token");
    try {
      setLoading(true);
      const ParameterData = await deleteData(`/parameters/${id}`, token);
      console.log("Delete result:", ParameterData);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
      setRefresh((p) => p + 1);
    }
  };

  const EditParameter = async (e) => {
    e.preventDefault();
    const EditParameterData = {
      name: editingParam.name,
      unit: editingParam.unit,
      referenceMin: editingParam.referenceMin || null,
      referenceMax: editingParam.referenceMax || null,
    };
    const token = localStorage.getItem("token");
    try {
      setLoading(true);
      const ParameterData = await putData(
        `/parameters/${editingParam._id}`,
        token,
        EditParameterData
      );
      console.log("Edit result:", ParameterData);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
      setRefresh((p) => p + 1);
    }
  };

  const filteredParametersName = parameters.filter((param) =>
    param.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <Beaker className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          </div>
          <p className="text-slate-600 text-lg font-medium">Loading parameters...</p>
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
              <Beaker className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Parameter Manager</h1>
          </div>
          <p className="text-slate-600">Manage laboratory parameters and their reference ranges</p>
        </div>

        {/* Add Parameter Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-600" />
            Add New Parameter
          </h2>
          
          <form onSubmit={AddParameter} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Parameter Name *</label>
                <input
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="e.g., Glucose"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Unit *</label>
                <input
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="e.g., mg/dL"
                  required
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Reference Min</label>
                <input
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  type="number"
                  placeholder="70"
                  value={formData.referenceMin}
                  onChange={(e) =>
                    setFormData({ ...formData, referenceMin: e.target.value })
                  }
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Reference Max</label>
                <input
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  type="number"
                  placeholder="100"
                  value={formData.referenceMax}
                  onChange={(e) =>
                    setFormData({ ...formData, referenceMax: e.target.value })
                  }
                />
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Save className="w-4 h-4" />
              Save Parameter
            </button>
          </form>
        </div>

        {/* Search and Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          {/* Search Header */}
          <div className="p-6 border-b border-slate-200 bg-slate-50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-xl font-semibold text-slate-900">Parameters List</h2>
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search parameters..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">#</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Parameter Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Unit</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Reference Range</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Last Updated</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredParametersName.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Beaker className="w-12 h-12 text-slate-300" />
                        <p className="text-slate-500 text-lg font-medium">No parameters found</p>
                        <p className="text-slate-400 text-sm">Try adjusting your search criteria</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredParametersName.map((param, index) => (
                    <tr key={param._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-600 font-medium">{index + 1}</td>
                      <td className="px-6 py-4 text-sm text-slate-500 font-mono">{param._id}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900">{param.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                          {param.unit}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <span className="font-medium">
                          {param.referenceMin ?? "N/A"} - {param.referenceMax ?? "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {new Date(param.createdAt).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            className="p-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors group"
                            onClick={() => setEditingParam(param)}
                          >
                            <Edit3 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          </button>
                          <button
                            className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors group"
                            onClick={() => DeleteParameter(param._id)}
                          >
                            <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
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

        {/* Edit Modal */}
        {editingParam && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-blue-600" />
                  Edit Parameter
                </h3>
                <button
                  onClick={() => setEditingParam(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={EditParameter} className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Parameter Name *</label>
                  <input
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={editingParam.name}
                    onChange={(e) =>
                      setEditingParam({ ...editingParam, name: e.target.value })
                    }
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Unit *</label>
                  <input
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={editingParam.unit}
                    onChange={(e) =>
                      setEditingParam({ ...editingParam, unit: e.target.value })
                    }
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Reference Min</label>
                    <input
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      type="number"
                      value={editingParam.referenceMin || ""}
                      onChange={(e) =>
                        setEditingParam({
                          ...editingParam,
                          referenceMin: e.target.value,
                        })
                      }
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Reference Max</label>
                    <input
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      type="number"
                      value={editingParam.referenceMax || ""}
                      onChange={(e) =>
                        setEditingParam({
                          ...editingParam,
                          referenceMax: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setEditingParam(null)}
                    className="px-6 py-2 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium flex items-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
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