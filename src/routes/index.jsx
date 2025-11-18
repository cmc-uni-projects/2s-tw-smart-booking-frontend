import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext"; // Sử dụng alias @

// Import các mảng routes từ các file cấu hình riêng
import customerRoutes from "@/routes/CustomerRoutes";
import adminRoutes from "@/routes/AdminRoutes";
import ownerRoutes from "@/routes/OwnerRoutes";

// Import các trang Auth
import Login from "@/pages/Auth/Login";
import Register from "@/pages/Auth/Register";
import ForgotPassword from "@/pages/Auth/ForgotPassword";
import ResetPassword from "@/pages/Auth/ResetPassword";
import VerifyEmail from "@/pages/Auth/VerifyEmail";

// Import trang Preview Component (Dành cho dev/test)
import ComponentsPreview from "@/pages/ComponentsPreview";

const AppRoutes = () => {
    const { currentUser } = useAuth();

    return (
        <Routes>
            {/* === 1. AUTH ROUTES (Xử lý chuyển hướng nếu đã đăng nhập) === */}
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

            {/* === 2. DEV ROUTE (Xem trước các component UI) === */}
            <Route path="/components" element={<ComponentsPreview />} />

            {/* === 3. DYNAMIC ROUTES (Load từ các file cấu hình routes con) === */}

            {/* Customer Routes (Bao gồm TransactionHistory, Profile, Booking...) */}
            {customerRoutes.map((route, index) => (
                <Route
                    key={`customer-${index}`}
                    path={route.path}
                    element={route.element}
                />
            ))}

            {/* Admin Routes */}
            {adminRoutes.map((route, index) => (
                <Route
                    key={`admin-${index}`}
                    path={route.path}
                    element={route.element}
                />
            ))}

            {/* Owner Routes */}
            {ownerRoutes.map((route, index) => (
                <Route
                    key={`owner-${index}`}
                    path={route.path}
                    element={route.element}
                />
            ))}

            {/* 4. Fallback 404 - Chuyển hướng về trang chủ nếu không khớp route nào */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;