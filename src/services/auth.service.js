import api from "./axios.config.js"; // ✅ 1. IMPORT API INSTANCE

// ❌ 2. Xóa API_URL (đã có trong config)
// const API_URL = ...

// ============================
// 🔒 AUTH SERVICE
// ============================

const login = async (email, password) => {
  try {
    // ✅ 3. Dùng 'api' (không cần URL đầy đủ)
    const response = await api.post(`/auth/login`, {
      email,
      password,
    });

    if (response.data && response.data.data.accessToken) { 
      const { accessToken, user } = response.data.data; 
      localStorage.setItem("accessToken", accessToken); 
      localStorage.setItem("user", JSON.stringify(user));
      return response.data.data; 
    }
    throw new Error(response.data.message || "Login failed");
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Login failed");
    }
    throw new Error("Cannot connect to server");
  }
};

// 2. Đăng ký
const register = async (fullName, email, password, confirmPassword) => {
  try {
    // ✅ 3. Dùng 'api'
    const response = await api.post(`/auth/register`, {
      fullName,
      email,
      password,
      confirmPassword,
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Registration failed");
    }
    throw new Error("Cannot connect to server");
  }
};

// 3. Đăng xuất
const logout = (token) => {
  if (token) {
    // ✅ 3. Dùng 'api' (headers đã được interceptor tự thêm)
    api.post(`/auth/logout`, {});
  }
  
  localStorage.removeItem("user");
  localStorage.removeItem("accessToken"); 
  localStorage.removeItem("token"); // Xóa token cũ
};

// (Các hàm getCurrentUser và getAccessToken giữ nguyên)
const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  if (userStr) return JSON.parse(userStr);
  return null;
};
const getAccessToken = () => {
  return localStorage.getItem("accessToken") || localStorage.getItem("token");
};


// 6. Quên mật khẩu
const forgotPassword = async (email) => {
  try {
    // ✅ 3. Dùng 'api'
    const response = await api.post(`/auth/forgot-password`, { email });
    return response.data;
  } catch (error) {
    // ... (xử lý lỗi giữ nguyên)
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Forgot password failed");
    }
    throw new Error("Cannot connect to server");
  }
};

// 7. Reset mật khẩu
const resetPassword = async (token, newPassword) => {
  try {
    // ✅ 3. Dùng 'api'
    const response = await api.post(`/auth/reset-password`, { token, newPassword });
    return response.data;
  } catch (error) {
    // ... (xử lý lỗi giữ nguyên)
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Reset password failed");
    }
    throw new Error("Cannot connect to server");
  }
};

// 8. Xác thực Email
const verifyEmail = async (token) => {
  try {
    // ✅ 3. Dùng 'api'
    const response = await api.get(`/auth/verify-email`, { 
        params: { token } 
    });
    return response.data;
  } catch (error) {
    // ... (xử lý lỗi giữ nguyên)
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Email verification failed");
    }
    throw new Error("Cannot connect to server");
  }
};

// Export (giữ nguyên)
export const authService = {
  login,
  register,
  logout,
  getCurrentUser,
  getAccessToken,
  forgotPassword,
  resetPassword,
  verifyEmail,
};