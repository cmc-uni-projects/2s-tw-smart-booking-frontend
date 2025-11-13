import axios from "axios";

const API_BASE_URL = "http://localhost:8386/api/v1";

export const ownerService = {
  // 🟩 Gửi JSON DTO (application)
  submitApplication: async (payload) => {
    const token =
      localStorage.getItem("accessToken") || localStorage.getItem("token"); // ✅ fix key

    if (!token) throw new Error("Token not found — user must login first.");

    const res = await axios.post(`${API_BASE_URL}/applications/submit-owner`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return res.data;
  },
};
