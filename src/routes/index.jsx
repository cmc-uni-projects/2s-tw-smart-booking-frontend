import React from "react";
// 1. Thêm Navigate
import { Routes, Route, Navigate } from "react-router-dom";
// 2. Thêm useAuth
import { useAuth } from "../context/AuthContext"; 

// 3. Import các mảng routes (giữ nguyên)
import customerRoutes from "./CustomerRoutes";
import adminRoutes from "./AdminRoutes";
import ownerRoutes from "./OwnerRoutes";

// 4. Import các trang Auth (giữ nguyên)
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";
import VerifyEmail from "../pages/Auth/VerifyEmail";

/**
 * Đây là cách đúng để render một mảng routes trong React Router v6
 */
const AppRoutes = () => {
    // 5. Lấy currentUser từ context
    const { currentUser } = useAuth();

    return (
        <Routes>
            {/* === 1. CÁC ROUTE CHUNG (AUTH) === */}
            {/* 6. Thêm logic điều hướng giống App.jsx cũ vào đây */}
            <Route
                path="/login"
                element={currentUser ? <Navigate to="/" replace /> : <Login />}
            />
            <Route
                path="/register"
                element={currentUser ? <Navigate to="/" replace /> : <Register />}
            />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />

            {/* === 2. CÁC ROUTE CỦA CUSTOMER === */}
            {/* Lặp qua mảng customerRoutes (sẽ chạy file CustomerRoutes.jsx) */}
            {customerRoutes.map((route, index) => (
                <Route key={`customer-${index}`} path={route.path} element={route.element} />
            ))}

            {/* === 3. CÁC ROUTE CỦA ADMIN === */}
            {adminRoutes.map((route, index) => (
                <Route key={`admin-${index}`} path={route.path} element={route.element} />
            ))}

            {/* === 4. CÁC ROUTE CỦA OWNER === */}
            {ownerRoutes.map((route, index) => (
                <Route key={`owner-${index}`} path={route.path} element={route.element} />
            ))}

            {/* 7. Thêm route 404 (lấy từ App.jsx cũ) */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;