import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom'; 
import { format, differenceInCalendarDays } from 'date-fns';

// UI Components
import Card from '@/components/common/Card/Card';
import Button from '@/components/common/Button/Button';
import Divider from '@/components/common/Divider/Divider';
import Spinner from '@/components/common/Loading/Spinner';
import LoadingOverlay from '@/components/common/Loading/LoadingOverlay'; 
import Modal from '@/components/common/Modal/Modal'; 

import { 
    MapPin, BedDouble, Users, Receipt, 
    User, Phone, Mail, Tag, ArrowLeft, CheckCircle2, Clock, AlertTriangle
} from 'lucide-react';

// Local Components
import PaymentForm from './PaymentForm';
import QRCodeModal from './QRCodeModal';
import PaymentTimeoutModal from './components/PaymentTimeoutModal';

// Services
import bookingService from "@/services/booking.service";
import paymentService from "@/services/payment.service";

import './PaymentPage.css';

// --- HELPERS ---
const BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8386/api/v1").replace("/api/v1", "");
const getFullImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/300x200?text=No+Image";
    if (path.startsWith("http")) return path;
    let cleanPath = path.startsWith('/') ? path : `/${path}`;
    if (!cleanPath.startsWith('/uploads')) cleanPath = `/uploads${cleanPath}`;
    return `${BASE_URL}${cleanPath}`;
};

