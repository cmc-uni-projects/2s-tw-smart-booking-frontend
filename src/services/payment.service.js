import api from "./axios.config";

const paymentService = {
  // ==========================================
  // XÁC NHẬN THANH TOÁN
  // ==========================================
  // Backend: POST /api/v1/payment/submit?bookingId=...&note=...
  submitPayment: async (bookingId, note = "") => {
    try {
      const response = await api.post("/payment/submit", null, {
        params: {
          bookingId: bookingId,
          note: note
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default paymentService;  