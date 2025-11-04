import axios from "axios";

const API_URL = "http://localhost:8386/api/v1/auth";

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

  // gửi mail chứa link reset password (?token=...)
  forgotPassword: (email) =>
    axios.post(`${API_URL}/forgot-password`, { email }),

  // đặt lại mật khẩu qua token trong URL
  resetPassword: (token, newPassword, confirmPassword) =>
    axios.post(`${API_URL}/reset-password`, {
      token,
      newPassword,
      confirmPassword,
    }),

  // xác minh email (nếu cần dùng từ FE)
  verifyEmail: (token) =>
    axios.get(`${API_URL}/verify-email`, { params: { token } }),
};