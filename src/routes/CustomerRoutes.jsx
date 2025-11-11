import React from "react";
import { Routes, Route } from "react-router-dom";
import CustomerLayout from "@/layouts/CustomerLayout/CustomerLayout";
import Home from "@/pages/Customer/Home/HomePage";
import About from "@/pages/Customer/About/About";
import MyInboxPage from "@/pages/Customer/About/MyInboxPage";

import HotelSearchPage from "@/pages/Customer/HotelSearch/HotelSearchPage";

const CustomerRoutes = () => {
    return (
        <Routes>
            <Route index element={<HomePage />} />
            <Route path="/about" element={<About />} />

            {/* +++ ĐÃ THÊM: ROUTE CHO TRANG TÌM KIẾM +++ */}
            <Route path="/hotels" element={<HotelSearchPage />} />

            {/* 2. THÊM ROUTE /become-owner MỚI TẠI ĐÂY */}
            <Route
                path="/become-owner"
                element={
                    <ProtectedRoute>
                        <BecomeOwnerPage />
                    </ProtectedRoute>
                }
            />

            {/* Customer Dashboard Routes */}
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

