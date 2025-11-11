import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "../layouts/AdminLayout/AdminLayout";
import AdminDashboard from "../pages/Admin/Dashboard/AdminDashboard";

import PendingApprovalsPage from "../pages/Admin/Hotels/PendingApprovalsPage"; 
// ✅ 1. Import trang duyệt khách sạn mới
import HotelSubmissionsPage from "../pages/Admin/Hotels/HotelSubmissionsPage"; 

// Import các trang admin khác sau này
// import UserListPage from "../pages/Admin/Users/UserListPage";

const AdminRoutes = () => {
  return (
    <AdminLayout>
      <Routes>
        {/* Tất cả routes bên trong đều yêu cầu role "ADMIN" */}
        <Route
          path="/"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        
        {/* Route duyệt đơn ĐĂNG KÝ (owner) */}
        <Route
          path="/approvals"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <PendingApprovalsPage />
            </ProtectedRoute>
          }
        />

        {/* ✅ 2. Thêm route mới cho trang duyệt KHÁCH SẠN */}
        <Route
          path="/hotels/submissions"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <HotelSubmissionsPage />
            </ProtectedRoute>
          }
        />

        {/* <Route
          path="/users"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <UserListPage />
            </ProtectedRoute>
          }
        /> 
        */}

        {/* Fallback về dashboard admin nếu gõ sai URL */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminRoutes;
