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
import { MapPin, Star, Wifi, Waves, ParkingCircle, Utensils, Users, Maximize, Bed } from "lucide-react";

// --- Dữ liệu Mock (Để demo, sau này bạn sẽ thay bằng API call) ---
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
    },
    {
      id: 102,
      name: "Phòng Suite Gia Đình",
      price: 3500000,
      guests: 4,
      size: 50,
      beds: "2 giường Queen",
    },
  ],
};
// --- Hết dữ liệu Mock ---

// Component Sidebar Đặt phòng
const BookingSidebar = ({ hotel }) => {
    const [selectedRoom, setSelectedRoom] = useState(hotel.rooms[0]);

    // Hàm định dạng tiền tệ
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

                {/* Chọn phòng (ví dụ đơn giản) */}
                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-1">Loại phòng</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    onChange={(e) => setSelectedRoom(hotel.rooms.find(r => r.id == e.target.value))}
                  >
                    {hotel.rooms.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
            </div>

            {/* Chi tiết giá (giả lập 1 đêm) */}
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
  const { hotelId } = useParams(); // Lấy ID từ URL
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  // Giả lập việc fetch dữ liệu dựa trên hotelId
  useEffect(() => {
    setLoading(true);
    // TODO: Thay thế bằng API call thật
    // const fetchedHotel = await hotelService.getById(hotelId);

    // Giả lập API call
    setTimeout(() => {
      setHotel(MOCK_DETAIL); // Dùng dữ liệu mock
      setLoading(false);
    }, 1000);
  }, [hotelId]);

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

        {/* 1. Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* 2. Tiêu đề (Tên, địa chỉ, rating) */}
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

        {/* 3. Bộ sưu tập ảnh (Gợi ý layout đơn giản) */}
        <div className="mt-6 grid grid-cols-4 grid-rows-2 gap-2 h-96 rounded-2xl overflow-hidden">
            <div className="col-span-2 row-span-2">
                <img src={hotel.images[0]} alt="Main hotel" className="w-full h-full object-cover" />
            </div>
            {hotel.images.slice(1, 5).map((img, index) => (
                <div key={index} className="col-span-1 row-span-1">
                <img src={img} alt={`Hotel view ${index + 1}`} className="w-full h-full object-cover" />
                </div>
            ))}
        </div>

        {/* 4. Layout 2 cột (Nội dung chính & Sidebar đặt phòng) */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Cột trái (Nội dung) */}
          <div className="lg:col-span-2 space-y-8">

            {/* Mô tả */}
            <Card>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Mô tả</h3>
              <p className="text-gray-600 leading-relaxed">
                {hotel.description}
              </p>
            </Card>

            {/* Tiện ích */}
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

            {/* Danh sách phòng */}
            <Card>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Các loại phòng</h3>
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
                            <div className="text-right">
                                <span className="text-lg font-bold text-gray-800">{room.price.toLocaleString('vi-VN')}₫</span>
                                <span className="text-sm text-gray-500">/đêm</span>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

          </div>

          {/* Cột phải (Sidebar đặt phòng) */}
          <div className="lg:col-span-1">
            <BookingSidebar hotel={hotel} />
          </div>
        </div>

      </main>
    </CustomerLayout>
  );
}