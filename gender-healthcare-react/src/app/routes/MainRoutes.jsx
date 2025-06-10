import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Layout from "../pages/ForumPage/ForumComponents/Layout/Layout";
import ForumPage from "../pages/ForumPage/ForumPage";
import Login from "../pages/LoginRegister/Login";
import Register from "../pages/LoginRegister/Register";
import Blog from '../pages/blog/Blog';
import BlogDetail from '../pages/blog/components/BlogDetail';
import CounselorBlog from '../pages/Counselor/Content/Blog'
import CounselorSchedule from '../pages/Counselor/Content/Schedule'
import HomePage from "../pages/Home/HomePage";
import DashboardDoctor from "../pages/Dashboard/DashboardDoctor";



export default function MainRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/forum" element={<ForumPage />} />
          <Route path='/blog' element={<Blog />} />
          <Route path='/blog/:id' element={<BlogDetail />} />
          <Route
            path="/profile"
            element={<div>Profile Page (Coming Soon)</div>}
          />
        </Route>

          <Route path='/counselorblog' element={<CounselorBlog />} />
          <Route path='/counselorschedule' element={<CounselorSchedule />} />
   <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboardDoctor" element={<DashboardDoctor />} />


        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
