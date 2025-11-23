import api from "./axios.config";

const paymentService = {
  // 1. Khách hàng thanh toán (Chuyển khoản / Tiền mặt)
  submitPayment: async (bookingId, note = "") => {
    try {
      // Backend dùng @RequestParam cho note
      const response = await api.post("/payment/submit", null, {
        params: { bookingId, note }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // 2. Lấy lịch sử giao dịch của User
  getHistoryByUser: async (userId) => {
    try {
      const response = await api.get(`/payment/user/${userId}`);
      // Kiểm tra nếu backend trả về ApiResponse { data: [...] }
      return response.data?.data || response.data || [];
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ✅ 3. Gửi yêu cầu hoàn tiền (Cập nhật: Gửi Object JSON)
  requestRefund: async (bookingId, refundData) => {
    // refundData gồm: { reason, bankName, accountNumber, accountHolder }
    try {
      const response = await api.post(`/payment/request-refund/${bookingId}`, refundData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default paymentService;