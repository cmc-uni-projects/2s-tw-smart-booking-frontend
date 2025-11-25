import api from "./axios.config.js";

// Dữ liệu giả lập để test giao diện (Khi nào có API Backend thật thì xóa đi)
const adminService = {
  // ============================
  // 🧑‍💼 LẤY CÁC ĐƠN ĐĂNG KÝ OWNER
  // ============================
  getOwnerApplications: async (status) => {
    try {
      const response = await api.get(`/admin/owner-applications`, {
        params: { status },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching owner applications:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch applications");
    }
  },

  // ============================
  // 📝 DUYỆT ĐƠN ĐĂNG KÝ OWNER
  // ============================
  reviewOwnerApplication: async (applicationId, reviewData) => {
    try {
      const response = await api.post(
        `/admin/owner-applications/${applicationId}/review`,
        reviewData
      );
      return response.data;
    } catch (error) {
      console.error("Error reviewing owner application:", error);
      throw new Error(error.response?.data?.message || "Failed to review application");
    }
  },

  // ============================
  // 🏨 LẤY DANH SÁCH CƠ SỞ THEO TRẠNG THÁI
  // ============================
  getPropertiesByStatus: async (status) => {
    try {
      const response = await api.get(`/admin/properties/status`, {
        params: { status }, 
      });
      return response.data; 
    } catch (error) {
      console.error("Error fetching properties:", error);
      throw new Error(error.response?.data?.message || "Lỗi khi tải danh sách cơ sở");
    }
  },
};

export default adminService;