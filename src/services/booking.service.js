// src/services/booking.service.js
import axios from "axios";

// Lấy URL từ biến môi trường
const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8386/api/v1";

const getAuthHeader = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        throw new Error("No access token found");
    }
    return { Authorization: `Bearer ${token}` };
};

/**
 * Lấy danh sách lịch sử đặt phòng của user đã đăng nhập
 */
const getMyBookings = async () => {
    try {
        const response = await axios.get(`${API_URL}/customer/bookings`, {
            headers: getAuthHeader(),
        });
        // Giả sử API trả về theo chuẩn ApiResponse
        if (response.data && response.data.success) {
            return response.data.data; // Trả về mảng [Booking, ...]
        }
        return [];
    } catch (error) {
        console.error("Lỗi khi lấy lịch sử đặt phòng:", error);
        throw error;
    }
};

export const bookingService = {
    getMyBookings,
};