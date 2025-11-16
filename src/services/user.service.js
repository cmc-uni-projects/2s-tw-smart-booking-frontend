import api from "./axios.config.js"; // ✅ 1. IMPORT API INSTANCE

// ❌ 2. Xóa API_URL và getAuthHeader (không cần nữa)

export const userService = {
  /**
   * Lấy thông tin chi tiết (User + UserDetail)
   */
  getUserDetail: async () => {
    try {
      // ✅ 3. Dùng 'api.get'. Header được thêm tự động.
      const res = await api.get(`/user-details/me`);
      return res.data; // Trả về DTO (profileData) trực tiếp
    } catch (error) {
      console.error("Error fetching user detail:", error);
      throw error; // Ném lỗi để component (ProfilePage) bắt
    }
  },

  /**
   * Cập nhật thông tin (User + UserDetail)
   */
  updateUserDetail: async (data) => {
    try {
      // ✅ 3. Dùng 'api.put'.
      const res = await api.put(`/user-details/update`, data);
      return res.data; // Trả về ApiResponse { success, data, ... }
    } catch (error) {
      console.error("Error updating user detail:", error);
      // Ném lỗi đầy đủ để ProfilePage bắt (cho logic 409)
      throw error; 
    }
  },

  /**
   * Upload ảnh đại diện
   */
  uploadAvatar: async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file); 

      // ✅ 3. Dùng 'api.post'. 
      // Cả 'Authorization' và 'Content-Type' đều được tự động xử lý.
      const res = await api.post(`/user-details/upload-avatar`, formData);
      return res.data; // Trả về { success, data: { profilePhotoUrl: ... } }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      throw error;
    }
  },

  /**
   * Kiểm tra trạng thái hồ sơ
   */
  getProfileStatus: async () => {
    try {
      // ✅ 3. Dùng 'api.get'.
      const res = await api.get(`/user-details/profile-status`);
      return res.data; // API sẽ trả về { profileComplete: true/false, missingFields: [...] }
    } catch (error) {
      console.error("Error fetching profile status:", error);
      throw error;
    }
  }
};