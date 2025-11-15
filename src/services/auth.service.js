import axios from "axios";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:8386/api/v1";

// ============================
// 🔒 AUTH SERVICE
// ============================

// CODE ĐÃ SỬA TRONG auth.service.js
const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });

    // Sửa 'token' thành 'accessToken'
    if (response.data && response.data.data.accessToken) { // <-- SỬA Ở ĐÂY
      const { accessToken, user } = response.data.data; // <-- SỬA Ở ĐÂY
      localStorage.setItem("accessToken", accessToken); // <-- SỬA Ở ĐÂY
      localStorage.setItem("user", JSON.stringify(user));
      return response.data.data; // Trả về { accessToken, user, ... }
    }
    // Nếu cấu trúc data không đúng
    throw new Error(response.data.message || "Login failed");
  } catch (error) {
    // Nếu axios ném lỗi (vd: 401, 404, 500)
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Login failed");
    }
    // Nếu không thể kết nối (lỗi mạng, CORS,...)
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