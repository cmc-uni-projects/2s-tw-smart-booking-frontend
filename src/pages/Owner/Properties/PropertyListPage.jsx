// src/pages/Owner/Properties/PropertyListPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2 } from "lucide-react";
import Card from "@/components/common/Card/Card";
import CardHeader from "@/components/common/Card/CardHeader";
import PropertyCard from "./components/PropertyCard";
import ConfirmModal from "@/components/common/Modal/ConfirmModal";
import ViewSubmissionModal from "./components/ViewSubmissionModal";
import EditPropertyModal from "./components/EditPropertyModal"; // ✅ 1. Import Modal Sửa mới

// (MOCK DATA ĐÃ ĐƯỢC CẬP NHẬT VỚI DỮ LIỆU CHI TIẾT)
const mockProperties = [
  {
    id: 1,
    name: "Khách sạn The Grand Plaza", // Dùng cho Card
    location: "Quận 1, TP. Hồ Chí Minh", // Dùng cho Card
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80", // Dùng cho Card
    status: "APPROVED",
    isEnable: true,
    
    // --- Dữ liệu chi tiết cho Form Sửa ---
    details: {
      propertyName: "Khách sạn The Grand Plaza",
      description: "Tọa lạc tại trung tâm Quận 1, The Grand Plaza mang đến trải nghiệm sang trọng bậc nhất với hồ bơi vô cực và nhà hàng 5 sao. Mô tả này đủ dài để vượt qua validation 50 ký tự.",
      area: 2500,
    },
    locationDetails: {
      province: "TP. Hồ Chí Minh",
      city: "Quận 1",
      address: "123 đường Nguyễn Huệ",
    },
    amenities: {
      pool: true,
      wifi: true,
      parking: true,
      reception_24h: true,
      gym: false,
    },
    // Lưu ý: Rất khó để mock FileList, chúng ta sẽ để phần upload ảnh riêng
    existingImages: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
    ]
  },
  {
    id: 2,
    name: "Sunrise Resort (Đang chờ)",
    location: "Phú Quốc, Kiên Giang",
    imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=400&q=80",
    status: "PENDING",
    isEnable: false,
    // (Các đơn PENDING/REJECTED không cần dữ liệu form)
  },
  {
    id: 3,
    name: "Ocean View (Tạm tắt)",
    location: "Vũng Tàu",
    imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80",
    status: "APPROVED",
    isEnable: false,
     // --- Dữ liệu chi tiết cho Form Sửa ---
    details: {
      propertyName: "Ocean View (Tạm tắt)",
      description: "Khách sạn ven biển Vũng Tàu với view triệu đô. Đảm bảo mô tả này cũng đủ 50 ký tự để không bị lỗi validation khi mở form.",
      area: 1800,
    },
    locationDetails: {
      province: "Bà Rịa - Vũng Tàu",
      city: "TP. Vũng Tàu",
      address: "456 đường Hạ Long",
    },
    amenities: {
      pool: true,
      wifi: true,
      parking: false,
      reception_24h: true,
      gym: true,
    },
    existingImages: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
    ]
  },
  {
    id: 4,
    name: "Mountain Retreat (Bị từ chối)",
    location: "Sapa, Lào Cai",
    imageUrl: "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&w=400&q=80",
    status: "REJECTED",
    isEnable: false,
  },
];

const PropertyListPage = () => {
  const properties = mockProperties;
  const navigate = useNavigate();

  // ----- QUẢN LÝ STATE CHO MODAL -----
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isToggleModalOpen, setToggleModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false); // ✅ 2. Thêm state cho modal Sửa

  // ----- CÁC HÀM XỬ LÝ SỰ KIỆN -----

  // 1. Xử lý khi bấm SỬA: Mở modal Sửa
  const handleEditClick = (property) => {
    setSelectedProperty(property);
    setEditModalOpen(true); // ✅ 3. Mở modal Sửa
  };

  // 2. Xử lý khi bấm VÔ HIỆU HÓA / KÍCH HOẠT: Mở modal xác nhận
  const handleToggleClick = (property) => {
    setSelectedProperty(property);
    setToggleModalOpen(true);
  };

  // 3. Xử lý khi bấm XEM CHI TIẾT (cho PENDING/REJECTED): Mở modal thông tin
  const handleViewClick = (property) => {
    setSelectedProperty(property);
    setViewModalOpen(true);
  };

  // 4. Hàm đóng tất cả modal
  const closeModals = () => {
    setSelectedProperty(null);
    setToggleModalOpen(false);
    setViewModalOpen(false);
    setEditModalOpen(false); // ✅ 4. Thêm đóng modal Sửa
  };

  // 5. Hàm XÁC NHẬN VÔ HIỆU HÓA / KÍCH HOẠT
  const handleConfirmToggle = () => {
    console.log("ĐANG THAY ĐỔI TRẠNG THÁI CHO:", selectedProperty.name);
    closeModals();
    alert(`Đã ${selectedProperty.isEnable ? 'vô hiệu hóa' : 'kích hoạt'} ${selectedProperty.name}`);
  };

  // ✅ 6. Hàm XÁC NHẬN LƯU THAY ĐỔI (Từ Modal Sửa)
  const handleConfirmEdit = (data) => {
    // TODO: Gọi API để CẬP NHẬT property với 'data'
    console.log("===============================");
    console.log("🚀 [MOCK API] ĐANG CẬP NHẬT DỮ LIỆU CHO:", selectedProperty.name);
    console.log("Dữ liệu mới:", data);
    console.log("===============================");
    
    closeModals();
    alert("Đã cập nhật thành công (mock)!");
    // (Sau khi gọi API thật, bạn nên fetch lại danh sách properties)
  };
  // ------------------------------------

  return (
    <>
      <Card>
        <div className="mb-4">
          <CardHeader
            title="Quản lý Cơ sở lưu trú"
            subtitle={`Bạn đang quản lý ${properties.length} cơ sở.`}
            icon={<Building2 className="text-[rgb(40,169,224)]" />}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onEditClick={handleEditClick}
              onToggleClick={handleToggleClick}
              onViewClick={handleViewClick}
            />
          ))}
        </div>
      </Card>

      {/* ----- KHAI BÁO CÁC MODAL ----- */}

      {/* 1. Modal Xác nhận (Toggle Enable/Disable) */}
      <ConfirmModal
        open={isToggleModalOpen}
        onClose={closeModals}
        onConfirm={handleConfirmToggle}
        title={selectedProperty?.isEnable ? "Xác nhận Vô hiệu hóa" : "Xác nhận Kích hoạt"}
        message={
          <span>
            Bạn có chắc chắn muốn {selectedProperty?.isEnable ? "VÔ HIỆU HÓA" : "KÍCH HOẠT"}{" "}
            cơ sở <strong>{selectedProperty?.name}</strong>?
          </span>
        }
        type={selectedProperty?.isEnable ? "warning" : "success"}
        confirmText={selectedProperty?.isEnable ? "Vô hiệu hóa" : "Kích hoạt"}
        cancelText="Hủy"
      />

      {/* 2. Modal Xem chi tiết (Pending/Rejected) */}
      <ViewSubmissionModal
        open={isViewModalOpen}
        onClose={closeModals}
        property={selectedProperty}
      />
      
      {/* ✅ 7. Modal Sửa thông tin */}
      <EditPropertyModal
        open={isEditModalOpen}
        onClose={closeModals}
        property={selectedProperty}
        onSubmit={handleConfirmEdit}
      />
    </>
  );
};

export default PropertyListPage;