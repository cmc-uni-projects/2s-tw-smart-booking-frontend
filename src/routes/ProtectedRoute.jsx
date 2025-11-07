import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingOverlay from '../components/common/Loading/LoadingOverlay'; // Thêm loading cho mượt

const ProtectedRoute = ({ children, requiredRole }) => {
  // ✅ SỬA Ở ĐÂY: Đổi 'user' thành 'currentUser'
  const { currentUser, loading, hasRole } = useAuth();

  if (loading) {
    // Thêm trạng thái loading để tránh bị "chớp" màn hình login
    return <LoadingOverlay message="Đang tải thông tin xác thực..." />;
  }

  // ✅ SỬA Ở ĐÂY: Đổi 'user' thành 'currentUser'
  if (!currentUser) {
    // Nếu không có user, chuyển về trang login
    return <Navigate to="/login" replace />;
  }

  // Nếu route yêu cầu quyền (requiredRole) mà user không có quyền đó
  if (requiredRole && !hasRole(requiredRole)) {
    // Chuyển về trang chủ (hoặc trang "Không có quyền")
    // Ở đây tôi chuyển về trang chủ cho đơn giản
    return <Navigate to="/" replace />;
  }

  // Nếu mọi thứ OK, hiển thị component con (trang AdminDashboard)
  return children;
};

export default ProtectedRoute;