/*
 * bquang016/smart_booking_system_frontend/Smart_Booking_System_Frontend-feature-login-reg/src/context/AuthContext.jsx
 * (Đã sửa lỗi và thêm hasRole)
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
  const [loading, setLoading] = useState(false); // Sửa: nên là false ban đầu
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.login(email, password);

      if (res.data.success && res.data.data) {
        const { user, accessToken } = res.data.data;
        
        setCurrentUser(user);
        localStorage.setItem('accessToken', accessToken); 
        return true;
      } else {
        setError(res.data.message || 'Login failed');
        return false;
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
  };

  // ✅ THÊM MỚI HÀM NÀY
  // Kiểm tra xem user hiện tại có role được yêu cầu không
  // Dựa trên LoginResponse.java, user.roles là một Set<String>
  const hasRole = (role) => {
    if (!currentUser || !currentUser.roles) {
      return false;
    }
    return currentUser.roles.includes(role);
  };


  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('user', JSON.stringify(currentUser));
    } else {
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
        error,
        hasRole // ✅ THÊM MỚI
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