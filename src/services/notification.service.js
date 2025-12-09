import api from "./axios.config";

const notificationService = {
  // 1. Lấy danh sách thông báo (có phân trang)
  getNotifications: async (page = 0, size = 10) => {
    try {
      const response = await api.get("/notifications", {
        params: { page, size }
      });
      return response.data; // Mong đợi: { content: [], totalElements: 0, unreadCount: 0 }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return { content: [], unreadCount: 0 };
    }
  },

  // 2. Đánh dấu 1 thông báo là đã đọc
  markAsRead: async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  },

  // 3. Đánh dấu tất cả là đã đọc
  markAllAsRead: async () => {
    try {
      await api.put("/notifications/read-all");
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  },
  
  // 4. Lấy số lượng chưa đọc (gọi nhẹ để update badge)
  getUnreadCount: async () => {
      try {
          const response = await api.get("/notifications/unread-count");
          return response.data; // Trả về số int
      } catch (error) {
          return 0;
      }
  }
};

export default notificationService;