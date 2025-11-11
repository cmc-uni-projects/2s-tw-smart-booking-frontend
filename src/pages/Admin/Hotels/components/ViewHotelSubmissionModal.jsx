// 1. Import useState
import React, { useState } from "react";
import Modal from "../../../../components/common/Modal/Modal";
import Button from "../../../../components/common/Button/Button";
import Badge from "../../../../components/common/Badge/Badge";
// 2. Import thêm icon ZoomIn
import { User, MapPin, Home, Info, Wifi, ParkingCircle, Utensils, ZoomIn } from "lucide-react";

// 3. Import modal xem ảnh mới
import ImageViewerModal from "./ImageViewerModal";


// (Dữ liệu mock đầy đủ, giả sử được truyền vào qua prop 'submission')
const MOCK_FULL_SUBMISSION = {
    id: "HSUB-001",
    hotelName: "The Grand Plaza",
    ownerName: "Nguyễn Văn A",
    location: "123 Quận 1, TP. Hồ Chí Minh",
    roomCount: 120,
    status: <Badge color="warning">Đang chờ duyệt</Badge>,
    description: "Tọa lạc tại trung tâm Quận 1, The Grand Plaza mang đến trải nghiệm sang trọng bậc nhất với hồ bơi vô cực và nhà hàng 5 sao...",
    amenities: ["Wifi miễn phí", "Hồ bơi", "Chỗ đỗ xe", "Nhà hàng", "Gym"],
    // 4. Thêm nhiều ảnh hơn để demo
    images: [
        { url: "https://images.unsplash.com/photo-1566073771259-6a8506099945", caption: "Sảnh chính" },
        { url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb", caption: "Hồ bơi" },
        { url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b", caption: "Phòng Deluxe" },
        { url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d", caption: "Nhà hàng" },
        { url: "https://images.unsplash.com/photo-1611892440504-4cb0296a1a19", caption: "Phòng tắm" },
    ],
    roomTypes: [
        { id: 1, name: "Deluxe King", count: 50, price: "2.500.000₫" },
        { id: 2, name: "Suite Hướng Biển", count: 20, price: "4.000.000₫" },
    ]
};
// (Kết thúc dữ liệu mock)


// --- Component con nội bộ (giữ nguyên) ---
const InfoRow = ({ icon, label, value }) => (
  <div>
    <span className="flex items-center gap-2 text-sm font-medium text-gray-500">
      {icon}
      {label}
    </span>
    <p className="text-md text-gray-900 ml-7">{value}</p>
  </div>
);
const AmenityChip = ({ text }) => {
    let icon = <Wifi size={14} />;
    if (text.includes("Hồ bơi")) icon = <Utensils size={14} />; 
    if (text.includes("Chỗ đỗ xe")) icon = <ParkingCircle size={14} />;
    return (<Badge color="gray" icon={icon}>{text}</Badge>);
};
// --- Hết component con ---


const ViewHotelSubmissionModal = ({ open, onClose, submission }) => {
  // 5. ✅ Thêm state cho modal xem ảnh
  const [isViewerOpen, setViewerOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const details = submission ? MOCK_FULL_SUBMISSION : null;
  if (!details) return null;

  // 6. ✅ Hàm để mở modal xem ảnh
  const openImageViewer = (index) => {
    setSelectedImageIndex(index);
    setViewerOpen(true);
  };

  return (
    // 7. ✅ Bọc component bằng Fragment <>...</>
    <>
      <Modal 
          open={open} 
          onClose={onClose} 
          title={`Chi tiết: ${details.hotelName}`}
          maxWidth="max-w-4xl" // Vẫn giữ kích thước 4xl cho modal chi tiết
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* --- CỘT 1: Thông tin & Tiện ích (giữ nguyên) --- */}
          <div className="space-y-6">
            <section className="space-y-3">
                <h4 className="font-semibold text-[rgb(40,169,224)]">Thông tin chung</h4>
                <InfoRow icon={<User size={16}/>} label="Chủ sở hữu" value={details.ownerName} />
                <InfoRow icon={<MapPin size={16}/>} label="Địa chỉ" value={details.location} />
                <InfoRow icon={<Home size={16}/>} label="Tổng số phòng" value={details.roomCount} />
                <InfoRow icon={<Info size={16}/>} label="Mô tả" value={details.description} />
            </section>
            <section>
                <h4 className="font-semibold text-[rgb(40,169,224)] mb-3">Tiện ích nổi bật</h4>
                <div className="flex flex-wrap gap-2">
                    {details.amenities.map(item => (
                        <AmenityChip key={item} text={item} />
                    ))}
                </div>
            </section>
          </div>

          {/* --- CỘT 2: Hình ảnh & Loại phòng (CẬP NHẬT) --- */}
          <div className="space-y-6">
            <section>
                {/* 8. ✅ Thêm nút "Xem tất cả" */}
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-[rgb(40,169,224)]">Hình ảnh</h4>
                  {details.images.length > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => openImageViewer(0)} // Mở ảnh đầu tiên
                      leftIcon={<ZoomIn size={16}/>}
                    >
                      Xem tất cả ({details.images.length})
                    </Button>
                  )}
                </div>
                {/* 9. ✅ Biến ảnh thumbnail thành nút */}
                <div className="grid grid-cols-3 gap-2">
                    {/* Chỉ hiển thị 3 ảnh đầu tiên làm thumbnail */}
                    {details.images.slice(0, 3).map((img, index) => ( 
                        <button
                            type="button"
                            key={index} 
                            onClick={() => openImageViewer(index)} // Mở ảnh được click
                            className="relative w-full h-24 object-cover rounded-md border overflow-hidden group"
                        >
                            <img 
                                src={img.url} 
                                alt={img.caption} 
                                className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                title={img.caption}
                            />
                            {/* Overlay khi hover */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <ZoomIn size={20} className="text-white"/>
                            </div>
                            {/* Nếu có nhiều hơn 3 ảnh, làm mờ ảnh cuối */}
                            {index === 2 && details.images.length > 3 && (
                                <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                                    <span className="font-bold text-gray-700">+{details.images.length - 3}</span>
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </section>
            
            {/* Phần loại phòng (giữ nguyên) */}
            <section>
                <h4 className="font-semibold text-[rgb(40,169,224)] mb-3">Các loại phòng</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {details.roomTypes.map(room => (
                        <li key={room.id}>
                            {room.name} (SL: {room.count} - Giá: {room.price})
                        </li>
                    ))}
                </ul>
            </section>
          </div>
        </div>

        {/* --- Footer (Nút đóng - giữ nguyên) --- */}
        <div className="flex justify-end pt-4 mt-6 border-t">
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </Modal>

      {/* 10. ✅ Render Modal ImageViewer (nó sẽ tự ẩn/hiện) */}
      <ImageViewerModal
        open={isViewerOpen}
        onClose={() => setViewerOpen(false)}
        images={details.images}
        startIndex={selectedImageIndex}
      />
    </>
  );
};

export default ViewHotelSubmissionModal;