import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Layout from "../pages/ForumPage/ForumComponents/Layout/Layout";
import ForumPage from "../pages/ForumPage/ForumPage";
import Login from "../pages/LoginRegister/Login";
import Register from "../pages/LoginRegister/Register";
import HomePage from "../pages/Home/HomePage";
import DashboardDoctor from "../pages/Dashboard/DashboardDoctor";

export default function MainRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forum" element={<ForumPage />} />
          <Route
            path="/profile"
            element={<div>Profile Page (Coming Soon)</div>}
          />
        </Route>
        <Route path="/dashboardDoctor" element={<DashboardDoctor />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
