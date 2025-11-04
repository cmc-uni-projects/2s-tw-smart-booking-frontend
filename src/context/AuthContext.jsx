/*
 * bquang016/smart_booking_system_frontend/Smart_Booking_System_Frontend-feature-login-reg/src/context/AuthContext.jsx
 * (Đã sửa lỗi)
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth.service';

// 1. Tạo Context
export const AuthContext = createContext();

// 2. Tạo Provider (Component cha)
export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem('user')) || null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      // authService.login trả về response của axios (res)
      const res = await authService.login(email, password);

      // Dữ liệu ApiResponse của backend nằm trong res.data
      // Dữ liệu LoginResponse (chứa token + user) nằm trong res.data.data
      if (res.data.success && res.data.data) {
        const { user, accessToken } = res.data.data;
        
        setCurrentUser(user);
        localStorage.setItem('accessToken', accessToken); // Lưu token
        // useEffect bên dưới sẽ tự động lưu user
        return true;
      } else {
        // Trường hợp backend trả về success: false
        setError(res.data.message || 'Login failed');
        return false;
      }
    } catch (err) {
      // Trường hợp axios ném lỗi (4xx, 5xx)
      setError(err.response?.data?.message || err.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // authService.logout(); // (Nếu bạn có API logout)
    setCurrentUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
  };

  // Cập nhật localStorage khi currentUser thay đổi
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('user', JSON.stringify(currentUser));
    } else {
       // Đảm bảo xóa khi logout
       localStorage.removeItem('user');
       localStorage.removeItem('accessToken');
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        logout,
        loading,
        error
        // Không cần truyền 'setCurrentUser' nếu chỉ login/logout mới thay đổi
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 3. Tạo Hook (Để component con sử dụng)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};