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
  reviewProperty: async (propertyId, reviewData) => {
    try {
      // reviewData thường gồm: { status: "APPROVED" | "REJECTED", reason: "..." }
      const response = await api.post(
        `/admin/properties/${propertyId}/review`, 
        reviewData
      );
      return response.data;
    } catch (error) {
      console.error("Error reviewing property:", error);
      throw new Error(error.response?.data?.message || "Lỗi khi duyệt cơ sở lưu trú");
    }
  },
  getDashboardStats: async () => {
    try {
      // Endpoint này map với AdminApplicationController.getDashboardStats
      const response = await api.get("/admin/owner-applications/dashboard-stats");
      return response.data; // Trả về toàn bộ ApiResponse
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw error;
    }
  },
  // ============================
  // 🏨 QUẢN LÝ KHÁCH SẠN (ACTIVE)
  // ============================
  
  // 1. Lấy danh sách khách sạn đang hoạt động (có phân trang)
  getActiveProperties: async (page = 0, size = 10) => {
    try {
      const response = await api.get(`/admin/properties/active`, {
        params: { page, size }
      });
      return response.data; // Trả về ApiResponse
    } catch (error) {
      console.error("Error fetching active properties:", error);
      throw error;
    }
  },

  // 2. Dừng hoạt động khách sạn
  suspendProperty: async (propertyId, reason) => {
    try {
      const response = await api.put(`/admin/properties/${propertyId}/suspend`, {
        reason
      });
      return response.data;
    } catch (error) {
      console.error("Error suspending property:", error);
      throw error;
    }
  },

  // ============================
  // 🛏️ QUẢN LÝ PHÒNG (CỦA KHÁCH SẠN)
  // ============================

  // 3. Lấy danh sách phòng của 1 khách sạn
  getPropertyRooms: async (propertyId) => {
    try {
      const response = await api.get(`/admin/properties/${propertyId}/rooms`);
      return response.data;
    } catch (error) {
      console.error("Error fetching property rooms:", error);
      throw error;
    }
  },

  // 4. Dừng hoạt động phòng
  suspendRoom: async (roomId, reason) => {
    try {
      const response = await api.put(`/admin/rooms/${roomId}/suspend`, {
        reason
      });
      return response.data;
    } catch (error) {
      console.error("Error suspending room:", error);
      throw error;
    }
  },
};


export default adminService;