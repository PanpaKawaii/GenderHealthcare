import React, { useEffect, useState } from "react";
import {
  fetchData,
  postData,
  putData,
  deleteData,
} from "../LoginRegister/api_register";
import "./ManagerStyles.css";

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
      const token = "";
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
    const token = "";
    try {
      setLoading(true);
      const ParameterData = await postData(
        `/parameters`,
        token,
        AddParameterData
      );
      console.log("Add result:", ParameterData);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
      setRefresh((p) => p + 1);
    }
  };

  const DeleteParameter = async (id) => {
    const token = "";
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
    const token = "";
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

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="container">
      <h2 className="title">🧪 Parameter Manager</h2>
      <form className="form" onSubmit={AddParameter}>
        <input
          placeholder="Name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          placeholder="Unit"
          required
          value={formData.unit}
          onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
        />
        <input
          type="number"
          placeholder="Reference Min"
          value={formData.referenceMin}
          onChange={(e) =>
            setFormData({ ...formData, referenceMin: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Reference Max"
          value={formData.referenceMax}
          onChange={(e) =>
            setFormData({ ...formData, referenceMax: e.target.value })
          }
        />
        <button type="submit">Save</button>
      </form>

      <input
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Id</th>
            <th>Name</th>
            <th>Unit</th>
            <th>Reference</th>
            <th>Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredParametersName.length === 0 ? (
            <tr>
              <td colSpan="7">No data</td>
            </tr>
          ) : (
            filteredParametersName.map((param, index) => (
              <tr key={param._id}>
                <td>{index + 1}</td>
                <td>{param._id}</td>
                <td>{param.name}</td>
                <td>{param.unit}</td>
                <td>
                  {param.referenceMin ?? "N/A"} - {param.referenceMax ?? "N/A"}
                </td>
                <td>{new Date(param.createdAt).toLocaleDateString("vi-VN")}</td>
                <td>
                  <div className="btn-box">
                    <button className="btn" onClick={() => setEditingParam(param)}>Edit</button>
                    <button className="btn dlt-btn" onClick={() => DeleteParameter(param._id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {editingParam && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Cập nhật thông số</h3>
            <form onSubmit={EditParameter}>
              <input
                value={editingParam.name}
                onChange={(e) =>
                  setEditingParam({ ...editingParam, name: e.target.value })
                }
                required
              />
              <input
                value={editingParam.unit}
                onChange={(e) =>
                  setEditingParam({ ...editingParam, unit: e.target.value })
                }
                required
              />
              <input
                type="number"
                value={editingParam.referenceMin || ""}
                onChange={(e) =>
                  setEditingParam({
                    ...editingParam,
                    referenceMin: e.target.value,
                  })
                }
              />
              <input
                type="number"
                value={editingParam.referenceMax || ""}
                onChange={(e) =>
                  setEditingParam({
                    ...editingParam,
                    referenceMax: e.target.value,
                  })
                }
              />
              <div className="modal-actions">
                <button type="submit">Save</button>
                <button type="button" onClick={() => setEditingParam(null)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
