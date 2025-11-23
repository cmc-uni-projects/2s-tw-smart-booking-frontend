import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { format, differenceInCalendarDays } from 'date-fns';

// UI Components
import Card from '@/components/common/Card/Card';
import Button from '@/components/common/Button/Button';
import Divider from '@/components/common/Divider/Divider';
import Spinner from "@/components/common/Loading/Spinner";
import { 
    MapPin, Calendar, BedDouble, Users, Receipt, 
    User, Phone, Mail, Tag, ArrowLeft, CheckCircle2, AlertTriangle
} from 'lucide-react';

// Local Components
import PaymentForm from './PaymentForm';
import QRCodeModal from './QRCodeModal';     
import SuccessModal from './SuccessModal'; 

// Services
import bookingService from "@/services/booking.service";
import paymentService from "@/services/payment.service";

import './PaymentPage.css';

// --- HELPERS ---
const BASE_URL = "http://localhost:8386"; 
const getFullImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/300x200?text=No+Image";
    if (path.startsWith("http")) return path;
    return `${BASE_URL}/uploads/${path}`;
};

/* ----------------------------------------
   COMPONENT: TÓM TẮT ĐƠN HÀNG (BÊN PHẢI)
---------------------------------------- */
const PaymentSummary = ({ booking }) => {
    if (!booking) return null;

    // Lấy dữ liệu từ API (propertyImage, user info...)
    const { propertyName, propertyImage, propertyAddress, roomName, checkInDate, checkOutDate, guestCount, user } = booking;
    
    // Tính số đêm
    const startDate = new Date(checkInDate);
    const endDate = new Date(checkOutDate);
    const nights = Math.max(1, differenceInCalendarDays(endDate, startDate));

    return (
        <Card className="p-0 overflow-hidden border border-gray-200 shadow-xl sticky top-24"> 
            
            {/* ẢNH BÌA KHÁCH SẠN */}
            <div className="relative h-48 w-full group overflow-hidden">
                <img 
                    src={getFullImageUrl(propertyImage)} 
                    alt={propertyName}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                
                <div className="absolute bottom-0 left-0 p-4 text-white w-full">
                    <h4 className="font-bold text-xl leading-tight shadow-black drop-shadow-md">{propertyName}</h4>
                    <p className="text-xs text-white/90 flex items-center gap-1 mt-1">
                        <MapPin size={12} /> {propertyAddress || "Việt Nam"}
                    </p>
                </div>

                {/* Mã đặt chỗ */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-blue-700 shadow-sm flex items-center gap-1">
                    <Receipt size={12} /> #{booking.bookingId}
                </div>
            </div>

            <div className="p-5 space-y-5 bg-white">
                {/* Thời gian lưu trú */}
                <div className="bg-blue-50 p-3 rounded-xl flex justify-between items-center text-sm border border-blue-100">
                    <div className="text-center">
                        <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Nhận phòng</p>
                        <p className="font-bold text-gray-800 text-base">{format(startDate, "dd/MM")}</p>
                        <p className="text-xs text-gray-500">{format(startDate, "yyyy")}</p>
                    </div>
                    <div className="flex flex-col items-center px-2">
                        <div className="text-[10px] text-blue-500 font-bold mb-1">{nights} đêm</div>
                        <div className="w-16 h-[2px] bg-blue-200 relative">
                            <div className="absolute -top-[3px] -right-[1px] w-2 h-2 bg-blue-200 rounded-full"></div>
                            <div className="absolute -top-[3px] -left-[1px] w-2 h-2 bg-blue-200 rounded-full"></div>
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Trả phòng</p>
                        <p className="font-bold text-gray-800 text-base">{format(endDate, "dd/MM")}</p>
                        <p className="text-xs text-gray-500">{format(endDate, "yyyy")}</p>
                    </div>
                </div>

                {/* Chi tiết phòng */}
                <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                        <div className="bg-gray-100 p-2 rounded-lg text-gray-600"><BedDouble size={18}/></div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Loại phòng</p>
                            <p className="font-bold text-gray-800">{roomName}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="bg-gray-100 p-2 rounded-lg text-gray-600"><Users size={18}/></div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Khách</p>
                            <p className="font-bold text-gray-800">{guestCount} khách</p>
                        </div>
                    </div>
                </div>

                <Divider className="my-2 border-dashed" />

                {/* Thông tin người đặt */}
                <div>
                    <h5 className="font-bold text-gray-900 mb-3 text-sm flex items-center gap-2">
                        <User size={16} className="text-blue-600"/> Thông tin liên hệ
                    </h5>
                    <div className="space-y-2 text-sm pl-1 border-l-2 border-gray-100 ml-2">
                        <div className="pl-3">
                            <p className="font-semibold text-gray-800">{user?.fullName || "Khách vãng lai"}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <Mail size={12} className="text-gray-400"/> 
                                <span className="text-gray-500 text-xs">{user?.email}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                <Phone size={12} className="text-gray-400"/> 
                                <span className="text-gray-500 text-xs">{user?.phoneNumber}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

/* ----------------------------------------
   COMPONENT: TỔNG TIỀN & NÚT THANH TOÁN
---------------------------------------- */
const TotalPriceSection = ({ totalPrice, onSubmit, loading }) => {
    return (
        <Card className="p-6 border border-gray-200 shadow-md bg-white">
            <div className="flex justify-between items-end mb-4">
                <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">Tổng thanh toán</p>
                    <div className="flex items-center gap-1 text-green-600 text-xs bg-green-50 w-fit px-2 py-1 rounded-md">
                        <CheckCircle2 size={12}/> Đã bao gồm thuế phí
                    </div>
                </div>
                <h3 className="text-3xl font-extrabold text-[rgb(40,169,224)] tracking-tight">
                    {new Intl.NumberFormat('vi-VN').format(totalPrice)}₫
                </h3>
            </div>
            
            <Button 
                size="lg" 
                fullWidth
                onClick={onSubmit} 
                className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-lg py-4 text-lg font-bold transition-all transform active:scale-[0.98]"
                disabled={loading}
                leftIcon={loading ? <Spinner size="sm" color="white"/> : null}
            >
                {loading ? "Đang xử lý..." : "Thanh toán ngay"}
            </Button>
            
            <p className="text-xs text-gray-500 mt-4 text-center leading-relaxed">
                Bằng cách tiếp tục thanh toán, bạn đã đồng ý với <a href="#" className="text-blue-600 underline">Điều khoản & Điều kiện</a> và <a href="#" className="text-blue-600 underline">Chính sách quyền riêng tư</a> của chúng tôi.
            </p>
        </Card>
    );
};

/* ----------------------------------------
   MAIN PAGE: PAYMENT PAGE
---------------------------------------- */
export default function PaymentPage() {
    const { bookingId } = useParams();
    const navigate = useNavigate();

    // States
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    
    // Modals
    const [isModalOpen, setIsModalOpen] = useState(false); // QR Modal
    const [isSuccessOpen, setIsSuccessOpen] = useState(false); // Success Modal

    const [paymentMethod, setPaymentMethod] = useState('qr_code');

    // 1. Load thông tin Booking từ API
    useEffect(() => {
        const fetchBooking = async () => {
            if (!bookingId) return;
            try {
                const data = await bookingService.getBookingById(bookingId);
                setBooking(data);
            } catch (error) {
                console.error("Error fetching booking:", error);
                alert("Không tìm thấy đơn đặt phòng!");
                navigate('/hotels');
            } finally {
                setLoading(false);
            }
        };
        fetchBooking();
    }, [bookingId]);

    // 2. Xử lý khi bấm nút "Thanh toán ngay" ở dưới cùng
    const handlePaymentSubmit = async () => {
        setProcessing(true);
        
        // Nếu chọn QR Code -> Mở Modal để quét (Chưa gọi API ngay)
        if (paymentMethod === 'qr_code') {
            setIsModalOpen(true);
            setProcessing(false);
            return;
        }

        // Nếu chọn phương thức khác (ví dụ tiền mặt) -> Gọi API luôn
        try {
            await paymentService.submitPayment(bookingId, "Thanh toán tiền mặt (Demo)");
            setIsSuccessOpen(true);
        } catch (error) {
            alert("Thanh toán thất bại: " + error.message);
        } finally {
            setProcessing(false);
        }
    };

    // 3. ✅ Xử lý khi bấm "Tôi đã thanh toán" trong Modal QR
    const handleConfirmQR = async () => {
        try {
            // Gọi API báo Backend xác nhận đã chuyển khoản
            await paymentService.submitPayment(bookingId, "Thanh toán qua QR Code (Xác nhận thủ công)");
            
            // Đóng QR Modal & Mở Success Modal
            setIsModalOpen(false);
            setIsSuccessOpen(true);
        } catch (error) {
            console.error("Lỗi xác nhận thanh toán:", error);
            alert("Có lỗi xảy ra khi xác nhận: " + (error.message || error));
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><Spinner size="lg" /></div>;

    if (!booking) return null;

    return (
            <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 bg-gray-50 min-h-screen">
                {/* Header & Back Button */}
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => navigate(-1)} 
                        leftIcon={<ArrowLeft size={18} />}
                        className="mb-4 pl-0 hover:bg-transparent text-gray-600 hover:text-blue-600"
                    >
                        Quay lại
                    </Button>
                    <h1 className="text-3xl font-bold text-gray-900">Thanh toán đơn hàng</h1>
                    <p className="text-gray-500 mt-1">Vui lòng chọn phương thức thanh toán và hoàn tất đặt phòng.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* CỘT TRÁI: PHƯƠNG THỨC THANH TOÁN */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Cảnh báo giữ phòng */}
                        <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl flex gap-3 shadow-sm">
                            <div className="bg-orange-100 p-2 rounded-full h-fit"><AlertTriangle className="text-orange-600" size={20} /></div>
                            <div>
                                <h4 className="font-bold text-orange-800 text-sm">Giữ phòng trong 30:00 phút</h4>
                                <p className="text-sm text-orange-700 mt-1">Vui lòng hoàn tất thanh toán để đảm bảo giữ phòng này.</p>
                            </div>
                        </div>

                        {/* Form chọn phương thức */}
                        <PaymentForm onChange={setPaymentMethod} selected={paymentMethod} />
                        
                        {/* Mã giảm giá (Giả lập) */}
                        <Card className="p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <Tag size={20} className="text-blue-600" />
                                <h3 className="font-bold text-gray-800">Mã giảm giá</h3>
                            </div>
                            <div className="flex gap-2">
                                <input type="text" placeholder="Nhập mã giảm giá" className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                                <Button variant="outline">Áp dụng</Button>
                            </div>
                        </Card>
                        
                        {/* Tổng tiền & Submit */}
                        <TotalPriceSection 
                            totalPrice={booking.totalPrice} 
                            onSubmit={handlePaymentSubmit}
                            loading={processing}
                        />
                    </div>

                    {/* CỘT PHẢI: TÓM TẮT */}
                    <div className="lg:col-span-1">
                        <PaymentSummary booking={booking} />
                    </div>
                </div>

                {/* --- MODALS --- */}
                <QRCodeModal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    onConfirm={handleConfirmQR} // ✅ Gọi hàm xử lý API
                    amount={booking.totalPrice}
                    bookingCode={booking.bookingId}
                />

                <SuccessModal 
                    isOpen={isSuccessOpen} 
                    onClose={() => {
                        setIsSuccessOpen(false);
                        navigate('/customer/transactions'); // Chuyển về trang Lịch sử giao dịch
                    }} 
                />
            </main>
    );
}