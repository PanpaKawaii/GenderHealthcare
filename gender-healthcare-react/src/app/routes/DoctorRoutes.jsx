import Layout from "../pages/DoctorRole/Layout";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import CounselorBlog from "../pages/DoctorRole/pages/Blog";
import CounselorSchedule from "../pages/DoctorRole/pages/Schedule";
import Login from "../pages/LoginRegister/Login";
import Home from "../pages/DoctorRole/Home"
import Dashboard from "../pages/DoctorRole/pages/Dashboard";
import NewBlog from "../pages/DoctorRole/components/Blog/NewBlog";
import EditBlog from "../pages/DoctorRole/components/Blog/EditBlog";
import BlogDetail from "../pages/blog/components/BlogDetail";


export default function CounselorRoutes() {
  return (
    <BrowserRouter>
      <Routes>
         <Route path="/login" element={<Login />} />
        <Route path="doctor" element={<Layout />}>
          <Route path="blog" element={<CounselorBlog />} />
          <Route path="blog/:id" element={<BlogDetail />} />
          <Route path="newblog" element={<NewBlog />} />
          <Route path="editblog/:id" element={<EditBlog />} />
          <Route path="schedule" element={<CounselorSchedule />} />
          <Route path="" element={<Home />} />
        </Route>
        <Route path="*" element={<Navigate to="/doctor" replace />} />

      </Routes>
    </BrowserRouter>
  );
}
