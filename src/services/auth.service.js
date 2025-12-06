import api from "./axios.config.js"; 

// ============================
// 🔒 AUTH SERVICE
// ============================

// 1. Đăng nhập thường
const login = async (email, password) => {
  try {
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
    api.post(`/auth/logout`, {}).catch(err => console.error(err));
  }
  
  localStorage.removeItem("user");
  localStorage.removeItem("accessToken"); 
  localStorage.removeItem("token"); 
};

// 4. Lấy user từ LocalStorage
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
    const response = await api.post(`/auth/forgot-password`, { email });
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
    const response = await api.post(`/auth/reset-password`, { token, newPassword });
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
    const response = await api.get(`/auth/verify-email`, { 
        params: { token } 
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Email verification failed");
    }
    throw new Error("Cannot connect to server");
  }
};

const fetchUserProfile = async () => {
  try {
    const response = await api.get('/auth/me'); 
    const userData = response.data.data;

    if (!userData.roles && userData.authorities) {
      userData.roles = userData.authorities.map(auth => ({
        roleName: auth.authority.replace("ROLE_", "") // Bỏ tiền tố ROLE_
      }));
    }

    return userData;
  } catch (error) {
    console.error("Fetch profile error:", error);
    throw error;
  }
};

export const authService = {
  login,
  register,
  logout,
  getCurrentUser,
  getAccessToken,
  forgotPassword,
  resetPassword,
  verifyEmail,
  fetchUserProfile, // <-- Đừng quên export hàm mới này
};