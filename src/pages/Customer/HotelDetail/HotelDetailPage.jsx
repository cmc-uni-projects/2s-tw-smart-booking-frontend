import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import CustomerLayout from "@/layouts/CustomerLayout/CustomerLayout";
import Breadcrumb from "@/components/common/Breadcrumb/Breadcrumb";
import Spinner from "@/components/common/Loading/Spinner";
import Card from "@/components/common/Card/Card";
import Button from "@/components/common/Button/Button";
import Badge from "@/components/common/Badge/Badge";
// 1. ✅ Import thêm motion, AnimatePresence và các icon tiện nghi phòng
import { motion, AnimatePresence } from "framer-motion";
import {
    MapPin, Star, Wifi, Waves, ParkingCircle, Utensils, Users, Maximize, Bed, Images, FileText,
    CheckCircle, XCircle, Tv, Wind, Droplet, Coffee, Ban, Bath
} from "lucide-react";
import ImageViewerModal from "@/pages/Admin/Hotels/components/ImageViewerModal";
import TabsComponent from "@/components/common/Tabs/TabsComponent";

// 2. ✅ Định nghĩa các icon tiện nghi (dùng cho chi tiết phòng)
const ROOM_AMENITIES_ICONS = {
    tv: { label: "TV màn hình phẳng", icon: <Tv size={18} /> },
    ac: { label: "Điều hòa", icon: <Wind size={18} /> },
    minibar: { label: "Quầy bar mini", icon: <Droplet size={18} /> },
    tea_coffee: { label: "Trà/Cà phê", icon: <Coffee size={18} /> },
    wifi: { label: "Wi-Fi miễn phí", icon: <Wifi size={18} /> },
    bathtub: { label: "Bồn tắm", icon: <Bath size={18} /> },
    balcony: { label: "Ban công", icon: <Bed size={18} /> }, // (Dùng tạm icon)
    non_smoking: { label: "Phòng không hút thuốc", icon: <Ban size={18} /> },
};

// --- Dữ liệu Mock (CẬP NHẬT) ---
const MOCK_DETAIL = {
    id: 1,
    name: "The Ocean Resort",
    location: "Võ Nguyên Giáp, Đà Nẵng",
    rating: 9.2,
    reviewsCount: 1480,
    description:
        "Tọa lạc tại vị trí đắc địa bên bờ biển Mỹ Khê, The Ocean Resort là ốc đảo nghỉ dưỡng sang trọng với tầm nhìn tuyệt đẹp ra đại dương. Chúng tôi cung cấp các phòng nghỉ hiện đại, hồ bơi vô cực, nhà hàng ẩm thực Á-Âu và dịch vụ spa cao cấp...",
    images: [
        "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2022/12/19/1128932/312606256_1243871556.jpg",
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d",
        "https://images.unsplash.com/photo-1611892440504-4cb0296a1a19",
    ],
    amenities: [
        { name: "Wifi miễn phí", icon: <Wifi size={18}/> },
        { name: "Hồ bơi", icon: <Waves size={18}/> },
        { name: "Chỗ đỗ xe", icon: <ParkingCircle size={18}/> },
        { name: "Nhà hàng", icon: <Utensils size={18}/> },
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
            // 3. ✅ Thêm chi tiết cho phòng 101
            description: "Phòng Deluxe 35m² có ban công riêng nhìn ra biển Mỹ Khê, trang bị TV thông minh 50-inch, minibar, và bồn tắm nằm. Wi-Fi tốc độ cao miễn phí.",
            amenities: { tv: true, ac: true, wifi: true, bathtub: true, minibar: true, balcony: true }
        },
        {
            id: 102,
            name: "Phòng Suite Gia Đình",
            price: 3500000,
            guests: 4,
            size: 50,
            beds: "2 giường Queen",
            available: 3,
            // 3. ✅ Thêm chi tiết cho phòng 102
            description: "Suite gia đình rộng 50m² với 2 giường lớn, khu vực tiếp khách riêng. Lý tưởng cho gia đình 4 người. Không hút thuốc.",
            amenities: { tv: true, ac: true, wifi: true, tea_coffee: true, non_smoking: true }
        },
    ],
};
// --- Hết dữ liệu Mock ---

// 4. ✅ XÓA `BookingSidebar`

// --- CÁC COMPONENT CON CHO NỘI DUNG TAB ---

// 5. ✅ THÊM MỚI: Component chi tiết phòng (để mở rộng)
const RoomRowDetails = ({ room }) => {
    // Lọc ra các tiện nghi mà phòng này CÓ
    const availableAmenities = Object.keys(room.amenities || {})
        .filter(key => room.amenities[key] && ROOM_AMENITIES_ICONS[key])
        .map(key => ROOM_AMENITIES_ICONS[key]);

    return (
        <motion.div
            key="room-details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="col-span-10 overflow-hidden border-t border-gray-200 mt-4 pt-4"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cột 1: Mô tả */}
                <div>
                    <h5 className="font-semibold text-gray-800 mb-2">Mô tả phòng</h5>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        {room.description || "Chưa có mô tả chi tiết cho phòng này."}
                    </p>
                </div>
                {/* Cột 2: Tiện nghi */}
                <div>
                    <h5 className="font-semibold text-gray-800 mb-2">Tiện nghi trong phòng</h5>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        {availableAmenities.length > 0 ? (
                            availableAmenities.map(item => (
                                <span key={item.label} className="flex items-center gap-2 text-gray-700">
                  {item.icon} {item.label}
                </span>
                            ))
                        ) : (
                            <p className="text-gray-500">Không có tiện nghi đặc biệt.</p>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// 6. ✅ CẬP NHẬT: Component `RoomRow`
const RoomRow = ({ room }) => {
    // State để bật/tắt chi tiết
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <Card className="p-4 !shadow-md">
            {/* Thay đổi grid-cols-1 (mobile) thành grid-cols-10 (desktop) */}
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">

                {/* 1. Thông tin & Ảnh (3/10) */}
                <div className="col-span-10 lg:col-span-3">
                    <h4 className="text-base font-semibold text-[rgb(40,169,224)] mb-2 line-clamp-2">{room.name}</h4>
                    <div className="grid grid-cols-3 gap-1 mb-3">
                        <img src={MOCK_DETAIL.images[1]} alt={room.name} className="col-span-2 h-20 w-full object-cover rounded-md" />
                        <div className="col-span-1 h-20 relative">
                            <img src={MOCK_DETAIL.images[2]} alt="" className="h-full w-full object-cover rounded-md" />
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-md cursor-pointer">
                                <span className="text-white font-bold text-sm">+2</span>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                        <span className="flex items-center gap-1.5"><Bed size={14} /> {room.beds}</span>
                        <span className="flex items-center gap-1.5"><Maximize size={14} /> {room.size} m²</span>
                        <span className="flex items-center gap-1.5"><Wifi size={14} /> Wi-Fi miễn phí</span>
                    </div>

                    {/* Cập nhật nút này */}
                    <button
                        className="text-sm text-[rgb(40,169,224)] font-medium mt-1 hover:underline"
                        onClick={() => setIsExpanded(!isExpanded)} // Bật/tắt state
                    >
                        {isExpanded ? "Ẩn thông tin" : "Thông Tin Phòng"}
                    </button>
                </div>

                {/* 2. Tóm tắt (3/10) */}
                <div className="col-span-10 lg:col-span-3 border-b lg:border-b-0 lg:border-l lg:border-r border-gray-100 px-0 lg:px-4 py-4 lg:py-0">
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
                    <Users size={20} className="text-gray-600" />
                    <span className="text-sm mt-1">{room.guests}</span>
                </div>

                {/* 4. Giá (3/10) */}
                <div className="col-span-7 lg:col-span-3 flex flex-col items-end justify-between text-right h-full border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0 lg:pl-4">
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

                {/* 5. Thêm phần chi tiết (mở rộng) */}
                <AnimatePresence>
                    {isExpanded && <RoomRowDetails room={room} />}
                </AnimatePresence>

            </div>
        </Card>
    );
};


// Component `RoomListSection`
const RoomListSection = ({ rooms }) => (
    <div className="p-0">
        {/* Thanh Filter Chips */}
        <div className="flex flex-wrap gap-2 p-4 border-b border-gray-100 bg-gray-50/50">
            <FilterChip>Gói Khách Sạn (7)</FilterChip>
            <FilterChip>Xác nhận ngay (14)</FilterChip>
            <FilterChip>4+ Giường (4)</FilterChip>
            <FilterChip>Thanh toán trước (14)</FilterChip>
        </div>

        {/* Header của bảng (Chỉ hiển thị trên desktop) */}
        <div className="hidden lg:grid grid-cols-10 gap-4 px-6 py-3 border-b border-gray-200">
            <div className="col-span-3 font-semibold text-sm text-gray-600 uppercase">Chi tiết phòng</div>
            <div className="col-span-3 font-semibold text-sm text-gray-600 uppercase">Tóm tắt</div>
            <div className="col-span-1 font-semibold text-sm text-gray-600 uppercase text-center">Sức chứa</div>
            <div className="col-span-3 font-semibold text-sm text-gray-600 uppercase text-right">Giá hôm nay</div>
        </div>

        {/* Danh sách các phòng (các RoomRow) */}
        <div className="space-y-4 p-4 lg:p-6 bg-gray-50">
            {rooms.map((room) => (
                <RoomRow key={room.id} room={room} />
            ))}
        </div>
    </div>
);

// Component cho tab "Tiện nghi" (GỘP cả Mô tả)
const AmenitiesSection = ({ amenities, description }) => (
    <div className="p-6">
        {/* Phần Mô tả */}
        <h3 className="text-xl font-bold text-gray-800 mb-3">Mô tả</h3>
        <p className="text-gray-600 leading-relaxed mb-6 pb-6 border-b">
            {description}
        </p>

        {/* Phần Tiện nghi */}
        <h3 className="text-xl font-bold text-gray-800 mb-4">Tiện ích</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {amenities.map(item => (
                <div key={item.name} className="flex items-center gap-2 text-gray-700">
                    {item.icon}
                    <span>{item.name}</span>
                </div>
            ))}
        </div>
    </div>
);

// Component cho tab "Đánh giá"
const ReviewsSection = () => (
    <div className="p-6 text-center">
        <Star size={40} className="mx-auto text-gray-300" />
        <p className="mt-2 text-gray-500">Phần đánh giá của khách đang được xây dựng.</p>
    </div>
);

// Component cho tab "Chính sách"
const PoliciesSection = () => (
    <div className="p-6 text-center">
        <FileText size={40} className="mx-auto text-gray-300" />
        <p className="mt-2 text-gray-500">Phần chính sách khách sạn đang được xây dựng.</p>
    </div>
);

// Component cho các chip filter
const FilterChip = ({ children }) => (
    <Button
        variant="outline"
        size="sm"
        className="bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700 font-medium !rounded-lg"
    >
        {children}
    </Button>
);


// --- Component chính của trang ---
export default function HotelDetailPage() {
    const { hotelId } = useParams();
    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isViewerOpen, setViewerOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    // State cho tab
    const [activeTab, setActiveTab] = useState("rooms");

    // TABS (Bao gồm "Tiện nghi")
    const TABS = [
        { id: "rooms", name: "Phòng" },
        { id: "reviews", name: "Đánh Giá Của Khách" },
        { id: "amenities", name: "Tiện nghi" },
        { id: "policies", name: "Chính Sách" },
    ];

    // (Logic fetch data, modal, loading)
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
        // ... (code không tìm thấy)
    }
    const imagesForModal = hotel.images.map((imgUrl, index) => ({
        url: imgUrl,
        caption: `${hotel.name} - Ảnh ${index + 1}`
    }));
    const breadcrumbItems = [
        { label: "Tìm kiếm", href: "/hotels" },
        { label: hotel.name },
    ];
    // --- KẾT THÚC LOGIC ---

    return (
        <CustomerLayout>
            <main className="max-w-7xl mx-auto px-6 py-8">

                {/* (Breadcrumb, Tiêu đề, Bộ sưu tập ảnh giữ nguyên) */}
                <Breadcrumb items={breadcrumbItems} />
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
                                <img src={img.url} alt={`Hotel view ${index + 1}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
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


                {/* ✅ KHỐI NỘI DUNG CHÍNH (Đã xóa layout 2 cột) */}
                <div className="mt-8">
                    <div className="space-y-8">

                        {/* Card Mô tả (Giữ nguyên) */}
                        <Card>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Mô tả</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {hotel.description}
                            </p>
                        </Card>

                        {/* Card Tiện ích (Giữ nguyên) */}
                        <Card>
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Tiện ích</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {hotel.amenities.map(item => (
                                    <div key={item.name} className="flex items-center gap-2 text-gray-700">
                                        {item.icon}
                                        <span>{item.name}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Card chứa Tabs (Giữ nguyên) */}
                        <Card className="p-0 overflow-hidden">
                            {/* Thanh Tabs */}
                            <div className="px-6 border-b border-gray-200">
                                <TabsComponent
                                    tabs={TABS}
                                    activeTab={activeTab}
                                    onTabChange={setActiveTab}
                                />
                            </div>

                            {/* Nội dung Tab */}
                            <div className="animate-fadeIn">
                                {activeTab === 'rooms' && <RoomListSection rooms={hotel.rooms} />}
                                {activeTab === 'reviews' && <ReviewsSection />}
                                {activeTab === 'amenities' && <AmenitiesSection amenities={hotel.amenities} description={hotel.description} />}
                                {activeTab === 'policies' && <PoliciesSection />}
                            </div>
                        </Card>
                    </div>

                    {/* ✅ ĐÃ XÓA SIDEBAR */}
                </div>

                {/* (Modal xem ảnh - Giữ nguyên) */}
                <ImageViewerModal
                    open={isViewerOpen}
                    onClose={closeImageViewer}
                    images={imagesForModal}
                    startIndex={selectedImageIndex}
                />

            </main>
        </CustomerLayout>
    );
}