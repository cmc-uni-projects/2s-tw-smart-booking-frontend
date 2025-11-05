// src/pages/Customer/Home/FeaturedHotels.jsx
import React from "react";
import Button from "@/components/common/Button/Button";
// ✅ Import component con mới
import HotelCard from "@/components/common/Card/HotelCard"; 

const FeaturedHotels = () => {
  const hotels = [
    { id: 1, name: "The Ocean Resort", location: "Đà Nẵng", price: "2.200.000₫/đêm", image: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2022/12/19/1128932/312606256_1243871556.jpg" },
    { id: 2, name: "Mountain Retreat", location: "Sapa", price: "1.700.000₫/đêm", image: "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a" },
    { id: 3, name: "Urban Stay", location: "Hà Nội", price: "1.500.000₫/đêm", image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511" },
  ];

  return (
    <section className="max-w-6xl mx-auto px-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">🏨 Khách sạn nổi bật</h2>
        <Button variant="outline">Xem tất cả</Button>
      </div>

      {/* ✅ Sử dụng HotelCard thay vì code logic tại đây */}
      <div className="grid md:grid-cols-3 gap-6">
        {hotels.map((h) => (
          <HotelCard key={h.id} hotel={h} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedHotels;