// 1. Import thêm useState và icon ZoomIn
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import CustomerLayout from "@/layouts/CustomerLayout/CustomerLayout";
import Breadcrumb from "@/components/common/Breadcrumb/Breadcrumb";
import Spinner from "@/components/common/Loading/Spinner";
import Card from "@/components/common/Card/Card";
import Button from "@/components/common/Button/Button";
import Badge from "@/components/common/Badge/Badge";
import DateSelector from "@/components/search/DateSelector";
import GuestSelector from "@/components/search/GuestSelector";
// 2. Import icon ZoomIn
import { MapPin, Star, Wifi, Waves, ParkingCircle, Utensils, Users, Maximize, Bed, ZoomIn } from "lucide-react";

// 3. Import Modal xem ảnh ta vừa tạo
import ImageViewerModal from "@/components/common/Modal/ImageViewerModal";

// --- Dữ liệu Mock (Giữ nguyên) ---
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
        },
        {
            id: 102,
            name: "Phòng Suite Gia Đình",
            price: 3500000,
            guests: 4,
            size: 50,
            beds: "2 giường Queen",
            available: 3,
        },
    ],
};
// --- Hết dữ liệu Mock ---

// Component Sidebar Đặt phòng (Giữ nguyên)
const BookingSidebar = ({ hotel }) => {
    const [selectedRoom, setSelectedRoom] = useState(hotel.rooms[0]);
    const formatPrice = (price) => price.toLocaleString('vi-VN') + '₫';

    return (
        <Card className="sticky top-24 p-5 shadow-lg border">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Đặt phòng ngay</h3>
            <p className="text-xl font-bold text-[rgb(40,169,224)]">
                {formatPrice(selectedRoom.price)}
                <span className="text-sm font-normal text-gray-500"> /đêm</span>
            </p>

            <div className="space-y-4 my-4">
                <DateSelector />
                <GuestSelector />
                <div>
                    <label className="text-sm font-semibold text-gray-600 mb-1">Loại phòng</label>
                    <select
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        onChange={(e) => setSelectedRoom(hotel.rooms.find(r => r.id == e.target.value))}
                    >
                        {hotel.rooms.map(r => (
                            <option key={r.id} value={r.id}>{r.name} ({r.available} trống)</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="space-y-2 text-sm border-t pt-4">
                <div className="flex justify-between">
                    <span className="text-gray-600">{formatPrice(selectedRoom.price)} x 1 đêm</span>
                    <span className="text-gray-800">{formatPrice(selectedRoom.price)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Thuế và phí (10%)</span>
                    <span className="text-gray-800">{formatPrice(selectedRoom.price * 0.1)}</span>
                </div>
                <div className="flex justify-between font-bold text-base border-t pt-2 mt-2">
                    <span className="text-gray-800">Tổng cộng</span>
                    <span className="text-red-600">{formatPrice(selectedRoom.price * 1.1)}</span>
                </div>
            </div>

            <Button fullWidth size="lg" className="mt-4">
                Đặt ngay
            </Button>
        </Card>
    );
};

// Component chính của trang
export default function HotelDetailPage() {
    const { hotelId } = useParams();
    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);

    // 4. ✅ Thêm state cho modal xem ảnh
    const [isViewerOpen, setViewerOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setHotel(MOCK_DETAIL);
            setLoading(false);
        }, 1000);
    }, [hotelId]);

    // 5. ✅ Hàm mở modal
    const openImageViewer = (index) => {
        setSelectedImageIndex(index);
        setViewerOpen(true);
    };

    // 6. ✅ Chuẩn bị dữ liệu cho modal (vì modal cần object {url, caption})
    // Mock data 'images' chỉ là mảng string, ta cần chuyển đổi nó
    const imagesForViewer = hotel
      ? hotel.images.map((imgUrl, index) => ({
          url: imgUrl,
          caption: `Ảnh ${index + 1} của ${hotel.name}`,
        }))
      : [];


    if (loading) {
        return (
            <CustomerLayout>
                <div className="flex justify-center items-center h-[60vh]">
                    <Spinner />
                </div>
            </CustomerLayout>
        );
    }
    // ... (Giữ nguyên phần loading và !hotel) ...
    if (!hotel) {
        return (
            <CustomerLayout>
                <div className="text-center py-20">
                    <h2 className="text-xl font-semibold text-red-500">Không tìm thấy khách sạn</h2>
                    <Link to="/hotels">
                        <Button variant="outline" className="mt-4">Quay lại tìm kiếm</Button>
                    </Link>
                </div>
            </CustomerLayout>
        );
    }

    const breadcrumbItems = [
        { label: "Tìm kiếm", href: "/hotels" },
        { label: hotel.name },
    ];

    return (
        <CustomerLayout>
            <main className="max-w-7xl mx-auto px-6 py-8">

                {/* 1. Breadcrumb (Giữ nguyên) */}
                <Breadcrumb items={breadcrumbItems} />

                {/* 2. Tiêu đề (Giữ nguyên) */}
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

                {/* 3. ✅ Bộ sưu tập ảnh (ĐÃ CẬP NHẬT) */}
                <div className="relative mt-6 grid grid-cols-4 grid-rows-2 gap-2 h-96 rounded-2xl overflow-hidden group">
                    {/* Ảnh chính */}
                    <button
                        onClick={() => openImageViewer(0)}
                        className="col-span-2 row-span-2 relative cursor-pointer"
                    >
                        <img src={hotel.images[0]} alt="Main hotel" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <ZoomIn size={48} className="text-white drop-shadow-lg" />
                        </div>
                    </button>

                    {/* 4 ảnh nhỏ */}
                    {hotel.images.slice(1, 5).map((img, index) => (
                        <button
                            key={index}
                            onClick={() => openImageViewer(index + 1)} // index + 1 vì ảnh 0 là ảnh chính
                            className="col-span-1 row-span-1 relative cursor-pointer"
                        >
                            <img src={img} alt={`Hotel view ${index + 1}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <ZoomIn size={24} className="text-white" />
                            </div>
                        </button>
                    ))}

                    {/* Nút "Xem tất cả" */}
                    <Button
                        onClick={() => openImageViewer(0)}
                        className="absolute bottom-4 right-4 bg-white/90 text-gray-800 hover:bg-white"
                        size="sm"
                        leftIcon={<ZoomIn size={16} />}
                    >
                        Xem tất cả ảnh
                    </Button>
                </div>


                {/* 4. Layout 2 cột (Giữ nguyên) */}
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Cột trái (Nội dung - Giữ nguyên) */}
                    <div className="lg:col-span-2 space-y-8">
                        <Card>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Mô tả</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {hotel.description}
                            </p>
                        </Card>
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
                        <Card>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-800">Các loại phòng</h3>
                                <Badge color="success">
                                    Tổng số phòng trống: {hotel.rooms.reduce((acc, room) => acc + (room.available || 0), 0)}
                                </Badge>
                            </div>
                            <div className="space-y-4">
                                {hotel.rooms.map((room) => (
                                    <div key={room.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                                        <div>
                                            <h4 className="text-lg font-semibold text-[rgb(40,169,224)]">{room.name}</h4>
                                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mt-2">
                                                <span className="flex items-center gap-1"><Users size={14} /> Tối đa {room.guests} người</span>
                                                <span className="flex items-center gap-1"><Maximize size={14} /> {room.size} m²</span>
                                                <span className="flex items-center gap-1"><Bed size={14} /> {room.beds}</span>
                                            </div>
                                        </div>
                                        <div className="text-right flex flex-col items-end gap-1">
                                            <Badge color={room.available > 5 ? "success" : (room.available > 0 ? "warning" : "danger")} icon={false}>
                                                {room.available > 0 ? `${room.available} phòng trống` : "Hết phòng"}
                                            </Badge>
                                            <div className="mt-1">
                                                <span className="text-lg font-bold text-gray-800">{room.price.toLocaleString('vi-VN')}₫</span>
                                                <span className="text-sm text-gray-500">/đêm</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Cột phải (Sidebar đặt phòng - Giữ nguyên) */}
                    <div className="lg:col-span-1">
                        <BookingSidebar hotel={hotel} />
                    </div>
                </div>

            </main>

            {/* 7. ✅ Render Modal ImageViewer (Nó sẽ tự ẩn/hiện) */}
            <ImageViewerModal
              open={isViewerOpen}
              onClose={() => setViewerOpen(false)}
              images={imagesForViewer} // Truyền dữ liệu đã được map
              startIndex={selectedImageIndex}
            />
        </CustomerLayout>
    );
}