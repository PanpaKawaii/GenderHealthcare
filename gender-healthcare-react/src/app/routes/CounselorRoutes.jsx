import Layout from "../pages/Counselor/pages/Layout";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import CounselorBlog from "../pages/Counselor/pages/Blog";
import CounselorSchedule from "../pages/Counselor/pages/Schedule";
import Login from "../pages/LoginRegister/Login";
import Home from "../pages/Counselor/Home"
import Dashboard from "../pages/Counselor/pages/Dashboard";
import NewBlog from "../pages/Counselor/components/Blog/NewBlog";

export default function CounselorRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/counselorblog" element={<CounselorBlog />} />
          <Route path="/newblog" element={<NewBlog />} />
          <Route path="/counselorschedule" element={<CounselorSchedule />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}
