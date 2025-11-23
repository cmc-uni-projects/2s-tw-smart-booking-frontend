import axios from "./axios.config";

const API_URL = "/promotions";

// ✅ Helper: Chuyển đổi ngày giờ sang chuẩn LocalDateTime (YYYY-MM-DDTHH:mm:ss)
const formatDateTime = (dateInput, isEndOfDay = false) => {
    if (!dateInput) return null;

    // 1. Nếu là chuỗi "YYYY-MM-DD" (từ input type="date") -> Thêm giờ
    if (typeof dateInput === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
        const time = isEndOfDay ? '23:59:59' : '00:00:00';
        return `${dateInput}T${time}`;
    }

    // 2. Nếu là mảng từ Backend [2025, 6, 1, 14, 30, 0] -> "2025-06-01T14:30:00"
    if (Array.isArray(dateInput)) {
        const [year, month, day, hour = 0, minute = 0, second = 0] = dateInput;
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
    }

    // 3. Nếu là đối tượng Date -> Format thủ công giữ nguyên múi giờ Local
    if (dateInput instanceof Date) {
        const year = dateInput.getFullYear();
        const month = String(dateInput.getMonth() + 1).padStart(2, '0');
        const day = String(dateInput.getDate()).padStart(2, '0');
        // Nếu cần end of day cho Date object
        if (isEndOfDay) {
            return `${year}-${month}-${day}T23:59:59`;
        }
        const hour = String(dateInput.getHours()).padStart(2, '0');
        const minute = String(dateInput.getMinutes()).padStart(2, '0');
        const second = String(dateInput.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
    }

    // 4. Nếu là chuỗi ISO có sẵn (VD: "2025-11-20T10:00:00"), trả về nguyên vẹn
    if (typeof dateInput === 'string' && dateInput.includes('T')) {
        return dateInput;
    }

    return dateInput;
};

const promotionService = {
    getAllPromotions: async () => {
        const response = await axios.get(`${API_URL}/all`);
        return response.data;
    },

    createPromotion: async (data) => {
        const payload = {
            code: data.code,
            description: data.name,
            discountType: data.type === "PERCENT" || data.type === "PERCENTAGE" ? "PERCENTAGE" : "FIXED_AMOUNT",
            discountValue: data.value,
            // ✅ Gửi start date là 00:00:00
            startDate: formatDateTime(data.startDate, false),
            // ✅ Gửi end date là 23:59:59
            endDate: formatDateTime(data.endDate, true),
            minBookingAmount: data.minOrder || 0,
            maxDiscountAmount: data.maxDiscount || 0,
            usageLimit: data.quantity && data.quantity > 0 ? data.quantity : null,
            status: "ACTIVE"
        };
        return await axios.post(`${API_URL}/create`, payload);
    },

    updatePromotion: async (id, data) => {
        const payload = {
            code: data.code,
            description: data.name,
            discountType: data.type === "PERCENT" || data.type === "PERCENTAGE" ? "PERCENTAGE" : "FIXED_AMOUNT",
            discountValue: data.value,
            // ✅ Gửi start date là 00:00:00
            startDate: formatDateTime(data.startDate, false),
            // ✅ Gửi end date là 23:59:59
            endDate: formatDateTime(data.endDate, true),
            minBookingAmount: data.minOrder || 0,
            maxDiscountAmount: data.maxDiscount || 0,
            usageLimit: data.quantity && data.quantity > 0 ? data.quantity : null,
            status: data.isActive ? "ACTIVE" : "PAUSED"
        };
        return await axios.put(`${API_URL}/update/${id}`, payload);
    },

    // 3. XÓA MỀM (SOFT DELETE)
    softDeletePromotion: async (id, currentPromotionData) => {
        const dataToSend = {
            ...currentPromotionData,
            status: "DELETED",
        };
        // Sử dụng lại logic update nhưng đảm bảo ngày tháng được format đúng lại
        // Lưu ý: currentPromotionData từ backend trả về thường là mảng ngày, formatDateTime xử lý được.
        return await promotionService.updatePromotion(id, dataToSend);
    },

    deletePromotion: async (id) => {
        return await axios.delete(`${API_URL}/delete/${id}`);
    }
};

export default promotionService;