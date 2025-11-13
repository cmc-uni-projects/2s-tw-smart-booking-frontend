import axios from "axios";

const API_BASE_URL = "http://localhost:8386/api/v1";

// ✅ SỬA: Kiểm tra cả 2 key 'accessToken' và 'token' để tránh bị null
const getAuthHeader = () => {
  const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

export const adminService = {
  getPendingApplications: async () => {
    try {
      // ✅ Thêm config header vào request
      const res = await axios.get(`${API_BASE_URL}/admin/owner-applications`, {
        headers: getAuthHeader(),
        params: { status: "PENDING" },
      });
      return res.data;
    } catch (error) {
      console.error("Error fetching applications:", error);
      throw error;
    }
  },

  reviewApplication: async (applicationId, status, reason) => {
    try {
      const payload = {
        status: status,
        reason: reason || "",
      };
      // ✅ Thêm config header vào request
      const res = await axios.post(
        `${API_BASE_URL}/admin/owner-applications/${applicationId}/review`,
        payload,
        {
          headers: getAuthHeader(),
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error reviewing application:", error);
      throw error;
    }
  },
};