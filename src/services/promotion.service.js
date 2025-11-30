import axios from "./axios.config";

const API_URL = "/promotions";

// ... (giữ nguyên hàm formatDateTime) ...
const formatDateTime = (dateInput, isEndOfDay = false) => {
    // ... (giữ nguyên code cũ) ...
    if (!dateInput) return null;
    if (typeof dateInput === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
        const time = isEndOfDay ? '23:59:59' : '00:00:00';
        return `${dateInput}T${time}`;
    }
    if (Array.isArray(dateInput)) {
        const [year, month, day, hour = 0, minute = 0, second = 0] = dateInput;
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
    }
    if (dateInput instanceof Date) {
        const year = dateInput.getFullYear();
        const month = String(dateInput.getMonth() + 1).padStart(2, '0');
        const day = String(dateInput.getDate()).padStart(2, '0');
        if (isEndOfDay) { return `${year}-${month}-${day}T23:59:59`; }
        const hour = String(dateInput.getHours()).padStart(2, '0');
        const minute = String(dateInput.getMinutes()).padStart(2, '0');
        const second = String(dateInput.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
    }
    if (typeof dateInput === 'string' && dateInput.includes('T')) { return dateInput; }
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
            startDate: formatDateTime(data.startDate, false),
            endDate: formatDateTime(data.endDate, true),
            minBookingAmount: data.minOrder || 0,
            maxDiscountAmount: data.maxDiscount || 0,
            usageLimit: data.quantity && data.quantity > 0 ? data.quantity : null,
            status: "ACTIVE",
            // [QUAN TRỌNG] Thêm trường rank
            minMembershipRank: data.minMembershipRank || "BRONZE"
        };
        return await axios.post(`${API_URL}/create`, payload);
    },

    updatePromotion: async (id, data) => {
        const payload = {
            code: data.code,
            description: data.name,
            discountType: data.type === "PERCENT" || data.type === "PERCENTAGE" ? "PERCENTAGE" : "FIXED_AMOUNT",
            discountValue: data.value,
            startDate: formatDateTime(data.startDate, false),
            endDate: formatDateTime(data.endDate, true),
            minBookingAmount: data.minOrder || 0,
            maxDiscountAmount: data.maxDiscount || 0,
            usageLimit: data.quantity && data.quantity > 0 ? data.quantity : null,
            status: data.isActive ? "ACTIVE" : "PAUSED",
            // [QUAN TRỌNG] Thêm trường rank khi update
            minMembershipRank: data.minMembershipRank || "BRONZE"
        };
        return await axios.put(`${API_URL}/update/${id}`, payload);
    },

    // ... (Giữ nguyên các hàm delete, uploadBanner, softDelete) ...
    softDeletePromotion: async (id, currentPromotionData) => {
        const dataToSend = { ...currentPromotionData, status: "DELETED" };
        return await promotionService.updatePromotion(id, dataToSend);
    },
    deletePromotion: async (id) => { return await axios.delete(`${API_URL}/delete/${id}`); },
    uploadBanner: async (id, file) => {
        const formData = new FormData();
        formData.append('file', file);
        return await axios.post(`${API_URL}/${id}/banner`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    }
};

export default promotionService;