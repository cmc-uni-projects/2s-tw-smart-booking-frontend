import api from "./axios.config";

const paymentService = {
  // ============================================================
  // 🛒 KHÁCH HÀNG (CUSTOMER)
  // ============================================================

  // 1. Khách hàng thanh toán
  submitPayment: async (bookingId, note = "", method = "Online Banking") => {
    try {
      const response = await api.post(`/payments/${bookingId}/pay`, null, {
        params: { note, method }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // 2. Lịch sử giao dịch của User
  getHistoryByUser: async (userId) => {
    try {
      const response = await api.get(`/payments/user/${userId}`);
      return response.data; 
    } catch (error) {
      console.error("Lỗi lấy lịch sử giao dịch:", error);
      return [];
    }
  },

  // 3. Gửi yêu cầu hoàn tiền
  requestRefund: async (bookingId, refundData) => {
    // refundData: { reason, bankName, accountNumber, accountHolder }
    try {
      const response = await api.post(`/payments/${bookingId}/refund-request`, refundData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ============================================================
  // 👮 ADMIN (QUẢN LÝ GIAO DỊCH & HOÀN TIỀN)
  // ============================================================

  // 4. Lấy tất cả giao dịch (Cho trang TransactionManagementPage)
  getAllTransactions: async () => {
    try {
      const response = await api.get("/payments/all"); // ✅ API số nhiều
      // Xử lý linh hoạt: trả về mảng data bất kể cấu trúc ApiResponse
      const result = response.data;
      return Array.isArray(result) ? result : (result.data || []); 
    } catch (error) {
      console.error("Lỗi lấy danh sách giao dịch:", error);
      throw new Error(error.response?.data?.message || "Không thể tải dữ liệu giao dịch");
    }
  },

  // 5. Xử lý hoàn tiền (Duyệt/Từ chối) (Cho trang RefundManagementPage)
  processRefundRequest: async (requestId, isApproved, note) => {
    try {
      const response = await api.put(`/payments/refund-process/${requestId}`, null, {
        params: { approve: isApproved, note }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default paymentService;