import axios from "./axios.config";

const API_URL = "/promotions";

// ✅ Helper: Chuyển đổi ngày (String/Array/Date) sang chuẩn YYYY-MM-DD
const formatDate = (dateInput) => {
    if (!dateInput) return null;

    // 1. Nếu là mảng [2025, 6, 1] (Backend trả về) -> chuyển thành chuỗi "2025-06-01"
    if (Array.isArray(dateInput)) {
        const [year, month, day] = dateInput;
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }

    // 2. Nếu là chuỗi có dính giờ (VD: "2025-11-20T00:00:00") -> Cắt bỏ phần giờ
    if (typeof dateInput === 'string' && dateInput.includes('T')) {
        return dateInput.split('T')[0];
    }

    // 3. Nếu là đối tượng Date -> format
    if (dateInput instanceof Date) {
        const year = dateInput.getFullYear();
        const month = String(dateInput.getMonth() + 1).padStart(2, '0');
        const day = String(dateInput.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // 4. Nếu là chuỗi thường (hy vọng đã chuẩn), trả về nguyên vẹn
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
            startDate: formatDate(data.startDate), // ✅ Đảm bảo format chuẩn
            endDate: formatDate(data.endDate),     // ✅ Đảm bảo format chuẩn
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
            startDate: formatDate(data.startDate), // ✅ Đảm bảo format chuẩn
            endDate: formatDate(data.endDate),     // ✅ Đảm bảo format chuẩn
            minBookingAmount: data.minOrder || 0,
            maxDiscountAmount: data.maxDiscount || 0,
            usageLimit: data.quantity && data.quantity > 0 ? data.quantity : null,
            status: data.isActive ? "ACTIVE" : "PAUSED"
        };
        return await axios.put(`${API_URL}/update/${id}`, payload);
    },

    deletePromotion: async (id) => {
        return await axios.delete(`${API_URL}/delete/${id}`);
    }
};

export default promotionService;