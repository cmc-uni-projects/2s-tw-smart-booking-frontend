import React from "react";
// Import các component common
import Button from "../../../../components/common/Button/Button";
import Badge from "../../../../components/common/Badge/Badge";
// 1. Import icons mới cho phù hợp
import { Eye, Check, X, User, MapPin, Home } from "lucide-react";

// Component con nội bộ để hiển thị thông tin
const InfoRow = ({ icon, text }) => (
  <div className="flex items-center gap-2 text-sm text-gray-600">
    {icon}
    <span>{text}</span>
  </div>
);

// 2. Đổi tên prop từ 'application' sang 'submission'
const HotelSubmissionCard = ({ submission, onApprove, onReject, onViewDetails }) => {
  
  const statusText = submission.status?.props?.children || "Không rõ";

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col">
      
      {/* 1. Header (Tên khách sạn, Trạng thái) */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-[rgb(40,169,224)]">
            {submission.hotelName}
          </h3>
          <Badge color={statusText === "Đang chờ duyệt" ? "warning" : "default"}>
            {statusText}
          </Badge>
        </div>
      </div>

      {/* 2. Body (Thông tin tóm tắt về khách sạn) */}
      {/* 3. Cập nhật phần body để hiển thị thông tin của submission */}
      <div className="p-4 space-y-3">
        <InfoRow 
          icon={<User size={14} />} 
          text={`Chủ sở hữu: ${submission.ownerName}`} 
        />
        <InfoRow 
          icon={<MapPin size={14} />} 
          text={`Địa điểm: ${submission.location}`} 
        />
         <InfoRow 
          icon={<Home size={14} />} 
          text={`Tổng số phòng: ${submission.roomCount}`} 
        />
      </div>

      {/* 3. Footer (Các nút hành động - giữ nguyên) */}
      <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-2 justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetails(submission)} // 4. Đổi sang submission
          leftIcon={<Eye size={16} />}
        >
          Xem chi tiết
        </Button>
        
        <Button
          variant="danger-outline"
          size="sm"
          onClick={() => onReject(submission)} // 4. Đổi sang submission
          leftIcon={<X size={16} />}
        >
          Từ chối
        </Button>

        <Button
          variant="success"
          size="sm"
          onClick={() => onApprove(submission)} // 4. Đổi sang submission
          leftIcon={<Check size={16} />}
        >
          Phê duyệt
        </Button>
      </div>
    </div>
  );
};

export default HotelSubmissionCard;