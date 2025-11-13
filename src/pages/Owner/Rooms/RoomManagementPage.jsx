import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/common/Card/Card";
import CardHeader from "@/components/common/Card/CardHeader";
import { Building2 } from "lucide-react";
import PropertyRowCard from "./components/PropertyRowCard"; // Import card khách sạn
import EmptyState from "@/components/common/EmptyState/EmptyState"; // Import EmptyState

// ----- MOCK DATA (Lấy từ PropertyListPage) -----
// Chúng ta chỉ cần dữ liệu này để demo trang chọn
const mockProperties = [
  {
    id: 1,
    name: "Khách sạn The Grand Plaza", 
    location: "Quận 1, TP. Hồ Chí Minh", 
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80",
    status: "APPROVED",
    isEnable: true,
    roomCount: 15, // (Giả lập số phòng)
  },
  {
    id: 2,
    name: "Sunrise Resort (Đang chờ)",
    location: "Phú Quốc, Kiên Giang",
    imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=400&q=80",
    status: "PENDING",
    isEnable: false,
    roomCount: 0,
  },
  {
    id: 3,
    name: "Ocean View (Tạm tắt)",
    location: "Vũng Tàu",
    imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80",
    status: "APPROVED",
    isEnable: false, // Bị vô hiệu hóa
    roomCount: 10,
  },
];
// ------------------------------------

const RoomManagementPage = () => {
  const navigate = useNavigate();

  // 1. Lọc danh sách khách sạn: Chỉ lấy cái ĐÃ DUYỆT và ĐANG KÍCH HOẠT
  const activeProperties = mockProperties.filter(
    p => p.status === "APPROVED" && p.isEnable === true
  );

  // 2. Xử lý khi bấm "Xem phòng"
  const handleViewRoomsClick = (propertyId) => {
    navigate(`/owner/rooms/${propertyId}`); // Chuyển trang
  };

  return (
    <Card>
      <CardHeader
        title="Quản lý Phòng"
        subtitle="Chọn một cơ sở lưu trú để xem và chỉnh sửa danh sách phòng."
        icon={<Building2 className="text-[rgb(40,169,224)]" />}
      />
      
      {/* Danh sách các khách sạn (dạng card-row) */}
      <div className="mt-6 space-y-6">
        {activeProperties.length > 0 ? (
          activeProperties.map((property) => (
            <PropertyRowCard
              key={property.id}
              property={property}
              onViewRoomsClick={handleViewRoomsClick}
            />
          ))
        ) : (
          <EmptyState
            title="Không có cơ sở nào đang hoạt động"
            description="Bạn cần có ít nhất một cơ sở lưu trú đã được 'Phê duyệt' và 'Kích hoạt' để quản lý phòng."
          />
        )}
      </div>
    </Card>
  );
};

export default RoomManagementPage;