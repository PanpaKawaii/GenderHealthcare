import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
// import AdminDashboard from '../pages/AdminPage/AdminDashboard';
import UserManagement from '../pages/AdminPage/UserManagement';
// import PostsManagement from '../pages/AdminPage/PostsManagement';
// import CommentsManagement from '../pages/AdminPage/CommentsManagement';
// import SettingsPage from '../pages/AdminPage/SettingsPage';
import ModerationPage from '../pages/ModerationPage/ModerationPage';
function AdminRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<ModerationPage />} />
          <Route path="admin/users" element={<UserManagement />} />
          {/* <Route path="admin/posts" element={<PostsManagement />} />
          <Route path="admin/comments" element={<CommentsManagement />} /> */}
          <Route path="admin/moderation" element={<ModerationPage />} />
          {/* <Route path="admin/settings" element={<SettingsPage />} /> */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AdminRoutes;