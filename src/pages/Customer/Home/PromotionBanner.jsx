// src/pages/Customer/Home/PromotionBanner.jsx
import React from "react";
// ✅ Import component con mới
import PromotionCard from "@/components/common/Card/PromotionCard"; 
import Button from "@/components/common/Button/Button";

const PromotionBanner = () => {
  
  // ✅ (Yêu cầu 1) Tạo mock data cho 3 ô ưu đãi
  const promotions = [
    { 
      id: 1, 
      title: "Giảm 20% đặt phòng lần đầu", 
      description: "Ưu đãi độc quyền cho thành viên mới.",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80",
      buttonText: "Đăng ký ngay"
    },
    { 
      id: 2, 
      title: "Flash Sale vào những ngày cuối tuần", 
      description: "Giảm giá sốc khách sạn 5 sao.",
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=400&q=80",
      buttonText: "Săn sale" 
    },
    { 
      id: 3, 
      title: "Ưu đãi vé máy bay + KS", 
      description: "Tiết kiệm hơn khi đặt combo.",
      image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=400&q=80",
      buttonText: "Xem combo" 
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-6 mt-16">
      {/* Tiêu đề chung */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">🎁 Ưu đãi & Khuyến mãi</h2>
        <Button variant="outline">Xem tất cả</Button>
      </div>

      {/* ✅ (Yêu cầu 2) Grid hiển thị 3 component con */}
      {/* Trên mobile (mặc định) là 1 cột.
        Trên tablet (md) là 1 cột.
        Trên desktop (lg) là 3 cột.
      */}
      <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
        {promotions.map((promo) => (
          <PromotionCard key={promo.id} promo={promo} />
        ))}
      </div>
    </section>
  );
};

export default PromotionBanner;