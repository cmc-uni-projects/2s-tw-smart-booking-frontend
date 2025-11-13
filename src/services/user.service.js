import axios from "axios";

// Lấy URL từ biến môi trường hoặc mặc định
const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8386/api/v1";

const getAuthHeader = () => {
  const token = localStorage.getItem("accessToken");
  return { Authorization: `Bearer ${token}` };
};

export const userService = {
  // 1. Lấy thông tin chi tiết (User + UserDetail)
  getMyProfile: async () => {
    const res = await axios.get(`${API_URL}/userdetails/search`, {
      headers: getAuthHeader(),
    });
    return res.data;
  },

  // 2. Cập nhật thông tin (Tự động chọn Add hoặc Edit dựa trên việc đã có ID chưa)
  updateProfile: async (data) => {
    const headers = getAuthHeader();
    // Nếu đã có userdetailId thì gọi API sửa, ngược lại gọi API thêm mới
    if (data.userdetailId) {
      return axios.put(`${API_URL}/userdetails/edit`, data, { headers });
    } else {
      return axios.post(`${API_URL}/userdetails/add`, data, { headers });
    }
  },

  // 3. Upload ảnh đại diện
  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append("image", file); // Key 'image' phải khớp với Backend @RequestParam("image")

    const res = await axios.post(`${API_URL}/userdetails/upload-photo`, formData, {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  }
};