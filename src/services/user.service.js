import api from "./axios.config.js"; // ✅ 1. IMPORT API INSTANCE

// Đảm bảo API_URL này đúng
const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8386/api/v1";

const getAuthHeader = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    console.error("No access token found for auth header");
    return {};
  }
  return { Authorization: `Bearer ${token}` };
};

export const userService = {
  /**
   * Lấy thông tin chi tiết (User + UserDetail)
   * Khớp với @GetMapping("/api/v1/user-details/me")
   */
  getUserDetail: async () => {
    const res = await axios.get(`${API_URL}/user-details/me`, {
      headers: getAuthHeader(),
    });
    return res.data;
  },

  /**
   * Cập nhật thông tin (User + UserDetail)
   * Khớp với @PutMapping("/api/v1/user-details/update")
   */
  updateUserDetail: async (data) => {
    const headers = getAuthHeader();
    return axios.put(`${API_URL}/user-details/update`, data, { headers });
  },

  /**
   * Upload ảnh đại diện
   * Khớp với (ví dụ) @PostMapping("/api/v1/user-details/upload-avatar")
   */
  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append("file", file); // Thay "image" bằng "file" cho khớp

    const res = await axios.post(`${API_URL}/user-details/upload-avatar`, formData, {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },

  // === ĐÂY LÀ HÀM BỊ THIẾU ===
  /**
   * Kiểm tra trạng thái hồ sơ
   * Khớp với @GetMapping("/api/v1/user-details/profile-status")
   */
  getProfileStatus: async () => {
    const res = await axios.get(`${API_URL}/user-details/profile-status`, {
      headers: getAuthHeader(),
    });
    return res.data; // API sẽ trả về { isProfileComplete: true/false }
  }
  // === KẾT THÚC HÀM BỊ THIẾU ===
};