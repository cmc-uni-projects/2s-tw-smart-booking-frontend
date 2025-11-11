import React from "react";
import Card from "@/components/common/Card/Card";
import Badge from "@/components/common/Badge/Badge";
import Button from "@/components/common/Button/Button";
import { Users, Tag, Edit, Eye, EyeOff } from "lucide-react";
import { ROOM_STATUS_OPTIONS } from "./roomData.jsx"; // Import mock data trạng thái

// Lấy ảnh bìa (isCover: true)
const getCoverImage = (images) => {
  if (!images || images.length === 0) {
    // Ảnh placeholder nếu không có ảnh
    return "https://images.unsplash.com/photo-1540518614846-713b0e193c79?auto=format&fit=crop&w=400&q=80";
  }
  const cover = images.find(img => img.isCover);
  return cover ? cover.url : images[0].url; // Lấy ảnh bìa, nếu không có thì lấy ảnh đầu tiên
};

// Lấy nhãn của trạng thái (vd: "AVAILABLE" -> "Sẵn sàng (Available)")
const getStatusLabel = (statusValue) => {
  return ROOM_STATUS_OPTIONS.find(opt => opt.value === statusValue)?.label || statusValue;
};

export default function RoomCard({ room, onEditClick }) {
  const { roomName, roomCategory, capacity, pricePerNight, roomStatus, isActive, images } = room;
  const coverImage = getCoverImage(images);

  return (
    <Card className="p-0 overflow-hidden group flex flex-col justify-between h-full shadow-md">
      {/* Phần hình ảnh */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={coverImage}
          alt={roomName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Lớp phủ trạng thái */}
        <div className="absolute top-3 right-3 z-10">
          <Badge color={isActive ? "success" : "gray"} icon={isActive ? <Eye size={14} /> : <EyeOff size={14} />}>
            {isActive ? "Đang kích hoạt" : "Vô hiệu hóa"}
          </Badge>
        </div>
         <div className="absolute top-12 right-3 z-10">
           <Badge color="primary" icon={false}>
            {getStatusLabel(roomStatus)}
          </Badge>
        </div>
      </div>

      {/* Phần nội dung */}
      <div className="p-5 flex-1">
        <h3 className="font-semibold text-lg text-gray-800 truncate" title={roomName}>
          {roomName}
        </h3>
        <p className="text-sm text-gray-500 mt-1">{roomCategory}</p>
        
        <div className="flex justify-between items-center mt-3 pt-3 border-t">
           <div className="flex items-center gap-1.5 text-sm text-gray-600">
             <Users size={16} />
             <span>{capacity} người</span>
           </div>
           <div className="flex items-center gap-1.5 text-sm font-semibold text-[rgb(40,169,224)]">
             <Tag size={16} />
             <span>{pricePerNight.toLocaleString('vi-VN')} VNĐ</span>
           </div>
        </div>
      </div>

      {/* Phần chân (Actions) */}
      <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
        <Button
          size="sm"
          onClick={() => onEditClick(room)}
          leftIcon={<Edit size={16} />}
        >
          Sửa thông tin phòng
        </Button>
      </div>
    </Card>
  );
}