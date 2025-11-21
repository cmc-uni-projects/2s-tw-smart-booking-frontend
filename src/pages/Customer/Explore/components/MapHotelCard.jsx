import React from "react";
import { Star, MapPin, ArrowRight, CalendarCheck, X } from "lucide-react";
// ❌ Xóa dòng này: import { useNavigate } from "react-router-dom";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8386/api/v1").replace("/api/v1", "");

// ✅ Thêm prop 'navigate'
const MapHotelCard = ({ property, onClose, navigate }) => {
  
  // Xử lý ảnh
  let imageUrl = "/assets/images/placeholder.png";
  if (property.coverImage) {
      // Nếu ảnh bắt đầu bằng http thì dùng luôn, không thì nối thêm base url ảnh
      imageUrl = property.coverImage.startsWith("http") 
        ? property.coverImage 
        : `${API_BASE_URL}/images/${property.coverImage}`;
  }

  const priceFormatted = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumSignificantDigits: 3 }).format(property.minPrice || 0);

  return (
    <div className="w-72 bg-white rounded-xl shadow-lg overflow-hidden font-sans relative group">
      
      {/* Nút Đóng (Custom) */}
      <button 
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="absolute top-2 right-2 z-20 bg-black/40 hover:bg-black/60 text-white rounded-full p-1 transition-colors backdrop-blur-sm"
      >
          <X size={14} />
      </button>

      {/* Ảnh */}
      <div className="relative h-36 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={property.propertyName} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => e.target.src = "/assets/images/placeholder.png"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        <span className="absolute bottom-2 left-2 bg-blue-600 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase shadow-sm tracking-wider">
            {property.propertyType}
        </span>
      </div>

      {/* Nội dung */}
      <div className="p-3">
        <div className="flex justify-between items-start gap-2 mb-1">
            <h3 className="font-bold text-gray-800 text-sm line-clamp-2 leading-snug" title={property.propertyName}>
                {property.propertyName}
            </h3>
            <div className="flex items-center gap-1 text-[10px] font-bold text-white bg-yellow-500 px-1.5 py-0.5 rounded shrink-0 shadow-sm">
                <Star size={10} fill="currentColor" />
                {property.rating || 0}
            </div>
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
            <MapPin size={12} className="text-gray-400" />
            {/* Hiển thị khoảng cách nếu có, hoặc địa chỉ ngắn gọn */}
            <span className="truncate">{property.city || "Việt Nam"}</span>
        </div>

        <div className="flex items-end justify-between pt-2 border-t border-gray-100">
            <div>
                <p className="text-[10px] text-gray-400 font-medium uppercase">Giá từ</p>
                <p className="text-base font-bold text-blue-600 leading-none">{priceFormatted}</p>
            </div>
            <button 
                // ✅ Sử dụng prop navigate được truyền vào
                onClick={(e) => {
                    e.stopPropagation();
                    if (navigate) navigate(`/hotel/${property.propertyId}`);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-3 rounded-lg transition-all shadow-md flex items-center gap-1.5 active:scale-95"
            >
                Đặt ngay <ArrowRight size={14} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default MapHotelCard;