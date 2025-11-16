import api from "./axios.config.js"; // ✅ Đã import

// ============================
// 🔍 TÌM KIẾM PROPERTIES (Public)
// ============================
const searchProperties = async (city, keyword) => {
  try {
    // ✅ SỬA: Dùng 'api.get'
    const response = await api.get(`/properties/search`, {
      params: { city, keyword },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching properties:", error);
    throw error;
  }
};

// ============================
// ➕ THÊM PROPERTY (Cũ)
// ============================
const addProperty = async (propertyData) => {
  try {
    // ✅ SỬA: Dùng 'api.post'. Header được thêm tự động.
    const response = await api.post(`/properties/add`, propertyData);
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
  try {
    // ✅ SỬA: Dùng 'api.put'. Header được thêm tự động.
    const response = await api.put(`/properties/update/${id}`, updatedData);
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
// ⭐ LẤY PROPERTY NỔI BẬT (Public)
// ============================
const getFeaturedProperties = async () => {
  try {
    // ✅ SỬA: Dùng 'api.get'
    const response = await api.get(`/properties/featured`);
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
  try {
    // ✅ SỬA: Dùng 'api.post'. 
    // Header 'Authorization' và 'Content-Type: multipart/form-data'
    // sẽ được tự động xử lý.
    const response = await api.post(
      `/properties/submit-application`,
      formData 
    );
    return response.data; // Trả về ApiResponse (success: true, data: PropertyDetailDTO)
  } catch (error) {
    console.error("❌ Error submitting property application:", error);
    if (error.response) {
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
  submitPropertyApplication,
};

export default propertyService;