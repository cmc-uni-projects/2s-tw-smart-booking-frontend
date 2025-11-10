// src/routes/CustomerRoutes.jsx (ĐÃ SỬA ĐỂ KHẮC PHỤC LỖI LỒNG MENU)

import { Route, Routes } from "react-router-dom";
import HomePage from "@/pages/Customer/Home/HomePage";
import About from "@/pages/Customer/About/About";
import CustomerDashboardLayout from "@/layouts/CustomerLayout/CustomerDashboardLayout";
import ProtectedRoute from "./ProtectedRoute";

// CÁC IMPORTS CẦN THIẾT
import ProfilePage from "@/pages/Customer/Profile/ProfilePage";
import SettingsPage from "@/pages/Customer/Profile/SettingsPage";
import BookingHistory from "@/pages/Customer/Booking/BookingHistory";

// Imports giả lập
const TransactionHistoryPage = () => <h1>Lịch sử giao dịch</h1>;
const RefundsPage = () => <h1>Refunds</h1>;
const WishlistPage = () => <h1>Yêu thích</h1>;
import BecomeOwnerPage from "@/pages/Customer/Profile/BecomeOwnerPage";


const CustomerRoutes = () => {
    return (
        <Routes>
            <Route index element={<HomePage />} />
            <Route path="/about" element={<About />} />

            {/* Route /become-owner */}
            <Route
                path="/become-owner"
                element={
                    <ProtectedRoute>
                        <BecomeOwnerPage />
                    </ProtectedRoute>
                }
            />

            {/* ✅ CUSTOMER DASHBOARD ROUTES (Tất cả các trang đều dùng Layout trống này) */}
            <Route
                path="/customer"
                element={
                    <ProtectedRoute>
                        {/* CustomerDashboardLayout chỉ còn là Header/Footer */}
                        <CustomerDashboardLayout />
                    </ProtectedRoute>
                }
            >
                {/* Trang mặc định (Hoặc trang Profile chính) */}
                <Route index element={<ProfilePage />} />

                {/* CÁC TRANG CÓ MENU WIDGET BÊN TRONG NÓ */}
                <Route path="profile" element={<ProfilePage />} />
                <Route path="settings" element={<SettingsPage />} />

                {/* CÁC TRANG DASHBOARD KHÁC (CẦN TẠO SIDEBAR/MENU CỦA RIÊNG CHÚNG) */}
                <Route path="bookings" element={<BookingHistory />} />
                <Route path="transactions" element={<TransactionHistoryPage />} />
                <Route path="refunds" element={<RefundsPage />} />
                <Route path="wishlist" element={<WishlistPage />} />

            </Route>
        </Routes>
    );
};

export default CustomerRoutes;