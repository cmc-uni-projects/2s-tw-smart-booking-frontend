import React from "react";
// ❌ Không cần import { Routes, Route, Navigate } ở đây
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "../layouts/AdminLayout/AdminLayout";
import AdminDashboard from "../pages/Admin/Dashboard/AdminDashboard";
import PendingApprovalsPage from "../pages/Admin/Hotels/PendingApprovalsPage";
import HotelSubmissionsPage from "../pages/Admin/Hotels/HotelSubmissionsPage";
import TransactionManagementPage from "@/pages/Admin/Transactions/TransactionManagementPage";
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
  {
        path: "/admin/transactions",
        element: (
            <AdminLayout>
                <TransactionManagementPage />
            </AdminLayout>
        ),
    },
];

export default adminRoutes; // ✅ Export mảng