import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Layout from "../pages/ForumPage/ForumComponents/Layout/Layout";
import ForumPage from "../pages/ForumPage/ForumPage";
import Login from "../pages/LoginRegister/Login";
import Register from "../pages/LoginRegister/Register";
import Blog from "../pages/blog/Blog";
import BlogDetail from "../pages/blog/components/BlogDetail";
import CounselorBlog from "../pages/Counselor/pages/Blog";
import CounselorSchedule from "../pages/Counselor/pages/Schedule";
import HomePage from "../pages/Home/HomePage";
import DashboardDoctor from "../pages/Dashboard/DashboardDoctor";
import DashboardTestservice from "../pages/Dashboard/DashboardTestservice";
import DashboardMedicalfacility from "../pages/Dashboard/DashboardMedicalfacility";
import ProfilePage from "../pages/ProfilePage/ProfilePage";

import PostDetail from "../pages/ForumPage/PostDetail";

import Booking from "../pages/Counselor/Booking/Booking";
import BookingDetail from "../pages/ProfilePage/BookingDetail"

import PaymentStatus from "../pages/PaymentStatus/PaymentStatus";

import SelectBooking from "../pages/Booking/SelectBooking";
import TestBooking from "../pages/TestBooking/TestBooking";
import ParameterManager from "../pages/ParameterManager/ParameterManager";
import TestResultManager from "../pages/TestResultManager/TestResultManager";
import TestResultDetailManager from "../pages/TestResultDetailManager/TestResultDetailManager";
import TestServiceParameterManager from "../pages/TestServiceParameterManager/TestServiceParameterManager";
import TestServiceParameterDetail from "../pages/TestServiceParameterManager/TestServiceParameterDetail/TestServiceParameterDetail";

import TestBookingManager from "../pages/TestBookingManager/TestBookingManager";
import BookingService from "../pages/TestBooking/Service";
import CyclePage from "../pages/Cycle/Cycle";
import Contact from "../pages/contact/Contact";

export default function CustomerRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/forum" element={<ForumPage />} />
          <Route path="/post/:postId" element={<PostDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/cycle" element={<CyclePage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="bookings/:id" element={<BookingDetail />} />
          <Route path="/bookingservice" element={<BookingService />} />
          <Route path="/couselortestbooking" element={<TestBooking />} />
          <Route path='/paymentstatus' element={<PaymentStatus />} />
        </Route>

        <Route path="/counselorblog" element={<CounselorBlog />} />
        <Route path="/counselorschedule" element={<CounselorSchedule />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/parametermanager" element={<ParameterManager />} />
        <Route path="/testbookingmanager" element={<TestBookingManager />} />
        <Route path="/testresultmanager/:id" element={<TestResultManager />} />
        <Route path="/testserviceparametermanager" element={<TestServiceParameterManager />} />
        <Route path="/testserviceparametermanager/:id" element={<TestServiceParameterDetail />} />
        <Route
          path="/dashboardTestservice"
          element={<DashboardTestservice />}
        />
        <Route
          path="/dashboardMedicalfacility"
          element={<DashboardMedicalfacility />}
        />

        {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
