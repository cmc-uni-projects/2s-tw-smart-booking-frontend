import React, { useState, useEffect } from "react";
import Modal from "@/components/common/Modal/Modal";
import Button from "@/components/common/Button/Button";
import { 
    Tv, Wind, Droplet, Coffee, Wifi, Bath, Bed, Ban, 
    CheckCircle, Loader2, Users, Star, ChevronRight 
} from "lucide-react";
import ImageViewerModal from "@/pages/Admin/Hotels/components/ImageViewerModal";
import roomService from "@/services/room.service";

// --- HELPER & CONFIG ---
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8386/api/v1").replace("/api/v1", "");
const getFullImageUrl = (url) => {
  if (!url) return "https://via.placeholder.com/800x600?text=No+Image";
  if (url.startsWith("http")) return url;
  let path = url.startsWith("/") ? url : `/${url}`;
  if (!path.startsWith("/uploads")) path = `/uploads${path}`;
  return `${API_BASE_URL}${path}`;
};

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
    <li className="flex items-center gap-3 text-sm text-gray-700 py-1">
        <span className="text-gray-500 bg-gray-50 p-1.5 rounded-md">{icon}</span>
        <span className="font-medium">{text}</span>
    </li>
);

const ServiceItem = ({ text }) => (
    <li className="flex items-center gap-2 text-sm text-gray-600">
        <CheckCircle size={14} className="text-green-500 shrink-0" />
        <span>{text}</span>
    </li>
);

