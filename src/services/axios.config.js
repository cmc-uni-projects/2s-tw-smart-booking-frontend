import axios from "axios";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:8386/api/v1";

const api = axios.create({
  baseURL: API_URL,
});

// Thêm token vào mọi request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
    
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Tự logout khi token hết hạn
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
