import api from "./axios.config";

const roomService = {
  // 1. Lấy danh sách phòng theo Property ID
  getRoomsByProperty: async (propertyId) => {
    try {
      const response = await api.get(`/rooms/property/${propertyId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // 2. Thêm phòng mới (Multipart)
  addRoom: async (formData) => {
    try {
      const response = await api.post("/rooms/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // 3. Xóa phòng
  deleteRoom: async (roomId) => {
    try {
      const response = await api.delete(`/rooms/${roomId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  
  // 4. Cập nhật phòng (Cần đảm bảo backend hỗ trợ JSON hoặc Multipart)
  // Ở đây giả định backend update basic info bằng JSON
  updateRoom: async (roomId, formData) => {
      try {
          const response = await api.put(`/rooms/${roomId}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          return response.data;
      } catch (error) {
          throw error.response?.data || error.message;
      }
  },
};

export default roomService;