// src/routes/index.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// IMPORT ROUTE ARRAYS
// Các file này export mảng các route objects { path, element, ... }
import customerRoutes from "./CustomerRoutes";
import adminRoutes from "./AdminRoutes";
import ownerRoutes from "./OwnerRoutes";

// AUTH SCREENS
import Login from "@/pages/Auth/Login";
import Register from "@/pages/Auth/Register";
import ForgotPassword from "@/pages/Auth/ForgotPassword";
import ResetPassword from "@/pages/Auth/ResetPassword";
import VerifyEmail from "@/pages/Auth/VerifyEmail";

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

            {/* =========================================================
          DEV TOOLS & POLICY
      ========================================================= */}
            <Route path="/components" element={<ComponentsPreview />} />
            <Route path="/owner/terms-of-service" element={<TermsOfService />} />
            <Route path="/owner/partner-policy" element={<PartnerPolicy />} />

            {/* =========================================================
          CUSTOMER ROUTES
          (Bao gồm: Trang chủ, Tìm kiếm, Đặt phòng, Profile,
           và tính năng KHUYẾN MÃI mới thêm)
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
          (Bao gồm: Dashboard, Duyệt khách sạn, Quản lý giao dịch,
           Quản lý khuyến mãi)
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
          (Bao gồm: Dashboard, Quản lý tài sản, Phòng, Booking)
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
          Chuyển hướng về trang chủ nếu không tìm thấy route
      ========================================================= */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;