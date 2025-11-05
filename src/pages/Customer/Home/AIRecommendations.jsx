// src/pages/Customer/Home/AIRecommendations.jsx
import React from "react";
import RecommendationList from "@/components/ai/Recommendations/RecommendationList";
import Button from "@/components/common/Button/Button"; // Thêm Button "Xem tất cả"

// ✅ Dữ liệu mock được chuyển lên đây
const mockRecommendations = [
  { id: 1, name: "Ocean View Hotel", city: "Đà Nẵng", score: "9.3" },
  { id: 2, name: "Sunrise Resort", city: "Phú Quốc", score: "8.8" },
  { id: 3, name: "The Green House", city: "Đà Lạt", score: "9.0" },
];

const AIRecommendations = () => {
  return (
    <section className="max-w-6xl mx-auto px-6 mt-16">
      {/* ✅ Thêm tiêu đề + nút "Xem tất cả" cho đồng bộ */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          🤖 Gợi ý dành riêng cho bạn
        </h2>
        <Button variant="outline">Xem thêm gợi ý</Button>
      </div>
      
      {/* ✅ Truyền dữ liệu vào list component */}
      <RecommendationList recommendations={mockRecommendations} />
    </section>
  );
};

export default AIRecommendations;