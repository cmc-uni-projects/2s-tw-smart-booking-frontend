import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { format, addDays } from 'date-fns';
import { ArrowLeft } from 'lucide-react';

// Components
import Button from '@/components/common/Button/Button';
import Spinner from "@/components/common/Loading/Spinner";
import LoadingOverlay from "@/components/common/Loading/LoadingOverlay";

// Sub-components
import BookingDateSelector from './components/BookingDateSelector';
import BookingSummary from './components/BookingSummary';
import ContactInfoForm from './components/ContactInfoForm';

// Services & Context
import propertyService from "@/services/property.service";
import bookingService from "@/services/booking.service";
import { useAuth } from "@/context/AuthContext";

const BASE_URL = "http://localhost:8386"; 
const getFullImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/150";
    if (path.startsWith("http")) return path;
    return `${BASE_URL}/uploads/${path}`;
};

export default function BookingPage() {
    const { propertyId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { currentUser } = useAuth(); 

    const { selectedRoomId } = location.state || {};

    // Data State
    const [hotel, setHotel] = useState(null);
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Form State
    const [dateRange, setDateRange] = useState({
        startDate: new Date(),
        endDate: addDays(new Date(), 1)
    });
    
    const [contactData, setContactData] = useState({});
    const [submitting, setSubmitting] = useState(false);

    // 1. Fetch Hotel & Room Info
    useEffect(() => {
        const fetchData = async () => {
            if (!propertyId) return;
            setLoading(true);
            try {
                const data = await propertyService.getPropertyDetail(propertyId);
                setHotel({
                    id: data.propertyId,
                    name: data.propertyName,
                    type: data.propertyType, // ✅ Lưu loại hình để check logic submit
                    location: `${data.address}, ${data.city}`,
                    image: getFullImageUrl(data.coverImage)
                });

                let targetRoom = null;
                if (data.rooms && selectedRoomId) {
                    targetRoom = data.rooms.find(r => r.roomId === selectedRoomId);
                } else if (data.rooms?.length > 0) {
                    targetRoom = data.rooms[0]; // Fallback room đầu tiên
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
    }, [propertyId, selectedRoomId]);

    // Validate Form
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
            // ✅ CHECK LOGIC: Nếu là Villa/Homestay -> Không gửi roomId (gửi null)
            const isWholeUnit = ["VILLA", "HOMESTAY"].includes(hotel.type);

            const payload = {
                userId: currentUser.userId, 
                propertyId: parseInt(propertyId),
                roomId: isWholeUnit ? null : room.id, // ✅ Xử lý roomId tại đây
                checkInDate: format(dateRange.startDate, "yyyy-MM-dd"),
                checkOutDate: format(dateRange.endDate, "yyyy-MM-dd"),
                guestCount: room.guests,
                
                // Gửi thông tin contact & cờ SelfBooking
                bookingForSelf: contactData.isSelfBooking,
                contactName: contactData.fullName,
                contactPhone: contactData.phone,
                contactEmail: contactData.email,
                specialRequest: contactData.specialRequest
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
                
                {/* CỘT TRÁI: INPUTS */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Chọn ngày */}
                    <BookingDateSelector 
                        dateRange={dateRange} 
                        onChange={setDateRange} 
                    />
                    
                    {/* Form Liên hệ (Component tách riêng) */}
                    <ContactInfoForm 
                        user={currentUser}
                        onChange={setContactData}
                        initialData={{
                            // Nếu muốn pre-fill
                        }}
                    />
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
                    />
                </div>
            </div>
        </main>
    );
}