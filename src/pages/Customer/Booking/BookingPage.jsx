import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { format, addDays, differenceInCalendarDays } from 'date-fns';
import { vi } from 'date-fns/locale';
import { DateRange } from 'react-date-range';

import 'react-date-range/dist/styles.css'; 
import 'react-date-range/dist/theme/default.css';

import Card from '@/components/common/Card/Card';
import Button from '@/components/common/Button/Button';
import Divider from '@/components/common/Divider/Divider'; 
import Spinner from "@/components/common/Loading/Spinner";
import { ArrowLeft, MapPin, Calendar, BedDouble, Users, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react'; 

import BookingForm from './BookingForm';
import propertyService from "@/services/property.service";
import bookingService from "@/services/booking.service";
import { useAuth } from "@/context/AuthContext";

const BASE_URL = "http://localhost:8386"; 

const getFullImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/150";
    if (path.startsWith("http")) return path;
    return `${BASE_URL}/uploads/${path}`;
};

// --- COMPONENT 1: CHỌN NGÀY ---
const BookingDateSelector = ({ dateRange, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const nights = differenceInCalendarDays(dateRange.endDate, dateRange.startDate);

    const handleSelect = (ranges) => {
        onChange({
            startDate: ranges.selection.startDate,
            endDate: ranges.selection.endDate
        });
    };

    return (
        <Card className="p-5 border border-gray-200 shadow-sm mb-6">
            <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                <div className="flex items-center gap-3">
                    <div className="bg-blue-50 p-2.5 rounded-full text-blue-600">
                        <Calendar size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Thời gian lưu trú</h3>
                        <div className="flex items-center gap-2 text-sm mt-0.5">
                            <span className="font-semibold">{format(dateRange.startDate, "dd/MM/yyyy")}</span>
                            <span className="text-gray-400">→</span>
                            <span className="font-semibold">{format(dateRange.endDate, "dd/MM/yyyy")}</span>
                            <span className="text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-md text-xs ml-2">
                                {nights} đêm
                            </span>
                        </div>
                    </div>
                </div>
                <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                    {isOpen ? <ChevronUp size={18} /> : "Thay đổi"}
                </Button>
            </div>

            {isOpen && (
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-center animate-in fade-in slide-in-from-top-2">
                    <DateRange
                        ranges={[{ ...dateRange, key: 'selection' }]}
                        onChange={handleSelect}
                        minDate={new Date()}
                        rangeColors={['#28a9e0']}
                        locale={vi}
                        dateDisplayFormat="dd/MM/yyyy"
                    />
                </div>
            )}
        </Card>
    );
};

// --- COMPONENT 2: TÓM TẮT ---
const BookingSummary = ({ hotel, room, dateRange, onSubmit, disabled, submitting }) => {
  if (!hotel || !room) return null;

  const nights = Math.max(1, differenceInCalendarDays(dateRange.endDate, dateRange.startDate));
  const totalPrice = room.price * nights;

  return (
    <Card className="sticky top-24 p-6 border border-gray-200 shadow-lg"> 
      <div className="flex gap-4 mb-4">
        <img 
          src={room.image || hotel.image} 
          alt={hotel.name} 
          className="w-20 h-20 rounded-lg object-cover flex-shrink-0" 
        />
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Khách sạn</span>
          <h3 className="font-bold text-base text-gray-900 line-clamp-2 leading-tight mb-1">{hotel.name}</h3>
          <p className="text-xs text-gray-500 flex items-center gap-1 truncate">
            <MapPin size={12} /> {hotel.location}
          </p>
        </div>
      </div>
      
      <Divider className="my-4" />
      
      <div className="space-y-3 text-sm">
        <h4 className="font-bold text-gray-800">{room.name}</h4>
        
        <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-gray-50 p-2 rounded">
                <span className="block text-gray-500 mb-0.5">Nhận phòng</span>
                <span className="font-semibold text-gray-900">{format(dateRange.startDate, "dd/MM/yyyy")}</span>
            </div>
            <div className="bg-gray-50 p-2 rounded">
                <span className="block text-gray-500 mb-0.5">Trả phòng</span>
                <span className="font-semibold text-gray-900">{format(dateRange.endDate, "dd/MM/yyyy")}</span>
            </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-600 font-medium">
            <span className="flex items-center gap-1"><Users size={14} className="text-blue-500"/> {room.guests} khách</span>
            <span className="flex items-center gap-1"><BedDouble size={14} className="text-blue-500"/> {nights} đêm</span>
        </div>
      </div>
      
      <Divider className="my-4" />
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Giá phòng (x{nights} đêm)</span>
          <span className="font-medium">{new Intl.NumberFormat('vi-VN').format(totalPrice)}₫</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Thuế và phí</span>
          <span className="font-medium text-green-600">Đã bao gồm</span>
        </div>
        <div className="flex justify-between text-xl font-extrabold text-[rgb(40,169,224)] pt-3 mt-2 border-t border-dashed border-gray-200">
          <span>Tổng cộng</span>
          <span>{new Intl.NumberFormat('vi-VN').format(totalPrice)}₫</span>
        </div>
      </div>
      
      <Button 
        fullWidth 
        size="lg" 
        className="mt-6 bg-[rgb(40,169,224)] hover:bg-blue-600 text-white shadow-md" 
        onClick={onSubmit}
        disabled={disabled || submitting} 
        leftIcon={submitting ? <Spinner size="sm" color="white" /> : <CheckCircle2 size={18} />}
      >
        {submitting ? "Đang xử lý..." : "Thanh toán ngay"}
      </Button>
    </Card>
  );
};

// --- TRANG CHÍNH ---
export default function BookingPage() {
  const { propertyId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // ✅ SỬA LỖI: Dùng currentUser thay vì user
  const { currentUser } = useAuth(); 

  const { selectedRoomId, guestDetails: initialGuestDetails } = location.state || {};

  // States
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hotel, setHotel] = useState(null);
  const [room, setRoom] = useState(null);

  const [dateRange, setDateRange] = useState({
      startDate: new Date(),
      endDate: addDays(new Date(), 1)
  });

  const [guestDetails, setGuestDetails] = useState(initialGuestDetails || {});

  // 1. Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      if (!propertyId) return;
      setLoading(true);
      try {
        const data = await propertyService.getPropertyDetail(propertyId);
        
        setHotel({
            id: data.propertyId,
            name: data.propertyName,
            location: `${data.address}, ${data.city}`,
            image: getFullImageUrl(data.coverImage)
        });

        let targetRoom = null;
        if (data.rooms && selectedRoomId) {
            targetRoom = data.rooms.find(r => r.roomId === selectedRoomId);
        }
        if (!targetRoom && data.rooms?.length > 0) {
            targetRoom = data.rooms[0];
        }

        if (targetRoom) {
             setRoom({
                id: targetRoom.roomId,
                name: targetRoom.roomName,
                price: targetRoom.pricePerNight,
                guests: targetRoom.capacity,
                beds: "Tiêu chuẩn", 
                image: (targetRoom.images && targetRoom.images.length > 0) 
                    ? getFullImageUrl(targetRoom.images[0]) 
                    : null
             });
        }
      } catch (error) {
        console.error("Error fetching booking details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [propertyId, selectedRoomId]);

  // 2. Validate
  const contact = guestDetails?.contact || {};
  const guestName = guestDetails?.guestName || "";
  const isFormValid = 
    contact.fullName?.trim().length > 0 &&
    contact.phone?.trim().length > 0 &&
    contact.email?.trim().length > 0 &&
    guestName?.trim().length > 0; 

  // 3. Submit
  const handleFinalSubmit = async () => {
    // ✅ SỬA LỖI: Kiểm tra currentUser thay vì user
    if (!currentUser) {
        alert("Vui lòng đăng nhập để tiếp tục đặt phòng!");
        // Chuyển hướng qua login và nhớ trang hiện tại để quay lại
        navigate("/login", { state: { from: location.pathname + location.search } });
        return;
    }

    setSubmitting(true);
    try {
        const payload = {
            userId: currentUser.userId, // ✅ SỬA LỖI: Dùng currentUser.id
            propertyId: parseInt(propertyId),
            roomId: room.id,
            checkInDate: format(dateRange.startDate, "yyyy-MM-dd"),
            checkOutDate: format(dateRange.endDate, "yyyy-MM-dd"),
            guestCount: room.guests 
        };

        const response = await bookingService.createBooking(payload);
        
        if (response && response.bookingId) {
            navigate(`/booking/payment/${response.bookingId}`);
        } else {
            throw new Error("Không nhận được Mã đặt phòng.");
        }

    } catch (error) {
        console.error("Booking Error:", error);
        alert("Đặt phòng thất bại: " + (error.message || "Lỗi hệ thống"));
    } finally {
        setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><Spinner size="lg" /></div>;

  if (!hotel || !room) return (
      <div className="text-center py-20 max-w-7xl mx-auto px-6">
        <h1 className="text-2xl font-bold mb-4">Lỗi Đặt phòng</h1>
        <p className="text-gray-600 mb-6">Không tìm thấy thông tin phòng hoặc khách sạn.</p>
        <Button onClick={() => navigate('/hotels')}>Tìm khách sạn khác</Button>
      </div>
  );

  return (
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 bg-gray-50 min-h-screen">
        <Button
          variant="ghost"
          onClick={() => navigate(`/hotels/${hotel.id}`)}
          leftIcon={<ArrowLeft size={18} />}
          className="mb-6 text-gray-600 hover:text-blue-600 pl-0 hover:bg-transparent"
        >
          Quay lại chi tiết
        </Button>

        <h1 className="text-3xl font-bold mb-8 text-gray-900">Xác nhận & Đặt phòng</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            
            <BookingDateSelector 
                dateRange={dateRange} 
                onChange={setDateRange} 
            />

            {/* ✅ SỬA LỖI: Truyền currentUser vào initialContact để tự điền form */}
            <BookingForm 
                onChange={setGuestDetails} 
                initialData={initialGuestDetails}
                initialContact={{
                    fullName: currentUser?.fullName || "",
                    email: currentUser?.email || "",
                    phone: currentUser?.phone || ""
                }}
            />
          </div>

          <div className="lg:col-span-1">
            <BookingSummary 
              hotel={hotel} 
              room={room}
              dateRange={dateRange} 
              onSubmit={handleFinalSubmit}
              disabled={!isFormValid} 
              submitting={submitting}
            />
          </div>
        </div>
      </main>
  );
}

//BookingPage