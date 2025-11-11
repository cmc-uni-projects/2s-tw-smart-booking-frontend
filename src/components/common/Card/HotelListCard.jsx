import React from "react";
import { Link } from "react-router-dom";
import Card from "@/components/common/Card/Card";
import Button from "@/components/common/Button/Button";
import { MapPin, Star, Eye } from "lucide-react";

// Component này hiển thị 1 khách sạn trong danh sách
export default function HotelListCard({ hotel }) {
  const { id, name, location, price, image } = hotel;

  return (
    // Dùng Card làm nền, bỏ padding mặc định (p-0)
    <Card className="p-0 overflow-hidden group hover:shadow-lg transition-shadow">
      {/* Sử dụng flex-row cho màn hình desktop (sm:)
        và flex-col cho mobile (mặc định)
      */}
      <div className="flex flex-col sm:flex-row">

        {/* 1. Hình ảnh (bên trái) - ĐÃ THU NHỎ */}
        {/* sm:w-1/4 (25% width) và sm:h-40 (10rem / 160px height) */}
        <div className="sm:w-1/4 h-40 sm:h-40 overflow-hidden relative flex-shrink-0">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Lớp overlay khi hover */}
          <Link
            to={`/hotels/${id}`}
            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer"
          >
            <div className="flex items-center gap-2 text-white font-semibold border-2 border-white rounded-full px-4 py-2 transform scale-90 group-hover:scale-100 transition-transform">
              <Eye size={18} />
            </div>
          </Link>
        </div>

        {/* 2. Nội dung (bên phải) - ĐÃ GIẢM PADDING */}
        {/* sm:w-3/4 (75% width) và p-4 (1rem padding) */}
        <div className="sm:w-3/4 p-4 flex flex-col justify-between">

          {/* Phần thông tin trên */}
          <div>
            {/* Đánh giá sao (ví dụ) */}
            <div className="flex items-center gap-1 text-yellow-500 mb-1">
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} className="text-gray-300" fill="currentColor" />
              <span className="text-xs text-gray-500 ml-1">(120 đánh giá)</span>
            </div>

            {/* Giữ nguyên title text-lg, nhưng nó sẽ có nhiều không gian hơn */}
            <h3 className="font-semibold text-gray-800 text-lg truncate" title={name}>
              {name}
            </h3>

            <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
              <MapPin size={16} />
              <span className="truncate">{location}</span>
            </div>
          </div>

          {/* 3. Phần Giá & Nút bấm (dưới cùng) - ĐÃ THU NHỎ */}
          <div className="flex justify-between items-end mt-3">
            {/* Giá - (text-lg) */}
            <div>
              <span className="text-sm text-gray-500">Giá mỗi đêm từ</span>
              <p className="text-lg font-bold text-[rgb(40,169,224)]">
                {price}
              </p>
            </div>
            {/* Nút xem - (size="sm") */}
            <Link to={`/hotels/${id}`}>
              <Button size="sm" variant="primary-outline">
                Xem chi tiết
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}