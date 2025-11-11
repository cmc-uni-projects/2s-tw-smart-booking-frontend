import React from "react";
// (Bỏ import useNavigate)
import Card from "@/components/common/Card/Card";
import Badge from "@/components/common/Badge/Badge";
import Button from "@/components/common/Button/Button";
import { MapPin, Edit, EyeOff, Eye, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

// (Hàm getStatusBadge giữ nguyên)
const getStatusBadge = (status, isEnable) => {
  if (status === "PENDING") {
    return <Badge color="warning" icon={<AlertTriangle size={14} />}>Chờ duyệt</Badge>;
  }
  if (status === "REJECTED") {
    return <Badge color="danger" icon={<XCircle size={14} />}>Bị từ chối</Badge>;
  }
  if (status === "APPROVED") {
    if (isEnable) {
      return <Badge color="success" icon={<CheckCircle2 size={14} />}>Đang hoạt động</Badge>;
    } else {
      return <Badge color="gray" icon={<EyeOff size={14} />}>Đã vô hiệu hóa</Badge>;
    }
  }
  return <Badge color="gray">{status}</Badge>;
};

/**
 * Cập nhật: Nhận thêm props onEditClick, onToggleClick, onViewClick
 */
export default function PropertyCard({ property, onEditClick, onToggleClick, onViewClick }) {
  
  const { id, name, location, imageUrl, status, isEnable } = property;
  const isApproved = status === "APPROVED";

  return (
    <Card className="p-0 overflow-hidden group flex flex-col justify-between h-full shadow-md">
      {/* Phần hình ảnh (giữ nguyên) */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 right-3 z-10">
          {getStatusBadge(status, isEnable)}
        </div>
      </div>

      {/* Phần nội dung (giữ nguyên) */}
      <div className="p-5 flex-1">
        <h3 className="font-semibold text-lg text-gray-800 truncate" title={name}>
          {name}
        </h3>
        <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
          <MapPin size={16} />
          <span className="truncate">{location}</span>
        </div>
      </div>

      {/* Phần chân (Actions) - CẬP NHẬT ONCLICK */}
      <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-2 justify-end">
        {!isApproved ? (
          // 1. Nút Xem
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewClick(property)} // Gọi hàm từ props
            leftIcon={<Eye size={16} />}
          >
            Xem chi tiết đơn
          </Button>
        ) : (
          // 2. Nếu ĐÃ ĐƯỢC DUYỆT
          <>
            {isEnable ? (
              // 2a. Nút Vô hiệu hóa
              <Button
                variant="outline"
                size="sm"
                onClick={() => onToggleClick(property)} // Gọi hàm từ props
                leftIcon={<EyeOff size={16} />}
                className="text-yellow-700 border-yellow-300 hover:bg-yellow-50 hover:border-yellow-400"
              >
                Vô hiệu hóa
              </Button>
            ) : (
              // 2b. Nút Kích hoạt
              <Button
                variant="outline"
                size="sm"
                onClick={() => onToggleClick(property)} // Gọi hàm từ props
                leftIcon={<Eye size={16} />}
                className="text-green-700 border-green-300 hover:bg-green-50 hover:border-green-400"
              >
                Kích hoạt
              </Button>
            )}
            
            {/* 2c. Nút Sửa */}
            <Button
              size="sm"
              onClick={() => onEditClick(property)} // ✅ GỌI HÀM NÀY
              leftIcon={<Edit size={16} />}
            >
              Sửa thông tin
            </Button>
          </>
        )}
      </div>
    </Card>
  );
}