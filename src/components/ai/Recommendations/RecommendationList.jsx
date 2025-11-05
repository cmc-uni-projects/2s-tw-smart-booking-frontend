// src/components/ai/Recommendations/RecommendationList.jsx
import React from "react";
import Card from "../../common/Card/Card";
import Badge from "../../common/Badge/Badge";

const RecommendationList = () => {
  const recs = [
    { id: 1, name: "Ocean View Hotel", city: "Đà Nẵng", score: "9.3" },
    { id: 2, name: "Sunrise Resort", city: "Phú Quốc", score: "8.8" },
    { id: 3, name: "The Green House", city: "Đà Lạt", score: "9.0" },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {recs.map((r) => (
        <Card key={r.id} className="p-5 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold text-gray-800">{r.name}</h3>
          <p className="text-gray-500 text-sm">{r.city}</p>
          <Badge className="mt-2">{r.score} / 10</Badge>
        </Card>
      ))}
    </div>
  );
};

// ✅ thêm dòng này
export default RecommendationList;
