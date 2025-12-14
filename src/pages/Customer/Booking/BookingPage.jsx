import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { format, addDays } from 'date-fns';
import { ArrowLeft, ShieldCheck, Headset, Wallet } from 'lucide-react';

// Components
import Button from '@/components/common/Button/Button';
import Spinner from "@/components/common/Loading/Spinner";
import LoadingOverlay from "@/components/common/Loading/LoadingOverlay";

// Sub-components
import BookingSummary from './components/BookingSummary';
import ContactInfoForm from './components/ContactInfoForm';

// Services & Context
import propertyService from "@/services/property.service";
import bookingService from "@/services/booking.service";
import { useAuth } from "@/context/AuthContext";

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8386/api/v1").replace("/api/v1", "");
const getFullImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/150";
    if (path.startsWith("http")) return path;
    let cleanPath = path.startsWith('/') ? path : `/${path}`;
    if (!cleanPath.startsWith('/uploads')) cleanPath = `/uploads${cleanPath}`;
    return `${BASE_URL}${cleanPath}`;
};

// Component con: Khối An Tâm Đặt Phòng
const TrustBadges = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <div className="bg-white p-2 rounded-full text-blue-600 shadow-sm"><ShieldCheck size={20}/></div>
            <div>
                <p className="font-bold text-sm text-gray-800">Thanh toán an toàn</p>
                <p className="text-xs text-gray-500">Bảo mật chuẩn quốc tế</p>
            </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
            <div className="bg-white p-2 rounded-full text-green-600 shadow-sm"><Wallet size={20}/></div>
            <div>
                <p className="font-bold text-sm text-gray-800">Không phí ẩn</p>
                <p className="text-xs text-gray-500">Minh bạch giá cả</p>
            </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl border border-purple-100">
            <div className="bg-white p-2 rounded-full text-purple-600 shadow-sm"><Headset size={20}/></div>
            <div>
                <p className="font-bold text-sm text-gray-800">Hỗ trợ 24/7</p>
                <p className="text-xs text-gray-500">Luôn sẵn sàng giúp đỡ</p>
            </div>
        </div>
    </div>
);

