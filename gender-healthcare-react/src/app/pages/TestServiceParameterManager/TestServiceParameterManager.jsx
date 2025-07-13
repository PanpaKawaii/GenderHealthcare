import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  fetchData,
  postData,
  putData,
  deleteData,
} from "../LoginRegister/api_register";
import "../ParameterManager/ManagerStyles.css";

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

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="container">
      <h2 className="title">🧪 Test Service Parameter Manager</h2>

      <form className="form" onSubmit={handleSubmit}>
        <select
          required
          value={formData.testServiceId}
          onChange={(e) =>
            setFormData({ ...formData, testServiceId: e.target.value })
          }
        >
          <option value="">-- Test Service --</option>
          {testServices.map((ts) => (
            <option key={ts._id} value={ts._id}>
              {ts.name}
            </option>
          ))}
        </select>
        <select
          required
          value={formData.parameterId}
          onChange={(e) =>
            setFormData({ ...formData, parameterId: e.target.value })
          }
        >
          <option value="">-- Parameter --</option>
          {parameters.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>
        <button type="submit">{editing ? "Cập nhật" : "Save"}</button>
      </form>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search Service Name..."
          value={searchServiceName}
          onChange={(e) => setSearchServiceName(e.target.value)}
          className="search-input"
          style={{ marginRight: 10 }}
        />
        <input
          type="text"
          placeholder="Search Parameter..."
          value={searchParameter}
          onChange={(e) => setSearchParameter(e.target.value)}
          className="search-input"
        />
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Service Name</th>
            <th>Parameter</th>
            <th>Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredList.length === 0 ? (
            <tr>
              <td colSpan="5">No data</td>
            </tr>
          ) : (
            filteredList
              .sort((a, b) => {
                const nameA = a.testServiceId?.name?.toLowerCase() || "";
                const nameB = b.testServiceId?.name?.toLowerCase() || "";
                return nameA.localeCompare(nameB);
              })
              .map((item, i) => (
                <tr key={item._id}>
                  <td>{i + 1}</td>
                  <td>{item.testServiceId?.name || item.testServiceId?._id}</td>
                  <td>{item.parameterId?.name || item.parameterId?._id}</td>
                  <td>
                    {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td>
                    <Link
                      to={`/doctor/testserviceparametermanager/${item.testServiceId?._id}`}
                    >
                      <button className="btn detail-btn">Detail</button>
                    </Link>
                  </td>
                </tr>
              ))
          )}
        </tbody>
      </table>

      {editing && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Cập nhật thông số dịch vụ</h3>
            <form onSubmit={handleSubmit}>
              <select
                required
                value={formData.testServiceId}
                onChange={(e) =>
                  setFormData({ ...formData, testServiceId: e.target.value })
                }
              >
                {testServices.map((ts) => (
                  <option key={ts._id} value={ts._id}>
                    {ts.name}
                  </option>
                ))}
              </select>
              <select
                required
                value={formData.parameterId}
                onChange={(e) =>
                  setFormData({ ...formData, parameterId: e.target.value })
                }
              >
                {parameters.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <div className="modal-actions">
                <button type="submit">Save</button>
                <button type="button" onClick={() => setEditing(null)}>
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
