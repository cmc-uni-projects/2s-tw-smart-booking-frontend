import axios from "./axios.config";

// Helper tạo FormData chuẩn cho Backend Spring Boot
const createFormData = (ratingData, files) => {
  const formData = new FormData();

  formData.append(
    "data",
    new Blob([JSON.stringify(ratingData)], { type: "application/json" })
  );

  if (files && files.length > 0) {
    files.forEach((file) => {
      formData.append("files", file);
    });
  }

  return formData;
};

export const createRating = async ({ bookingId, stars, comment, files }) => {
  const ratingPayload = {
    bookingId: bookingId,
    stars: stars,
    comment: comment,
  };

  const formData = createFormData(ratingPayload, files);

  // SỬA: Xóa "/api/v1" ở đầu, chỉ để lại "/rating/create"
  const response = await axios.post("/rating/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateRating = async (ratingId, { stars, comment, files }) => {
  const ratingPayload = {
    bookingId: 0,
    stars: stars,
    comment: comment,
  };

  const formData = createFormData(ratingPayload, files);

  // SỬA: Xóa "/api/v1" ở đầu
  const response = await axios.put(`/rating/update/${ratingId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getRatingByBooking = async (bookingId) => {
  // SỬA: Xóa "/api/v1" ở đầu
  const response = await axios.get(`/rating/booking/${bookingId}`);
  return response.data;
};