import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";

import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";
import VerifyEmail from "./pages/Auth/VerifyEmail.jsx";
import ForgotPassword from "./pages/Auth/ForgotPassword.jsx";
import ResetPassword from "./pages/Auth/ResetPassword.jsx";

import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import "./styles/global.css";

// Trang Home thật (Customer)
import HomePage from "./pages/Customer/Home/HomePage.jsx"; 
import About from "./pages/Customer/About/About.jsx";

// Các trang sau đăng nhập (dashboard)
import ProfilePage from "./pages/Customer/Profile/ProfilePage.jsx";
import BookingHistory from "./pages/Customer/Booking/BookingHistory.jsx";

// ✅ THÊM MỚI
import AdminRoutes from "./routes/AdminRoutes.jsx";

function App() {
  const { currentUser } = useAuth();

  return (
    <Routes>
      {/* 🔹 PUBLIC ROUTES - KHÔNG CẦN ĐĂNG NHẬP */}
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<About />} />
      
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

      {/* 🔐 PROTECTED ROUTES - CẦN ĐĂNG NHẬP */}
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
      
      {/* ✅ ADMIN ROUTES */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminRoutes />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;