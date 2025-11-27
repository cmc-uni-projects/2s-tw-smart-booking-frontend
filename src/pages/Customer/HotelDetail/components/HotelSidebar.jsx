import React from "react";
import { Map as MapIcon, Check } from "lucide-react";

// ✅ Nhận thêm props lat, lng
const HotelSidebar = ({ location, rating, minPrice, lat, lng }) => {

  // Hàm xử lý mở Google Maps
  const handleOpenMap = () => {
    if (lat && lng) {
      // Mở theo tọa độ chính xác
      window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
    } else {
      // Fallback: Tìm theo địa chỉ nếu không có tọa độ
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`, '_blank');
    }
  };

  return (
    <div className="lg:col-span-4">
        <div className="sticky top-32 space-y-6">
            
            {/* MAP CARD */}
            <div 
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 group cursor-pointer hover:shadow-md transition-all"
                onClick={handleOpenMap} // ✅ Thêm sự kiện click vào đây
            >
                <div className="h-32 bg-blue-50 relative overflow-hidden">
                    {/* Giả lập hình bản đồ */}
                    <div className="absolute inset-0 opacity-50" style={{backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '10px 10px'}}></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm flex items-center gap-2 text-blue-600 font-bold text-sm group-hover:scale-105 transition-transform">
                            <MapIcon size={16} /> Xem trên bản đồ
                        </div>
                    </div>
                </div>
                <div className="p-4 flex justify-between items-start gap-2">
                    <p className="text-sm text-gray-600 line-clamp-2 flex-1">{location}</p>
                    <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600 shrink-0">
                        <MapIcon size={16} />
                    </div>
                </div>
            </div>

            {/* HIGHLIGHTS CARD (Giữ nguyên) */}
            <div className="bg-[rgb(40,169,224)]/5 rounded-2xl p-5 border border-[rgb(40,169,224)]/20">
                <h4 className="font-bold text-gray-800 mb-3">Điểm nổi bật</h4>
                <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-gray-700">
                        <Check size={14} className="text-[rgb(40,169,224)]" /> Vị trí trung tâm
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-700">
                        <Check size={14} className="text-[rgb(40,169,224)]" /> Nhận phòng 24/7
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-700">
                        <Check size={14} className="text-[rgb(40,169,224)]" /> Đánh giá cao ({rating || 8.5}/10)
                    </li>
                </ul>
            </div>

            {/* CTA BUTTON */}
            <a 
                href="#rooms"
                className="block w-full bg-[rgb(40,169,224)] hover:bg-[#1b98d6] text-white text-center font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95"
            >
                Chọn phòng ngay
            </a>

        </div>
    </div>
  );
};

export default HotelSidebar;