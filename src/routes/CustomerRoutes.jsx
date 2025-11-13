import React from "react";
import { Routes, Route } from "react-router-dom";
import CustomerLayout from "@/layouts/CustomerLayout/CustomerLayout";
import Home from "@/pages/Customer/Home/HomePage";
import About from "@/pages/Customer/About/About";
import MyInboxPage from "@/pages/Customer/About/MyInboxPage";
import HelpPage from "@/pages/Customer/About/HelpPage";

import HotelSearchPage from "@/pages/Customer/HotelSearch/HotelSearchPage";
import HotelDetailPage from "@/pages/Customer/HotelDetail/HotelDetailPage";

import ProtectedRoute from "./ProtectedRoute";
import CustomerDashboardLayout from "@/layouts/CustomerLayout/CustomerDashboardLayout";
import ProfilePage from "@/pages/Customer/Profile/ProfilePage";
import BookingHistory from "@/pages/Customer/Booking/BookingHistory";

import SettingsPage from "@/pages/Customer/Profile/SettingsPage";

const TransactionHistoryPage = () => <h2>Lịch sử giao dịch</h2>;
const RefundsPage = () => <h2>Refunds</h2>;
const WishlistPage = () => <h2>Yêu thích</h2>;
// =============================================

const CustomerRoutes = () => {
    return (
        <Routes>

            <Route index element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/help" element={<HelpPage />} />


            {/* +++ ĐÃ THÊM: ROUTE CHO TRANG TÌM KIẾM +++ */}
            <Route path="/hotels" element={<HotelSearchPage />} />
            <Route path="/hotels/:hotelId" element={<HotelDetailPage />} />

            {/* --- ROUTE BECOME-OWNER  --- */}
            <Route
                path="/become-owner"
                element={
                    <ProtectedRoute>
                        <BecomeOwnerPage />
                    </ProtectedRoute>
                }
            />


            <Route
                path="/customer"
                element={
                    <ProtectedRoute>
                        <CustomerDashboardLayout />
                    </ProtectedRoute>
                }
            >

                <Route path="profile" element={<ProfilePage />} />
                <Route path="bookings" element={<BookingHistory />} />
                <Route path="my-inbox" element={<MyInboxPage />} />

                {/* Add more customer-specific routes here */}
            </Route>
        </Routes>
    );
};

export default CustomerRoutes;

