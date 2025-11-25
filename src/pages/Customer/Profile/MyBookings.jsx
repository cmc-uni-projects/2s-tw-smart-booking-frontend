import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, MapPin, Loader2, FileText, Search, Building2, CheckCircle2, AlertCircle, Clock, XCircle } from "lucide-react"; // Thêm icon

// Components UI
import Button from "@/components/common/Button/Button";
import Toast from "@/components/common/Notification/Toast";
import ToastPortal from "@/components/common/Notification/ToastPortal";
import TabsComponent from "@/components/common/Tabs/TabsComponent";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import AccountMenu from "./AccountMenu";

// Modals
import BookingDetailModal from "./BookingDetailModal";
import CancelBookingModal from "./CancelBookingModal";
import RequestRefundModal from "./RequestRefundModal"; 

// Services & Context
import bookingService from "@/services/booking.service";
import paymentService from "@/services/payment.service";
import { useAuth } from "@/context/AuthContext";

// Helpers
const API_BASE_URL = "http://localhost:8386";   
const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/300x200?text=No+Image";
    if (path.startsWith("http")) return path;
    return `${API_BASE_URL}/${path}`;
};

const TABS = [
    { id: "upcoming", name: "Sắp tới" },
    { id: "cancelled", name: "Đã hủy" },
    { id: "all", name: "Tất cả" },
];

