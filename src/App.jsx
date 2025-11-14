import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";

import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";
import VerifyEmail from "./pages/Auth/VerifyEmail.jsx";
import ForgotPassword from "./pages/Auth/ForgotPassword.jsx";
import ResetPassword from "./pages/Auth/ResetPassword.jsx";

import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import "./styles/global.css";

import HotelSearchPage from "@/pages/Customer/HotelSearch/HotelSearchPage";

// Trang Home thật (Customer)
import HomePage from "./pages/Customer/Home/HomePage.jsx";
import About from "./pages/Customer/About/About.jsx";
import MyInboxPage from "@/pages/Customer/About/MyInboxPage";
import HelpPage from "./pages/Customer/About/HelpPage.jsx";

// Các trang sau đăng nhập (dashboardd)
import ProfilePage from "./pages/Customer/Profile/ProfilePage.jsx";
import BookingHistory from "./pages/Customer/Booking/BookingHistory.jsx";

import PartnerLandingPage from "./pages/Partner/PartnerLandingPage.jsx";
import BecomeOwnerPage from "./pages/Customer/Profile/BecomeOwnerPage.jsx";

import HotelDetailPage from "@/pages/Customer/HotelDetail/HotelDetailPage";

import AdminRoutes from "./routes/AdminRoutes.jsx";
// ✅ Import OwnerRoutes
import OwnerRoutes from "./routes/OwnerRoutes.jsx";

function App() {
  const { currentUser } = useAuth();

  return (
    <Routes>
      {/* 🔹 PUBLIC ROUTES - KHÔNG CẦN ĐĂNG NHẬP */}
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<About />} />
      <Route path="/partner-with-us" element={<PartnerLandingPage />} />
      <Route path="/hotels" element={<HotelSearchPage />} />
      <Route path="/hotels/:hotelId" element={<HotelDetailPage />} />

      {/* 🔹 AUTH ROUTES - CHỈ DÀNH CHO NGƯỜI CHƯA ĐĂNG NHẬP */}
      <Route
        path="/login"
        element={currentUser ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={currentUser ? <Navigate to="/" replace /> : <Register />}
      />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* 🔐 PROTECTED CUSTOMER ROUTES - CẦN ĐĂNG NHẬP */}
      <Route
        path="/customer/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/bookings"
        element={
          <ProtectedRoute>
            <BookingHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/my-inbox"
        element={
          <ProtectedRoute>
            <MyInboxPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/help"
        element={
            <HelpPage />
        }
      />
      <Route
        path="/partner/register" // Route để nộp đơn làm Owner
        element={
          <ProtectedRoute>
            <BecomeOwnerPage />
          </ProtectedRoute>
        }
      />

      {/* 🔐 ADMIN ROUTES */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminRoutes />
          </ProtectedRoute>
        }
      />
      
      {/* 🔐 OWNER ROUTES */}
      <Route
        path="/owner/*"
        element={
          <ProtectedRoute requiredRole="OWNER">
            <OwnerRoutes />
          </ProtectedRoute>
        }
      />

      {/* 404 Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;