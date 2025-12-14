import axios from "axios";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:8386/api/v1";

const api = axios.create({
    baseURL: API_URL,
});

// Thêm token vào request (Giữ nguyên)
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

// ✅ CẬP NHẬT PHẦN NÀY
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const { response } = error;

        if (response) {
            // 1. Token hết hạn (401)
            if (response.status === 401) {
                localStorage.removeItem("user");
                localStorage.removeItem("accessToken");
                window.location.href = "/login";
            }

            // 2. Tài khoản bị khóa (403)
            if (response.status === 403) {
                const errorMessage = response.data?.error || "";

                // Kiểm tra thông điệp lỗi từ Backend (Cần đảm bảo Backend trả về đúng chuỗi này)
                // Ví dụ Backend trả: { "error": "Tài khoản của bạn đã bị khóa." }
                if (errorMessage && (errorMessage.toLowerCase().includes("khóa") || errorMessage.toLowerCase().includes("locked") || errorMessage.toLowerCase().includes("banned"))) {

                    // 🔥 Phát tín hiệu để React Component nhận biết và hiện Modal
                    // Chúng ta không dùng alert() hay window.location ở đây để UX mượt hơn
                    window.dispatchEvent(new CustomEvent("auth:account-locked", {
                        detail: errorMessage
                    }));
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;