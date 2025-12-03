import api from "./axios.config";

const roomService = {

    // ✅ 1. Lấy danh sách ảnh của phòng (để refresh)
  getRoomImages: async (roomId) => {
      try {
          // Giả sử bạn đã có API này ở Controller: GET /api/v1/room-images/{roomId}
          // Nếu chưa, hãy dùng api getRoomDetail cũng được, nhưng API riêng sẽ nhẹ hơn
          const response = await api.get(`/room-images/${roomId}`); 
          return response.data; 
      } catch (error) {
          console.error(error);
          return [];
      }
  },

  // ✅ 2. Xóa ảnh phòng
  deleteRoomImage: async (roomId, imageId) => {
      try {
          // API: DELETE /api/v1/room-images/delete/{roomId}/{imageId}
          const response = await api.delete(`/room-images/delete/${roomId}/${imageId}`);
          return response.data;
      } catch (error) {
          throw error.response?.data || error.message;
      }
  },

  // ✅ 3. Đặt ảnh bìa phòng
  setRoomCoverImage: async (roomId, imageId) => {
      try {
          // API: PUT /api/v1/room-images/{roomId}/{imageId}/set-cover
          const response = await api.put(`/room-images/${roomId}/${imageId}/set-cover`);
          return response.data;
      } catch (error) {
          throw error.response?.data || error.message;
      }
  },

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
getRoomDetail: async (roomId) => {
    try {
      const response = await api.get(`/rooms/${roomId}`);
      // API trả về { success: true, data: { ...room } }
      // Nên cần return response.data.data
      return response.data?.data || response.data; 
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  checkNameAvailability: async (propertyId, roomName, excludeRoomId = 0) => {
    return api.get(`/rooms/check-name`, {
      params: { 
        propertyId, 
        roomName, 
        excludeRoomId 
      }
    });
  },
};

export default roomService;