// --- PAYMENT SUMMARY COMPONENT ---
const PaymentSummary = ({ booking }) => {
    if (!booking) return null;
    const { propertyName, propertyImage, propertyAddress, roomName, checkInDate, checkOutDate, guestCount, user } = booking;
    
    // Xử lý an toàn cho ngày tháng
    const startDate = checkInDate ? new Date(checkInDate) : new Date();
    const endDate = checkOutDate ? new Date(checkOutDate) : new Date();
    const nights = Math.max(1, differenceInCalendarDays(endDate, startDate));

    return (
        <Card className="p-0 overflow-hidden border border-gray-200 shadow-xl sticky top-24"> 
            <div className="relative h-48 w-full group overflow-hidden">
                <img src={getFullImageUrl(propertyImage)} alt={propertyName} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4 text-white w-full">
                    <h4 className="font-bold text-xl leading-tight shadow-black drop-shadow-md">{propertyName}</h4>
                    <p className="text-xs text-white/90 flex items-center gap-1 mt-1"><MapPin size={12} /> {propertyAddress || "Việt Nam"}</p>
                </div>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-blue-700 shadow-sm flex items-center gap-1">
                    <Receipt size={12} /> #{booking.bookingId}
                </div>
            </div>

            <div className="p-5 space-y-5 bg-white">
                <div className="bg-blue-50 p-3 rounded-xl flex justify-between items-center text-sm border border-blue-100">
                    <div className="text-center"><p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Nhận phòng</p><p className="font-bold text-gray-800 text-base">{format(startDate, "dd/MM")}</p><p className="text-xs text-gray-500">{format(startDate, "yyyy")}</p></div>
                    <div className="flex flex-col items-center px-2"><div className="text-[10px] text-blue-500 font-bold mb-1">{nights} đêm</div><div className="w-16 h-[2px] bg-blue-200 relative"><div className="absolute -top-[3px] -right-[1px] w-2 h-2 bg-blue-200 rounded-full"></div><div className="absolute -top-[3px] -left-[1px] w-2 h-2 bg-blue-200 rounded-full"></div></div></div>
                    <div className="text-center"><p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Trả phòng</p><p className="font-bold text-gray-800 text-base">{format(endDate, "dd/MM")}</p><p className="text-xs text-gray-500">{format(endDate, "yyyy")}</p></div>
                </div>

                <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3"><div className="bg-gray-100 p-2 rounded-lg text-gray-600"><BedDouble size={18}/></div><div><p className="text-xs text-gray-500 font-medium">Loại phòng</p><p className="font-bold text-gray-800">{roomName}</p></div></div>
                    <div className="flex items-start gap-3"><div className="bg-gray-100 p-2 rounded-lg text-gray-600"><Users size={18}/></div><div><p className="text-xs text-gray-500 font-medium">Khách</p><p className="font-bold text-gray-800">{guestCount} khách</p></div></div>
                </div>

                <Divider className="my-2 border-dashed" />

                <div>
                    <h5 className="font-bold text-gray-900 mb-3 text-sm flex items-center gap-2"><User size={16} className="text-blue-600"/> Thông tin liên hệ</h5>
                    <div className="space-y-2 text-sm pl-1 border-l-2 border-gray-100 ml-2">
                        <div className="pl-3">
                            <p className="font-semibold text-gray-800">{booking.customerName || user?.fullName || "Khách vãng lai"}</p>
                            <div className="flex items-center gap-2 mt-1"><Mail size={12} className="text-gray-400"/> <span className="text-gray-500 text-xs">{booking.customerEmail || user?.email}</span></div>
                            <div className="flex items-center gap-2 mt-1"><Phone size={12} className="text-gray-400"/> <span className="text-gray-500 text-xs">{booking.customerPhone || user?.phoneNumber}</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

// --- TOTAL PRICE COMPONENT ---
const TotalPriceSection = ({ totalPrice, onSubmit, loading, disabled }) => {
    return (
        <Card className="p-6 border border-gray-200 shadow-md bg-white">
            <div className="flex justify-between items-end mb-4">
                <div><p className="text-sm text-gray-500 font-medium mb-1">Tổng thanh toán</p><div className="flex items-center gap-1 text-green-600 text-xs bg-green-50 w-fit px-2 py-1 rounded-md"><CheckCircle2 size={12}/> Đã bao gồm thuế phí</div></div>
                <h3 className="text-3xl font-extrabold text-[rgb(40,169,224)] tracking-tight">{new Intl.NumberFormat('vi-VN').format(totalPrice)}₫</h3>
            </div>
            <Button size="lg" fullWidth onClick={onSubmit} className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-lg py-4 text-lg font-bold" disabled={loading || disabled}>Thanh toán ngay</Button>
        </Card>
    );
};

/* ----------------------------------------
   MAIN PAGE: PAYMENT PAGE
---------------------------------------- */
export default function PaymentPage() {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // States
    const [booking, setBooking] = useState(location.state?.booking || null);
    const [loading, setLoading] = useState(true);
    const [isConfirming, setIsConfirming] = useState(false); 
    
    // Modals
    const [isModalOpen, setIsModalOpen] = useState(false); // QR Modal
    const [isSuccessOpen, setIsSuccessOpen] = useState(false); // Success Modal
    const [paymentMethod, setPaymentMethod] = useState('qr_code');

    // Timeout State
    const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 phút
    const [isTimeoutOpen, setIsTimeoutOpen] = useState(false);
    const timerRef = useRef(null);

    // 1. Fetch Booking và tính toán thời gian
    useEffect(() => {
        const fetchBooking = async () => {
            try {
                let currentBooking = booking;

                // Nếu chưa có data (do F5 hoặc truy cập trực tiếp), gọi API
                if (!currentBooking) {
                    if (!bookingId) return;
                    const res = await bookingService.getBookingById(bookingId);
                    
                    // ✅ FIX LỖI: bookingService.getBookingById trả về data trực tiếp, không cần .data
                    currentBooking = res; 
                    setBooking(currentBooking);
                }

                // Logic tính thời gian còn lại
                if (currentBooking) {
                    // Nếu backend chưa trả về createdAt, tạm thời dùng thời gian hiện tại để không bị lỗi NaN
                    // (Bạn cần update Backend để logic này chính xác)
                    const createdTime = currentBooking.createdAt ? new Date(currentBooking.createdAt).getTime() : new Date().getTime();
                    const now = new Date().getTime();
                    const elapsedSeconds = Math.floor((now - createdTime) / 1000);
                    const remaining = (5 * 60) - elapsedSeconds;
                    
                    if (remaining <= 0) {
                        handleExpired();
                    } else {
                        setTimeLeft(remaining);
                    }
                }
            } catch (error) {
                console.error("Error:", error);
                alert("Lỗi khi tải đơn đặt phòng.");
                navigate('/hotels');
            } finally {
                setLoading(false);
            }
        };
        fetchBooking();
    }, [bookingId]);

    // 2. Chạy đồng hồ đếm ngược
    useEffect(() => {
        if (isTimeoutOpen) return;

        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    handleExpired();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [isTimeoutOpen]);

    // 3. Xử lý khi hết giờ
    const handleExpired = async () => {
        setIsTimeoutOpen(true);
        try {
            await bookingService.cancelBooking(bookingId);
        } catch (err) {
            console.error("Lỗi tự động hủy đơn:", err);
        }
    };

    const formatTime = (seconds) => {
        if (isNaN(seconds) || seconds < 0) return "05:00"; // Fallback nếu chưa có createdAt
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handlePaymentSubmit = async () => {
        if (timeLeft <= 0) return;

        if (paymentMethod === 'qr_code') {
            setIsModalOpen(true);
            return;
        }

        setIsConfirming(true);
        try {
            await paymentService.submitPayment(bookingId, "Thanh toán tiền mặt (Demo)");
            setIsSuccessOpen(true);
        } catch (error) {
            alert("Thanh toán thất bại: " + error.message);
        } finally {
            setIsConfirming(false);
        }
    };

    const handleConfirmQR = async () => {
        if (timeLeft <= 0) return;

        setIsConfirming(true);
        try {
            await paymentService.submitPayment(bookingId, "Thanh toán qua QR Code");
            setIsModalOpen(false);
            setIsSuccessOpen(true);
        } catch (error) {
            console.error("Lỗi xác nhận:", error);
            alert("Có lỗi xảy ra: " + (error.message || error));
        } finally {
            setIsConfirming(false);
        }
    };

    const handleTimeoutConfirm = () => {
        navigate("/"); 
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><Spinner size="lg" /></div>;
    // ✅ Kiểm tra booking tồn tại trước khi render
    if (!booking) return null; 

    return (
            <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 bg-gray-50 min-h-screen">
                
                {isConfirming && <LoadingOverlay message="Đang xác nhận thanh toán..." />}

                {/* MODAL HẾT GIỜ */}
                <PaymentTimeoutModal 
                    open={isTimeoutOpen} 
                    onConfirm={handleTimeoutConfirm} 
                />

                <div className="mb-6">
                    <Button variant="ghost" onClick={() => navigate(-1)} leftIcon={<ArrowLeft size={18} />} className="mb-2 pl-0 hover:bg-transparent text-gray-500 hover:text-blue-600">Quay lại</Button>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Thanh toán đơn hàng</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* CẢNH BÁO ĐẾM NGƯỢC */}
                        <div className={`border rounded-xl p-4 flex items-center justify-between shadow-sm transition-colors ${timeLeft < 60 ? 'bg-red-50 border-red-200' : 'bg-orange-50 border-orange-200'}`}>
                            <div className="flex items-center gap-3">
                                <Clock className={`${timeLeft < 60 ? 'text-red-600' : 'text-orange-600'} animate-pulse`} size={24} />
                                <div>
                                    <p className={`text-sm font-medium ${timeLeft < 60 ? 'text-red-800' : 'text-orange-800'}`}>
                                        {timeLeft < 60 ? "Sắp hết thời gian giữ phòng!" : "Thời gian giữ phòng còn lại"}
                                    </p>
                                    <p className={`text-2xl font-bold font-mono tracking-wider ${timeLeft < 60 ? 'text-red-600' : 'text-orange-600'}`}>
                                        {formatTime(timeLeft)}
                                    </p>
                                </div>
                            </div>
                            <div className="hidden sm:block text-xs text-gray-500 max-w-[250px] text-right">
                                Vui lòng hoàn tất thanh toán trong thời gian này để đảm bảo phòng không bị người khác đặt mất.
                            </div>
                        </div>

                        <PaymentForm onChange={setPaymentMethod} selected={paymentMethod} />
                        
                        <Card className="p-5">
                            <div className="flex items-center gap-2 mb-3"><Tag size={20} className="text-blue-600" /><h3 className="font-bold text-gray-800">Mã giảm giá</h3></div>
                            <div className="flex gap-2"><input type="text" placeholder="Nhập mã giảm giá" className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" /><Button variant="outline">Áp dụng</Button></div>
                        </Card>
                        
                        <TotalPriceSection 
                            totalPrice={booking.totalPrice} 
                            onSubmit={handlePaymentSubmit} 
                            loading={isConfirming} 
                            disabled={timeLeft <= 0} 
                        />
                    </div>

                    <div className="lg:col-span-1">
                        <PaymentSummary booking={booking} />
                    </div>
                </div>

                {/* QR CODE MODAL */}
                <QRCodeModal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    onConfirm={handleConfirmQR} 
                    amount={booking.totalPrice} 
                    bookingCode={booking.bookingId}
                />

                {/* SUCCESS MODAL */}
                <Modal 
                    open={isSuccessOpen} 
                    onClose={() => setIsSuccessOpen(false)} 
                    title="Thanh toán thành công"
                    maxWidth="max-w-md"
                >
                    <div className="flex flex-col items-center text-center space-y-4 p-4">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-2 animate-bounce">
                            <CheckCircle2 size={48} className="text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Đã hoàn tất!</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Đơn đặt phòng của bạn đã được xác nhận.
                        </p>
                        <div className="w-full pt-4 flex flex-col gap-3">
                            <Button onClick={() => navigate('/customer/my-bookings')} fullWidth size="lg">
                                Đi đến trang Đặt chỗ của tôi
                            </Button>
                            <Button variant="ghost" onClick={() => setIsSuccessOpen(false)} fullWidth>
                                Đóng
                            </Button>
                        </div>
                    </div>
                </Modal>
            </main>
    );
}