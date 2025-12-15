// src/pages/Admin/Hotels/components/HotelRoomsModal.jsx
import React, { useState, useEffect } from "react";
import Modal from "@/components/common/Modal/Modal";
import Table from "@/components/common/Table/Table";
import Button from "@/components/common/Button/Button";
import { Ban, CheckCircle } from "lucide-react";
import adminService from "@/services/admin.service";
import SuspendModal from "@/components/common/Modal/SuspendModal";
import Toast from "@/components/common/Notification/Toast";

const HotelRoomsModal = ({ isOpen, onClose, hotel }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Suspend Room State
  const [suspendRoomModalOpen, setSuspendRoomModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchRooms = async () => {
    if (!hotel) return;
    setLoading(true);
    try {
      const res = await adminService.getPropertyRooms(hotel.propertyId);
      if (res.success) {
        setRooms(res.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchRooms();
    }
  }, [isOpen, hotel]);

  const handleSuspendClick = (room) => {
    setSelectedRoom(room);
    setSuspendRoomModalOpen(true);
  };

  const handleConfirmSuspendRoom = async (reason) => {
    try {
      await adminService.suspendRoom(selectedRoom.roomId, reason);
      setToast({ message: "Đã dừng phòng thành công", type: "success" });
      fetchRooms(); // Refresh list
    } catch (error) {
      setToast({ message: "Lỗi dừng phòng", type: "error" });
      throw error;
    }
  };

  const columns = [
    { header: "Tên phòng", accessor: "roomName" },
    { 
      header: "Giá/Đêm", 
      accessor: "pricePerNight",
      render: (row) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(row.pricePerNight)
    },
    { 
        header: "Trạng thái", 
        accessor: "roomStatus",
        render: (row) => (
            <span className={`px-2 py-1 rounded text-xs font-medium ${
                row.roomStatus === 'AVAILABLE' ? 'bg-green-100 text-green-800' : 
                row.roomStatus === 'SUSPENDED' ? 'bg-red-100 text-red-800' : 'bg-gray-100'
            }`}>
                {row.roomStatus}
            </span>
        )
    },
    {
      header: "Thao tác",
      render: (row) => (
        row.roomStatus !== 'SUSPENDED' && (
            <Button 
                size="xs" 
                className="bg-red-100 text-red-600 hover:bg-red-200 border-none"
                onClick={() => handleSuspendClick(row)}
            >
                <Ban size={14} className="mr-1" /> Dừng
            </Button>
        )
      )
    }
  ];

  return (
    <>
        <Modal 
            open={isOpen} 
            onClose={onClose} 
            title={`Danh sách phòng - ${hotel?.propertyName}`}
            maxWidth="max-w-4xl" // Modal rộng hơn để hiển thị bảng
        >
            {toast && <div className="mb-4"><Toast message={toast.message} type={toast.type} /></div>}
            
            <Table columns={columns} data={rooms} isLoading={loading} />
        </Modal>

        {/* Nested Modal: Suspend Room */}
        <SuspendModal 
            isOpen={suspendRoomModalOpen}
            onClose={() => setSuspendRoomModalOpen(false)}
            onConfirm={handleConfirmSuspendRoom}
            title="Dừng hoạt động Phòng"
            itemName={selectedRoom?.roomName}
        />
    </>
  );
};

export default HotelRoomsModal;