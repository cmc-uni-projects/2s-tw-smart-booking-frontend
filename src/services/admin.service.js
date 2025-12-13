import api from "./axios.config.js";

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

  // ============================
  // 👥 QUẢN LÝ NGƯỜI DÙNG (USERS) - [NEW]
  // ============================
  getAllUsers: async (page = 0, size = 10, search = "", role = "ALL", status = "ALL") => {
    const params = {
      page,
      size,
      search: search || undefined, // Nếu rỗng thì không gửi lên param này
    };

    // Chỉ gửi params role/status nếu không phải là "ALL"
    if (role !== "ALL") params.role = role;
    if (status !== "ALL") params.status = status;

    try {
      const response = await api.get("/admin/users", { params });
      return response.data; // Trả về ApiResponse chứa Page<AdminUserResponseDTO>
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new Error(error.response?.data?.message || "Lỗi khi tải danh sách người dùng");
    }
  },

  updateUserStatus: async (userId, newStatus) => {
    try {
      // Endpoint BE: PATCH /api/admin/users/{userId}/status?status=...
      const response = await api.patch(`/admin/users/${userId}/status`, null, {
        params: { status: newStatus }
      });
      return response.data;
    } catch (error) {
      console.error("Error updating user status:", error);
      throw new Error(error.response?.data?.message || "Lỗi cập nhật trạng thái người dùng");
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw new Error(error.response?.data?.message || "Lỗi khi xóa người dùng");
    }
  },

  // ============================
  // 📊 THỐNG KÊ DASHBOARD
  // ============================
  getDashboardStats: async () => {
    try {
      const response = await api.get("/admin/owner-applications/dashboard-stats");
      return response.data;
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw error;
    }
  },
};

export default adminService;