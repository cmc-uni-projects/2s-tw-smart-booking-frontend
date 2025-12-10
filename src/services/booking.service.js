import api from "./axios.config";

const bookingService = {
  // ==========================================
  // 1. TẠO BOOKING MỚI
  // ==========================================
  // Payload: { userId, propertyId, roomId, checkInDate, checkOutDate, guestCount }
  createBooking: async (bookingData) => {
    try {
      const response = await api.post("/bookings/create", bookingData);
      return response.data;
    } catch (error) {
      // Ném lỗi ra để component (BookingPage) bắt được và alert
      throw error.response?.data || error.message;
    }
  },

  // ==========================================
  // 2. LẤY CHI TIẾT BOOKING
  // ==========================================
  getBookingById: async (bookingId) => {
    try {
      const response = await api.get(`/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ==========================================
  // 3. LẤY LỊCH SỬ ĐẶT PHÒNG CỦA USER
  // ==========================================
  getBookingsByUserId: async (userId) => {
    try {
      const response = await api.get(`/bookings/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ==========================================
  // 4. HỦY ĐẶT PHÒNG
  // ==========================================
  cancelBooking: async (bookingId) => {
    try {
      const response = await api.put(`/bookings/cancel/${bookingId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ==========================================
  // 5. CHECK-IN
  // ==========================================
  checkInBooking: async (bookingId) => {
    try {
      const response = await api.put(`/bookings/${bookingId}/check-in`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ==========================================
  // 6. LẤY DANH SÁCH BOOKING THEO KHÁCH SẠN (Dành cho Chủ nhà/Admin)
  // ==========================================
  getBookingsByPropertyId: async (propertyId) => {
    try {
      const response = await api.get(`/bookings/property/${propertyId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getBookingsByProperty: async (propertyId) => {
    try {
      const response = await api.get(`/bookings/property/${propertyId}`);
      return response.data; // Trả về mảng BookingResponseDTO
    } catch (error) {
      console.error("Error fetching property bookings:", error);
      throw error;
    }
  },

  // ==========================================
  // 7. CHECK-OUT (Trả phòng)
  // ==========================================
  checkOutBooking: async (bookingId) => {
    try {
      // Gọi đúng đường dẫn đã định nghĩa ở Controller (/checkout/{id})
      const response = await api.put(`/bookings/checkout/${bookingId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ==========================================
  // 8. LẤY TÌNH TRẠNG PHÒNG TRỐNG
  // ==========================================
  getRoomAvailability: async (roomId) => {
    try {
      const response = await api.get(`/bookings/room/${roomId}/availability`);
      return response.data; // Backend trả về { success: true, message: "...", data: [...] }
    } catch (error) {
      console.error("Error fetching availability:", error);
      return { data: [] }; // Trả về mảng rỗng nếu lỗi để không chặn nhầm
    }
  },

  // ==========================================
  // 9. [MỚI] ÁP DỤNG MÃ KHUYẾN MÃI
  // ==========================================
  // Hàm này gọi API để lưu mã vào DB và cập nhật lại giá tiền
  applyPromotion: async (bookingId, code) => {
    try {
      // Gọi endpoint PUT /api/v1/bookings/{id}/apply-promotion?code=...
      const response = await api.put(`/bookings/${bookingId}/apply-promotion`, null, {
        params: { code }
      });
      // Backend trả về ApiResponse, ta cần lấy phần data (BookingResponseDTO)
      return response.data?.data || response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  // ==========================================
  // 10. [MỚI] HỦY MÃ KHUYẾN MÃI
  // ==========================================
  cancelPromotion: async (bookingId, code) => {
    try {
      // Gọi endpoint POST /api/v1/promotions/cancel
      const response = await api.post(`/promotions/cancel`, null, {
        params: { 
            bookingId: bookingId,
            code: code 
        }
      });
      // Trả về dữ liệu BookingResponseDTO mới nhất
      return response.data?.data || response.data;
    } catch (error) {
       throw error.response?.data || error.message;
    }
  },
  
};

export default bookingService;