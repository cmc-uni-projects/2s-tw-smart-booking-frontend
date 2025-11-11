import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "@/components/common/Card/Card";
import CardHeader from "@/components/common/Card/CardHeader";
import Button from "@/components/common/Button/Button";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import { BedDouble, ArrowLeft } from "lucide-react";
import EditRoomModal from "./components/EditRoomModal"; // Import modal sửa
import RoomCard from "./components/RoomCard"; // Import card phòng

// ----- MOCK DATA (Lấy từ RoomManagementPage cũ) -----
const allMockRooms = [
  {
    id: 101, propertyId: 1, roomName: "Deluxe King Hướng Biển", roomCategory: "Deluxe",
    capacity: 2, pricePerNight: 2500000, roomStatus: "AVAILABLE", isActive: true,
    description: "Phòng Deluxe King 35m2 có ban công nhìn ra biển.",
    images: [
      { id: 1, url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b", isCover: true },
      { id: 2, url: "https://images.unsplash.com/photo-1611892440504-4cb0296a1a19", isCover: false },
    ],
    amenities: { tv: true, ac: true, wifi: true, bathtub: true, minibar: true },
  },
  {
    id: 102, propertyId: 1, roomName: "Suite Tổng Thống", roomCategory: "Suite",
    capacity: 4, pricePerNight: 10000000, roomStatus: "CLEANING", isActive: true,
    description: "Phòng Suite 120m2, 2 phòng ngủ, view toàn cảnh.",
    images: [
      { id: 3, url: "https://images.unsplash.com/photo-1560347876-aeef00eeab8f", isCover: true },
    ],
    amenities: { tv: true, ac: true, wifi: true, bathtub: true, minibar: true, tea_coffee: true, balcony: true },
  },
  {
    id: 103, propertyId: 1, roomName: "Standard Twin", roomCategory: "Standard",
    capacity: 2, pricePerNight: 1800000, roomStatus: "OCCUPIED", isActive: true,
    description: "Phòng 2 giường đơn, 30m2.",
    images: [],
    amenities: { tv: true, ac: true, wifi: true },
  },
  {
    id: 201, propertyId: 3, roomName: "Standard Hướng Vườn", roomCategory: "Standard",
    capacity: 2, pricePerNight: 1200000, roomStatus: "OUT_OF_ORDER", isActive: false,
    description: "Phòng tiêu chuẩn 25m2, không view.",
    images: [],
    amenities: { tv: true, ac: true, wifi: true },
  },
];
// ------------------------------------

const RoomListPage = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  // 1. Lọc danh sách phòng dựa trên propertyId từ URL
  const filteredRooms = useMemo(() => {
    // Chuyển đổi propertyId từ URL (string) sang số
    return allMockRooms.filter(room => room.propertyId === Number(propertyId)); 
  }, [propertyId]);

  // 2. Xử lý mở modal
  const handleEditClick = (room) => {
    setSelectedRoom(room);
    setEditModalOpen(true);
  };
  
  // 3. Xử lý đóng modal
  const closeModals = () => {
    setSelectedRoom(null);
    setEditModalOpen(false);
  };

  // 4. Xử lý khi Submit form (từ modal)
  const handleEditSubmit = (data) => {
    console.log(`🚀 [MOCK API] ĐANG CẬP NHẬT PHÒNG ID: ${selectedRoom.id}`, data);
    closeModals();
    alert("Đã cập nhật phòng thành công (mock)!");
    // (Sau khi API thật chạy, bạn nên fetch lại `allMockRooms`)
  };

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        onClick={() => navigate("/owner/rooms")} // Nút quay lại trang chọn khách sạn
        leftIcon={<ArrowLeft size={18} />}
        className="mb-4"
      >
        Quay lại
      </Button>

      <Card>
        <CardHeader
          title={`Danh sách phòng (Cơ sở ID: ${propertyId})`}
          subtitle={`Tìm thấy ${filteredRooms.length} phòng.`}
          icon={<BedDouble className="text-[rgb(40,169,224)]" />}
        />

        {/* Danh sách các phòng (dạng card) */}
        <div className="mt-6">
          {filteredRooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  onEditClick={handleEditClick}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Không tìm thấy phòng nào"
              description="Cơ sở này chưa có phòng nào. Bạn có thể thêm phòng mới."
            />
          )}
        </div>
      </Card>
      
      {/* Modal chỉnh sửa (giống hệt trang cũ) */}
      <EditRoomModal
        open={isEditModalOpen}
        onClose={closeModals}
        room={selectedRoom}
        onSubmit={handleEditSubmit}
      />
    </>
  );
};

export default RoomListPage;