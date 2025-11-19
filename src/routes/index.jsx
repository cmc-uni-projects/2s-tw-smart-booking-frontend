// src/routes/index.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// IMPORT ROUTES
import customerRoutes from "./CustomerRoutes";
import adminRoutes from "./AdminRoutes";
import ownerRoutes from "./OwnerRoutes";

// AUTH SCREENS
import Login from "@/pages/Auth/Login";
import Register from "@/pages/Auth/Register";
import ForgotPassword from "@/pages/Auth/ForgotPassword";
import ResetPassword from "@/pages/Auth/ResetPassword";
import VerifyEmail from "@/pages/Auth/VerifyEmail";

// DEV PREVIEW
import ComponentsPreview from "@/pages/ComponentsPreview";

// POLICY
import TermsOfService from "@/pages/Owner/TermsOfService/TermsOfService";
import PartnerPolicy from "@/pages/Owner/TermsOfService/PartnerPolicy";

const AppRoutes = () => {
  return (
    <Routes>
      {/* AUTH */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* DEV */}
      <Route path="/components" element={<ComponentsPreview />} />

      {/* POLICY */}
      <Route path="/owner/terms-of-service" element={<TermsOfService />} />
      <Route path="/owner/partner-policy" element={<PartnerPolicy />} />

      {/* CUSTOMER ROUTES */}
      {customerRoutes.map((route, index) => (
        <Route key={"customer-" + index} path={route.path} element={route.element} />
      ))}

      {/* ADMIN ROUTES */}
      {adminRoutes.map((route, index) => (
        <Route key={"admin-" + index} path={route.path} element={route.element} />
      ))}

      {/* OWNER ROUTES */}
      {ownerRoutes.map((route, index) => (
        <Route key={"owner-" + index} path={route.path} element={route.element} />
      ))}

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
