// src/pages/Customer/Booking/PaymentPage.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { format, differenceInCalendarDays } from 'date-fns';
import Card from '@/components/common/Card/Card';
import Button from '@/components/common/Button/Button';
import Divider from '@/components/common/Divider/Divider';
import Spinner from '@/components/common/Loading/Spinner';
import LoadingOverlay from '@/components/common/Loading/LoadingOverlay';
import Modal from '@/components/common/Modal/Modal';
import Toast from "@/components/common/Notification/Toast";
import ToastPortal from "@/components/common/Notification/ToastPortal";

import { MapPin, BedDouble, Users, Receipt, User, Phone, Mail, ArrowLeft, CheckCircle2, Clock } from 'lucide-react';
import PaymentForm from './PaymentForm';
import QRCodeModal from './QRCodeModal';
import PaymentTimeoutModal from './components/PaymentTimeoutModal';
import DiscountSection from './components/DiscountSection';
import bookingService from "@/services/booking.service";
import paymentService from "@/services/payment.service";
import './PaymentPage.css';

// ... (Giữ nguyên các hàm helper: BASE_URL, getFullImageUrl)
const BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8386/api/v1").replace("/api/v1", "");
const getFullImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/300x200?text=No+Image";
    if (path.startsWith("http")) return path;
    let cleanPath = path.startsWith('/') ? path : `/${path}`;
    if (!cleanPath.startsWith('/uploads')) cleanPath = `/uploads${cleanPath}`;
    return `${BASE_URL}${cleanPath}`;
};

