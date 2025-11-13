import axios from "axios";

const API_BASE_URL = "http://localhost:8386/api/v1";

// Hàm lấy header chứa Token
const getAuthHeader = () => {
  const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

export const adminService = {
  // 1. Lấy danh sách đơn đăng ký đang chờ
  getPendingApplications: async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/owner-applications`, {
        headers: getAuthHeader(),
        params: { status: "PENDING" },
      });
      return res.data;
    } catch (error) {
      console.error("Lỗi lấy danh sách đơn:", error);
      throw error;
    }
  },

  // 2. Duyệt hoặc Từ chối đơn (Status phải là APPROVED | REJECTED)
  reviewApplication: async (applicationId, status, reason) => {
    try {
      const payload = {
        status: status, // Backend yêu cầu: "APPROVED" hoặc "REJECTED"
        reason: reason || "",
      };

      const res = await axios.post(
        `${API_BASE_URL}/admin/owner-applications/${applicationId}/review`,
        payload,
        { headers: getAuthHeader() }
      );
      return res.data;
    } catch (error) {
      console.error("Lỗi xử lý đơn:", error);
      throw error;
    }
  },
};