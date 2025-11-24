import api from "./axios.config";

const paymentService = {
  // 1. Khách hàng thanh toán (Chuyển khoản / Tiền mặt)
  submitPayment: async (bookingId, note = "", method = "Online Banking") => {
    try {
      // ✅ SỬA: Gọi đường dẫn chuẩn RESTful: /payments/{id}/pay
      const response = await api.post(`/payments/${bookingId}/pay`, null, {
        params: { note, method } // Gửi note và method qua query params
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  

  // 2. Lấy lịch sử giao dịch của User
  getHistoryByUser: async (userId) => {
    try {
      // ✅ SỬA: payments số nhiều
      const response = await api.get(`/payments/user/${userId}`);
      // Backend trả về List trực tiếp hoặc ApiResponse, cần check kỹ
      // Theo controller trên: trả về List<PaymentResponseDTO> trực tiếp
      return response.data; 
    } catch (error) {
      console.error("Lỗi lấy lịch sử giao dịch:", error);
      return [];
    }
  },

  // 3. Gửi yêu cầu hoàn tiền
  requestRefund: async (bookingId, refundData) => {
    // refundData gồm: { reason, bankName, accountNumber, accountHolder }
    try {
      // ✅ SỬA: payments số nhiều
      const response = await api.post(`/payments/${bookingId}/refund-request`, refundData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default paymentService;