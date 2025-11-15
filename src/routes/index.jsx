import React from "react";
import { Routes, Route } from "react-router-dom";

// 1. Import các mảng routes (viết thường cho rõ ràng)
import customerRoutes from "./CustomerRoutes";
import adminRoutes from "./AdminRoutes";
import ownerRoutes from "./OwnerRoutes";

// 2. Import các trang Auth (vì chúng không có trong CustomerRoutes)
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";
import VerifyEmail from "../pages/Auth/VerifyEmail";

/**
 * Đây là cách đúng để render một mảng routes trong React Router v6
 */
const AppRoutes = () => {
    return (
        <Routes>
            {/* === 1. CÁC ROUTE CHUNG (AUTH) === */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />

            {/* === 2. CÁC ROUTE CỦA CUSTOMER === */}
            {/* Lặp qua mảng customerRoutes và tạo Route cho mỗi phần tử */}
            {customerRoutes.map((route, index) => (
                <Route key={`customer-${index}`} path={route.path} element={route.element} />
            ))}

            {/* === 3. CÁC ROUTE CỦA ADMIN === */}
            {/* Lặp qua mảng adminRoutes (sửa lỗi tương tự) */}
            {adminRoutes.map((route, index) => (
                <Route key={`admin-${index}`} path={route.path} element={route.element} />
            ))}

            {/* === 4. CÁC ROUTE CỦA OWNER === */}
            {/* Lặp qua mảng ownerRoutes (sửa lỗi tương tự) */}
            {ownerRoutes.map((route, index) => (
                <Route key={`owner-${index}`} path={route.path} element={route.element} />
            ))}

            {/* (Bạn có thể thêm 1 route 404 Not Found ở đây nếu muốn) */}
            {/* <Route path="*" element={<h1>404 Not Found</h1>} /> */}
        </Routes>
    );
};

export default AppRoutes;