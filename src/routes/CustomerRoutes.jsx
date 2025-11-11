import React from "react";
import { Routes, Route } from "react-router-dom";
import CustomerLayout from "@/layouts/CustomerLayout/CustomerLayout";
import Home from "@/pages/Customer/Home/HomePage";
import About from "@/pages/Customer/About/About";
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


                <Route path="settings" element={<SettingsPage />} />
                <Route path="transactions" element={<TransactionHistoryPage />} />
                <Route path="refunds" element={<RefundsPage />} />
                <Route path="wishlist" element={<WishlistPage />} />

            </Route>
        </Routes>
    );
};

export default CustomerRoutes;