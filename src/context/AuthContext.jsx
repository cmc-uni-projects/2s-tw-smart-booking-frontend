  // src/context/AuthContext.jsx
  import React, { createContext, useContext, useState, useEffect } from 'react';
  import { authService } from '../services/auth.service';

  export const AuthContext = createContext();

  export const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(
      JSON.parse(localStorage.getItem('user')) || null
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // CODE ĐÃ SỬA TRONG AuthContext.jsx
    const login = async (email, password) => {
      setLoading(true);
      setError(null);
      try {
        // 'data' bây giờ là object { accessToken, user, ... }
        // được trả về từ authService.login
        const data = await authService.login(email, password);

        // Kiểm tra trực tiếp các trường cần thiết
        if (data && data.user && data.accessToken) { // <-- SỬA Ở ĐÂY
          setCurrentUser(data.user);
          localStorage.setItem('accessToken', data.accessToken); 
          return true;
        } else {
          // Xử lý nếu 'data' trả về không hợp lệ
          setError('Login failed: Invalid data received');
          return false;
        }
      } catch (err) {
        // Bắt lỗi được ném từ authService (vd: "Login failed", "Cannot connect to server")
        setError(err.message || 'Login failed'); // <-- Chỉ cần err.message
        return false;
      } finally {
        setLoading(false);
      }
    };

    // Code đã sửa trong AuthContext.jsx
  const logout = () => {
    // Lấy token HIỆN TẠI để gửi cho service
    const currentToken = authService.getAccessToken(); 
    
    // Gọi service: nó sẽ tự gọi API và xóa localStorage
    authService.logout(currentToken); 
    
    // Chỉ cần cập nhật state của React
    setCurrentUser(null); 
  };

    // ✅ HÀM MỚI: Cập nhật thông tin user mà không cần login lại
    const updateUser = (userData) => {
      setCurrentUser((prev) => {
        const updated = { ...prev, ...userData };
        localStorage.setItem('user', JSON.stringify(updated));
        return updated;
      });
    };

    const hasRole = (role) => {
      if (!currentUser || !currentUser.roles) return false;
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
          updateUser, // ✅ Export hàm này
          loading,
          error,
          hasRole 
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  };

  export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
  };