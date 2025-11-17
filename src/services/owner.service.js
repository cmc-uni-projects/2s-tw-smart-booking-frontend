import api from "./axios.config.js"; // ✅ Đã import

export const ownerService = {
  /**
   * Gửi JSON DTO (đơn đăng ký làm Owner)
   */
  submitApplication: async (payload) => {
    try {
      // ✅ SỬA: Dùng 'api.post' và đường dẫn tương đối.
      // Interceptor sẽ tự động thêm 'Authorization' header.
      const res = await api.post("/applications/submit-owner", payload);
      
      // Giả sử API trả về { success: true, message: "...", data: ... }
      return res.data;
      
    } catch (error) {
      // Xử lý lỗi
      console.error("Error submitting owner application:", error);
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || "Gửi đơn thất bại");
      }
      throw new Error("Không thể kết nối máy chủ");
    }
  },
};