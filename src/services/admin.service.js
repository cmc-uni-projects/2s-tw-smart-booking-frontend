import api from "./axios.config.js"; // ✅ 1. IMPORT API INSTANCE

// ❌ 2. Xóa API_URL và getAuthHeader (không cần nữa)
// const API_URL = ...
// const getAuthHeader = () => { ... };

// ============================
// 🧑‍💼 LẤY CÁC ĐƠN ĐĂNG KÝ (OWNER)
// ============================
const getOwnerApplications = async (status) => {
  try {
    // ✅ 3. Dùng 'api' (headers được tự động thêm)
    const response = await api.get(`/admin/owner-applications`, {
      params: { status },
    });
    return response.data; 
  } catch (error) {
    // ... (xử lý lỗi giữ nguyên)
    console.error("Error fetching owner applications:", error);
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to fetch applications");
    } else {
      throw new Error("Cannot connect to server");
    }
  }
};

// ============================
// 📝 DUYỆT ĐƠN ĐĂNG KÝ (OWNER)
// ============================
const reviewOwnerApplication = async (applicationId, reviewData) => {
  try {
    // ✅ 3. Dùng 'api'
    const response = await api.post(
      `/admin/owner-applications/${applicationId}/review`,
      reviewData 
    );
    return response.data; // Trả về ApiResponse
  } catch (error) {
    // ... (xử lý lỗi giữ nguyên)
    console.error("Error reviewing owner application:", error);
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to review application");
    } else {
      throw new Error("Cannot connect to server");
    }
  }
};

// ============================
// 🏨 LẤY DANH SÁCH CƠ SỞ THEO TRẠNG THÁI
// ============================
const getPropertiesByStatus = async (status) => {
  try {
    // ✅ 3. Dùng 'api'
    const response = await api.get(`/admin/properties/pending`);
    return response.data; 
  } catch (error) {
    // ... (xử lý lỗi giữ nguyên)
    console.error(`Error fetching properties with status ${status}:`, error);
    if (error.response) {
      throw new Error(error.response.data.message || "Lỗi khi tải danh sách cơ sở");
    } else {
      throw new Error("Không thể kết nối máy chủ");
    }
  }
};

// ============================
// 🏤 DUYỆT CƠ SỞ (APPROVE / REJECTED)
// ============================
const reviewProperty = async (propertyId, reviewData) => {
  try {
    // ✅ 3. Dùng 'api'
    const response = await api.post(
      `/admin/properties/${propertyId}/review`,
      reviewData
    );
    return response.data; 
  } catch (error) {
    // ... (xử lý lỗi giữ nguyên)
    console.error(`Error reviewing property ${propertyId}:`, error);
    if (error.response) {
      throw new Error(error.response.data.message || "Lỗi khi duyệt cơ sở");
    } else {
      throw new Error("Không thể kết nối máy chủ");
    }
  }
};

// Export (giữ nguyên)
const adminService = {
  getOwnerApplications,
  reviewOwnerApplication,
  getPropertiesByStatus, 
  reviewProperty,
};

export default adminService;