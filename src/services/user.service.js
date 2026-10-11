import api from "./axios.config.js";
import i18n from "@/i18n"; // API instance

export const userService = {

  /** Saves the account language ("vi" | "en") used for emails and notifications. */
  updateLanguage: async (language) => {
    const res = await api.put("/user-details/language", { language });
    return res.data;
  },

  /**
   * Lấy thông tin chi tiết (User + UserDetail)
   */
  getUserDetail: async () => {
    try {
      const res = await api.get("/user-details/me");
      return res.data;
    } catch (error) {
      console.error("Error fetching user detail:", error);
      throw error;
    }
  },

  /**
   * Cập nhật thông tin (User + UserDetail)
   */
  updateUserDetail: async (data) => {
    try {
      const res = await api.put("/user-details/update", data);
      return res.data;
    } catch (error) {
      console.error("Error updating user detail:", error);
      throw error;
    }
  },

  /**
   * Upload ảnh đại diện
   * ✅ CÁCH 1: Ghi đè Content-Type ngay tại request này
   */
  uploadAvatar: async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post(
          "/user-details/upload-avatar",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          }
      );

      return res.data;
    } catch (error) {
      console.error("Error uploading avatar:", error);
      throw error;
    }
  },

  /**
   * Kiểm tra trạng thái hồ sơ
   */
  getProfileStatus: async () => {
    try {
      const res = await api.get("/user-details/profile-status");
      return res.data;
    } catch (error) {
      console.error("Error fetching profile status:", error);
      throw error;
    }
  },

  /**
   * Upload file chung
   */
  uploadFile: async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/files/upload", formData);
      const data = res.data;

      if (data?.fileDownloadUri) return data.fileDownloadUri;
      if (data?.url) return data.url;

      throw new Error(i18n.t("common:userservice.theUploadApiDidNot"));
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  },
};

export default userService;
