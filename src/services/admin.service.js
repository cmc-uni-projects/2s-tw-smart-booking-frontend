import axios from "axios";

// Đảm bảo REACT_APP_API_URL được định nghĩa trong file .env của bạn
const API_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:8386/api/v1";

// ============================
// 🔒 LẤY TOKEN HELPER
// ============================
const getAuthHeader = () => {
  const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
  if (!token) throw new Error("Token not found");
  return { Authorization: `Bearer ${token}` };
};

// ============================
// 🧑‍💼 LẤY CÁC ĐƠN ĐĂNG KÝ (OWNER)
// ============================
const getOwnerApplications = async (status) => {
  try {
    const response = await axios.get(`${API_URL}/admin/owner-applications`, {
      params: { status },
      headers: getAuthHeader(),
    });
    return response.data; // Giả sử trả về ApiResponse { success, message, data }
  } catch (error) {
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
    const response = await axios.post(
      `${API_URL}/admin/owner-applications/${applicationId}/review`,
      reviewData, // { status: "APPROVE" | "REJECTED", reason: "..." }
      {
        headers: getAuthHeader(),
      }
    );
    return response.data; // Trả về ApiResponse
  } catch (error) {
    console.error("Error reviewing owner application:", error);
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to review application");
    } else {
      throw new Error("Cannot connect to server");
    }
  }
};

// ==========================================================
// === CÁC HÀM MỚI CHO TRANG HOTEL SUBMISSIONS (Property) ===
// ==========================================================

// ============================
// 🏨 LẤY DANH SÁCH CƠ SỞ THEO TRẠNG THÁI
// ============================
const getPropertiesByStatus = async (status) => {
  try {
    // SỬA LỖI: Gọi đến đúng endpoint /admin/properties/pending của backend
    const response = await axios.get(`${API_URL}/admin/properties/pending`, {
      headers: getAuthHeader(),
    });
    return response.data; // Trả về ApiResponse { success, message, data: [PropertyDetailDTO] }
  } catch (error) {
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
    // reviewData là { status: "APPROVE" | "REJECTED", reason: "..." }
    // SỬA LỖI: Thêm tiền tố /admin vào URL
    const response = await axios.post(
      `${API_URL}/admin/properties/${propertyId}/review`,
      reviewData,
      {
        headers: getAuthHeader(),
      }
    );
    return response.data; // Trả về ApiResponse { success, message, data: PropertyDetailDTO }
  } catch (error) {
    console.error(`Error reviewing property ${propertyId}:`, error);
    if (error.response) {
      throw new Error(error.response.data.message || "Lỗi khi duyệt cơ sở");
    } else {
      throw new Error("Không thể kết nối máy chủ");
    }
  }
};
// ==========================================================
// 📦 EXPORT TỔNG
// ==========================================================
const adminService = {
  getOwnerApplications,
  reviewOwnerApplication,
  getPropertiesByStatus, // <-- Hàm mới
  reviewProperty,        // <-- Hàm mới
};

export default adminService;