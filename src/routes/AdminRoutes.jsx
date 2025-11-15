import React from "react";
// ❌ Không cần import { Routes, Route, Navigate } ở đây
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "../layouts/AdminLayout/AdminLayout";
import AdminDashboard from "../pages/Admin/Dashboard/AdminDashboard";
import PendingApprovalsPage from "../pages/Admin/Hotels/PendingApprovalsPage";
import HotelSubmissionsPage from "../pages/Admin/Hotels/HotelSubmissionsPage";
// import UserListPage from "../pages/Admin/Users/UserListPage";

// ✅ Chuyển đổi const AdminRoutes = () => { ... } thành một mảng:
const adminRoutes = [
  {
    path: "/admin",
    element: (
      <AdminLayout>
        <ProtectedRoute requiredRole="ADMIN">
          <AdminDashboard />
        </ProtectedRoute>
      </AdminLayout>
    ),
  },
  {
    path: "/admin/approvals",
    element: (
      <AdminLayout>
        <ProtectedRoute requiredRole="ADMIN">
          <PendingApprovalsPage />
        </ProtectedRoute>
      </AdminLayout>
    ),
  },
  {
    path: "/admin/hotels/submissions",
    element: (
      <AdminLayout>
        <ProtectedRoute requiredRole="ADMIN">
          <HotelSubmissionsPage />
        </ProtectedRoute>
      </AdminLayout>
    ),
  },
  // {
  //   path: "/admin/users",
  //   element: (
  //     <AdminLayout>
  //       <ProtectedRoute requiredRole="ADMIN">
  //         <UserListPage />
  //       </ProtectedRoute>
  //     </AdminLayout>
  //   ),
  // },
  // Không cần Route "*" ở đây vì index.jsx đã xử lý 404
];

export default adminRoutes; // ✅ Export mảng