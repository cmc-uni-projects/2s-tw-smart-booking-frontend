// src/pages/Customer/HotelDetail/HotelDetailPage.jsx

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import CustomerLayout from "@/layouts/CustomerLayout/CustomerLayout";
import Breadcrumb from "@/components/common/Breadcrumb/Breadcrumb";
import Spinner from "@/components/common/Loading/Spinner";
import Card from "@/components/common/Card/Card";
import Button from "@/components/common/Button/Button";
import Badge from "@/components/common/Badge/Badge";
// ✅ 1. Import TabsComponent
import TabsComponent from "@/components/common/Tabs/TabsComponent"; 
import {
    MapPin, Star, Wifi, Waves, ParkingCircle, Utensils, Users, Maximize, Bed, Images, FileText,
    CheckCircle, XCircle, Tv, Wind, Droplet, Coffee, Ban, Bath,
    User
} from "lucide-react";
import ImageViewerModal from "@/pages/Admin/Hotels/components/ImageViewerModal";
import Modal from "@/components/common/Modal/Modal";

// --- Dữ liệu Mock (CẬP NHẬT) ---
const mockImages = [
    "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2022/12/19/1128932/312606256_1243871556.jpg", // 0
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb", // 1
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b", // 2
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d", // 3
    "https://images.unsplash.com/photo-1611892440504-4cb0296a1a19", // 4
    "https://images.unsplash.com/photo-1590490359854-dfc809fd2686", // 5
];

const MOCK_DETAIL = {
    id: 1,
    name: "The Ocean Resort",
    location: "Võ Nguyên Giáp, Đà Nẵng",
    rating: 9.2,
    reviewsCount: 1480,
    description:
        "Tọa lạc tại vị trí đắc địa bên bờ biển Mỹ Khê, The Ocean Resort là ốc đảo nghỉ dưỡng sang trọng với tầm nhìn tuyệt đẹp ra đại dương. Chúng tôi cung cấp các phòng nghỉ hiện đại, hồ bơi vô cực, nhà hàng ẩm thực Á-Âu và dịch vụ spa cao cấp...",
    images: mockImages,
    amenities: [
        { name: "Wifi miễn phí", icon: <Wifi size={18}/> },
        { name: "Hồ bơi", icon: <Waves size={18}/> },
        { name: "Chỗ đỗ xe", icon: <ParkingCircle size={18}/> },
        { name: "Nhà hàng", icon: <Utensils size={18}/> },
        { name: "Spa", icon: <Droplet size={18}/> },
        { name: "Phòng gym", icon: <Users size={18}/> },
    ],
    rooms: [
        {
            id: 101,
            name: "Phòng Deluxe Hướng Biển",
            price: 2200000,
            guests: 2,
            size: 35,
            beds: "1 giường King",
            available: 5,
            description: "Phòng Deluxe 35m² có ban công riêng nhìn ra biển Mỹ Khê, trang bị TV thông minh 50-inch, minibar, và bồn tắm nằm. Wi-Fi tốc độ cao miễn phí.",
            amenities: { tv: true, ac: true, wifi: true, bathtub: true, minibar: true, balcony: true },
            images: [ mockImages[2], mockImages[4], mockImages[1], mockImages[3] ]
        },
        {
            id: 102,
            name: "Phòng Suite Gia Đình",
            price: 3500000,
            guests: 4,
            size: 50,
            beds: "2 giường Queen",
            available: 3,
            description: "Suite gia đình rộng 50m² với 2 giường lớn, khu vực tiếp khách riêng. Lý tưởng cho gia đình 4 người. Không hút thuốc.",
            amenities: { tv: true, ac: true, wifi: true, tea_coffee: true, non_smoking: true },
            images: [ mockImages[1], mockImages[5], mockImages[0], mockImages[2] ]
        },
    ],
};
// --- Hết dữ liệu Mock ---

// --- CÁC COMPONENT CON NỘI BỘ ---

// Định nghĩa các icon tiện nghi (dùng cho chi tiết phòng)
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
        {icon}
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
    if (!room) return null;

    const availableAmenities = Object.keys(room.amenities || {})
        .filter(key => room.amenities[key] && ROOM_AMENITIES_ICONS[key])
        .map(key => ROOM_AMENITIES_ICONS[key]);

    const roomImages = room.images || MOCK_DETAIL.images.slice(0, 4);

    return (
        <Modal open={open} onClose={onClose} title="Chi tiết phòng" maxWidth="max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cột 1: Ảnh */}
                <div className="grid grid-cols-2 grid-rows-2 gap-2 h-[400px]">
                    <div className="col-span-1 row-span-1 rounded-lg overflow-hidden"><img src={roomImages[0]} alt="view 1" className="w-full h-full object-cover"/></div>
                    <div className="col-span-1 row-span-1 rounded-lg overflow-hidden"><img src={roomImages[1]} alt="view 2" className="w-full h-full object-cover"/></div>
                    <div className="col-span-1 row-span-1 rounded-lg overflow-hidden"><img src={roomImages[2]} alt="view 3" className="w-full h-full object-cover"/></div>
                    <div className="col-span-1 row-span-1 rounded-lg overflow-hidden"><img src={roomImages[3]} alt="view 4" className="w-full h-full object-cover"/></div>
                </div>
                {/* Cột 2: Chi tiết */}
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
                            <ServiceItem text="Máy giặt" />
                            <ServiceItem text="Bàn ủi quần áo" />
                            <ServiceItem text="Máy ủi quần áo" />
                            <ServiceItem text="Dụng cụ vệ sinh" />
                            <ServiceItem text="Máy sấy quần áo" />
                            <ServiceItem text="Bàn là và cầu là" />
                            <ServiceItem text="Đồ vệ sinh cá nhân" />
                        </ul>
                    </div>
                    <Button size="lg" className="w-full mt-6" onClick={onClose}>
                        Chọn phòng này
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

const RoomRow = ({ room, onInfoClick }) => {
    return (
        <Card className="p-4 !shadow-md">
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
                {/* 1. Thông tin & Ảnh (4/10) */}
                <div className="col-span-10 lg:col-span-4">
                    <h4
                        className="text-base font-semibold text-[rgb(40,169,224)] mb-2 line-clamp-2 cursor-pointer hover:underline"
                        onClick={() => onInfoClick(room)}
                    >
                        {room.name}
                    </h4>
                    <button
                        type="button"
                        className="relative w-full aspect-video rounded-lg overflow-hidden mb-3 group/image"
                        onClick={() => onInfoClick(room)}
                    >
                        <img
                            src={room.images[0]}
                            alt={room.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover/image:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/image:opacity-100 transition-opacity"></div>
                        {room.images.length > 1 && (
                            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs font-semibold px-2 py-1 rounded-md backdrop-blur-sm">
                                + {room.images.length - 1} ảnh
                            </div>
                        )}
                    </button>
                    <div className="space-y-1 text-sm text-gray-600">
                        <span className="flex items-center gap-1.5"><Bed size={14} /> {room.beds}</span>
                        <span className="flex items-center gap-1.5"><Maximize size={14} /> {room.size} m²</span>
                        <span className="flex items-center gap-1.5"><Wifi size={14} /> Wi-Fi miễn phí</span>
                    </div>
                    <button
                        className="text-sm text-[rgb(40,169,224)] font-medium mt-1 hover:underline"
                        onClick={() => onInfoClick(room)}
                    >
                        Thông Tin Phòng
                    </button>
                </div>

                {/* 2. Tóm tắt (2/10) */}
                <div className="col-span-10 lg:col-span-2 border-b lg:border-b-0 lg:border-l lg:border-r border-gray-200 px-0 lg:px-4 py-4 lg:py-0 flex flex-col items-center justify-center">
                    <h5 className="font-semibold text-gray-800 mb-2 lg:hidden">Tóm Tắt</h5>
                    <div className="space-y-1.5 text-sm">
                        <Badge color="success" icon={false}>Giá tốt nhất hôm nay!</Badge>
                        <span className="flex items-center gap-2 text-red-600"><XCircle size={15} /> Không Hoàn Tiền</span>
                        <span className="flex items-center gap-2 text-green-600"><CheckCircle size={15} /> Xác nhận ngay</span>
                        <span className="flex items-center gap-2 text-gray-700"><CheckCircle size={15} /> Thanh toán trước</span>
                        <span className="flex items-center gap-2 text-gray-700"><CheckCircle size={15} /> Dịch vụ vệ sinh</span>
                    </div>
                </div>

                {/* 3. Sức chứa (1/10) */}
                <div className="col-span-3 lg:col-span-1 flex flex-col items-center justify-center text-center">
                    <h5 className="font-semibold text-gray-800 mb-2 lg:hidden">Sức Chứa</h5>
                    <div className="flex items-center justify-center gap-1 text-black">
                        <User size={20} />
                        <span className="text-xl font-medium text-gray-800">x{room.guests}</span>
                    </div>
                </div>

                {/* 4. Giá (3/10) */}
                <div className="col-span-7 lg:col-span-3 flex flex-col items-end justify-between text-right h-full border-t lg:border-t-0 lg:border-l border-gray-200 pt-4 lg:pt-0 lg:pl-4">
                    <div>
                        <h5 className="font-semibold text-gray-800 mb-2 lg:hidden">Giá Hôm Nay</h5>
                        <div>
                            <Badge color="danger">Giảm 80%</Badge>
                            <span className="text-gray-500 line-through text-sm ml-1.5">
                                {(room.price * 1.8).toLocaleString('vi-VN')}₫
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-red-600 mt-1">
                            {room.price.toLocaleString('vi-VN')}₫
                        </p>
                        <span className="text-xs text-gray-500">đã gồm thuế & phí / đêm</span>
                    </div>
                    <Button size="md" className="w-full mt-2">Đặt</Button>
                </div>
            </div>
        </Card>
    );
};

const FilterChip = ({ children }) => (
    <Button
        variant="outline"
        size="sm"
        className="bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700 font-medium !rounded-lg"
    >
        {children}
    </Button>
);

const RoomListSection = ({ rooms, onRoomInfoClick }) => (
    <div className="p-0">
        <div className="flex flex-wrap gap-2 p-4 border-b border-gray-100 bg-gray-50/50">
            <FilterChip>Gói Khách Sạn (7)</FilterChip>
            <FilterChip>Xác nhận ngay (14)</FilterChip>
            <FilterChip>4+ Giường (4)</FilterChip>
            <FilterChip>Thanh toán trước (14)</FilterChip>
        </div>
        <div className="hidden lg:grid grid-cols-10 gap-4 px-6 py-3 border-b border-gray-200">
            <div className="col-span-4 font-semibold text-sm text-gray-600 uppercase">Chi tiết phòng</div>
            <div className="col-span-2 font-semibold text-sm text-gray-600 uppercase text-center">Tóm tắt</div>
            <div className="col-span-1 font-semibold text-sm text-gray-600 uppercase text-center">Sức chứa</div>
            <div className="col-span-3 font-semibold text-sm text-gray-600 uppercase text-right">Giá hôm nay</div>
        </div>
        <div className="space-y-4 p-4 lg:p-6 bg-gray-50">
            {rooms.map((room) => (
                <RoomRow key={room.id} room={room} onInfoClick={onRoomInfoClick} />
            ))}
        </div>
    </div>
);

const AmenitiesSection = ({ amenities, description }) => {
    const featuredAmenities = amenities.slice(0, 4);
    return (
        <div className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Mô tả</h3>
            <p className="text-gray-600 leading-relaxed mb-6 pb-6 border-b">
                {description}
            </p>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Tiện ích</h3>
                <Button variant="ghost" size="sm" className="text-[rgb(40,169,224)]">
                    Tất Cả Tiện Nghi
                </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {featuredAmenities.map(item => (
                    <div key={item.name} className="flex items-center gap-2 text-gray-700 p-2 rounded-lg hover:bg-gray-50">
                        {item.icon}
                        <span>{item.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ReviewsSection = () => (
    <div className="p-6 text-center">
        <Star size={40} className="mx-auto text-gray-300" />
        <p className="mt-2 text-gray-500">Phần đánh giá của khách đang được xây dựng.</p>
    </div>
);

const PoliciesSection = () => (
    <div className="p-6 text-center">
        <FileText size={40} className="mx-auto text-gray-300" />
        <p className="mt-2 text-gray-500">Phần chính sách khách sạn đang được xây dựng.</p>
    </div>
);

// --- Component chính của trang ---
export default function HotelDetailPage() {
    const { hotelId } = useParams();
    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isViewerOpen, setViewerOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [activeTab, setActiveTab] = useState("rooms");
    const [selectedRoomDetail, setSelectedRoomDetail] = useState(null);

    // Mảng TABS
    const TABS = [
        { id: "rooms", name: "Phòng" },
        { id: "reviews", name: "Đánh Giá Của Khách" },
        { id: "amenities", name: "Tiện nghi" },
        { id: "policies", name: "Chính Sách" },
    ];

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setHotel(MOCK_DETAIL);
            setLoading(false);
        }, 1000);
    }, [hotelId]);

    const openImageViewer = (index) => {
        setSelectedImageIndex(index);
        setViewerOpen(true);
    };
    const closeImageViewer = () => {
        setViewerOpen(false);
    };
    const handleOpenRoomDetail = (room) => {
        setSelectedRoomDetail(room);
    };
    const handleCloseRoomDetail = () => {
        setSelectedRoomDetail(null);
    };

    if (loading) {
        return (
            <CustomerLayout>
                <div className="flex justify-center items-center h-[60vh]">
                    <Spinner />
                </div>
            </CustomerLayout>
        );
    }
    if (!hotel) {
        return (
            <CustomerLayout>
                <div className="text-center py-20">Không tìm thấy khách sạn.</div>
            </CustomerLayout>
        );
    }
    
    const imagesForModal = hotel.images.map((imgUrl, index) => ({
        url: imgUrl,
        caption: `${hotel.name} - Ảnh ${index + 1}`
    }));
    const breadcrumbItems = [
        { label: "Tìm kiếm", href: "/hotels" },
        { label: hotel.name },
    ];

    return (
        <CustomerLayout>
            <main className="max-w-7xl mx-auto px-6 py-8">

                {/* Breadcrumb */}
                <Breadcrumb items={breadcrumbItems} />

                {/* Tiêu đề */}
                <div className="mt-4">
                    <h1 className="text-3xl font-bold text-gray-900">{hotel.name}</h1>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-gray-600">
                        <Badge color="primary" icon={<Star size={14} className="fill-current" />}>
                            {hotel.rating} ({hotel.reviewsCount} đánh giá)
                        </Badge>
                        <div className="flex items-center gap-1.5 text-sm">
                            <MapPin size={16} />
                            <span>{hotel.location}</span>
                        </div>
                    </div>
                </div>

                {/* Bộ sưu tập ảnh */}
                <div className="relative mt-6 group">
                    <div className="grid grid-cols-4 grid-rows-2 gap-2 h-96 rounded-2xl overflow-hidden">
                        <button
                            type="button"
                            className="col-span-2 row-span-2 relative block overflow-hidden"
                            onClick={() => openImageViewer(0)}
                        >
                            <img src={imagesForModal[0].url} alt="Main hotel" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </button>

                        {imagesForModal.slice(1, 5).map((img, index) => (
                            <button
                                type="button"
                                key={index}
                                className="col-span-1 row-span-1 relative block overflow-hidden"
                                onClick={() => openImageViewer(index + 1)}
                            >
                                <img src={img.url} alt={`Hotel view ${index + 1}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </button>
                        ))}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="absolute bottom-4 right-4 z-10 bg-white/90 border-gray-200 text-gray-800 hover:bg-white"
                        leftIcon={<Images size={16} />}
                        onClick={() => openImageViewer(0)}
                    >
                        Xem tất cả {imagesForModal.length} ảnh
                    </Button>
                </div>


                {/* Khối nội dung chính */}
                <div className="mt-8 space-y-8">

                    <Card>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">Mô tả</h3>
                        <p className="text-gray-600 leading-relaxed">
                            {hotel.description}
                        </p>
                    </Card>

                    <Card>
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Tiện ích</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {hotel.amenities.map(item => (
                                <div key={item.name} className="flex items-center gap-2 text-gray-700">
                                    {item.icon}
                                    <span>{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* ✅ KHU VỰC TAB ĐÃ ĐƯỢC THAY THẾ */}
                    <div>
                        {/* 1. Thanh Tab (Sticky) */}
                        <div className="sticky top-16 z-30 bg-white shadow-sm border-b border-gray-100">
                            {/* Thêm padding ngang (px-6) vào wrapper
                                vì TabsComponent không tự chứa padding ngang
                            */}
                            <div className="px-6">
                                <TabsComponent 
                                    tabs={TABS} 
                                    activeTab={activeTab} 
                                    onTabChange={setActiveTab} 
                                />
                            </div>
                        </div>

                        {/* 2. Card Nội dung (Bỏ mt-6) */}
                        <Card className="p-0 overflow-hidden !rounded-t-none">
                            <div className="animate-fadeIn">
                                {activeTab === 'rooms' && <RoomListSection rooms={hotel.rooms} onRoomInfoClick={handleOpenRoomDetail} />}
                                {activeTab === 'reviews' && <ReviewsSection />}
                                {activeTab === 'amenities' && <AmenitiesSection amenities={hotel.amenities} description={hotel.description} />}
                                {activeTab === 'policies' && <PoliciesSection />}
                            </div>
                        </Card>
                    </div>
                    {/* Hết phần Tab */}

                </div>

                {/* Modal xem ảnh */}
                <ImageViewerModal
                    open={isViewerOpen}
                    onClose={closeImageViewer}
                    images={imagesForModal}
                    startIndex={selectedImageIndex}
                />

                {/* Render Modal Chi Tiết Phòng */}
                <RoomDetailModal
                    room={selectedRoomDetail}
                    open={!!selectedRoomDetail}
                    onClose={handleCloseRoomDetail}
                />

            </main>
        </CustomerLayout>
    );
}