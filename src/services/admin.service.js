import api from "./axios.config.js";

const adminService = {
  // ============================
  // 🧑‍💼 LẤY CÁC ĐƠN ĐĂNG KÝ OWNER (Giữ nguyên)
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
  // 📝 DUYỆT ĐƠN ĐĂNG KÝ OWNER (Giữ nguyên)
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
  // 🏨 LẤY DANH SÁCH CƠ SỞ THEO TRẠNG THÁI (🔴 ĐÃ SỬA)
  // ============================
  getPropertiesByStatus: async (status) => {
    try {
      // ✅ GỌI API ĐỘNG: /api/v1/admin/properties/status?status=PENDING
      const response = await api.get(`/admin/properties/status`, {
        params: { status }, 
      });
      
      // ✅ Backend trả về List trực tiếp, nên chỉ cần response.data
      return response.data; 
    } catch (error) {
      console.error("Error fetching properties:", error);
      throw new Error(error.response?.data?.message || "Lỗi khi tải danh sách cơ sở");
    }
  },

  // ============================
  // 🏤 DUYỆT CƠ SỞ (APPROVE / REJECTED) (🟢 GIỮ NGUYÊN VÌ ĐÃ ĐÚNG URL)
  // ============================
  reviewProperty: async (propertyId, reviewData) => {
    try {
      const response = await api.post(
        `/admin/properties/${propertyId}/review`,
        reviewData
      );
      return response.data;
    } catch (error) {
      console.error(`Error reviewing property ${propertyId}:`, error);
      throw new Error(error.response?.data?.message || "Lỗi khi duyệt cơ sở");
    }
  },
};

export default adminService;