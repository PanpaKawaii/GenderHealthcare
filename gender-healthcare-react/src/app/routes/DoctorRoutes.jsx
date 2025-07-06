import Layout from "../pages/DoctorRole/Layout";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import CounselorBlog from "../pages/DoctorRole/pages/Blog";
import CounselorSchedule from "../pages/DoctorRole/pages/Schedule";
import Login from "../pages/LoginRegister/Login";
import Home from "../pages/DoctorRole/Home"

import Booking from "../pages/DoctorRole/pages/ManageBooking";



export default function CounselorRoutes() {
  return (
    <BrowserRouter>
      <Routes>
         <Route path="/login" element={<Login />} />
        <Route path="doctor" element={<Layout />}>
          <Route path="schedule" element={<CounselorSchedule />} />
          <Route path="booking" element={<Booking />} />

          <Route path="" element={<Home />} />
        </Route>
        <Route path="*" element={<Navigate to="/doctor" replace />} />

      </Routes>
    </BrowserRouter>
  );
}
