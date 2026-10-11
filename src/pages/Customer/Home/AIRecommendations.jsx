// src/pages/Customer/Home/AIRecommendations.jsx
import React from "react";
import { Lightbulb } from "lucide-react"; // 1. Import icon Lightbulb
import RecommendationList from "@/components/ai/Recommendations/RecommendationList";
import Button from "@/components/common/Button/Button";
import { useTranslation } from "react-i18next";

// i18n-ignore-start (mock data, proper nouns)
const mockRecommendations = [
  { id: 1, name: "Ocean View Hotel", city: "Đà Nẵng", score: "9.3" },
  { id: 2, name: "Sunrise Resort", city: "Phú Quốc", score: "8.8" },
  { id: 3, name: "The Green House", city: "Đà Lạt", score: "9.0" },
];
// i18n-ignore-end

const AIRecommendations = () => {
  const { t } = useTranslation("home");
  return (
    <section className="max-w-6xl mx-auto px-6 mt-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          {/* 2. Sử dụng Lightbulb với màu vàng (yellow-500) để giống bóng đèn đang sáng */}
          <Lightbulb className="w-8 h-8 text-yellow-500 fill-yellow-500" />
          {t("ai.title")}
        </h2>
        <Button variant="outline">{t("ai.more")}</Button>
      </div>
      
      <RecommendationList recommendations={mockRecommendations} />
    </section>
  );
};

export default AIRecommendations;