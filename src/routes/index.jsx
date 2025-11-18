// src/routes/index.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

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

// Import trang Preview Component
import ComponentsPreview from "@/pages/ComponentsPreview";

// ✅ CẬP NHẬT IMPORT CÁC TRANG CHÍNH SÁCH
import TermsOfService from "@/pages/Owner/TermsOfService/TermsOfService";
import PartnerPolicy from "@/pages/Owner/TermsOfService/PartnerPolicy"; // <--- Import mới

const AppRoutes = () => {
    const { currentUser } = useAuth();

    return (
        <Routes>
            {/* === 1. AUTH ROUTES === */}
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

            {/* === 2. DEV ROUTE === */}
            <Route path="/components" element={<ComponentsPreview />} />

            {/* === 3. PUBLIC ROUTES === */}
            {/* Điều khoản dịch vụ */}
            <Route path="/owner/terms-of-service" element={<TermsOfService />} />

            {/* ✅ Route mới cho Chính sách Đối tác */}
            <Route path="/owner/partner-policy" element={<PartnerPolicy />} />

            {/* === 4. DYNAMIC ROUTES === */}
            {customerRoutes.map((route, index) => (
                <Route
                    key={`customer-${index}`}
                    path={route.path}
                    element={route.element}
                />
            ))}

            {adminRoutes.map((route, index) => (
                <Route
                    key={`admin-${index}`}
                    path={route.path}
                    element={route.element}
                />
            ))}

            {ownerRoutes.map((route, index) => (
                <Route
                    key={`owner-${index}`}
                    path={route.path}
                    element={route.element}
                />
            ))}

            {/* 5. Fallback 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;