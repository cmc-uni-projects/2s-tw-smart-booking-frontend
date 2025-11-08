import React from "react";
// Import các component common
import Button from "../../../../components/common/Button/Button";
import Badge from "../../../../components/common/Badge/Badge";
import Avatar from "../../../../components/common/Avatar/Avatar";
import { Eye, Check, X, Mail, User, Calendar } from "lucide-react";

// Component con nội bộ để hiển thị thông tin
const InfoRow = ({ icon, text }) => (
  <div className="flex items-center gap-2 text-sm text-gray-600">
    {icon}
    <span>{text}</span>
  </div>
);

// Component Card nhận 3 hàm: onApprove, onReject, onViewDetails
const ApprovalCard = ({ application, onApprove, onReject, onViewDetails }) => {
  
  const statusText = application.status?.props?.children || "Không rõ";

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col">
      
      {/* 1. Header của Card */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-[rgb(40,169,224)]">
            {application.hotelName}
          </h3>
          <Badge color={statusText === "Đang chờ" ? "warning" : "default"}>
            {statusText}
          </Badge>
        </div>
      </div>

      {/* 2. Body của Card */}
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <Avatar name={application.ownerName} size={40} />
          <div>
            <InfoRow 
              icon={<User size={14} />} 
              text={application.ownerName} 
            />
            <InfoRow 
              icon={<Mail size={14} />} 
              text={application.email} 
            />
          </div>
        </div>
        <InfoRow 
          icon={<Calendar size={14} />} 
          text={`Ngày nộp: ${application.submittedDate}`} 
        />
      </div>

      {/* 3. Footer của Card: Các nút hành động */}
      <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-2 justify-end">
        {/* NÚT XEM */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetails(application)}
          leftIcon={<Eye size={16} />}
        >
          Xem
        </Button>
        
        {/* ✅ SỬA LỖI TẠI ĐÂY: NÚT TỪ CHỐI */}
        <Button
          variant="danger-outline" // (Hoặc "outline" nếu "danger-outline" không tồn tại)
          size="sm"
          // Đảm bảo 100% gọi đúng hàm 'onReject'
          onClick={() => onReject(application)} 
          leftIcon={<X size={16} />}
        >
          Từ chối
        </Button>

        {/* NÚT PHÊ DUYỆT */}
        <Button
          variant="success" // (Hoặc "primary" nếu "success" không tồn tại)
          size="sm"
          onClick={() => onApprove(application)}
          leftIcon={<Check size={16} />}
        >
          Phê duyệt
        </Button>
      </div>
    </div>
  );
};

export default ApprovalCard;