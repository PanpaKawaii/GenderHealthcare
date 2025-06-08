import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Layout from "../pages/ForumPage/ForumComponents/Layout/Layout";
import ForumPage from "../pages/ForumPage/ForumPage";
import Login from "../pages/LoginRegister/Login";
import Register from "../pages/LoginRegister/Register";
import Blog from '../pages/blog/Blog'

export default function MainRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<div>Home Page (Coming Soon)</div>} />
          <Route path="/forum" element={<ForumPage />} />
            <Route path='/blog' element= {<Blog/>}/>
          <Route
            path="/profile"
            element={<div>Profile Page (Coming Soon)</div>}
          />
        </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