export default function BookingPage() {
    const { propertyId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    // Lấy dữ liệu từ state (được truyền từ HotelDetailPage)
    const {
        selectedRoomId, // ID phòng chọn
        roomId: stateRoomId, // Fallback ID
        checkInDate,
        checkOutDate,
        calculationData // ✅ [MỚI] Dữ liệu tính toán giá (có cuối tuần)
    } = location.state || {};

    // Ưu tiên lấy roomId chuẩn
    const finalRoomId = selectedRoomId || stateRoomId;

    // Data State
    const [hotel, setHotel] = useState(null);
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);

    // Form State
    const [dateRange] = useState({
        startDate: checkInDate ? new Date(checkInDate) : new Date(),
        endDate: checkOutDate ? new Date(checkOutDate) : addDays(new Date(), 1)
    });

    const [contactData, setContactData] = useState({});
    const [submitting, setSubmitting] = useState(false);

    // 1. Fetch Hotel & Room Info
    useEffect(() => {
        const fetchData = async () => {
            // Logic cũ: lấy pid từ URL hoặc hotel state
            const pid = propertyId || (hotel && hotel.id);

            // Nếu không có propertyId và cũng không có hotel data sẵn -> dừng
            if (!pid && !location.state?.hotelName) return;

            // Nếu location.state đã có đủ thông tin hotel/room (tối ưu không cần gọi lại API)
            if (location.state?.hotelName && location.state?.roomName) {
                setHotel({
                    id: propertyId,
                    name: location.state.hotelName,
                    location: location.state.address,
                    // Các field khác có thể thiếu nếu lấy từ state, nhưng đủ để hiển thị cơ bản
                    image: null
                });
                setRoom({
                    id: finalRoomId,
                    name: location.state.roomName,
                    price: location.state.price,
                    guests: 2, // Fallback
                    image: location.state.image
                });
                setLoading(false);
                return;
            }

            // Logic cũ: Gọi API lấy chi tiết
            setLoading(true);
            try {
                const data = await propertyService.getPropertyDetail(propertyId);
                setHotel({
                    id: data.propertyId,
                    name: data.propertyName,
                    type: data.propertyType,
                    location: `${data.address}, ${data.city}`,
                    image: getFullImageUrl(data.coverImage)
                });

                let targetRoom = null;
                if (data.rooms && finalRoomId) {
                    targetRoom = data.rooms.find(r => r.roomId === finalRoomId);
                } else if (data.rooms?.length > 0) {
                    targetRoom = data.rooms[0];
                }

                if (targetRoom) {
                    setRoom({
                        id: targetRoom.roomId,
                        name: targetRoom.roomName,
                        price: targetRoom.pricePerNight,
                        guests: targetRoom.capacity,
                        image: (targetRoom.images && targetRoom.images.length > 0)
                            ? getFullImageUrl(targetRoom.images[0])
                            : null
                    });
                }
            } catch (error) {
                console.error("Error fetching details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [propertyId, finalRoomId]);

    // Validate Form (dựa trên ContactInfoForm cũ: fullName, phone, email)
    const isFormValid =
        contactData.fullName?.trim() &&
        contactData.phone?.trim() &&
        contactData.email?.trim();

    // 2. Submit Booking
    const handleFinalSubmit = async () => {
        if (!currentUser) {
            alert("Vui lòng đăng nhập để tiếp tục đặt phòng!");
            navigate("/login", { state: { from: location.pathname + location.search } });
            return;
        }

        setSubmitting(true);
        try {
            const isWholeUnit = ["VILLA", "HOMESTAY"].includes(hotel?.type);

            const payload = {
                userId: currentUser.userId,
                propertyId: parseInt(propertyId || hotel.id), // Đảm bảo có ID
                roomId: isWholeUnit ? null : (room?.id || finalRoomId),
                checkInDate: format(dateRange.startDate, "yyyy-MM-dd"),
                checkOutDate: format(dateRange.endDate, "yyyy-MM-dd"),
                guestCount: room?.guests || 1,

                bookingForSelf: contactData.isSelfBooking,

                // Map dữ liệu contact (Form cũ dùng 'phone')
                contactName: contactData.fullName,
                contactPhone: contactData.phone,
                guestPhone: contactData.phone,   // Map thêm cho chắc
                contactEmail: contactData.email,
                guestEmail: contactData.email,

                specialRequest: contactData.specialRequest,
                note: contactData.specialRequest,

                // ✅ QUAN TRỌNG: Gửi tổng tiền chính xác (đã tính cuối tuần) lên server
                totalPrice: calculationData ? calculationData.total : undefined
            };

            const response = await bookingService.createBooking(payload);
            const newBookingId = response.bookingId || response.data?.bookingId;

            if (newBookingId) {
                // ✅ SỬA: Truyền giá cuối cùng sang trang Payment
                navigate(`/booking/payment/${newBookingId}`, {
                    state: {
                        finalTotalPrice: calculationData ? calculationData.total : undefined
                    }
                });
            } else {
                throw new Error("Không nhận được Mã đặt phòng.");
            }

        } catch (error) {
            console.error("Booking Error:", error);
            alert("Lỗi: " + (error.response?.data?.message || "Đặt phòng thất bại. Vui lòng thử lại."));
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><Spinner size="lg" /></div>;

    if (!hotel || !room) return (
        <div className="text-center py-20 max-w-7xl mx-auto px-6">
            <h1 className="text-2xl font-bold mb-4 text-slate-800">Không tìm thấy thông tin</h1>
            <Button onClick={() => navigate('/hotels')}>Quay lại tìm kiếm</Button>
        </div>
    );

    return (
        <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 bg-gray-50 min-h-screen">
            {submitting && <LoadingOverlay message="Đang xử lý đơn đặt phòng..." />}

            <Button
                variant="ghost"
                onClick={() => navigate(`/hotels/${hotel.id}`)}
                leftIcon={<ArrowLeft size={18} />}
                className="mb-6 text-slate-500 hover:text-blue-600 pl-0 hover:bg-transparent"
            >
                Quay lại chi tiết
            </Button>

            <h1 className="text-3xl font-bold mb-8 text-slate-900">Xác nhận & Đặt phòng</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* CỘT TRÁI: FORM & TIỆN ÍCH */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Form Liên hệ (Giữ nguyên component cũ) */}
                    <ContactInfoForm
                        user={currentUser}
                        onChange={setContactData}
                    />

                    <TrustBadges />
                </div>

                {/* CỘT PHẢI: SUMMARY */}
                <div className="lg:col-span-1">
                    <BookingSummary
                        hotel={hotel}
                        room={room}
                        dateRange={dateRange}
                        onSubmit={handleFinalSubmit}
                        disabled={!isFormValid}
                        submitting={submitting}
                        // ✅ Truyền calculationData xuống để hiển thị giá đúng
                        calculationData={calculationData}
                    />
                </div>
            </div>
        </main>
    );
};