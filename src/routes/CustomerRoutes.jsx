console.warn("LOG BẮT BUỘC: File CustomerRoutes.jsx (bản mới nhất) ĐÃ CHẠY!");
import React from "react";
import CustomerLayout from "../layouts/CustomerLayout/CustomerLayout";
import CustomerDashboardLayout from "../layouts/CustomerLayout/CustomerDashboardLayout";
import HomePage from "../pages/Customer/Home/HomePage";
import About from "../pages/Customer/About/About";
import HelpPage from "../pages/Customer/About/HelpPage";
import Contact from "../pages/Customer/About/Contact";
import HotelSearchPage from "../pages/Customer/HotelSearch/HotelSearchPage";
import HotelDetailPage from "../pages/Customer/HotelDetail/HotelDetailPage";
import BookingHistory from "../pages/Customer/Booking/BookingHistory";
import MyInboxPage from "../pages/Customer/About/MyInboxPage";
import ProfilePage from "../pages/Customer/Profile/ProfilePage";
import SettingsPage from "../pages/Customer/Profile/SettingsPage";
import ChangePassword from "../pages/Customer/Profile/ChangePassword";
import NotificationSettings from "../pages/Customer/Profile/NotificationSettings";
import LanguageSettings from "../pages/Customer/Profile/LanguageSettings";
import PartnerLandingPage from "../pages/Partner/PartnerLandingPage";
import BecomeOwnerPage from "../pages/Customer/Profile/BecomeOwnerPage";

import ProtectedRoute from "../routes/ProtectedRoute";
// === 1. IMPORT PARTNER ROUTE ===
import PartnerRoute from "../routes/PartnerRoute"; // <-- THÊM DÒNG NÀY

const customerRoutes = [
  // ... (Tất cả các route khác của bạn / /about /hotels /customer/profile ...)
  // ... (Giữ nguyên các route này)
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
    path: "/hotels/:id",
    element: (
      <CustomerLayout>
        <HotelDetailPage />
      </CustomerLayout>
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
  {
    path: "/customer/my-bookings",
    element: (
      <ProtectedRoute roles={["CUSTOMER"]}>
        <CustomerDashboardLayout>
          <BookingHistory />
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
  

  // === 2. SỬA LỖI LOGIC Ở ĐÂY ===
  {
    path: "/partner/register",
    element: (
        <PartnerRoute> 
          <BecomeOwnerPage />
        </PartnerRoute>
    ),
  },
];

export default customerRoutes;