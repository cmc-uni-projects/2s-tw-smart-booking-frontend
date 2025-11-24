import React, { useState } from "react";
import Modal from "@/components/common/Modal/Modal";
import Button from "@/components/common/Button/Button";
import { Tv, Wind, Droplet, Coffee, Wifi, Bath, Bed, Ban, Maximize, CheckCircle } from "lucide-react";
// ✅ 1. Import ImageViewerModal
import ImageViewerModal from "@/pages/Admin/Hotels/components/ImageViewerModal";

// ... (Giữ nguyên phần khai báo ICONS và các component con AmenityItem, ServiceItem) ...
const ROOM_AMENITIES_ICONS = {
    tv: { label: "TV màn hình phẳng", icon: <Tv size={16} /> },
    ac: { label: "Điều hòa", icon: <Wind size={16} /> },
    minibar: { label: "Quầy bar mini", icon: <Droplet size={16} /> },
    tea_coffee: { label: "Trà/Cà phê", icon: <Coffee size={16} /> },
    wifi: { label: "Wi-Fi miễn phí", icon: <Wifi size={16} /> },
    bathtub: { label: "Bồn tắm", icon: <Bath size={16} /> },
    balcony: { label: "Ban công", icon: <Bed size={16} /> },
    non_smoking: { label: "Phòng không hút thuốc", icon: <Ban size={16} /> },
};

const AmenityItem = ({ icon, text }) => (
    <li className="flex items-center gap-2 text-sm text-gray-700">
        <span className="text-gray-500">{icon}</span>
        <span>{text}</span>
    </li>
);

const ServiceItem = ({ text }) => (
    <li className="flex items-center gap-2 text-sm text-gray-700">
        <CheckCircle size={14} className="text-green-600" />
        <span>{text}</span>
    </li>
);

const RoomDetailModal = ({ room, open, onClose }) => {
    // ✅ 2. Thêm State quản lý việc xem ảnh
    const [isViewerOpen, setViewerOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    if (!room) return null;

    const availableAmenities = Object.keys(room.amenities || {})
        .filter(key => room.amenities[key] && ROOM_AMENITIES_ICONS[key])
        .map(key => ROOM_AMENITIES_ICONS[key]);

    const roomImages = room.images || [];

    // ✅ 3. Hàm mở viewer
    const handleImageClick = (index) => {
        setSelectedImageIndex(index);
        setViewerOpen(true);
    };

    // Chuẩn bị dữ liệu cho ImageViewer
    const viewerImages = roomImages.map((img, idx) => ({
        url: img,
        caption: `${room.name} - Ảnh ${idx + 1}`
    }));

    return (
        <>
            <Modal open={open} onClose={onClose} title="Chi tiết phòng" maxWidth="max-w-5xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Gallery Grid nhỏ */}
                    <div className="grid grid-cols-2 grid-rows-2 gap-2 h-[300px] md:h-[400px]">
                        {roomImages.slice(0, 4).map((img, idx) => (
                            <div 
                                key={idx} 
                                className="col-span-1 row-span-1 rounded-lg overflow-hidden cursor-pointer group relative"
                                onClick={() => handleImageClick(idx)} // ✅ Sự kiện click
                            >
                                <img 
                                    src={img} 
                                    alt={`Room view ${idx}`} 
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                                {/* Overlay hiệu ứng hover */}
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Maximize className="text-white w-8 h-8 drop-shadow-md" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Thông tin chi tiết (Giữ nguyên) */}
                    <div className="flex flex-col justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">{room.name}</h3>
                            <p className="text-sm text-gray-600 leading-relaxed border-b pb-4 mb-4">{room.description}</p>
                            
                            <ul className="grid grid-cols-2 gap-y-2 gap-x-4 mb-4">
                                <AmenityItem icon={<Maximize size={16} />} text={`${room.size} m²`} />
                                <AmenityItem icon={<Wifi size={16} />} text="Wi-Fi miễn phí" />
                                <AmenityItem icon={<Bed size={16} />} text={room.beds} />
                                {availableAmenities.map(item => (
                                    <AmenityItem key={item.label} icon={item.icon} text={item.label} />
                                ))}
                            </ul>

                            <h4 className="font-semibold text-gray-800 mb-2">Dịch vụ và Tiện ích</h4>
                            <ul className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                                <ServiceItem text="Dọn dẹp hàng ngày" />
                                <ServiceItem text="Đồ vệ sinh cá nhân" />
                                <ServiceItem text="Máy sấy tóc" />
                                <ServiceItem text="Dép đi trong phòng" />
                            </ul>
                        </div>
                        
                        <Button size="lg" className="w-full mt-6" onClick={onClose}>
                            Đóng
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* ✅ 4. Render ImageViewerModal (Nằm ngoài Modal chính để tránh z-index issues nếu có) */}
            {isViewerOpen && (
                <ImageViewerModal
                    open={isViewerOpen}
                    onClose={() => setViewerOpen(false)}
                    images={viewerImages}
                    startIndex={selectedImageIndex}
                />
            )}
        </>
    );
};

export default RoomDetailModal;