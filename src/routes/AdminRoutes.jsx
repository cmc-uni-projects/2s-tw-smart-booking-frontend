import React from "react";
// ❌ Không cần import { Routes, Route, Navigate } ở đây
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "../layouts/AdminLayout/AdminLayout";
import AdminDashboard from "../pages/Admin/Dashboard/AdminDashboard";
import PendingApprovalsPage from "../pages/Admin/Hotels/PendingApprovalsPage";
import HotelSubmissionsPage from "../pages/Admin/Hotels/HotelSubmissionsPage";

// 👇 (Mới từ nhánh của bạn) Import Component Quản lý Khuyến mãi
import PromotionManager from "../pages/Admin/Promotions/PromotionManager";

// 👇 (Mới từ nhánh develop) Import Component Quản lý Giao dịch
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
    // 👇 (Mới) Route cho trang Quản lý Giao dịch
    {
        path: "/admin/transactions",
        element: (
            <AdminLayout>
                <TransactionManagementPage />
            </AdminLayout>
        ),
    },
    // 👇 (Mới) Route cho trang Quản lý Khuyến mãi
    {
        path: "/admin/promotions",
        element: (
            <AdminLayout>
                <ProtectedRoute requiredRole="ADMIN">
                    <PromotionManager />
                </ProtectedRoute>
            </AdminLayout>
        ),
    },
];

export default adminRoutes; // ✅ Export mảng