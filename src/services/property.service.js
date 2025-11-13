// src/services/property.service.js
import axios from "axios";

// ✅ Cấu hình base URL: bạn có thể set trong .env hoặc để mặc định là localhost:8386
// Ví dụ .env:
// VITE_API_BASE_URL=http://localhost:8386/api/v1
const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8386/api/v1";

// ============================
// 🔍 SEARCH PROPERTIES
// ============================
const searchProperties = async (params) => {
  try {
    // Lọc bỏ các params null / rỗng
    const cleanParams = Object.keys(params).reduce((acc, key) => {
      const value = params[key];
      if (value !== null && value !== undefined && value !== "") {
        acc[key] = value;
      }
      return acc;
    }, {});

    console.log("📤 Sending search request with params:", cleanParams);

    // Gọi API tới backend: /api/v1/properties/search
    const response = await axios.get(`${API_URL}/properties/search`, {
      params: cleanParams,
    });

    console.log("✅ Received response:", response.data);
    return response.data; // Trả về mảng Property[]
  } catch (error) {
    console.error("❌ Error fetching properties:", error);
    // Nếu server có trả message thì log chi tiết
    if (error.response) {
      console.error("Server response:", error.response.data);
      throw new Error(error.response.data || "Failed to fetch properties");
    } else {
      throw new Error("Cannot connect to API server");
    }
  }
};

// ============================
// 🏠 THÊM PROPERTY (OWNER, ADMIN)
// ============================
const addProperty = async (propertyData, token) => {
  try {
    const response = await axios.post(`${API_URL}/properties/add`, propertyData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error adding property:", error);
    throw error;
  }
};

// ============================
// ✏️ UPDATE PROPERTY (OWNER, ADMIN)
// ============================
const updateProperty = async (id, updatedData, token) => {
  try {
    const response = await axios.put(`${API_URL}/properties/update/${id}`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error updating property:", error);
    throw error;
  }
};

// ============================
// ⭐ LẤY DANH SÁCH FEATURED PROPERTY
// ============================
const getFeaturedProperties = async () => {
  try {
    const response = await axios.get(`${API_URL}/properties/featured`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching featured properties:", error);
    throw error;
  }
};

// ============================
// 📦 EXPORT TỔNG
// ============================
const propertyService = {
  searchProperties,
  addProperty,
  updateProperty,
  getFeaturedProperties,
};

export default propertyService;
