import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "@/components/common/Card/Card";
import CardHeader from "@/components/common/Card/CardHeader";
import Button from "@/components/common/Button/Button";
import EmptyState from "@/components/common/EmptyState/EmptyState";
// ✅ 1. Import thêm icon 'Plus'
import { BedDouble, ArrowLeft, Plus } from "lucide-react";
import EditRoomModal from "./components/EditRoomModal"; 
import RoomCard from "./components/RoomCard"; 

// (Mock data giữ nguyên như trước, đã có 'roomCount')
const allMockRooms = [
  {
    id: 101, propertyId: 1, roomName: "Deluxe King Hướng Biển", roomCategory: "Deluxe",
    capacity: 2, pricePerNight: 2500000, roomStatus: "AVAILABLE", isActive: true,
    roomCount: 5, 
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
    roomCount: 1, 
    description: "Phòng Suite 120m2, 2 phòng ngủ, view toàn cảnh.",
    images: [
      { id: 3, url: "https://images.unsplash.com/photo-1560347876-aeef00eeab8f", isCover: true },
    ],
    amenities: { tv: true, ac: true, wifi: true, bathtub: true, minibar: true, tea_coffee: true, balcony: true },
  },
  // (Các phòng khác...)
];
// ------------------------------------

const RoomListPage = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  // ✅ 2. Thêm state cho modal THÊM
  const [isAddModalOpen, setAddModalOpen] = useState(false);

  const filteredRooms = useMemo(() => {
    return allMockRooms.filter(room => room.propertyId === Number(propertyId)); 
  }, [propertyId]);

  // === XỬ LÝ MODAL SỬA ===
  const handleEditClick = (room) => {
    setSelectedRoom(room);
    setEditModalOpen(true);
  };
  const handleEditSubmit = (data) => {
    console.log(`🚀 [MOCK API] ĐANG CẬP NHẬT PHÒNG ID: ${selectedRoom.id}`, data);
    setEditModalOpen(false); // Đóng modal Sửa
    setSelectedRoom(null);
    alert("Đã cập nhật phòng thành công (mock)!");
  };
  
  // === XỬ LÝ MODAL THÊM ===
  const handleAddClick = () => {
    setAddModalOpen(true); // Mở modal Thêm
  };
  const handleAddSubmit = (data) => {
    // Thêm propertyId vào dữ liệu
    const newRoomData = { ...data, propertyId: Number(propertyId) };
    console.log(`🚀 [MOCK API] ĐANG THÊM PHÒNG MỚI CHO CS ID: ${propertyId}`, newRoomData);
    setAddModalOpen(false); // Đóng modal Thêm
    alert("Đã thêm phòng mới thành công (mock)!");
    // (Trong API thật, bạn sẽ fetch lại danh sách)
  };

  // === HÀM ĐÓNG CHUNG ===
  const closeModals = () => {
    setEditModalOpen(false);
    setAddModalOpen(false);
    setSelectedRoom(null); // Reset phòng đang chọn
  };

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        onClick={() => navigate("/owner/rooms")} 
        leftIcon={<ArrowLeft size={18} />}
        className="mb-4"
      >
        Quay lại
      </Button>

      <Card>
        {/* ✅ 3. Cập nhật Header để chứa nút "Thêm" */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
          <CardHeader
            title={`Danh sách phòng (Cơ sở ID: ${propertyId})`}
            subtitle={`Tìm thấy ${filteredRooms.length} phòng.`}
            icon={<BedDouble className="text-[rgb(40,169,224)]" />}
          />
          <Button
            onClick={handleAddClick} // Gọi hàm mở modal Thêm
            leftIcon={<Plus size={18} />}
            className="mt-4 md:mt-0 w-full md:w-auto"
          >
            Thêm phòng mới
          </Button>
        </div>

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
              description="Cơ sở này chưa có phòng nào. Hãy bắt đầu bằng cách thêm phòng mới."
            />
          )}
        </div>
      </Card>
      
      {/* ✅ 4. Khai báo 2 Modal */}
      
      {/* Modal Sửa (chỉ render khi có selectedRoom) */}
      {selectedRoom && (
        <EditRoomModal
          open={isEditModalOpen}
          onClose={closeModals}
          initialData={selectedRoom} // Truyền dữ liệu phòng
          onSubmit={handleEditSubmit}
        />
      )}

      {/* Modal Thêm (chỉ render khi isAddModalOpen = true) */}
      <EditRoomModal
        open={isAddModalOpen}
        onClose={closeModals}
        initialData={null} // Không truyền dữ liệu
        onSubmit={handleAddSubmit}
      />
    </>
  );
};

export default RoomListPage;