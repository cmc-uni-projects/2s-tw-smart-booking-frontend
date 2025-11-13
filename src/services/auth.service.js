// src/services/auth.service.js
import axios from "axios";

const API_URL = "http://localhost:8386/api/v1/auth";

// Helper lấy header chứa token
const getAuthHeader = () => {
    const token = localStorage.getItem("accessToken");
    return { Authorization: `Bearer ${token}` };
};

export const authService = {
  login: (email, password) =>
    axios.post(`${API_URL}/login`, { email, password }),

  register: (fullName, email, password, confirmPassword) =>
    axios.post(`${API_URL}/register`, {
      fullName,
      email,
      password,
      confirmPassword,
    }),

  forgotPassword: (email) =>
    axios.post(`${API_URL}/forgot-password`, { email }),

  resetPassword: (token, newPassword, confirmPassword) =>
    axios.post(`${API_URL}/reset-password`, {
      token,
      newPassword,
      confirmPassword,
    }),

  verifyEmail: (token) =>
    axios.get(`${API_URL}/verify-email`, { params: { token } }),

  // ✅ THÊM HÀM NÀY
  changePassword: (currentPassword, newPassword, confirmPassword) =>
    axios.post(
      `${API_URL}/change-password`,
      { currentPassword, newPassword, confirmPassword },
      { headers: getAuthHeader() }
    ),
};