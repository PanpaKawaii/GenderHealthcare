import Layout from "../pages/DoctorRole/Layout";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "../pages/LoginRegister/Login";
import Home from "../pages/DoctorRole/Home";
import ParameterManager from "../pages/ParameterManager/ParameterManager";
import TestBookingManager from "../pages/TestBookingManager/TestBookingManager";
import TestServiceParameterManager from "../pages/TestServiceParameterManager/TestServiceParameterManager";
import TestResultManager from "../pages/TestResultManager/TestResultManager";
import TestServiceParameterDetail from "../pages/TestServiceParameterManager/TestServiceParameterDetail/TestServiceParameterDetail";

export default function DoctorRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/doctor" replace />} />{" "}
        {/* Thêm dòng này */}
        <Route path="/login" element={<Login />} />
        <Route path="doctor" element={<Layout />}>
          <Route index element={<ParameterManager />} />
          <Route path="parametermanager" element={<ParameterManager />} />
          <Route path="testbookingmanager" element={<TestBookingManager />} />
          <Route path="testresultmanager/:id" element={<TestResultManager />} />
          <Route
            path="testserviceparametermanager"
            element={<TestServiceParameterManager />}
          />
          <Route
            path="testserviceparametermanager/:id"
            element={<TestServiceParameterDetail />}
          />
          <Route path="*" element={<Navigate to="/doctor" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
