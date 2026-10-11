import React, { useMemo } from "react";
import {
    X, Phone, Mail, CreditCard, FileText, CheckCircle2, 
    MapPin, Users, LogOut, Calendar, Clock, User, AlertCircle
} from "lucide-react";
import Button from "./components/common/Button";
import { useTranslation } from "react-i18next";

const BookingDetailModal = ({ isOpen, onClose, booking, onCheckOut }) => {
  const { t } = useTranslation();
    if (!isOpen || !booking) return null;

    // --- 1. HELPERS FORMAT ---
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "N/A";
        return new Date(dateStr).toLocaleDateString('vi-VN', { 
            day: '2-digit', month: '2-digit', year: 'numeric' 
        });
    };

    // Helper dịch trạng thái thanh toán sang Tiếng Việt
    const getPaymentStatusLabel = (status) => {
        switch (status) {
            case 'APPROVED':
            case 'PAID':
                return t("owner:BookingDetailModal.paid");
            case 'PENDING':
            case 'PENDING_PAYMENT':
                return t("owner:BookingDetailModal.awaitingPayment");
            case 'REFUNDED':
                return t("owner:BookingDetailModal.refunded");
            case 'REFUND_REQUESTED':
                return t("owner:BookingDetailModal.awaitingRefund");
            case 'REJECTED':
                return t("owner:BookingDetailModal.failed");
            default:
                return status || t("owner:BookingDetailModal.notSpecified");
        }
    };

    // --- 2. TÍNH TOÁN SỐ ĐÊM & ĐƠN GIÁ ---
    const { nights, pricePerNight } = useMemo(() => {
        const start = new Date(booking.checkIn);
        const end = new Date(booking.checkOut);
        
        // Tính số mili-giây chênh lệch
        const diffTime = Math.abs(end - start);
        // Chuyển sang số ngày (làm tròn lên, tối thiểu 1 đêm)
        const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
        
        const price = booking.totalPrice / days;
        
        return { nights: days, pricePerNight: price };
    }, [booking.checkIn, booking.checkOut, booking.totalPrice]);

    // Hàm xử lý check-out
    const handleModalCheckOut = () => {
        if (onCheckOut) {
            onCheckOut(booking.id);
            onClose();
        }
    };

    // Logic màu sắc badge thanh toán
    const isPaid = booking.paymentStatus === 'APPROVED' || booking.paymentStatus === 'PAID';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                
                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-white z-10">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">{t("owner:BookingDetailModal.bookingDetails")}</h2>
                        <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                            {t("owner:BookingDetailModal.bookingCode")} <span className="font-mono font-bold text-[#28A9E0] bg-blue-50 px-2 py-0.5 rounded">{booking.bookingCode || "N/A"}</span>
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Body (Scrollable) */}
                <div className="p-6 overflow-y-auto custom-scrollbar grid grid-cols-1 md:grid-cols-3 gap-8 bg-slate-50/50">
                    
                    {/* CỘT TRÁI: THÔNG TIN KHÁCH & THANH TOÁN */}
                    <div className="md:col-span-2 space-y-6">
                        
                        {/* Thông tin liên hệ */}
                        <section className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2 border-b pb-2">
                                <Users size={18} className="text-[#28A9E0]" /> {t("owner:BookingDetailModal.guestInformation")}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {/* Họ tên */}
                                <div>
                                    <label className="text-xs text-slate-500 font-bold uppercase block mb-1.5">{t("owner:BookingDetailModal.fullName")}</label>
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                        <div className="bg-white p-1.5 rounded shadow-sm text-blue-500">
                                            <User size={16} />
                                        </div>
                                        <p className="text-sm font-bold text-slate-800">{booking.customerName}</p>
                                    </div>
                                </div>

                                {/* Số điện thoại */}
                                <div>
                                    <label className="text-xs text-slate-500 font-bold uppercase block mb-1.5">{t("owner:BookingDetailModal.phoneNumber")}</label>
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                        <div className="bg-white p-1.5 rounded shadow-sm text-emerald-500">
                                            <Phone size={16} />
                                        </div>
                                        <p className="text-sm font-bold text-slate-800">{booking.phone || "---"}</p>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="sm:col-span-2">
                                    <label className="text-xs text-slate-500 font-bold uppercase block mb-1.5">Email</label>
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                        <div className="bg-white p-1.5 rounded shadow-sm text-purple-500">
                                            <Mail size={16} />
                                        </div>
                                        <p className="text-sm font-bold text-slate-800 truncate">{booking.email || "---"}</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Thanh toán */}
                        <section className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2 border-b pb-2">
                                <CreditCard size={18} className="text-[#28A9E0]" /> {t("owner:BookingDetailModal.payment")}
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600 text-sm">{t("owner:BookingDetailModal.method")}</span>
                                    <span className="font-medium text-slate-900 bg-slate-100 px-3 py-1 rounded text-sm">
                                        {booking.paymentMethod || t("owner:BookingDetailModal.notSpecified")}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600 text-sm">{t("owner:BookingDetailModal.status")}</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border ${
                                        isPaid 
                                        ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                                        : 'bg-amber-100 text-amber-700 border-amber-200'
                                    }`}>
                                        {isPaid ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />} 
                                        {getPaymentStatusLabel(booking.paymentStatus)}
                                    </span>
                                </div>
                            </div>
                        </section>

                        {/* Yêu cầu đặc biệt */}
                        {booking.specialRequest && booking.specialRequest !== "Không" /* i18n-ignore: placeholder value stored by the booking form */ && (
                            <section className="bg-amber-50 border border-amber-100 p-4 rounded-xl">
                                <h3 className="text-sm font-bold text-amber-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <FileText size={16} /> {t("owner:BookingDetailModal.specialRequests")}
                                </h3>
                                <p className="text-amber-900 text-sm italic">"{booking.specialRequest}"</p>
                            </section>
                        )}
                    </div>

                    {/* CỘT PHẢI: TÓM TẮT PHÒNG */}
                    <div className="md:col-span-1">
                         <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden sticky top-0">
                            <div className="bg-slate-50 p-4 border-b border-slate-200">
                                <h3 className="font-bold text-slate-700 text-sm uppercase">{t("owner:BookingDetailModal.roomInformation")}</h3>
                            </div>
                            
                            <div className="p-5 space-y-5">
                                <div>
                                    <p className="text-xs text-slate-400 uppercase font-bold mb-1">{t("owner:BookingDetailModal.roomType")}</p>
                                    <p className="text-[#28A9E0] font-bold text-lg leading-tight">{booking.roomName}</p>
                                    <p className="text-sm text-slate-500 flex items-center gap-1 mt-2">
                                        <MapPin size={14} /> {booking.propertyAddress || t("owner:BookingDetailModal.atTheHotel")}
                                    </p>
                                </div>

                                {/* Ngày giờ nhận trả */}
                                <div className="bg-slate-50 rounded-lg border border-slate-100 p-3 grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-slate-400 mb-1">{t("owner:BookingDetailModal.checkIn")}</p>
                                        <p className="font-bold text-slate-700 text-sm flex items-center gap-1">
                                            <Calendar size={12}/> {formatDate(booking.checkIn)}
                                        </p>
                                        <p className="text-xs text-blue-600 font-medium mt-0.5 flex items-center gap-1">
                                            <Clock size={10}/> 14:00
                                        </p>
                                    </div>
                                    <div className="text-right border-l border-slate-200 pl-4">
                                        <p className="text-xs text-slate-400 mb-1">{t("owner:BookingDetailModal.checkOut")}</p>
                                        <p className="font-bold text-slate-700 text-sm flex items-center justify-end gap-1">
                                            {formatDate(booking.checkOut)} <Calendar size={12}/>
                                        </p>
                                        <p className="text-xs text-orange-600 font-medium mt-0.5 flex items-center justify-end gap-1">
                                            12:00 <Clock size={10}/>
                                        </p>
                                    </div>
                                </div>

                                <div className="border-t border-dashed border-slate-200 pt-4 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">{t("owner:BookingDetailModal.unitPrice")}</span>
                                        <span className="font-medium text-slate-700">{t("owner:BookingDetailModal.night", { value: formatCurrency(pricePerNight) })}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">{t("owner:BookingDetailModal.duration")}</span>
                                        <span className="font-medium text-slate-700">{t("owner:BookingDetailModal.nights", { nights })}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">{t("owner:BookingDetailModal.guests")}</span>
                                        <span className="font-medium text-slate-700">{booking.guestCount}</span>
                                    </div>
                                </div>

                                <div className="border-t border-slate-200 pt-4">
                                    <div className="flex justify-between items-end">
                                        <span className="text-slate-600 font-bold">{t("owner:BookingDetailModal.total")}</span>
                                        <span className="text-2xl font-bold text-[#28A9E0]">{formatCurrency(booking.totalPrice)}</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Nút Trả phòng (Nếu cần) */}
                            {/* Chỉ hiện nếu trạng thái là Đang ở (CHECKED_IN) hoặc Đã xác nhận (CONFIRMED) */}
                            {(booking.originalStatus === 'CHECKED_IN' || booking.originalStatus === 'CONFIRMED') && (
                                <div className="p-4 bg-slate-50 border-t border-slate-200">
                                    <Button 
                                        className="w-full justify-center bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-100" 
                                        icon={LogOut}
                                        onClick={handleModalCheckOut}
                                    >
                                        {t("owner:BookingDetailModal.checkOut2")}
                                    </Button>
                                </div>
                            )}
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingDetailModal;