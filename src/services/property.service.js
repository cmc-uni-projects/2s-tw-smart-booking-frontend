import axios from "axios";

// ✅ SỬA 1: Đổi cổng (port) mặc định sang 8386 của bạn
const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8386/api/v1";

const searchProperties = async (params) => {
  // Lọc ra các params không rỗng
  const cleanParams = Object.keys(params).reduce((acc, key) => {
    if (params[key] !== null && params[key] !== undefined && params[key] !== "") {
      acc[key] = params[key];
    }
    return acc;
  }, {});

  // 'await' ở đây để lấy 'response'
  const response = await axios.get(`${API_URL}/properties/search`, {
    params: cleanParams,
  });
  
  // ✅ SỬA 2: Trả về 'response.data' (mảng)
  // File HotelSearchPage.jsx của bạn cần mảng 'results'
  return response.data;
};

// Gom hàm vào đối tượng và 'export default'
const propertyService = {
  searchProperties,
};

export default propertyService;