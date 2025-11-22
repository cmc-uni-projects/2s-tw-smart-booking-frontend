import axios from "./axios.config";

const API_URL = "/promotions";

// ✅ Helper: Chuyển đổi ngày (String/Array) sang chuẩn YYYY-MM-DD
const formatDate = (dateInput) => {
    if (!dateInput) return null;
    // Nếu là mảng [2025, 6, 1] từ Backend
    if (Array.isArray(dateInput)) {
        const [year, month, day] = dateInput;
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
    // Nếu đã là string, trả về nguyên vẹn
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
            discountType: data.type === "PERCENT" ? "PERCENTAGE" : "FIXED_AMOUNT",
            discountValue: data.value,
            // ✅ Fix: Format ngày chuẩn trước khi gửi
            startDate: formatDate(data.startDate),
            endDate: formatDate(data.endDate),
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
            // ✅ Logic DiscountType
            discountType: data.type === "PERCENT" || data.type === "PERCENTAGE" ? "PERCENTAGE" : "FIXED_AMOUNT",
            discountValue: data.value,
            // ✅ Fix: Format ngày chuẩn
            startDate: formatDate(data.startDate),
            endDate: formatDate(data.endDate),
            minBookingAmount: data.minOrder || 0,
            maxDiscountAmount: data.maxDiscount || 0,
            usageLimit: data.quantity && data.quantity > 0 ? data.quantity : null,
            // ✅ Logic Status
            status: data.isActive ? "ACTIVE" : "PAUSED"
        };
        return await axios.put(`${API_URL}/update/${id}`, payload);
    },

    deletePromotion: async (id) => {
        return await axios.delete(`${API_URL}/delete/${id}`);
    }
};

export default promotionService;