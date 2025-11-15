// src/services/booking.service.js
import axiosClient from "@/api/axiosClient";



export const bookingService = {
    /**
     * Lấy danh sách booking của user hiện tại.
     * THAY ĐỔI endpoint nếu backend dùng đường dẫn khác.
     */
    getMyBookings: async () => {
        try {
            // Mặc định mình để endpoint: /api/customer/bookings/my
            // Nếu backend khác (ví dụ: /bookings/my hoặc /bookings/me) -> sửa lại ở đây.
            const res = await axiosClient.get("/api/customer/bookings/my");

            // Trường hợp axiosClient trả về res.data chứa { success, data }
            if (res && res.data && (res.data.success !== undefined)) {
                return res.data;
            }

            // Nếu axiosClient đã unwrap data (res là data), normalize:
            if (res && res.success !== undefined) {
                return res;
            }

            // Nếu backend trả danh sách trực tiếp
            return { success: true, data: res.data ?? res };
        } catch (err) {
            console.error("bookingService.getMyBookings error:", err);
            return { success: false, error: err.response?.data || err.message || err };
        }
    },
};
