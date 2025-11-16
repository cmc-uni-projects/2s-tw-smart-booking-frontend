import axios from "axios";

// Lấy URL API từ biến môi trường
const API_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:8386/api/v1";

// 1. Tạo một 'instance' axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Dùng 'interceptors' để thêm token vào MỌI request
// (Đây là cách làm đúng, thay vì dùng getAuthHeader() ở mọi hàm)
api.interceptors.request.use(
  (config) => {
    // KHÔNG DÙNG useAuth() ở đây
    // Lấy token trực tiếp từ localStorage
    const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
    
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. (Tùy chọn) Tự động logout khi gặp lỗi 401 (Token hết hạn)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // KHÔNG DÙNG useAuth().logout() ở đây
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      
      // Tải lại trang để đưa người dùng về trang login
      // (Cách đơn giản nhất để reset state)
      window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default api;