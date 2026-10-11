import React from "react";
import { MessageCircleHeart } from "lucide-react"; // Icon mới

// Components
import TestimonialCard from "@/components/common/Card/TestimonialCard";
import { useTranslation } from "react-i18next";

// Mock Data (Dữ liệu giả lập với Avatar thật)
const TESTIMONIALS = [
  {
    id: 1,
    name: "Nguyễn Thùy Chi", // i18n-ignore
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
    rating: 5,
  },
  {
    id: 2,
    name: "Trần Minh Đức", // i18n-ignore
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150",
    rating: 5,
  },
  {
    id: 3,
    name: "Lê Hoàng Bảo", // i18n-ignore
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150&h=150",
    rating: 4,
  }
];

const SectionHeader = () => {
    const { t } = useTranslation("home");
    return (
    <div className="text-center max-w-3xl mx-auto mb-12 px-4">
        <div className="inline-flex items-center gap-2 bg-pink-50 text-pink-600 px-4 py-1.5 rounded-full mb-4 shadow-sm">
            <MessageCircleHeart size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">{t("testimonials.badge")}</span>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-tight mb-4">
            {t("testimonials.titleLead")} <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-600">TravelMate?</span>
        </h2>
        
        <p className="text-gray-500 font-medium text-base md:text-lg">
            {t("testimonials.subtitle")}
        </p>
    </div>
    );
};

const TestimonialSection = () => {
  const { t } = useTranslation("home");
  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-20 font-sans relative overflow-hidden">
      
      {/* Decorative Circles (Background Effect) */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <SectionHeader />

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((item) => (
            <TestimonialCard
              key={item.id}
              data={{ ...item, role: t(`testimonials.items.${item.id}.role`), comment: t(`testimonials.items.${item.id}.comment`) }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;