// --- COMPONENT CARD (GIAO DIỆN) ---
const BookingCard = ({ booking, onClick }) => {
    const formatCurrency = (val) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);
    
    // Badge Status với Icon
    const renderStatusBadge = (status) => {
        const config = {
            CONFIRMED: { style: "bg-blue-100 text-blue-700 border-blue-200", label: "Đã xác nhận", icon: CheckCircle2 },
            PENDING_PAYMENT: { style: "bg-amber-100 text-amber-700 border-amber-200", label: "Chờ thanh toán", icon: AlertCircle },
            COMPLETED: { style: "bg-slate-100 text-slate-700 border-slate-200", label: "Hoàn thành", icon: CheckCircle2 },
            CANCELLED: { style: "bg-rose-100 text-rose-700 border-rose-200", label: "Đã hủy", icon: XCircle },
            CHECKED_IN: { style: "bg-emerald-100 text-emerald-700 border-emerald-200", label: "Đang lưu trú", icon: Building2 }
        };

        const current = config[status] || { style: "bg-gray-100 text-gray-600", label: status, icon: AlertCircle };
        const Icon = current.icon;

        return (
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${current.style}`}>
                <Icon size={14} strokeWidth={2.5} />
                {current.label}
            </span>
        );
    };

    return (
        <div 
            onClick={onClick}
            className={`group bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-blue-300 transition-all duration-300 cursor-pointer flex flex-col md:flex-row ${booking.status === 'CANCELLED' ? 'opacity-80 grayscale-[0.2]' : ''}`}
        >
            {/* Image Section */}
            <div className="w-full md:w-56 h-48 md:h-auto shrink-0 relative bg-slate-100">
                <img 
                    src={getImageUrl(booking.propertyImage)} 
                    alt={booking.propertyName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => e.target.src = "https://via.placeholder.com/300x200?text=Hotel"}
                />
                <div className="absolute top-3 left-3 md:hidden">
                    {renderStatusBadge(booking.status)}
                </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 p-5 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                                {booking.propertyName}
                            </h3>
                            <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                                <MapPin size={14} /> {booking.propertyAddress}
                            </p>
                        </div>
                        <div className="hidden md:block">
                            {renderStatusBadge(booking.status)}
                        </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded">
                            <CalendarDays size={16} className="text-blue-500" />
                            <div>
                                <p className="text-xs text-slate-400">Nhận phòng</p>
                                <p className="font-medium">{new Date(booking.checkInDate).toLocaleDateString('vi-VN')}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded">
                            <FileText size={16} className="text-blue-500" />
                            <div>
                                <p className="text-xs text-slate-400">Loại phòng</p>
                                <p className="font-medium truncate">{booking.roomName}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-end justify-between">
                    <div>
                        {booking.paymentStatus === 'REFUND_REQUESTED' && (
                            <span className="text-xs text-orange-600 font-bold flex items-center gap-1 mb-1">
                                <Loader2 size={10} className="animate-spin"/> Đang chờ hoàn tiền
                            </span>
                        )}
                        {booking.paymentStatus === 'REFUNDED' && (
                            <span className="text-xs text-green-600 font-bold mb-1 block">✔ Đã hoàn tiền</span>
                        )}
                        <p className="text-xs text-slate-400">Tổng thanh toán</p>
                        <p className="text-xl font-bold text-blue-600">{formatCurrency(booking.totalPrice)}</p>
                    </div>
                    
                    <Button size="sm" variant="outline" className="group-hover:bg-blue-50 group-hover:border-blue-200">
                        Xem chi tiết
                    </Button>
                </div>
            </div>
        </div>
    );
};

// --- MAIN PAGE ---
export default function MyBookings() {
    const navigate = useNavigate();
    const { currentUser } = useAuth(); 

    // Data States
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ show: false, msg: "", type: "info" });
    const [activeTab, setActiveTab] = useState("upcoming");
    
    // Modals State
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);

    const showToast = (msg, type = "info") => {
        setToast({ show: true, msg, type });
        setTimeout(() => setToast({ show: false, msg: "", type: "info" }), 3000);
    };

    // --- FETCH DATA ---
    const fetchBookings = async () => {
        if (!currentUser) return;
        setLoading(true);
        try {
            const data = await bookingService.getBookingsByUserId(currentUser.userId);
            setBookings(data.reverse()); 
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [currentUser]);

    // --- FILTER LOGIC ---
    const filteredBookings = useMemo(() => {
        if (activeTab === "upcoming") {
            return bookings.filter(b => 
                b.status === "CONFIRMED" || 
                b.status === "PENDING_PAYMENT" || 
                b.status === "CHECKED_IN"
            );
        }
        if (activeTab === "cancelled") {
            return bookings.filter(b => b.status === "CANCELLED");
        }
        return bookings; 
    }, [bookings, activeTab]);

    // --- HANDLERS ---
    const handleViewDetails = (booking) => {
        setSelectedBooking(booking);
        setIsDetailModalOpen(true);
    };

    const handleStartCancel = (booking) => {
        const targetBooking = booking || selectedBooking;
        setSelectedBooking(targetBooking);
        setIsDetailModalOpen(false);
        setTimeout(() => setIsCancelModalOpen(true), 200);
    };

    const handleConfirmCancel = async (booking, reason) => {
        try {
            await bookingService.cancelBooking(booking.bookingId);
            showToast("Hủy đặt phòng thành công!", "success");
            fetchBookings(); 
        } catch (err) {
            showToast(err.message || "Lỗi khi hủy đơn.", "error");
        } finally {
            setIsCancelModalOpen(false);
            setSelectedBooking(null);
        }
    };

    const handleOpenRefundModal = (booking) => {
        setSelectedBooking(booking);
        setIsRefundModalOpen(true);
        setIsDetailModalOpen(false); // Đóng modal chi tiết nếu đang mở
    };

    const handleConfirmRefundRequest = async (bookingId, refundData) => {
        try {
            await paymentService.requestRefund(bookingId, refundData);
            showToast("Đã gửi yêu cầu hoàn tiền thành công!", "success");
            fetchBookings(); 
        } catch (err) {
            showToast(err.message || "Lỗi khi gửi yêu cầu.", "error");
        } finally {
            setIsRefundModalOpen(false);
            setSelectedBooking(null);
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* MENU SIDEBAR */}
                <div className="lg:col-span-3">
                    <AccountMenu
                        activeSection="my-bookings" 
                        onSelect={(path) => navigate(`/customer/${path}`)}
                        userData={currentUser}
                    />
                </div>

                {/* MAIN CONTENT */}
                <div className="lg:col-span-9 space-y-6">
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Đặt chỗ của tôi</h2>
                            <p className="text-gray-500 text-sm">Quản lý các chuyến đi sắp tới và lịch sử đặt phòng.</p>
                        </div>
                    </div>

                    <div className="border-b border-gray-200">
                        <TabsComponent tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
                    </div>

                    {loading ? (
                        <div className="py-20 flex justify-center">
                            <Loader2 className="animate-spin w-10 h-10 text-blue-600" />
                        </div>
                    ) : filteredBookings.length === 0 ? (
                        <div className="py-10">
                            <EmptyState
                                title="Chưa có đơn đặt phòng nào"
                                description="Bạn chưa có chuyến đi nào trong mục này."
                            />
                            <div className="text-center mt-6">
                                <Button size="lg" onClick={() => navigate("/hotels")}>
                                    Tìm khách sạn ngay
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredBookings.map((b) => (
                                <BookingCard 
                                    key={b.bookingId} 
                                    booking={b} 
                                    onClick={() => handleViewDetails(b)} 
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* --- MODALS --- */}
            <ToastPortal>
                {toast.show && (
                    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999]">
                        <Toast message={toast.msg} type={toast.type} />
                    </div>
                )}
            </ToastPortal>

            <BookingDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                booking={selectedBooking}
                onCancelClick={() => handleStartCancel(selectedBooking)} // Gọi hàm mở modal hủy riêng
                onRefundClick={() => handleOpenRefundModal(selectedBooking)}
            />

            <CancelBookingModal
                open={isCancelModalOpen}
                onClose={() => setIsCancelModalOpen(false)}
                onConfirm={(reason) => handleConfirmCancel(selectedBooking, reason)}
                booking={selectedBooking}
            />

            <RequestRefundModal
                isOpen={isRefundModalOpen}
                onClose={() => setIsRefundModalOpen(false)}
                onConfirm={(data) => handleConfirmRefundRequest(selectedBooking.bookingId, data)}
                booking={selectedBooking}
            />
        </div>
    );
}