// ... (Giữ nguyên PaymentSummary)
const PaymentSummary = ({ booking }) => {
    if (!booking) return null;
    const { propertyName, propertyImage, propertyAddress, roomName, checkInDate, checkOutDate, guestCount, user } = booking;
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

// ... (Giữ nguyên TotalPriceSection)
const TotalPriceSection = ({ originalPrice, finalPrice, adminDiscount, ownerDiscount, onSubmit, loading, disabled }) => {
    return (
        <Card className="p-6 border border-gray-200 shadow-md bg-white">
            <div className="flex flex-col gap-2 mb-4">
                <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Tạm tính</span>
                    <span>{new Intl.NumberFormat('vi-VN').format(originalPrice)}₫</span>
                </div>

                {ownerDiscount > 0 && (
                    <div className="flex justify-between items-center text-sm text-purple-600 font-medium">
                        <span>Partner Voucher</span>
                        <span>- {new Intl.NumberFormat('vi-VN').format(ownerDiscount)}₫</span>
                    </div>
                )}

                {adminDiscount > 0 && (
                    <div className="flex justify-between items-center text-sm text-blue-600 font-medium">
                        <span>TravelMate Voucher</span>
                        <span>- {new Intl.NumberFormat('vi-VN').format(adminDiscount)}₫</span>
                    </div>
                )}

                <Divider className="my-2 border-dashed"/>

                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-sm text-gray-500 font-medium mb-1">Tổng thanh toán</p>
                        <div className="flex items-center gap-1 text-green-600 text-xs bg-green-50 w-fit px-2 py-1 rounded-md">
                            <CheckCircle2 size={12}/> Đã bao gồm thuế phí
                        </div>
                    </div>
                    <h3 className="text-3xl font-extrabold text-[rgb(40,169,224)] tracking-tight">
                        {new Intl.NumberFormat('vi-VN').format(finalPrice)}₫
                    </h3>
                </div>
            </div>
            <Button size="lg" fullWidth onClick={onSubmit} className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-lg py-4 text-lg font-bold" disabled={loading || disabled}>Thanh toán ngay</Button>
        </Card>
    );
};

export default function PaymentPage() {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // --- STATES ---
    const [booking, setBooking] = useState(location.state?.booking || null);
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [toast, setToast] = useState({ show: false, msg: "", type: "info" });

    // --- PROMO STATES ---
    const [adminPromo, setAdminPromo] = useState(null);
    const [ownerPromo, setOwnerPromo] = useState(null);

    // [MỚI]: State theo dõi thứ tự áp dụng
    // Sẽ chứa mảng các string: ['OWNER', 'ADMIN'] hoặc ['ADMIN', 'OWNER']
    const [promoOrder, setPromoOrder] = useState([]);

    // Modals
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('qr_code');

    // Timer
    const [timeLeft, setTimeLeft] = useState(5 * 60);
    const [isTimeoutOpen, setIsTimeoutOpen] = useState(false);
    const timerRef = useRef(null);

    const showToast = (msg, type = "info") => {
        setToast({ show: true, msg, type });
        setTimeout(() => setToast({ show: false, msg: "", type: "info" }), 3000);
    };

    // --- HÀM TÍNH TOÁN (HELPER) ---
    const calculateDiscountValue = (promo, priceBasis) => {
        if (!promo || !priceBasis) return 0;
        const val = Number(promo.discountValue) || 0;
        const max = Number(promo.maxDiscountAmount) || 0;

        const type = promo.discountType ? promo.discountType.toUpperCase() : '';
        if (type === 'PERCENTAGE' || type === 'PERCENT') {
            let amount = (priceBasis * val) / 100;
            if (max > 0) {
                amount = Math.min(amount, max);
            }
            return Math.round(amount);
        } else {
            return val;
        }
    };

    // --- FETCH BOOKING DATA ---
    useEffect(() => {
        const fetchBooking = async () => {
            try {
                let currentBooking = booking;
                if (!currentBooking) {
                    if (!bookingId) return;
                    const res = await bookingService.getBookingById(bookingId);
                    currentBooking = res;
                    setBooking(currentBooking);
                }

                if (currentBooking) {
                    const createdTime = currentBooking.createdAt ? new Date(currentBooking.createdAt).getTime() : new Date().getTime();
                    const now = new Date().getTime();
                    const elapsedSeconds = Math.floor((now - createdTime) / 1000);
                    const remaining = (5 * 60) - elapsedSeconds;
                    if (remaining <= 0) handleExpired();
                    else setTimeLeft(remaining);

                    // --- KHÔI PHỤC STATE TỪ DB ---
                    // Lưu ý: DB có thể không lưu timestamp áp dụng, nên ta setup mặc định
                    // hoặc nếu bạn muốn chính xác thì cần API trả về createdTime của PromotionUsage.
                    // Tạm thời logic: Nếu có sẵn cả 2 thì ưu tiên Owner trước (mặc định)

                    const initialOrder = [];
                    if (currentBooking.promotionCode) initialOrder.push('OWNER');
                    if (currentBooking.adminPromotionCode) initialOrder.push('ADMIN');

                    // Nếu đã có order (do navigate trong session) thì giữ nguyên, nếu không thì set mới
                    if (promoOrder.length === 0) {
                        setPromoOrder(initialOrder);
                    }

                    if (currentBooking.adminPromotionCode && !adminPromo) {
                        setAdminPromo({ code: currentBooking.adminPromotionCode, discountValue: 0, description: "Đã áp dụng" });
                    }
                    if (currentBooking.promotionCode && !ownerPromo) {
                        setOwnerPromo({ code: currentBooking.promotionCode, discountValue: 0, description: "Đã áp dụng" });
                    }
                }
            } catch (error) {
                console.error("Error:", error);
                showToast("Lỗi khi tải đơn đặt phòng.", "error");
                setTimeout(() => navigate('/hotels'), 2000);
            } finally {
                setLoading(false);
            }
        };
        fetchBooking();
    }, [bookingId]);

    // Timer Logic
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

    const handleExpired = async () => {
        setIsTimeoutOpen(true);
        try { await bookingService.cancelBooking(bookingId); } catch (err) { console.error(err); }
    };

    const formatTime = (seconds) => {
        if (isNaN(seconds) || seconds < 0) return "05:00";
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // =========================================================================
    // LOGIC TÍNH TOÁN LINH HOẠT THEO THỨ TỰ (FIRST COME FIRST SERVED)
    // =========================================================================

    // 1. Dữ liệu từ Backend
    const backendFinalPrice = booking ? booking.totalPrice : 0;
    const backendDiscountAmount = booking ? (booking.discountAmount || 0) : 0;

    // 2. Xác định Giá Gốc (Original Price)
    const originalPrice = backendFinalPrice + backendDiscountAmount;

    // 3. Tính toán dựa trên promoOrder
    let localOwnerDiscount = 0;
    let localAdminDiscount = 0;

    // Xác định ai là người đến trước (Mặc định Owner nếu không rõ)
    const firstApplied = promoOrder.length > 0 ? promoOrder[0] : 'OWNER';

    if (firstApplied === 'OWNER') {
        // --- TRƯỜNG HỢP 1: OWNER TRƯỚC -> ADMIN SAU ---

        // B1: Tính Owner trên giá gốc
        if (ownerPromo) {
            localOwnerDiscount = calculateDiscountValue(ownerPromo, originalPrice);
        }
        localOwnerDiscount = Math.min(localOwnerDiscount, originalPrice);

        // B2: Tính Admin trên giá còn lại (sau khi trừ Owner)
        const priceAfterOwner = originalPrice - localOwnerDiscount;
        if (adminPromo) {
            localAdminDiscount = calculateDiscountValue(adminPromo, priceAfterOwner);
        }
        localAdminDiscount = Math.min(localAdminDiscount, priceAfterOwner);

    } else {
        // --- TRƯỜNG HỢP 2: ADMIN TRƯỚC -> OWNER SAU ---

        // B1: Tính Admin trên giá gốc
        if (adminPromo) {
            localAdminDiscount = calculateDiscountValue(adminPromo, originalPrice);
        }
        localAdminDiscount = Math.min(localAdminDiscount, originalPrice);

        // B2: Tính Owner trên giá còn lại (sau khi trừ Admin)
        const priceAfterAdmin = originalPrice - localAdminDiscount;
        if (ownerPromo) {
            localOwnerDiscount = calculateDiscountValue(ownerPromo, priceAfterAdmin);
        }
        localOwnerDiscount = Math.min(localOwnerDiscount, priceAfterAdmin);
    }

    // 4. Quyết định hiển thị
    const displayAdminDiscount = localAdminDiscount;
    const displayOwnerDiscount = localOwnerDiscount;

    // Giá cuối = Giá gốc - Tổng giảm
    const displayFinalPrice = Math.max(0, originalPrice - displayOwnerDiscount - displayAdminDiscount);

    // =========================================================================

    // --- HANDLE APPLY ---
    const updateOrder = (type, action) => {
        // type: 'OWNER' | 'ADMIN'
        // action: 'ADD' | 'REMOVE'
        setPromoOrder(prev => {
            let newOrder = [...prev];
            if (action === 'ADD') {
                if (!newOrder.includes(type)) newOrder.push(type);
            } else {
                newOrder = newOrder.filter(item => item !== type);
            }
            return newOrder;
        });
    };

    const handleApplyAdmin = async (promo) => {
        setIsProcessing(true);
        try {
            if (!promo) {
                if (adminPromo) {
                    const updatedBooking = await bookingService.removePromotion(booking.bookingId, adminPromo.code);
                    setBooking(updatedBooking);
                    setAdminPromo(null);
                    updateOrder('ADMIN', 'REMOVE'); // Cập nhật thứ tự
                    showToast("Đã gỡ mã ưu đãi hệ thống.", "info");
                }
            } else {
                const updatedBooking = await bookingService.applyPromotion(booking.bookingId, promo.code);
                setBooking(updatedBooking);
                setAdminPromo(promo);
                updateOrder('ADMIN', 'ADD'); // Cập nhật thứ tự
                showToast(`Áp dụng mã ${promo.code} thành công!`, "success");
            }
        } catch (error) {
            console.error(error);
            showToast(error.message || "Lỗi cập nhật mã khuyến mãi.", "error");
            if (promo) setAdminPromo(null);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleApplyOwner = async (promo) => {
        setIsProcessing(true);
        try {
            if (!promo) {
                if (ownerPromo) {
                    const updatedBooking = await bookingService.removePromotion(booking.bookingId, ownerPromo.code);
                    setBooking(updatedBooking);
                    setOwnerPromo(null);
                    updateOrder('OWNER', 'REMOVE'); // Cập nhật thứ tự
                    showToast("Đã gỡ mã ưu đãi khách sạn.", "info");
                }
            } else {
                const updatedBooking = await bookingService.applyPromotion(booking.bookingId, promo.code);
                setBooking(updatedBooking);
                setOwnerPromo(promo);
                updateOrder('OWNER', 'ADD'); // Cập nhật thứ tự
                showToast(`Áp dụng mã ${promo.code} thành công!`, "success");
            }
        } catch (error) {
            console.error(error);
            showToast(error.message || "Lỗi cập nhật mã khuyến mãi.", "error");
            if (promo) setOwnerPromo(null);
        } finally {
            setIsProcessing(false);
        }
    };

    // --- SUBMIT ---
    const handlePaymentSubmit = async () => {
        if (timeLeft <= 0) return;

        const usedCodes = [];
        if (adminPromo && adminPromo.code) usedCodes.push(adminPromo.code);
        if (ownerPromo && ownerPromo.code) usedCodes.push(ownerPromo.code);
        const promoCodeString = usedCodes.join(',');

        if (paymentMethod === 'qr_code') {
            setIsModalOpen(true);
            return;
        }

        setIsProcessing(true);
        try {
            await paymentService.submitPayment(
                bookingId,
                "Thanh toán tiền mặt (Demo)",
                promoCodeString,
                paymentMethod
            );
            setIsSuccessOpen(true);
        } catch (error) {
            showToast("Thanh toán thất bại: " + error.message, "error");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleConfirmQR = async () => {
        const usedCodes = [];
        if (adminPromo && adminPromo.code) usedCodes.push(adminPromo.code);
        if (ownerPromo && ownerPromo.code) usedCodes.push(ownerPromo.code);
        const promoCodeString = usedCodes.join(',');

        setIsProcessing(true);
        try {
            await paymentService.submitPayment(
                bookingId,
                "Thanh toán qua QR Code",
                promoCodeString,
                "QR_CODE"
            );
            setIsModalOpen(false);
            setIsSuccessOpen(true);
        } catch (error) {
            console.error(error);
            showToast("Có lỗi xảy ra: " + (error.message || error), "error");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleTimeoutConfirm = () => { navigate("/"); };

    // --- RENDER ---
    if (loading) return <div className="flex justify-center items-center h-screen"><Spinner size="lg" /></div>;
    if (!booking) return null;

    return (
        <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 bg-gray-50 min-h-screen relative">
            {isProcessing && <LoadingOverlay message="Đang xử lý..." />}
            <PaymentTimeoutModal open={isTimeoutOpen} onConfirm={handleTimeoutConfirm} />

            <div className="mb-6">
                <Button variant="ghost" onClick={() => navigate(-1)} leftIcon={<ArrowLeft size={18} />} className="mb-2 pl-0 hover:bg-transparent text-gray-500 hover:text-blue-600">Quay lại</Button>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Thanh toán đơn hàng</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
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
                    </div>

                    <PaymentForm onChange={setPaymentMethod} selected={paymentMethod} />

                    <DiscountSection
                        onApplyAdmin={handleApplyAdmin}
                        onApplyOwner={handleApplyOwner}
                        bookingPropertyId={booking.propertyId}
                        selectedAdminCode={adminPromo ? adminPromo.code : null}
                        selectedOwnerCode={ownerPromo ? ownerPromo.code : null}
                        // Dùng biến display đã được xử lý theo thứ tự
                        adminDiscount={displayAdminDiscount}
                        ownerDiscount={displayOwnerDiscount}
                    />

                    <TotalPriceSection
                        originalPrice={originalPrice}
                        totalPrice={displayFinalPrice}
                        finalPrice={displayFinalPrice}
                        adminDiscount={displayAdminDiscount}
                        ownerDiscount={displayOwnerDiscount}
                        onSubmit={handlePaymentSubmit}
                        loading={isProcessing}
                        disabled={timeLeft <= 0}
                    />
                </div>

                <div className="lg:col-span-1">
                    <PaymentSummary booking={booking} />
                </div>
            </div>

            <QRCodeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmQR}
                amount={displayFinalPrice}
                bookingCode={booking.bookingId}
            />

            <Modal open={isSuccessOpen} onClose={() => setIsSuccessOpen(false)} title="Thanh toán thành công" maxWidth="max-w-md">
                <div className="flex flex-col items-center text-center space-y-4 p-4">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-2 animate-bounce">
                        <CheckCircle2 size={48} className="text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Đã hoàn tất!</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">Đơn đặt phòng của bạn đã được xác nhận.</p>
                    <div className="w-full pt-4 flex flex-col gap-3">
                        <Button onClick={() => navigate('/customer/bookings')} fullWidth size="lg">Đi đến trang Đặt chỗ của tôi</Button>
                        <Button variant="ghost" onClick={() => setIsSuccessOpen(false)} fullWidth>Đóng</Button>
                    </div>
                </div>
            </Modal>

            <ToastPortal>
                {toast.show && (
                    <div className="fixed bottom-6 left-1/2 z-[9999] -translate-x-1/2">
                        <Toast message={toast.msg} type={toast.type} onClose={() => setToast((prev) => ({ ...prev, show: false }))} />
                    </div>
                )}
            </ToastPortal>
        </main>
    );
}