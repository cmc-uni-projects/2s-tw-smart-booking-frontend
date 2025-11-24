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

  // ============================
  // 🏤 DUYỆT CƠ SỞ (APPROVE / REJECTED)
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

  // ============================================================
  // 💰 [MỚI] QUẢN LÝ GIAO DỊCH & HOÀN TIỀN
  // ============================================================
  
getAllTransactions: async () => {
    try {
      const response = await api.get("/payment/all");
      // ✅ SỬA: Nếu backend trả về ApiResponse { data: [...] } thì phải lấy .data
      // Kiểm tra an toàn: nếu response.data là mảng thì dùng luôn, nếu là object có field data thì lấy field đó
      const result = response.data;
      return Array.isArray(result) ? result : (result.data || []); 
    } catch (error) {
      console.error("Lỗi lấy danh sách giao dịch:", error);
      throw new Error(error.response?.data?.message || "Không thể tải dữ liệu giao dịch");
    }
  },

  // 2. Xác nhận hoàn tiền
  approveRefund: async (bookingId) => {
    try {
      const response = await api.post(`/payment/refund/${bookingId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default adminService;