import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { format, differenceInCalendarDays } from 'date-fns';

import Card from '@/components/common/Card/Card';
import Button from '@/components/common/Button/Button';
import Divider from '@/components/common/Divider/Divider';
import Spinner from "@/components/common/Loading/Spinner";
import { 
    MapPin, Calendar, BedDouble, Users, Receipt, 
    User, Phone, Mail, Tag, ArrowLeft, CheckCircle2, AlertTriangle
} from 'lucide-react';

import PaymentForm from './PaymentForm';
import QRCodeModal from './QRCodeModal';     
import SuccessModal from './SuccessModal'; 

import bookingService from "@/services/booking.service";
import paymentService from "@/services/payment.service";

import './PaymentPage.css';

const BASE_URL = "http://localhost:8386"; 
const getFullImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/300x200?text=No+Image";
    if (path.startsWith("http")) return path;
    return `${BASE_URL}/uploads/${path}`;
};

/* ----------------------------------------
   COMPONENT: TÓM TẮT ĐƠN HÀNG (UPDATE UI)
---------------------------------------- */
const PaymentSummary = ({ booking }) => {
    if (!booking) return null;

    const { propertyName, propertyImage, propertyAddress, roomName, checkInDate, checkOutDate, guestCount, user } = booking;
    
    const startDate = new Date(checkInDate);
    const endDate = new Date(checkOutDate);
    const nights = differenceInCalendarDays(endDate, startDate);

    return (
        <Card className="p-0 overflow-hidden border border-gray-200 shadow-xl sticky top-24"> 
            
            {/* ✅ 1. ẢNH BÌA KHÁCH SẠN (MỚI) */}
            <div className="relative h-48 w-full group overflow-hidden">
                <img 
                    src={getFullImageUrl(propertyImage)} 
                    alt={propertyName}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Lớp phủ Gradient để chữ dễ đọc */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                
                <div className="absolute bottom-0 left-0 p-4 text-white w-full">
                    <h4 className="font-bold text-xl leading-tight shadow-black drop-shadow-md">{propertyName}</h4>
                    <p className="text-xs text-white/90 flex items-center gap-1 mt-1">
                        <MapPin size={12} /> {propertyAddress || "Việt Nam"}
                    </p>
                </div>

                {/* Mã đặt chỗ nổi trên ảnh */}
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
                            <p className="font-bold text-gray-800">{guestCount} người lớn</p>
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
                            <p className="text-gray-500 text-xs mt-0.5">{user?.email}</p>
                            <p className="text-gray-500 text-xs">{user?.phoneNumber}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

/* ----------------------------------------
   COMPONENT: TỔNG TIỀN
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
        </Card>
    );
};

/* ----------------------------------------
   MAIN PAGE
---------------------------------------- */
export default function PaymentPage() {
    const { bookingId } = useParams();
    const navigate = useNavigate();

    // States
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    
    // Modals
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('qr_code');

    useEffect(() => {
        const fetchBooking = async () => {
            if (!bookingId) return;
            try {
                const data = await bookingService.getBookingById(bookingId);
                setBooking(data);
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

    const handlePaymentSubmit = async () => {
        setProcessing(true);
        if (paymentMethod === 'qr_code') {
            setIsModalOpen(true);
            setProcessing(false);
            return;
        }
        try {
            await paymentService.submitPayment(bookingId, "Thanh toán tiền mặt");
            setIsSuccessOpen(true);
        } catch (error) {
            alert("Lỗi: " + error.message);
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><Spinner size="lg" /></div>;
    if (!booking) return null;

    return (
            <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 bg-gray-50 min-h-screen">
                <div className="mb-6">
                    <Button variant="ghost" onClick={() => navigate(-1)} leftIcon={<ArrowLeft size={18} />} className="mb-2 pl-0 hover:bg-transparent text-gray-500 hover:text-blue-600">Quay lại</Button>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Thanh toán đơn hàng</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Cảnh báo */}
                        <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl flex gap-3 shadow-sm">
                            <div className="bg-orange-100 p-2 rounded-full h-fit"><AlertTriangle className="text-orange-600" size={20} /></div>
                            <div>
                                <h4 className="font-bold text-orange-800 text-sm">Giữ phòng trong 30:00 phút</h4>
                                <p className="text-sm text-orange-700 mt-1">Vui lòng hoàn tất thanh toán để đảm bảo giữ phòng này.</p>
                            </div>
                        </div>

                        <PaymentForm onChange={setPaymentMethod} selected={paymentMethod} />
                        
                        {/* Discount (Giữ nguyên UI cũ nếu có, hoặc ẩn tạm) */}
                        
                        <TotalPriceSection totalPrice={booking.totalPrice} onSubmit={handlePaymentSubmit} loading={processing} />
                    </div>

                    <div className="lg:col-span-1">
                        <PaymentSummary booking={booking} />
                    </div>
                </div>

                <QRCodeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={() => { setIsModalOpen(false); setIsSuccessOpen(true); }} amount={booking.totalPrice} bookingCode={booking.bookingId}/>
                <SuccessModal isOpen={isSuccessOpen} onClose={() => { setIsSuccessOpen(false); navigate('/customer/my-bookings'); }} />
            </main>
    );
}