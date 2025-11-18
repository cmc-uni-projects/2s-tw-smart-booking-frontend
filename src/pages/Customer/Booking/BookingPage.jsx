// src/pages/Customer/Booking/BookingPage.jsx (ĐÃ CẬP NHẬT)

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '@/components/common/Card/Card';
import Button from '@/components/common/Button/Button';
import Divider from '@/components/common/Divider/Divider'; 
import { ArrowLeft, MapPin, Calendar, BedDouble, Users, CheckCircle2 } from 'lucide-react'; 

// ✅ CHỈ IMPORT BOOKING FORM
// import PaymentForm from './PaymentForm'; // <-- ĐÃ XÓA
import BookingForm from './BookingForm';

// Component Tóm tắt Đặt phòng (Giữ nguyên)
// (Code của BookingSummary y hệt như trước, chỉ đổi text nút)
const BookingSummary = ({ hotel, room, onSubmit }) => {
  const nights = 1; 
  const totalPrice = room.price * nights;

  return (
    <Card className="sticky top-24 p-6"> 
      {/* 1. Thông tin Khách sạn */}
      <div className="flex gap-4 mb-4">
        <img 
          src={room.images[0] || hotel.image} 
          alt={hotel.name} 
          className="w-28 h-28 rounded-lg object-cover" 
        />
        <div className="flex-1">
          <span className="text-xs text-gray-500">Khách sạn</span>
          <h3 className="font-semibold text-lg leading-snug">{hotel.name}</h3>
          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
            <MapPin size={14} /> {hotel.location}
          </p>
        </div>
      </div>
      <Divider />
      {/* 2. Thông tin Phòng */}
      <div className="space-y-2.5 text-sm">
        <h4 className="font-semibold text-base">{room.name}</h4>
        <p className="flex items-center gap-2 text-gray-700">
          <Calendar size={14} className="text-[rgb(40,169,224)]" /> 
          <b>Check-in:</b> CN, 16 Th11 2025 (Giả)
        </p>
        <p className="flex items-center gap-2 text-gray-700">
          <Calendar size={14} className="text-[rgb(40,169,224)]" /> 
          <b>Check-out:</b> T2, 17 Th11 2025 (1 đêm)
        </p>
        <p className="flex items-center gap-2 text-gray-700">
          <Users size={14} className="text-[rgb(40,169,224)]" /> 
          <b>Khách:</b> {room.guests} người
        </p>
        <p className="flex items-center gap-2 text-gray-700">
          <BedDouble size={14} className="text-[rgb(40,169,224)]" /> 
          <b>Giường:</b> {room.beds}
        </p>
      </div>
      <Divider />
      {/* 3. Chi tiết giá */}
      <div className="space-y-2">
        <h4 className="font-semibold text-base mb-3">Chi tiết giá</h4>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Phòng (x{nights} đêm)</span>
          <span className="font-medium">{room.price.toLocaleString('vi-VN')}₫</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Thuế và phí</span>
          <span className="font-medium text-green-600">Đã bao gồm</span>
        </div>
        <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 mt-2 border-t">
          <span>Tổng cộng</span>
          <span>{totalPrice.toLocaleString('vi-VN')}₫</span>
        </div>
      </div>
      
      {/* Nút Submit chính */}
      <Button 
        fullWidth 
        size="lg" 
        className="mt-6" 
        onClick={onSubmit}
        leftIcon={<CheckCircle2 size={18} />}
      >
        {/* ✅ ĐÃ ĐỔI TEXT */}
        Tiếp tục
      </Button>
    </Card>
  );
};
// KẾT THÚC COMPONENT TÓM TẮT


export default function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { hotel, room } = location.state || {};

  // ✅ State để lưu dữ liệu từ BookingForm
  const [guestDetails, setGuestDetails] = useState({});

  if (!hotel || !room) {
    // (Phần code xử lý lỗi giữ nguyên)
    return (
        <div className="text-center py-20 max-w-7xl mx-auto px-6">
          <h1 className="text-2xl font-bold mb-4">Lỗi Đặt phòng</h1>
          <p className="text-gray-600 mb-6">Không tìm thấy thông tin phòng. Vui lòng quay lại và chọn phòng.</p>
          <Button onClick={() => navigate('/hotels')}>Tìm khách sạn</Button>
        </div>
    );
  }

  // ✅ CẬP NHẬT HÀM SUBMIT
  const handleFinalSubmit = () => {
    // 1. Thu thập tất cả dữ liệu
    const bookingData = {
      hotel,
      room,
      guestDetails // Dữ liệu từ BookingForm
    };

    // 2. Chuyển hướng đến trang thanh toán MỚI, mang theo dữ liệu
    navigate('/booking/payment', { state: { bookingData } });
  };

  return (
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)} 
          leftIcon={<ArrowLeft size={18} />}
          className="mb-4"
        >
          Quay lại
        </Button>

        <h1 className="text-3xl font-bold mb-8 text-gray-800">Xác nhận & Đặt phòng</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* === CỘT TRÁI (Nội dung) === */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* ✅ Truyền hàm 'onChange' để BookingForm cập nhật state */}
            <BookingForm onChange={setGuestDetails} />
            
            {/* ❌ ĐÃ XÓA PAYMENTFORM KHỎI ĐÂY */}
            {/* <PaymentForm onChange={setPaymentMethod} /> */}
          </div>

          {/* === CỘT PHẢI (Tóm tắt) === */}
          <div className="lg:col-span-1 sticky top-24 h-fit">
            <BookingSummary 
              hotel={hotel} 
              room={room} 
              onSubmit={handleFinalSubmit} 
            />
          </div>
        </div>
      </main>
  );
}