import axios from "axios";

// Lấy URL từ biến môi trường hoặc fallback về localhost
const API_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:8386/api/v1";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// =========================================================================
// 1. REQUEST INTERCEPTOR: Tự động đính kèm Token vào mọi request
// =========================================================================
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

// =========================================================================
// 2. RESPONSE INTERCEPTOR: Xử lý lỗi tập trung
// =========================================================================
api.interceptors.response.use(
    (response) => {
        return response; // Request thành công -> trả về data
    },
    (error) => {
        const { response } = error;

        if (response) {
            // Lấy URL của request bị lỗi để kiểm tra nguồn gốc
            const requestUrl = error.config?.url || "";

            // -----------------------------------------------------------
            // CASE 1: Lỗi 401 (Unauthorized) - Token hết hạn hoặc Sai mật khẩu
            // -----------------------------------------------------------
            if (response.status === 401) {
                // 🛑 QUAN TRỌNG:
                // Nếu lỗi 401 đến từ API Login (/auth/login) -> Đừng reload/redirect.
                // Hãy trả lỗi về cho component Login để nó hiện thông báo "Sai tài khoản/mật khẩu".
                if (requestUrl.includes("/auth/login") || requestUrl.includes("/auth/token")) {
                    return Promise.reject(error);
                }

                // Nếu lỗi 401 xảy ra ở các trang khác (khi đang lướt web) -> Token hết hạn thật.
                // Xóa token và đá người dùng về trang đăng nhập.
                localStorage.clear(); // Xóa sạch user, token, refresh token
                window.location.href = "/login";
                return Promise.reject(error);
            }

            // -----------------------------------------------------------
            // CASE 2: Lỗi 403 (Forbidden) - Tài khoản bị KHÓA hoặc Không có quyền
            // -----------------------------------------------------------
            if (response.status === 403) {
                const errorMessage = response.data?.message || response.data?.error || "";

                // Kiểm tra xem message có chứa từ khóa liên quan đến việc bị khóa không
                // (Backend trả về: "Tài khoản bị khóa...", "Account locked...", "User is banned...")
                const isAccountLocked = [
                    "khóa", "lock", "ban", "disabled", "inactive"
                ].some(keyword => errorMessage.toLowerCase().includes(keyword));

                if (isAccountLocked) {
                    // 🔥 PHÁT SỰ KIỆN TOÀN CỤC "auth:account-locked"
                    // App.jsx (SessionExpiredHandler) sẽ lắng nghe sự kiện này và bật Modal lên.
                    window.dispatchEvent(new CustomEvent("auth:account-locked", {
                        detail: errorMessage || "Tài khoản của bạn đã bị khóa."
                    }));
                }
            }
        }

        // Trả lỗi về cho component gọi API để nó có thể xử lý riêng (nếu cần)
        return Promise.reject(error);
    }
);

export default api;