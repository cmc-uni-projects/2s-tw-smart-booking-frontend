import React from "react";
import { MapPin, Star, Wifi, Coffee, Car, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/common/Button/Button";

const HotelListCard = ({ hotel }) => {
  const navigate = useNavigate();

  // 1. Xử lý ảnh (Parse JSON từ Backend)
  let images = [];
  try {
    images = hotel.imageUrlsJson ? JSON.parse(hotel.imageUrlsJson) : [];
  } catch (e) {
    images = [];
  }
  // Lấy ảnh đầu tiên hoặc ảnh placeholder
  const mainImage = images.length > 0 ? images[0] : "https://placehold.co/600x400?text=No+Image";

  // 2. Xử lý tiện ích (Parse JSON từ Backend)
  let amenities = [];
  try {
    // Backend trả về Map<String, Boolean> dưới dạng JSON
    // Ví dụ: {"wifi": true, "parking": true}
    const amenitiesObj = hotel.amenitiesJson ? JSON.parse(hotel.amenitiesJson) : {};
    // Lấy ra các key có value là true
    amenities = Object.keys(amenitiesObj).filter(key => amenitiesObj[key] === true);
  } catch (e) {
    amenities = [];
  }

  // Helper render icon tiện ích
  const renderAmenityIcon = (key) => {
    switch (key.toLowerCase()) {
      case "wifi": return <Wifi size={14} className="mr-1" />;
      case "parking": return <Car size={14} className="mr-1" />;
      case "breakfast": return <Coffee size={14} className="mr-1" />;
      default: return <Check size={14} className="mr-1" />;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row h-auto md:h-64">
      {/* Left: Image */}
      <div className="w-full md:w-1/3 h-48 md:h-full relative">
        <img
          src={mainImage}
          alt={hotel.propertyName}
          className="w-full h-full object-cover"
        />
        {/* Badge Status (nếu cần) */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-blue-600">
          {hotel.propertyType}
        </div>
      </div>

      {/* Right: Content */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-1 line-clamp-1">
                {hotel.propertyName}
              </h3>
              <div className="flex items-center text-gray-500 text-sm mb-3">
                <MapPin size={14} className="mr-1" />
                <span className="line-clamp-1">
                  {hotel.address}, {hotel.city}, {hotel.country}
                </span>
              </div>
            </div>
            
            {/* Rating Box */}
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1 text-blue-600 font-bold">
                <span className="text-lg">{hotel.rating || "New"}</span>
                <Star size={16} fill="currentColor" />
              </div>
              <span className="text-xs text-gray-400">
                {hotel.reviewCount > 0 ? `${hotel.reviewCount} đánh giá` : "Chưa có đánh giá"}
              </span>
            </div>
          </div>

          {/* Amenities (Hiển thị tối đa 4 cái) */}
          <div className="flex flex-wrap gap-2 mt-2">
            {amenities.slice(0, 4).map((item, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-gray-600 text-xs capitalize"
              >
                {renderAmenityIcon(item)} {item}
              </span>
            ))}
            {amenities.length > 4 && (
              <span className="text-xs text-gray-400 flex items-center">
                +{amenities.length - 4} khác
              </span>
            )}
          </div>
          
          <p className="text-sm text-gray-500 mt-3 line-clamp-2">
            {hotel.description}
          </p>
        </div>

        <div className="flex items-end justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 line-through">
              {/* Giá gốc giả định (Logic giá sẽ làm ở phần Room sau) */}
            </span>
            <div className="flex items-baseline gap-1">
               {/* Hiện tại Property chưa có minPrice, ta để placeholder hoặc xử lý sau */}
              <span className="text-lg font-bold text-red-500">Liên hệ</span>
              <span className="text-xs text-gray-500">/ đêm</span>
            </div>
            <span className="text-xs text-blue-600 font-medium">
              Đã bao gồm thuế & phí
            </span>
          </div>

          <Button 
            onClick={() => navigate(`/hotels/${hotel.propertyId}`)}
            className="bg-[rgb(40,169,224)] hover:bg-[#1b98d6]"
          >
            Chọn phòng
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HotelListCard;