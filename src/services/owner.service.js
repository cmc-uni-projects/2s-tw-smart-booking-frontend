// Hàm tiện ích để giả lập thời gian chờ của mạng
const fakeApiCall = (duration) => new Promise(resolve => setTimeout(resolve, duration));

export const ownerService = {
    /**
     * (Mocked) Giả lập gửi đơn đăng ký
     * @param {FormData} formData Đối tượng FormData chứa text và files
     */
    submitApplication: async (formData) => {

        console.log("=========================================");
        console.log("🚀 [MOCK API] ĐANG GIẢ LẬP GỬI ĐƠN ĐĂNG KÝ...");
        console.log("=========================================");

        // In ra toàn bộ dữ liệu bạn đã thu thập để kiểm tra
        for (let [key, value] of formData.entries()) {
            console.log(key, ":", value);
        }

        // 1. Giả lập thời gian chờ (2 giây)
        await fakeApiCall(2000);

        console.log("✅ [MOCK API] GỬI THÀNH CÔNG!");

        // 2. Trả về một đối tượng "thành công"
        return {
            success: true,
            message: "Application submitted successfully (Mocked)"
        };
    },
};