// src/components/common/Card/DestinationCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import Card from "@/components/common/Card/Card";
import Button from "@/components/common/Button/Button";

// Component này nhận 'item' (một điểm đến) làm prop
export default function DestinationCard({ item }) {
  
  const cardClassName = "group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 transition-all bg-white";

  return (
    <Card className={cardClassName}>
      {/* Hình ảnh điểm đến */}
      <div className="relative w-full h-56 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Overlay nhẹ dưới để dễ đọc chữ */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent group-hover:opacity-70 transition-all"></div>

        {/* Tên điểm đến */}
        <div className="absolute bottom-4 left-4 text-left">
          <h3 className="text-xl font-bold text-white drop-shadow">
            {item.name}
          </h3>
          <p className="text-gray-200 text-sm">
            {item.hotels.toLocaleString("vi-VN")} khách sạn
          </p>
        </div>
      </div>

      {/* ✅ Yêu cầu: Phần dưới card (ĐÃ CẬP NHẬT) */}
      {/* Bỏ flex-justify-end để nút có thể full-width */}
      <div className="p-4">
        
        {/* ✅ Bọc Link full-width */}
        <Link to={`/destinations/${item.id}`} className="block w-full">
          <Button 
            size="sm" 
            fullWidth // ✅ Thêm prop 'fullWidth'
            className="bg-[rgb(40,169,224)] text-white hover:bg-[#1b98d6] transition"
          >
            Xem ngay
          </Button>
        </Link>
      </div>
    </Card>
  );
}