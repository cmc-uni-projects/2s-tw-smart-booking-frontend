console.warn("LOG BẮT BUỘC: File CustomerRoutes.jsx (bản mới nhất) ĐÃ CHẠY!");
import React from "react";
// --- Chuẩn hóa alias ---
import CustomerLayout from "@/layouts/CustomerLayout/CustomerLayout";
import CustomerDashboardLayout from "@/layouts/CustomerLayout/CustomerDashboardLayout";
import HomePage from "@/pages/Customer/Home/HomePage";
import About from "@/pages/Customer/About/About";
import HelpPage from "@/pages/Customer/About/HelpPage";
import Contact from "@/pages/Customer/About/Contact";
import HotelSearchPage from "@/pages/Customer/HotelSearch/HotelSearchPage";
import HotelDetailPage from "@/pages/Customer/HotelDetail/HotelDetailPage";
import Refunds from "@/pages/Customer/Profile/Refunds";

// ✅ IMPORT MỚI: CÁC TRANG BOOKING & PAYMENT
import BookingPage from "@/pages/Customer/Booking/BookingPage";
import PaymentPage from "@/pages/Customer/Booking/PaymentPage";

// ✅ CẬP NHẬT: Dùng MyBookings (đã tích hợp API) thay vì BookingHistory cũ
import MyBookings from "@/pages/Customer/Profile/MyBookings"; 

import MyInboxPage from "@/pages/Customer/About/MyInboxPage";
import ProfilePage from "@/pages/Customer/Profile/ProfilePage";
import SettingsPage from "@/pages/Customer/Profile/SettingsPage";
import ChangePassword from "@/pages/Customer/Profile/ChangePassword";
import NotificationSettings from "@/pages/Customer/Profile/NotificationSettings";
import LanguageSettings from "@/pages/Customer/Profile/LanguageSettings";
import PartnerLandingPage from "@/pages/Partner/PartnerLandingPage";
import BecomeOwnerPage from "@/pages/Customer/Profile/BecomeOwnerPage";
import ExploreMapPage from "@/pages/Customer/Explore/ExploreMapPage";
import TransactionHistory from "@/pages/Customer/Profile/TransactionHistory/TransactionHistory";

// --- Chuẩn hóa alias ---
import ProtectedRoute from "@/routes/ProtectedRoute";
import PartnerRoute from "@/routes/PartnerRoute";

const customerRoutes = [
  {
    path: "/",
    element: (
      <CustomerLayout>
        <HomePage />
      </CustomerLayout>
    ),
  },
  {
    path: "/about",
    element: (
      <CustomerLayout>
        <About />
      </CustomerLayout>
    ),
  },
  {
    path: "/help",
    element: (
      <CustomerLayout>
        <HelpPage />
      </CustomerLayout>
    ),
  },
  {
    path: "/contact",
    element: (
      <CustomerLayout>
        <Contact />
      </CustomerLayout>
    ),
  },
  {
    path: "/hotels",
    element: (
      <CustomerLayout>
        <HotelSearchPage />
      </CustomerLayout>
    ),
  },
  {
    path: "/hotels/:hotelId",
    element: (
      <CustomerLayout>
        <HotelDetailPage />
      </CustomerLayout>
    ),
  },

  // ✅ ROUTE ĐẶT PHÒNG (Yêu cầu đăng nhập)
  {
    path: "/booking/:propertyId",
    element: (
      <ProtectedRoute roles={["CUSTOMER"]}>
        <CustomerLayout>
           <BookingPage />
        </CustomerLayout>
      </ProtectedRoute>
    ),
  },

  // ✅ ROUTE THANH TOÁN (Yêu cầu đăng nhập)
  {
    path: "/booking/payment/:bookingId",
    element: (
      <ProtectedRoute roles={["CUSTOMER"]}>
        <CustomerLayout>
           <PaymentPage />
        </CustomerLayout>
      </ProtectedRoute>
    ),
  },

  {
    path: "/partner-with-us",
    element: (
      <CustomerLayout>
        <PartnerLandingPage />
      </CustomerLayout>
    ),
  },
  {
    path: "/customer/profile",
    element: (
      <CustomerLayout>
        <ProtectedRoute roles={["CUSTOMER"]}>
          <ProfilePage />
        </ProtectedRoute>
      </CustomerLayout>
    ),
  },
  {
    path: "/customer/profile/settings",
    element: (
      <ProtectedRoute roles={["CUSTOMER"]}>
        <CustomerDashboardLayout>
          <SettingsPage />
        </CustomerDashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/customer/profile/change-password",
    element: (
      <ProtectedRoute roles={["CUSTOMER"]}>
        <CustomerDashboardLayout>
          <ChangePassword />
        </CustomerDashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "explore",
    element: <ExploreMapPage />,
    title: "Khám phá trên bản đồ"
  },
  {
    path: "/customer/profile/notifications",
    element: (
      <ProtectedRoute roles={["CUSTOMER"]}>
        <CustomerDashboardLayout>
          <NotificationSettings />
        </CustomerDashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/customer/profile/language",
    element: (
      <ProtectedRoute roles={["CUSTOMER"]}>
        <CustomerDashboardLayout>
          <LanguageSettings />
        </CustomerDashboardLayout>
      </ProtectedRoute>
    ),
  },
  
  // ✅ CẬP NHẬT: Dùng MyBookings Component
  {
    path: "/customer/my-bookings",
    element: (
      <ProtectedRoute roles={["CUSTOMER"]}>
        <CustomerDashboardLayout>
          <MyBookings />
        </CustomerDashboardLayout>
      </ProtectedRoute>
    ),
  },

  {
    path: "/customer/my-inbox",
    element: (
      <ProtectedRoute roles={["CUSTOMER"]}>
        <CustomerDashboardLayout>
          <MyInboxPage />
        </CustomerDashboardLayout>
      </ProtectedRoute>
    ),
  },
  
  {
    path: "/customer/transactions",
    element: (
      <ProtectedRoute roles={["CUSTOMER"]}>
        <CustomerDashboardLayout>
            <TransactionHistory />
        </CustomerDashboardLayout>
      </ProtectedRoute>
    ),
  },

  {
    path: "/partner/register",
    element: (
      <PartnerRoute>
        <BecomeOwnerPage />
      </PartnerRoute>
    ),
  },
{
        path: "/customer/refunds",
        element: (
            <ProtectedRoute roles={["CUSTOMER"]}>
                <CustomerDashboardLayout>
                    <Refunds />
                </CustomerDashboardLayout>
            </ProtectedRoute>
        ),
    },

];

export default customerRoutes;