import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth.service';
import axios from 'axios';

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
      const res = await authService.login({ email, password });
      if (res.success && res.data) {
        setCurrentUser(res.data.user);
        // authService đã tự lưu vào localStorage
        return true;
      } else {
        setError(res.message || 'Login failed');
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
    authService.logout();
    setCurrentUser(null);
  };

  // Cập nhật localStorage khi currentUser thay đổi
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
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 3. Tạo Hook (Để component con sử dụng)
// (Đây là phiên bản ĐÚNG, chỉ có MỘT phiên bản)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};