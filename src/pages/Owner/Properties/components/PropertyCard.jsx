import React from "react";
import { MapPin, Star, Edit, Eye, Clock, CheckCircle2, AlertCircle, Image as ImageIcon } from "lucide-react";
import Button from "@/components/common/Button/Button";
import ToggleSwitch from "@/components/common/Input/ToggleSwitch"; // ✅ Import ToggleSwitch
import { motion } from "framer-motion";

// Helper xử lý ảnh (Giữ nguyên)
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8386/api/v1").replace("/api/v1", "");
const getFullImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  
  let path = url.startsWith("/") ? url : `/${url}`;
  if (!path.startsWith("/uploads")) {
    path = `/uploads${path}`;
  }
  return `${API_BASE_URL}${path}`;
};

// ✅ Nhận thêm prop 'onToggleStatus'
const PropertyCard = ({ property, onView, onEdit, onToggleStatus }) => {
  
  // Logic xác định trạng thái
  const isPending = property.propertyStatus === "PENDING";
  const isApproved = property.propertyStatus === "APPROVE" || property.propertyStatus === "APPROVED";
  const isRejected = property.propertyStatus === "REJECTED";
  
  // ✅ Lấy trạng thái hoạt động (Active/Inactive)
  const isActive = property.active; 

  const handleEditClick = () => {
    if (isApproved && onEdit) {
      onEdit();
    }
  };

  const imageUrl = getFullImageUrl(property.coverImage);

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      // ✅ Thêm style thay đổi border/bg nếu đang tạm ngưng
      className={`group bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full ${!isActive && isApproved ? 'border-gray-200 bg-gray-50' : 'border-gray-200'}`}
    >
      {/* --- PHẦN 1: HÌNH ẢNH & BADGE --- */}
      <div className="relative h-52 overflow-hidden bg-gray-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={property.propertyName}
            // ✅ Thêm grayscale nếu inactive
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${!isActive && isApproved ? 'grayscale opacity-80' : ''}`}
            onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        
        <div className={`absolute inset-0 flex flex-col items-center justify-center text-gray-400 ${imageUrl ? 'hidden' : 'flex'}`}>
            <ImageIcon size={40} className="mb-2 opacity-40" />
            <span className="text-xs font-medium">Không có ảnh bìa</span>
        </div>

        {/* --- BADGES TRẠNG THÁI --- */}
        <div className="absolute top-3 right-3 z-10 flex gap-2">
            {isPending && (
                <span className="bg-yellow-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center shadow-sm">
                    <Clock size={14} className="mr-1.5" /> Chờ duyệt
                </span>
            )}
            
            {/* ✅ Case 1: Đã duyệt nhưng đang TẮT -> Tạm ngưng */}
            {isApproved && !isActive && (
                 <span className="bg-gray-600/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center shadow-sm">
                    <AlertCircle size={14} className="mr-1.5" /> Tạm ngưng
                 </span>
            )}

            {/* ✅ Case 2: Đã duyệt và đang BẬT -> Hoạt động */}
            {isApproved && isActive && (
                <span className="bg-green-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center shadow-sm">
                    <CheckCircle2 size={14} className="mr-1.5" /> Đang hoạt động
                </span>
            )}
        </div>

        <div className="absolute bottom-3 left-3 z-10">
             <div className="flex items-center bg-white/90 backdrop-blur-md text-gray-800 text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
                <Star size={14} className="fill-yellow-400 text-yellow-400 mr-1" />
                {property.rating || "Mới"}
            </div>
        </div>
      </div>

      {/* --- PHẦN 2: NỘI DUNG --- */}
      <div className="p-5 flex flex-col flex-grow">
        
        {/* ✅ Header: Tên + Toggle Switch */}
        <div className="flex justify-between items-start mb-2 gap-2">
            <h3 className="text-lg font-bold text-gray-900 line-clamp-1 flex-1 group-hover:text-blue-600 transition-colors" title={property.propertyName}>
                {property.propertyName}
            </h3>
            
            {/* Chỉ hiện Toggle khi đã được duyệt */}
            {isApproved && (
                <div title={isActive ? "Bấm để tạm ngưng" : "Bấm để mở lại"}>
                    <ToggleSwitch 
                        enabled={isActive || false}
                        onChange={() => onToggleStatus(property)}
                    />
                </div>
            )}
        </div>

        <div className="flex items-center text-gray-500 text-sm mb-4">
          <MapPin size={14} className="mr-1.5 text-blue-500 flex-shrink-0" />
          <span className="truncate">{property.address}, {property.city}</span>
        </div>

        <div className="grid grid-cols-2 gap-px bg-gray-100 rounded-lg overflow-hidden mb-5 border border-gray-100">
             <div className="bg-gray-50 p-2.5 text-center group-hover:bg-blue-50/50 transition-colors">
                <p className="text-xs text-gray-500 mb-0.5">Loại hình</p>
                <p className="font-semibold text-gray-800 text-sm">{property.propertyType}</p>
             </div>
             <div className="bg-gray-50 p-2.5 text-center group-hover:bg-blue-50/50 transition-colors">
                <p className="text-xs text-gray-500 mb-0.5">Đánh giá</p>
                <p className="font-semibold text-gray-800 text-sm">{property.reviewCount || 0}</p>
             </div>
        </div>

        {/* --- PHẦN 3: ACTIONS --- */}
        <div className="mt-auto flex gap-3 pt-4 border-t border-gray-100">
          
          <Button
            variant={isApproved ? "outline" : "secondary"}
            className={`flex-1 ${!isApproved ? "opacity-70 cursor-not-allowed" : "hover:border-blue-500 hover:text-blue-600"}`}
            size="sm"
            onClick={handleEditClick} 
            disabled={!isApproved}
            title={!isApproved ? "Chỉ có thể chỉnh sửa khi đã được duyệt" : "Chỉnh sửa thông tin"}
            leftIcon={<Edit size={16}/>}
          >
            {isPending ? "Đang xét duyệt" : isRejected ? "Bị từ chối" : "Chỉnh sửa"}
          </Button>
          
          <Button
             variant="secondary"
             size="sm"
             iconOnly
             className="text-gray-500 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-colors"
             onClick={onView} 
             title="Xem chi tiết"
          >
              <Eye size={18} />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;