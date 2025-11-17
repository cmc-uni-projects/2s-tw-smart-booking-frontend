import React from "react";
import { Eye, Check, X, User, Calendar, MapPin, ImageOff } from "lucide-react";
import Button from "@/components/common/Button/Button";
import Badge from "@/components/common/Badge/Badge";
import { motion } from "framer-motion";

// ==========================================
// ✅ 1. THÊM HÀM XỬ LÝ URL ẢNH (Giống Modal)
// ==========================================
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8386/api/v1")
  .replace("/api/v1", "");

const getFullImageUrl = (url) => {
  if (!url) return null; // Trả về null để hiển thị placeholder
  if (url.startsWith("http")) return url;

  let path = url.startsWith("/") ? url : `/${url}`;
  if (!path.startsWith("/uploads")) {
    path = `/uploads${path}`;
  }
  return `${API_BASE_URL}${path}`;
};

// ✅ Định nghĩa animation
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, x: -50, transition: { duration: 0.3 } },
};

const HotelSubmissionCard = ({ hotel, onViewDetails, onApprove, onReject }) => {
  
  // Lấy URL ảnh bìa (Ưu tiên coverImage nếu API có trả về, nếu không thì lấy imageUrl)
  const displayImage = getFullImageUrl(hotel.coverImage || hotel.imageUrl);

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      className="flex flex-col md:flex-row bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden 
                 transition-all duration-300 ease-in-out
                 hover:shadow-lg hover:scale-[1.01] hover:border-blue-300"
    >
      {/* Cột Ảnh */}
      <div className="md:w-1/3 lg:w-1/4 flex-shrink-0 relative bg-gray-100 flex items-center justify-center">
        {displayImage ? (
          <img
            // ✅ 2. SỬ DỤNG URL ĐÃ XỬ LÝ
            src={displayImage}
            alt={`Ảnh của ${hotel.hotelName}`}
            className="w-full h-48 md:h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none'; // Ẩn ảnh lỗi
              e.target.nextSibling.style.display = 'flex'; // Hiện placeholder
            }}
          />
        ) : null}
        
        {/* Placeholder khi không có ảnh hoặc ảnh lỗi */}
        <div 
          className={`absolute inset-0 flex flex-col items-center justify-center text-gray-400 ${displayImage ? 'hidden' : 'flex'}`}
        >
          <ImageOff size={32} className="mb-2 opacity-50" />
          <span className="text-xs font-medium">Không có ảnh</span>
        </div>
      </div>

      {/* Cột Thông tin */}
      <div className="flex-grow p-5 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
              {hotel.propertyName || hotel.hotelName}
            </h3>
            <Badge variant={hotel.propertyStatus === "PENDING" ? "warning" : "default"} className="flex-shrink-0 ml-4">
              {hotel.propertyStatus === "PENDING" ? "Chờ duyệt" : hotel.propertyStatus}
            </Badge>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center">
              <User size={14} className="mr-2 flex-shrink-0 text-gray-500" />
              <span>
                Chủ sở hữu:{" "}
                <span className="font-semibold text-gray-800">
                  {hotel.ownerFullName || hotel.ownerName}
                </span>
              </span>
            </div>

            <div className="flex items-center">
              <MapPin size={14} className="mr-2 flex-shrink-0 text-gray-500" />
              <span className="truncate max-w-[250px]" title={hotel.address}>
                {hotel.address}, {hotel.city}
              </span>
            </div>

            <div className="flex items-center">
              <Calendar size={14} className="mr-2 flex-shrink-0 text-gray-500" />
              <span>
                Ngày nộp:{" "}
                <span className="font-semibold text-gray-800">
                  {hotel.createdAt || hotel.submittedDate}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Cột Nút Bấm */}
        <div className="flex flex-col sm:flex-row gap-2 mt-5 pt-4 border-t border-gray-100">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(hotel)}
            leftIcon={<Eye size={16} />}
            className="flex-1"
          >
            Chi tiết
          </Button>
          
          {/* Chỉ hiện nút Duyệt/Từ chối nếu đang ở trạng thái Chờ duyệt */}
          {(!hotel.propertyStatus || hotel.propertyStatus === "PENDING") && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onReject(hotel)}
                className="flex-1 text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700"
                leftIcon={<X size={16} />}
              >
                Từ chối
              </Button>
              <Button
                size="sm"
                onClick={() => onApprove(hotel)}
                className="flex-1"
                leftIcon={<Check size={16} />}
              >
                Phê duyệt
              </Button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default HotelSubmissionCard;
