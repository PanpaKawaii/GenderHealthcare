import Layout from "../pages/Counselor/pages/Layout";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import CounselorBlog from "../pages/Counselor/pages/Blog";
import CounselorSchedule from "../pages/Counselor/pages/Schedule";
import Login from "../pages/LoginRegister/Login";
import Home from "../pages/Counselor/Home"
import Dashboard from "../pages/Counselor/pages/Dashboard";
import NewBlog from "../pages/Counselor/components/Blog/NewBlog";
import EditBlog from "../pages/Counselor/components/Blog/EditBlog";
import BlogDetail from "../pages/blog/components/BlogDetail";


export default function CounselorRoutes() {
  return (
    <BrowserRouter>
      <Routes>
         <Route path="/login" element={<Login />} />
        <Route path="counselor" element={<Layout />}>
          <Route path="blog" element={<CounselorBlog />} />
          <Route path="blog/:id" element={<BlogDetail />} />
          <Route path="newblog" element={<NewBlog />} />
          <Route path="editblog/:id" element={<EditBlog />} />
          <Route path="schedule" element={<CounselorSchedule />} />
          <Route path="" element={<Home />} />
        </Route>
        <Route path="*" element={<Navigate to="/counselor" replace />} />

      </Routes>
    </BrowserRouter>
  );
}