const RoomDetailModal = ({ room: initialRoom, open, onClose }) => {
    const [isViewerOpen, setViewerOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    
    const [roomDetail, setRoomDetail] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch Data
    useEffect(() => {
        if (open && initialRoom?.id) {
            const fetchRoomDetail = async () => {
                setLoading(true);
                try {
                    // Gọi API lấy chi tiết phòng
                    const data = await roomService.getRoomDetail(initialRoom.id);
                    setRoomDetail(data);
                } catch (error) {
                    console.error("Failed to fetch room detail:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchRoomDetail();
        } else {
            setRoomDetail(null);
        }
    }, [open, initialRoom]);

    if (!open) return null;

    // Loading State
    if (loading) {
        return (
            <Modal open={open} onClose={onClose} title="Đang tải thông tin..." maxWidth="max-w-5xl">
                <div className="flex flex-col justify-center items-center h-80">
                    <Loader2 className="animate-spin text-[rgb(40,169,224)] mb-3" size={40} />
                    <p className="text-gray-400 text-sm">Vui lòng đợi trong giây lát...</p>
                </div>
            </Modal>
        );
    }

    if (!roomDetail) return null;

    // Data Processing
    const availableAmenities = (roomDetail.amenities || [])
        .map(key => {
            const normalizedKey = key.toLowerCase();
            return ROOM_AMENITIES_ICONS[normalizedKey] || { label: key, icon: <CheckCircle size={16} /> };
        });

    const roomImages = (roomDetail.images || []).map(getFullImageUrl);
    const displayImages = roomImages.slice(0, 4); // Chỉ lấy 4 ảnh để hiển thị lưới
    const remainingCount = roomImages.length - 4;

    const handleImageClick = (index) => {
        setSelectedImageIndex(index);
        setViewerOpen(true);
    };

    const viewerImages = roomImages.map((img, idx) => ({
        url: img,
        caption: `${roomDetail.roomName} - Ảnh ${idx + 1}`
    }));

    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    return (
        <>
            <Modal open={open} onClose={onClose} title="Chi tiết phòng nghỉ" maxWidth="max-w-5xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-4">
                    
                    {/* --- CỘT TRÁI (7/12): HÌNH ẢNH --- */}
                    <div className="lg:col-span-7 space-y-3">
                        {/* Main Image */}
                        {roomImages.length > 0 ? (
                            <div 
                                className="relative w-full aspect-video rounded-xl overflow-hidden cursor-pointer group shadow-sm border border-gray-100"
                                onClick={() => handleImageClick(0)}
                            >
                                <img 
                                    src={roomImages[0]} 
                                    alt="Main Room" 
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                                />
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="bg-white/90 text-gray-800 px-4 py-2 rounded-full text-sm font-bold shadow-lg">Xem ảnh</span>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full aspect-video bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 italic">
                                Không có hình ảnh
                            </div>
                        )}

                        {/* Thumbnails Grid (3 ảnh dưới) */}
                        {roomImages.length > 1 && (
                            <div className="grid grid-cols-3 gap-3">
                                {roomImages.slice(1, 4).map((img, idx) => (
                                    <div 
                                        key={idx} 
                                        className="relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer group border border-gray-100"
                                        onClick={() => handleImageClick(idx + 1)}
                                    >
                                        <img 
                                            src={img} 
                                            alt={`Thumb ${idx}`} 
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                                        />
                                        
                                        {/* Overlay cho ảnh cuối cùng nếu còn nhiều ảnh */}
                                        {idx === 2 && remainingCount > 0 && (
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-lg backdrop-blur-[1px] group-hover:bg-black/70 transition-colors">
                                                +{remainingCount}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* --- CỘT PHẢI (5/12): THÔNG TIN & GIÁ --- */}
                    <div className="lg:col-span-5 flex flex-col h-full">
                        <div className="flex-1">
                            {/* Header */}
                            <div>
                                <div className="flex items-start justify-between gap-2">
                                    <h2 className="text-2xl font-bold text-gray-900 leading-snug mb-2">
                                        {roomDetail.roomName}
                                    </h2>
                                </div>
                                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100 italic leading-relaxed mb-6">
                                    {roomDetail.description || "Mô tả đang cập nhật..."}
                                </p>
                            </div>

                            {/* Thông số chính */}
                            <div className="mb-6">
                                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">
                                    Tổng quan
                                </h4>
                                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 flex items-center gap-4">
                                    <div className="bg-white p-3 rounded-full shadow-sm shrink-0">
                                        <Users size={24} className="text-orange-500" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-semibold text-orange-600 uppercase tracking-wide">
                                            Sức chứa tiêu chuẩn
                                        </span>
                                        <span className="text-lg font-bold text-gray-900">
                                            {roomDetail.capacity} người lớn
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Tiện nghi */}
                            <div className="mb-6">
                                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">
                                    Tiện nghi phòng
                                </h4>
                                <ul className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                                    {availableAmenities.map((item, idx) => (
                                        <AmenityItem key={idx} icon={item.icon} text={item.label} />
                                    ))}
                                    {availableAmenities.length === 0 && <li className="text-gray-400 text-sm italic">Đang cập nhật...</li>}
                                </ul>
                            </div>

                            {/* Dịch vụ */}
                            <div>
                                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">
                                    Dịch vụ miễn phí
                                </h4>
                                <ul className="grid grid-cols-2 gap-2">
                                    <ServiceItem text="Dọn phòng hàng ngày" />
                                    <ServiceItem text="Nước suối, trà, cafe" />
                                    <ServiceItem text="Đồ vệ sinh cá nhân" />
                                    <ServiceItem text="Wifi tốc độ cao" />
                                </ul>
                            </div>
                        </div>

                        {/* Footer: Giá & Nút (Sticky Bottom trên Mobile nếu cần, ở đây để thường) */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <div className="flex items-end justify-between mb-4">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Giá mỗi đêm từ</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-400 line-through decoration-red-400">
                                            {formatPrice(roomDetail.pricePerNight * 1.2)}
                                        </span>
                                        <span className="bg-red-100 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded">-20%</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-3xl font-extrabold text-[rgb(40,169,224)]">
                                        {formatPrice(roomDetail.pricePerNight)}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="flex gap-3">
                                <Button 
                                    variant="ghost" 
                                    className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-100"
                                    onClick={onClose}
                                >
                                    Đóng
                                </Button>
                                {/* Nút này có thể dẫn đến trang booking hoặc scroll tới form đặt phòng */}
                                <Button 
                                    className="flex-[2] py-3 text-base shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all"
                                    onClick={onClose} // Hoặc logic đặt phòng
                                >
                                    Chọn phòng này
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>

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