// src/pages/Admin/Hotels/ActiveHotelsPage.jsx
import React, { useState, useEffect } from "react";
import { Hotel, Eye, Ban, Building } from "lucide-react";
import Card from "@/components/common/Card/Card";
import CardHeader from "@/components/common/Card/CardHeader";
import Table from "@/components/common/Table/Table"; // Kiểm tra lại đường dẫn Table của bạn
import Button from "@/components/common/Button/Button";
import Toast from "@/components/common/Notification/Toast";
import adminService from "@/services/admin.service";
import SuspendModal from "@/components/common/Modal/SuspendModal";
import HotelRoomsModal from "./components/HotelRoomsModal"; // Chúng ta sẽ tạo component này ở bước 4

const ActiveHotelsPage = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [toast, setToast] = useState(null);

  // Modal states
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [roomsModalOpen, setRoomsModalOpen] = useState(false);

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const res = await adminService.getActiveProperties(page, 10);
      if (res.success) {
        setHotels(res.data.content); // Giả sử Spring Data trả về Page object
        setTotalPages(res.data.totalPages);
      }
    } catch (error) {
      setToast({ message: "Lỗi tải danh sách khách sạn", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, [page]);

  const handleSuspendClick = (hotel) => {
    setSelectedHotel(hotel);
    setSuspendModalOpen(true);
  };

  const handleViewRoomsClick = (hotel) => {
    setSelectedHotel(hotel);
    setRoomsModalOpen(true);
  };

  const handleConfirmSuspend = async (reason) => {
    if (!selectedHotel) return;
    try {
      await adminService.suspendProperty(selectedHotel.propertyId, reason);
      setToast({ message: "Đã dừng hoạt động khách sạn thành công", type: "success" });
      fetchHotels(); // Reload list
    } catch (error) {
      setToast({ message: error.response?.data?.message || "Lỗi khi dừng hoạt động", type: "error" });
      throw error; // Để modal biết là lỗi
    }
  };

  const columns = [
    { header: "ID", accessor: "propertyId" },
    { 
      header: "Tên Khách sạn", 
      accessor: "propertyName",
      render: (row) => (
        <div className="flex items-center gap-3">
            <img 
                src={row.coverImage || "/assets/images/placeholder.png"} 
                alt="" 
                className="w-10 h-10 rounded object-cover"
            />
            <span className="font-medium">{row.propertyName}</span>
        </div>
      )
    },
    { header: "Chủ sở hữu", accessor: "ownerName" }, // Đảm bảo DTO trả về field này
    { header: "Địa chỉ", accessor: "address" },
    {
      header: "Hành động",
      accessor: "actions",
      render: (row) => (
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => handleViewRoomsClick(row)}
            title="Xem danh sách phòng"
          >
            <Building size={16} className="text-blue-600" />
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="border-red-200 hover:bg-red-50"
            onClick={() => handleSuspendClick(row)}
            title="Dừng hoạt động"
          >
            <Ban size={16} className="text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <Card>
        <CardHeader 
          title="Danh sách Khách sạn Đang hoạt động" 
          subtitle="Quản lý và giám sát các cơ sở lưu trú"
          icon={<Hotel className="text-green-600" />}
        />
        <div className="mt-4">
          <Table 
            columns={columns} 
            data={hotels} 
            isLoading={loading}
            // Add pagination props if your Table supports it
          />
          {/* Pagination Controls Here if Table doesn't handle it internaly */}
        </div>
      </Card>

      {/* Modal Dừng Hoạt Động Khách Sạn */}
      <SuspendModal
        isOpen={suspendModalOpen}
        onClose={() => setSuspendModalOpen(false)}
        onConfirm={handleConfirmSuspend}
        title="Dừng hoạt động Khách sạn"
        itemName={selectedHotel?.propertyName}
      />

      {/* Modal Xem Danh Sách Phòng */}
      {selectedHotel && (
        <HotelRoomsModal
            isOpen={roomsModalOpen}
            onClose={() => setRoomsModalOpen(false)}
            hotel={selectedHotel}
        />
      )}
    </div>
  );
};

export default ActiveHotelsPage;