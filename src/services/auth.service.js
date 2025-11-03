import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const authService = {
  /**
   * Register new user
   */
  register: async (userData) => {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
  },

  /**
   * Login user
   */
  login: async (credentials) => {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    if (response.data.success && response.data.data) {
      // Store token and user info in localStorage
      localStorage.setItem('accessToken', response.data.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  /**
   * Logout user
   */
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  },

  /**
   * Get current user from localStorage
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  /**
   * Get access token
   */
  getAccessToken: () => {
    return localStorage.getItem('accessToken');
  },

  /**
   * Verify email
   */
  verifyEmail: async (token) => {
    const response = await axios.get(`${API_URL}/auth/verify-email?token=${token}`);
    return response.data;
  },

  /**
   * Resend verification email
   */
  resendVerification: async (email) => {
    const response = await axios.post(`${API_URL}/auth/resend-verification?email=${email}`);
    return response.data;
  },

  /**
   * Forgot password
   */
  forgotPassword: async (email) => {
    const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
    return response.data;
  },

  /**
   * Reset password
   */
  resetPassword: async (token, newPassword, confirmPassword) => {
    const response = await axios.post(`${API_URL}/auth/reset-password`, {
      token,
      newPassword,
      confirmPassword
    });
    return response.data;
  },

  /**
   * Change password
   */
  changePassword: async (oldPassword, newPassword, confirmPassword) => {
    const token = authService.getAccessToken();
    const response = await axios.post(
      `${API_URL}/auth/change-password`,
      {
        oldPassword,
        newPassword,
        confirmPassword
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  },

  /**
   * Get current user info from API
   */
  getMe: async () => {
    const token = authService.getAccessToken();
    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  }
};

export { authService };