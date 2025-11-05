import React from "react";
import RecommendationList from "@/components/ai/Recommendations/RecommendationList";

const AIRecommendations = () => {
  return (
    <section className="max-w-6xl mx-auto px-6 mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        🤖 Gợi ý dành riêng cho bạn
      </h2>
      <RecommendationList />
    </section>
  );
};

export default AIRecommendations;
