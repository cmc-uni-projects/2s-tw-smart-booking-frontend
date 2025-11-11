import { Route, Routes } from "react-router-dom";
import HomePage from "@/pages/Customer/Home/HomePage";
import About from "@/pages/Customer/About/About";
import ProfilePage from "@/pages/Customer/Profile/ProfilePage";
import BookingHistory from "@/pages/Customer/Booking/BookingHistory";
import CustomerDashboardLayout from "@/layouts/CustomerLayout/CustomerDashboardLayout";
import ProtectedRoute from "./ProtectedRoute";

// 1. IMPORT TRANG MỚI TỪ NHÁNH FEATURE
import BecomeOwnerPage from "@/pages/Customer/Profile/BecomeOwnerPage";

// +++ ĐÃ THÊM: IMPORT TRANG TÌM KIẾM MỚI +++
import HotelSearchPage from "@/pages/Customer/HotelSearch/HotelSearchPage";

// ✅ Thêm import cho trang chi tiết
import HotelDetailPage from "@/pages/Customer/HotelDetail/HotelDetailPage";

const CustomerRoutes = () => {
    return (
        <Routes>
            <Route index element={<HomePage />} />
            <Route path="/about" element={<About />} />

            {/* +++ ĐÃ THÊM: ROUTE CHO TRANG TÌM KIẾM +++ */}
            <Route path="/hotels" element={<HotelSearchPage />} />

            {/* ✅ Thêm route động cho trang chi tiết khách sạn */}
            <Route path="/hotels/:hotelId" element={<HotelDetailPage />} />

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
                {/* Add more customer-specific routes here */}
            </Route>
        </Routes>
    );
};

export default CustomerRoutes;