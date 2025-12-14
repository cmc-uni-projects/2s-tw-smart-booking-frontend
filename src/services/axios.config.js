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

// Interceptor xử lý phản hồi (Response)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const { response } = error;

        if (response) {
            // 1. Xử lý lỗi 401: Token hết hạn hoặc không hợp lệ -> Logout ngay (hoặc có thể dùng Modal nếu muốn đồng bộ)
            if (response.status === 401) {
                localStorage.removeItem("user");
                localStorage.removeItem("accessToken");
                window.location.href = "/login";
            }

            // 2. Xử lý lỗi 403: Không có quyền hoặc TÀI KHOẢN BỊ KHÓA
            if (response.status === 403) {
                const errorMessage = response.data?.error || "";

                // Kiểm tra xem lỗi có phải do tài khoản bị khóa không?
                if (errorMessage && (errorMessage.toLowerCase().includes("khóa") || errorMessage.toLowerCase().includes("locked"))) {

                    // ✅ THAY ĐỔI QUAN TRỌNG:
                    // Thay vì alert() và logout ngay, ta phát tín hiệu để Component React (SessionExpiredHandler) hiện Modal
                    window.dispatchEvent(new CustomEvent("auth:account-locked", {
                        detail: errorMessage
                    }));

                    // Lưu ý: Không thực hiện redirect hay xóa token ở đây nữa.
                    // Việc đó sẽ do Modal thực hiện khi người dùng bấm nút xác nhận.
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;