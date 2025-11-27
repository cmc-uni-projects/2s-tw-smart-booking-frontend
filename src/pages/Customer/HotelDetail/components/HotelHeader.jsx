import React from "react";
import { MapPin, Heart, Share2 } from "lucide-react";
import HotelGallery from "./HotelGallery";

// Helper để hiển thị nhãn đánh giá dựa trên điểm số
const getRatingLabel = (score) => {
  if (score >= 9) return "Tuyệt hảo";
  if (score >= 8) return "Rất tốt";
  if (score >= 7) return "Tốt";
  return "Hài lòng";
};

const HotelHeader = ({ hotel, onOpenGallery }) => {
  if (!hotel) return null;

  const ratingScore = 8.5; // Giả sử điểm đánh giá (hoặc lấy từ hotel.rating nếu logic của bạn lưu điểm số vào đó)
  // Lưu ý: Trong code cũ bạn dùng hotel.rating làm số sao. Nếu hotel.rating là điểm 10 thì dùng luôn, nếu là sao (1-5) thì nhân đôi lên.
  // Ở đây tôi giả định hiển thị điểm chuẩn 10.

  return (
    <div className="bg-white shadow-sm pt-6 pb-2">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Header Top Row */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-6">
          
          {/* LEFT: Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className="px-2.5 py-1 rounded bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wide border border-blue-100">
                Khách sạn
              </span>
              {/* Đã bỏ phần hiển thị Sao */}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-2">
              {hotel.name}
            </h1>
            
            <div className="flex items-start gap-2 text-gray-600 mt-1 group cursor-pointer w-fit">
              <MapPin size={18} className="text-[rgb(40,169,224)] mt-0.5 group-hover:animate-bounce" />
              <span className="text-sm group-hover:text-[rgb(40,169,224)] group-hover:underline decoration-dotted underline-offset-4 transition-all">
                {hotel.location}
              </span>
            </div>
          </div>

          {/* RIGHT: Actions & Score */}
          <div className="flex flex-row lg:flex-col items-end gap-4">
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
               <button className="p-2.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-red-500 transition-colors" title="Lưu yêu thích">
                  <Heart size={20} />
               </button>
               <button className="p-2.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-blue-600 transition-colors" title="Chia sẻ">
                  <Share2 size={20} />
               </button>
               <button className="px-4 py-2.5 bg-[rgb(40,169,224)] hover:bg-[#1b98d6] text-white text-sm font-bold rounded-lg shadow-md shadow-blue-200 transition-all active:scale-95 hidden md:block">
                  Đặt phòng ngay
               </button>
            </div>

            {/* Score Box (Hiện đại hơn) */}
            <div className="flex items-center gap-3 bg-white p-1 rounded-xl">
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-gray-800">{getRatingLabel(ratingScore)}</p>
                    <p className="text-xs text-gray-500">{hotel.reviewsCount} đánh giá</p>
                </div>
                <div className="w-12 h-12 flex items-center justify-center bg-[rgb(40,169,224)] text-white text-lg font-bold rounded-tl-xl rounded-br-xl rounded-tr-md rounded-bl-md shadow-lg shadow-blue-200">
                    {ratingScore}
                </div>
            </div>

          </div>
        </div>

        {/* Gallery Section */}
        <HotelGallery images={hotel.images} onOpenViewer={onOpenGallery} />
      </div>
    </div>
  );
};

export default HotelHeader;