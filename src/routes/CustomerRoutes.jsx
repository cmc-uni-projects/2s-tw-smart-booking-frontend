import React from "react";
import CustomerLayout from "../layouts/CustomerLayout/CustomerLayout";
import CustomerDashboardLayout from "../layouts/CustomerLayout/CustomerDashboardLayout";
import HomePage from "../pages/Customer/Home/HomePage";
import About from "../pages_Customer_About_About";
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

// 1. IMPORT PROTECTED ROUTE
import ProtectedRoute from "../routes/ProtectedRoute";

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
    // === SỬA LỖI GIAI ĐOẠN 1 ===
    // Đổi từ "/hotels/search" thành "/hotels"
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
  
  // === THÊM LỚP BẢO VỆ CHO CÁC ROUTE CÁ NHÂN ===
  // Tất cả các route bên dưới bây giờ sẽ yêu cầu đăng nhập
  {
    path: "/customer/profile",
    element: (
      <ProtectedRoute roles={["CUSTOMER"]}>
        <CustomerDashboardLayout>
          <ProfilePage />
        </CustomerDashboardLayout>
      </ProtectedRoute>
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
  {
    // Trang đăng ký làm partner cũng CẦN được bảo vệ
    path: "/partner/register",
    element: (
      <ProtectedRoute roles={["CUSTOMER"]}>
        <CustomerLayout>
          <BecomeOwnerPage />
        </CustomerLayout>
      </ProtectedRoute>
    ),
  },
];

export default customerRoutes;