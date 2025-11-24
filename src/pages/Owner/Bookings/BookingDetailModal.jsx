// File: src/pages/Owner/Bookings/BookingDetailModal.jsx
import React from "react";
import { 
    X, Calendar, User, Phone, Mail, CreditCard, 
    MessageSquare, Clock, MapPin, BedDouble 
} from "lucide-react";
import Button from "./components/common/Button";
import StatusBadge from "./components/common/StatusBadge";
import UserAvatar from "./components/common/UserAvatar";

const BookingDetailModal = ({ isOpen, onClose, booking, onCheckOut }) => {
    if (!isOpen || !booking) return null;

    const formatCurrency = (val) =>
        new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);

    const formatDate = (dateStr) => {
        if (!dateStr) return "N/A";
        return new Date(dateStr).toLocaleDateString("vi-VN", {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    // --- 1. LOGIC XÁC ĐỊNH TRẠNG THÁI HIỂN THỊ ---
    const getStatusInfo = (b) => {
        // Ưu tiên check status gốc từ Backend
        if (b.originalStatus === 'COMPLETED') return { type: 'gray', text: 'Đã trả phòng' };
        if (b.originalStatus === 'CANCELLED') return { type: 'gray', text: 'Đã hủy' };
        if (b.originalStatus === 'PENDING_PAYMENT') return { type: 'warning', text: 'Chờ thanh toán' };

        // Nếu đang hoạt động (CONFIRMED) thì check ngày
        const today = new Date();
        today.setHours(0,0,0,0);
        const checkOut = new Date(b.checkOut);
        checkOut.setHours(0,0,0,0);

        if (checkOut < today) return { type: 'overdue', text: 'Quá hạn trả' };
        if (checkOut.getTime() === today.getTime()) return { type: 'today', text: 'Trả hôm nay' };
        
        return { type: 'active', text: 'Đang lưu trú' };
    };

    const statusInfo = getStatusInfo(booking);

    // --- 2. LOGIC ẨN/HIỆN NÚT TRẢ PHÒNG ---
    // Chỉ hiện nút khi đơn chưa hoàn thành và chưa hủy
    const canCheckOut = booking.originalStatus !== 'COMPLETED' && booking.originalStatus !== 'CANCELLED';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
            {/* Modal Container */}
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
                
                {/* Header */}
                <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            Thông tin đặt phòng
                            <span className="text-sm font-normal text-slate-500 bg-white px-2 py-1 rounded border border-slate-200 shadow-sm">
                                {booking.bookingCode}
                            </span>
                        </h2>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body (Scrollable) */}
                <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
                    
                    {/* Section 1: Thông tin phòng & Trạng thái */}
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm text-blue-500">
                                    <BedDouble size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 mb-1">Phòng đã đặt</p>
                                    <h3 className="font-bold text-slate-800 text-lg">{booking.roomName}</h3>
                                    <div className="mt-2">
                                        <StatusBadge type={statusInfo.type} text={statusInfo.text} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
                             <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm text-slate-500">
                                    <User size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 mb-1">Khách hàng</p>
                                    <h3 className="font-bold text-slate-800 text-lg">{booking.customerName}</h3>
                                    <p className="text-sm text-slate-500 mt-1">{booking.guestCount}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Thời gian & Chi tiết */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h4 className="font-semibold text-slate-900 border-b border-slate-100 pb-2">Thời gian lưu trú</h4>
                            <div className="flex items-center gap-3 text-slate-600">
                                <Calendar size={18} className="text-[#28A9E0]" />
                                <div>
                                    <p className="text-xs text-slate-400">Nhận phòng</p>
                                    <p className="font-medium">{formatDate(booking.checkIn)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600">
                                <Clock size={18} className="text-rose-500" />
                                <div>
                                    <p className="text-xs text-slate-400">Trả phòng</p>
                                    <p className="font-medium">{formatDate(booking.checkOut)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="font-semibold text-slate-900 border-b border-slate-100 pb-2">Thông tin liên hệ</h4>
                            <div className="flex items-center gap-3 text-slate-600">
                                <Phone size={18} className="text-slate-400" />
                                <span>{booking.phone || "Không có số điện thoại"}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600">
                                <Mail size={18} className="text-slate-400" />
                                <span className="truncate">{booking.email || "Không có email"}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600">
                                <MapPin size={18} className="text-slate-400" />
                                <span className="truncate">Việt Nam</span>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Thanh toán & Ghi chú */}
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                        <div className="flex justify-between items-center mb-4 border-b border-slate-200 pb-3">
                            <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                <CreditCard size={18} />
                                Thông tin thanh toán
                            </h4>
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                                booking.paymentMethod === 'Đã thanh toán' 
                                ? 'bg-emerald-100 text-emerald-700' 
                                : 'bg-amber-100 text-amber-700'
                            }`}>
                                {booking.paymentMethod}
                            </span>
                        </div>
                        
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-slate-500">Đơn giá phòng</span>
                            <span className="font-medium text-slate-700">--</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-slate-500">Phụ phí</span>
                            <span className="font-medium text-slate-700">0 ₫</span>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-slate-200 mt-3">
                            <span className="font-bold text-slate-800 text-lg">Tổng cộng</span>
                            <span className="font-bold text-[#28A9E0] text-xl">
                                {formatCurrency(booking.totalPrice)}
                            </span>
                        </div>
                    </div>

                    {/* Ghi chú */}
                    {booking.specialRequest && (
                        <div className="flex gap-3 p-4 bg-amber-50 text-amber-800 rounded-lg border border-amber-100 text-sm">
                            <MessageSquare size={18} className="shrink-0 mt-0.5" />
                            <div>
                                <span className="font-bold block mb-1">Yêu cầu đặc biệt:</span>
                                {booking.specialRequest}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Buttons */}
                <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose}>
                        Đóng
                    </Button>
                    
                    {/* --- 3. NÚT TRẢ PHÒNG CÓ ĐIỀU KIỆN --- */}
                    {canCheckOut && (
                        <Button 
                            variant="dangerSoft" 
                            onClick={() => onCheckOut(booking.id)}
                        >
                            Trả phòng ngay
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingDetailModal;