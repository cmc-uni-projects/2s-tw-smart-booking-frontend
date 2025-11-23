import api from "./axios.config";

const paymentService = {
  submitPayment: async (bookingId, note = "") => {
    try {
      const response = await api.post("/payment/submit", null, {
        params: { bookingId, note }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  requestRefund: async (bookingId, reason) => {
    try {
      // Gửi reason qua params (hoặc body tùy backend, ở đây dùng params cho đồng bộ)
      const response = await api.post(`/payment/request-refund/${bookingId}`, null, {
          params: { reason }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ✅ MỚI: Lấy lịch sử giao dịch
  getHistoryByUser: async (userId) => {
    try {
      const response = await api.get(`/payment/user/${userId}`);
      return response.data; // Trả về mảng PaymentResponseDTO
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default paymentService;