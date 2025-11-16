import api from "./axios.config.js"; // ✅ 1. IMPORT API INSTANCE

// Đảm bảo REACT_APP_API_URL được định nghĩa trong file .env của bạn
const API_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:8386/api/v1";

// ============================
// 🔍 TÌM KIẾM PROPERTIES
// ============================
const searchProperties = async (city, keyword) => {
  try {
    const response = await axios.get(`${API_URL}/properties/search`, {
      params: { city, keyword },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching properties:", error);
    throw error;
  }
};

// ============================
// ➕ THÊM PROPERTY (Cũ - Có thể bạn không dùng nữa)
// ============================
const addProperty = async (propertyData) => {
  const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
  if (!token) throw new Error("Token not found");

  try {
    const response = await axios.post(`${API_URL}/properties/add`, propertyData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding property:", error);
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to add property");
    } else {
      throw new Error("Cannot connect to server");
    }
  }
};

// ============================
// 🔄 CẬP NHẬT PROPERTY
// ============================
const updateProperty = async (id, updatedData) => {
  const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
  if (!token) throw new Error("Token not found");

  try {
    const response = await axios.put(`${API_URL}/properties/update/${id}`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating property:", error);
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to update property");
    } else {
      throw new Error("Cannot connect to server");
    }
  }
};

// ============================
// ⭐ LẤY PROPERTY NỔI BẬT
// ============================
const getFeaturedProperties = async () => {
  try {
    const response = await axios.get(`${API_URL}/properties/featured`);
    return response.data;
  } catch (error) {
    console.error("Error fetching featured properties:", error);
    throw error;
  }
};

// ==========================================================
// 🚀 HÀM MỚI: GỬI ĐƠN ĐĂNG KÝ PROPERTY (MULTIPART FORMDATA)
// ==========================================================
const submitPropertyApplication = async (formData) => {
  const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
  if (!token) throw new Error("Token not found");

  try {
    const response = await axios.post(
      `${API_URL}/properties/submit-application`, // Gọi endpoint mới
      formData, // Gửi FormData trực tiếp
      {
        headers: {
          Authorization: `Bearer ${token}`,
          // "Content-Type": "multipart/form-data" sẽ được Axios tự động thêm
          // khi phát hiện 'formData' là một instance của FormData
        },
      }
    );
    return response.data; // Trả về ApiResponse (success: true, data: PropertyDetailDTO)
  } catch (error) {
    console.error("❌ Error submitting property application:", error);
    if (error.response) {
      // Ném lỗi từ BE để component bắt
      throw new Error(error.response.data.message || "Gửi đơn thất bại");
    } else {
      throw new Error("Không thể kết nối máy chủ");
    }
  }
};
// ==========================================================
// 📦 EXPORT TỔNG
// ==========================================================
const propertyService = {
  searchProperties,
  addProperty,
  updateProperty,
  getFeaturedProperties,
  submitPropertyApplication, // <-- Thêm hàm mới vào export
};

export default propertyService;