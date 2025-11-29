// src/services/rating.service.js
import api from "./axios.config";

/**
 * Upload file (ảnh / video) của rating.
 * Hiện tại bạn CHƯA dùng tới upload file thật,
 * nên tạm thời hàm này trả về mảng rỗng để không gây lỗi.
 * Sau này nếu có API upload riêng, chỉ cần sửa lại body hàm này.
 */
export const uploadRatingFiles = async (files) => {
  // TODO: sau này nếu có API upload thì implement lại.
  // Bây giờ chỉ lưu rating + comment, bỏ qua ảnh/video.
  return [];
};

/**
 * Tạo rating mới
 * params:
 *  - bookingId: number
 *  - userId: string
 *  - rating: number
 *  - comment: string
 *  - files?: File[] (ảnh + video đã chọn) -> hiện tại bỏ qua
 */
export const createRating = async ({
  bookingId,
  userId,
  rating,
  comment,
  files, // vẫn nhận để không phải sửa MyBookings, nhưng KHÔNG dùng
}) => {
  // Nếu sau này bạn có URL ảnh sẵn (VD từ Cloudinary),
  // có thể map vào payload.images tương tự như trước.
  // Hiện tại ta chỉ gửi rating + comment.
  const payload = {
    bookingId: {
      bookingId,
    },
    userId: {
      userId,
    },
    rating,
    comment,
    // images: [] // tạm thời không gửi lên BE
  };

  try {
    const res = await api.post("/rating/create", payload);
    return res.data;
  } catch (error) {
    const respData = error?.response?.data;

    // Lấy message gốc từ backend (nếu có)
    const backendMsg =
      (respData && respData.message) ||
      (typeof respData === "string" ? respData : "") ||
      error?.message ||
      "";

    let uiMessage = backendMsg || "Không thể gửi đánh giá, vui lòng thử lại.";

    // Map các lỗi đặc biệt sang tiếng Việt đẹp
    if (
      typeof backendMsg === "string" &&
      (backendMsg.includes("Rating contains abusive content") ||
        backendMsg.includes("VIOLATION") ||
        backendMsg.toLowerCase().includes("abusive"))
    ) {
      uiMessage =
        "❌ Bình luận chứa từ ngữ không phù hợp, vui lòng chỉnh sửa lại trước khi gửi.";
    } else if (
      typeof backendMsg === "string" &&
      backendMsg.includes("Booking must be COMPLETE before rating")
    ) {
      uiMessage =
        "Bạn chỉ có thể đánh giá sau khi chuyến đi đã được đánh dấu là hoàn thành.";
    }

    console.error("❌ Rating API Error:", respData || backendMsg);

    // Ném Error với message tiếng Việt để ReviewBookingModal / MyBookings hiển thị
    throw new Error(uiMessage);
  }
};

// Giữ lại default cho những chỗ còn import ratingService
const ratingService = {
  uploadRatingFiles,
  createRating,
};

export default ratingService;
