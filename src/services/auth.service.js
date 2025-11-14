import axios from "axios";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:8386/api/v1";

// ============================
// 🔒 AUTH SERVICE
// ============================

// 1. Đăng nhập
const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });

    if (response.data && response.data.data.token) {
      const { token, user } = response.data.data;
      localStorage.setItem("accessToken", token);
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
const register = async (fullName, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, {
      fullName,
      email,
      password,
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
    axios.post(`${API_URL}/auth/logout`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  localStorage.removeItem("user");
  // Sửa lỗi: Xóa đúng key "accessToken"
  localStorage.removeItem("accessToken"); 
  localStorage.removeItem("token");
};

// 4. Lấy thông tin user hiện tại từ local storage
const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  if (userStr) return JSON.parse(userStr);
  return null;
};

// 5. Lấy token
const getAccessToken = () => {
  return localStorage.getItem("accessToken") || localStorage.getItem("token");
};

// 6. Quên mật khẩu
const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Forgot password failed");
    }
    throw new Error("Cannot connect to server");
  }
};

// 7. Reset mật khẩu
const resetPassword = async (token, newPassword) => {
  try {
    const response = await axios.post(`${API_URL}/auth/reset-password`, { token, newPassword });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Reset password failed");
    }
    throw new Error("Cannot connect to server");
  }
};

// 8. Xác thực Email
const verifyEmail = async (token) => {
  try {
    const response = await axios.post(`${API_URL}/auth/verify-email`, { token });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Email verification failed");
    }
    throw new Error("Cannot connect to server");
  }
};


// ▼▼▼ THAY ĐỔI CÁCH EXPORT TẠI ĐÂY ▼▼▼
// Export một object có tên là "authService"
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

// (Không còn export default nữa)