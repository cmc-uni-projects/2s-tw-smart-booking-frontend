// src/services/property.service.js
// TODO: Kết nối API thật. Hiện tại đây là file mock.

// Hàm tiện ích để giả lập thời gian chờ của mạng
const fakeApiCall = (duration) => new Promise(resolve => setTimeout(resolve, duration));

export const propertyService = {
  /**
   * (Mocked) Gửi đơn đăng ký cơ sở lưu trú mới
   * @param {FormData} formData Đối tượng FormData
   */
  submitPropertyApplication: async (formData) => {

    console.log("=========================================");
    console.log("🚀 [MOCK API] GỬI ĐƠN ĐĂNG KÝ CƠ SỞ LƯU TRÚ...");
    console.log("=========================================");

    // In ra toàn bộ dữ liệu bạn đã thu thập để kiểm tra
    for (let [key, value] of formData.entries()) {
      console.log(key, ":", value);
    }

    // Giả lập thời gian chờ
    await fakeApiCall(2000);

    // --- Giả lập lỗi (bạn có thể uncomment để test luồng lỗi) ---
    // throw new Error("403 - Missing required documents (Mocked)");
    // ---

    console.log("✅ [MOCK API] GỬI THÀNH CÔNG!");

    return {
      success: true,
      message: "Property application submitted (Mocked)"
    };
  },
};