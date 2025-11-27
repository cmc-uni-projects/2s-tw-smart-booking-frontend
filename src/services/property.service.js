import api from "./axios.config.js";



// ============================
// 📤 SUBMIT PROPERTY APPLICATION
// ============================
const submitPropertyApplication = async (formData) => {
  try {
    const response = await api.post("/properties/submit-application", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};


const getOwnerActiveProperties = async () => {
  try {
    const response = await api.get("/properties/my-active-properties");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// ============================
// 🔍 TÌM KIẾM PROPERTIES
// ============================
const searchProperties = async (keyword, guests, checkIn, checkOut) => {
  try {
    // ✅ SỬA: Gửi thêm checkIn và checkOut
    const response = await api.get(`/properties/search`, {
      params: { 
        keyword: keyword || "", 
        guests: guests || 1,
        checkIn: checkIn || null,   // Thêm dòng này
        checkOut: checkOut || null  // Thêm dòng này
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching properties:", error);
    throw error;
  }
};

// ============================
// 🏠 LẤY DANH SÁCH CỦA OWNER
// ============================
const getOwnerProperties = async () => {
  try {
    const response = await api.get("/properties/my-properties");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// ============================
// ⚙️ CẬP NHẬT THÔNG TIN CƠ BẢN
// ============================
const updateProperty = async (id, updatedData) => {
  try {
    const response = await api.put(`/properties/update/${id}`, updatedData);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("Failed to update property");
  }
};

// ==========================================================
// 🖼️ QUẢN LÝ HÌNH ẢNH (THEO CONTROLLER MỚI)
// ==========================================================

// 1. Lấy danh sách ảnh
const getPropertyImages = async (propertyId) => {
  try {
    // GET /api/v1/propertyImage/{propertyId}
    const response = await api.get(`/propertyImage/${propertyId}`);
    return response.data; // Trả về List<PropertyImageResponseDTO>
  } catch (error) {
    console.error("Error fetching images:", error);
    throw error;
  }
};

// 2. Upload nhiều ảnh
const uploadPropertyImages = async (propertyId, formData) => {
  try {
    // POST /api/v1/propertyImage/upload-multiple/{propertyId}
    const response = await api.post(
      `/propertyImage/upload-multiple/${propertyId}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading images:", error);
    throw error;
  }
};

// 3. Xóa ảnh
const deletePropertyImage = async (propertyId, imageId) => {
  try {
    // DELETE /api/v1/propertyImage/delete/{propertyId}/{imageId}
    const response = await api.delete(`/propertyImage/delete/${propertyId}/${imageId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
};

// 4. Đặt ảnh bìa
const setCoverImage = async (propertyId, imageId) => {
  try {
    // ⚠️ Lưu ý: Controller của bạn đang là @PutMapping("/{imageId}/set-cover")
    // nhưng lại yêu cầu @PathVariable propertyId. 
    // Code dưới đây giả định bạn sẽ sửa backend thành @PutMapping("/{propertyId}/{imageId}/set-cover")
    // Nếu không sửa backend, code này sẽ lỗi 404 hoặc 400.
    const response = await api.put(`/propertyImage/${propertyId}/${imageId}/set-cover`);
    return response.data;
  } catch (error) {
    console.error("Error setting cover image:", error);
    throw error;
  }
};

//Lấy chi tiết thông tin cơ sở
const getPropertyDetail = async (id, checkIn, checkOut) => {
  try {
    const response = await api.get(`/properties/${id}`, {
      params: {
        checkIn: checkIn || null,
        checkOut: checkOut || null
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
// ============================
// 🗺️ TÌM KHÁCH SẠN QUANH ĐÂY (MAP EXPLORE) -> [MỚI THÊM]
// ============================
const findNearbyProperties = async (lat, lng, radius = 10) => {
  try {
    const response = await api.get(`/properties/nearby`, {
      params: { lat, lng, radius }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching nearby properties:", error);
    return [];
  }
};
//Thêm chính sách cho property
const addPropertyPolicies = async (propertyId, policyData) => {
  try {
    const response = await api.post(`/properties/${propertyId}/policies`, policyData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// ==========================================================
// 📦 EXPORT
// ==========================================================
const propertyService = {
  searchProperties,
  getOwnerProperties,
  getPropertyDetail,
  updateProperty,
  getPropertyImages,   
  uploadPropertyImages,
  deletePropertyImage,  
  setCoverImage,
  getOwnerActiveProperties,
  submitPropertyApplication,
  findNearbyProperties,
  addPropertyPolicies,     
};

export default propertyService;
