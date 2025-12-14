// src/routes/index.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// IMPORT ROUTE ARRAYS
import customerRoutes from "./CustomerRoutes";
import adminRoutes from "./AdminRoutes";
import ownerRoutes from "./OwnerRoutes";

// AUTH SCREENS (Sử dụng alias @)
import Login from "@/pages/Auth/Login";
import Register from "@/pages/Auth/Register";
import ForgotPassword from "@/pages/Auth/ForgotPassword";
import ResetPassword from "@/pages/Auth/ResetPassword";
import VerifyEmail from "@/pages/Auth/VerifyEmail";
// ✅ Import thêm handler xử lý Login Google/Facebook
import OAuth2RedirectHandler from "@/pages/Auth/OAuth2RedirectHandler";
// ✅ Import thêm trang hoàn thiện hồ sơ (nếu user thiếu thông tin)
import CompleteProfile from "@/pages/Auth/CompleteProfile";

// DEV PREVIEW (Trang xem trước components)
import ComponentsPreview from "@/pages/ComponentsPreview";

// POLICY PAGES
import TermsOfService from "@/pages/Owner/TermsOfService/TermsOfService";
import PartnerPolicy from "@/pages/Owner/TermsOfService/PartnerPolicy";

const AppRoutes = () => {
    return (
        <Routes>
            {/* =========================================================
                AUTHENTICATION ROUTES
            ========================================================= */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />

            {/* ✅ Route nhận Token từ Google/Facebook trả về */}
            <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />

            {/* ✅ Route cập nhật thông tin bổ sung sau khi đăng ký */}
            <Route path="/complete-profile" element={<CompleteProfile />} />

            {/* =========================================================
                DEV TOOLS & POLICY
            ========================================================= */}
            <Route path="/components" element={<ComponentsPreview />} />
            <Route path="/owner/terms-of-service" element={<TermsOfService />} />
            <Route path="/owner/partner-policy" element={<PartnerPolicy />} />

            {/* =========================================================
                CUSTOMER ROUTES
            ========================================================= */}
            {customerRoutes.map((route, index) => (
                <Route
                    key={`customer-${index}`}
                    path={route.path}
                    element={route.element}
                />
            ))}

            {/* =========================================================
                ADMIN ROUTES
            ========================================================= */}
            {adminRoutes.map((route, index) => (
                <Route
                    key={`admin-${index}`}
                    path={route.path}
                    element={route.element}
                />
            ))}

            {/* =========================================================
                OWNER ROUTES
            ========================================================= */}
            {ownerRoutes.map((route, index) => (
                <Route
                    key={`owner-${index}`}
                    path={route.path}
                    element={route.element}
                />
            ))}

            {/* =========================================================
                FALLBACK (404)
            ========================================================= */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;