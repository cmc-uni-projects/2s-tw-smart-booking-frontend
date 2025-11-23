import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, MapPin, Loader2, FileText, Search } from "lucide-react";

// Components
import Card from "@/components/common/Card/Card";
import Button from "@/components/common/Button/Button";
import Toast from "@/components/common/Notification/Toast";
import ToastPortal from "@/components/common/Notification/ToastPortal";
import TabsComponent from "@/components/common/Tabs/TabsComponent";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import AccountMenu from "./AccountMenu"; // ✅ Import AccountMenu

// Modals
import BookingDetailModal from "./BookingDetailModal";
import CancelBookingModal from "./CancelBookingModal";

// Services & Context
import bookingService from "@/services/booking.service";
import { useAuth } from "@/context/AuthContext";

// Helpers
const BASE_URL = "http://localhost:8386"; 
const getFullImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/300x200?text=No+Image";
    if (path.startsWith("http")) return path;
    return `${BASE_URL}/uploads/${path}`;
};

const TABS = [
    { id: "upcoming", name: "Sắp tới" },
    { id: "cancelled", name: "Đã hủy" },
    { id: "all", name: "Tất cả" },
];

export default function MyBookings() {
    const navigate = useNavigate();
    const { currentUser } = useAuth(); 

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ show: false, msg: "", type: "info" });
    
    // Modals State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    
    const [activeTab, setActiveTab] = useState("upcoming");

    const showToast = (msg, type = "info") => {
        setToast({ show: true, msg, type });
        setTimeout(() => setToast({ show: false, msg: "", type: "info" }), 3000);
    };

    // --- 1. FETCH DATA ---
    const fetchBookings = async () => {
        if (!currentUser) return;
        setLoading(true);
        try {
            const data = await bookingService.getBookingsByUserId(currentUser.userId);
            
            const mappedData = data.map(b => ({
                bookingId: b.bookingId,
                code: `BK-${b.bookingId}`,
                hotelName: b.propertyName,
                location: b.propertyAddress,
                imageUrl: getFullImageUrl(b.propertyImage),
                roomName: b.roomName,
                checkInDate: b.checkInDate,
                checkOutDate: b.checkOutDate,
                totalPrice: b.totalPrice,
                status: b.status,
                guestCount: b.guestCount,
                penaltyAmount: b.penaltyAmount,
                refundAmount: b.refundAmount
            }));

            mappedData.sort((a, b) => new Date(b.checkInDate) - new Date(a.checkInDate));
            setBookings(mappedData);
        } catch (err) {
            console.error("Fetch error:", err);
            showToast("Lỗi tải lịch sử đặt phòng.", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [currentUser]);

    // --- 2. FILTER LOGIC ---
    const filteredBookings = useMemo(() => {
        if (activeTab === "upcoming") {
            return bookings.filter(b => 
                b.status === "CONFIRMED" || 
                b.status === "PENDING_PAYMENT" || 
                b.status === "PENDING"
            );
        }
        if (activeTab === "cancelled") {
            return bookings.filter(b => b.status === "CANCELLED");
        }
        return bookings; 
    }, [bookings, activeTab]);

    // --- 3. HANDLERS ---
    const handleViewDetails = (booking) => {
        setSelectedBooking(booking);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedBooking(null), 300);
    };

    const handleStartCancel = () => {
        setIsModalOpen(false);
        setTimeout(() => setIsCancelModalOpen(true), 300);
    };

    const handleCloseCancelModal = () => {
        setIsCancelModalOpen(false);
        setTimeout(() => setSelectedBooking(null), 300);
    };

    const handleConfirmCancel = async (booking, reason, otherText) => {
        try {
            await bookingService.cancelBooking(booking.bookingId);
            showToast("Hủy đặt phòng thành công!", "success");
            fetchBookings(); 
        } catch (err) {
            console.error("Cancel error:", err);
            showToast(err.message || "Lỗi khi hủy đơn.", "error");
        } finally {
            handleCloseCancelModal();
        }
    };

    const renderStatusBadge = (status) => {
        switch (status) {
            case "CONFIRMED":
                return <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">Đã xác nhận</span>;
            case "PENDING_PAYMENT":
            case "PENDING":
                return <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 border border-yellow-200">Chờ thanh toán</span>;
            case "CANCELLED":
                return <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">Đã hủy</span>;
            case "COMPLETED":
                return <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">Hoàn thành</span>;
            default:
                return <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">{status}</span>;
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            {/* ✅ LAYOUT GRID 2 CỘT GIỐNG TRANSACTION HISTORY */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* CỘT TRÁI: MENU */}
                <div className="lg:col-span-3">
                    <AccountMenu
                        activeSection="my-bookings" // Đánh dấu mục đang chọn
                        onSelect={(path) => navigate(`/customer/${path}`)}
                        userData={currentUser}
                    />
                </div>

                {/* CỘT PHẢI: NỘI DUNG */}
                <div className="lg:col-span-9 space-y-6">
                    
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Đặt chỗ của tôi</h2>
                            <p className="text-gray-500 text-sm">Quản lý các chuyến đi sắp tới và lịch sử đặt phòng.</p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-gray-200">
                        <TabsComponent tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
                    </div>

                    {/* Loading State */}
                    {loading ? (
                        <div className="py-20 flex justify-center"><Loader2 className="animate-spin w-8 h-8 text-blue-600" /></div>
                    ) : filteredBookings.length === 0 ? (
                        /* Empty State */
                        <div className="py-10">
                            <EmptyState
                                title="Chưa có đơn đặt phòng nào"
                                description="Bạn chưa có chuyến đi nào trong mục này. Hãy khám phá ngay!"
                            />
                            <div className="text-center mt-6">
                                <Button size="lg" onClick={() => navigate("/hotels")} leftIcon={<Search size={18} />}>
                                    Tìm khách sạn ngay
                                </Button>
                            </div>
                        </div>
                    ) : (
                        /* List Bookings */
                        <div className="space-y-4">
                            {filteredBookings.map((b) => (
                                <Card
                                    key={b.bookingId}
                                    className={`p-0 overflow-hidden border hover:shadow-md transition-all duration-300 group ${
                                        b.status === "CANCELLED" ? "opacity-70 grayscale-[0.5]" : ""
                                    }`}
                                >
                                    <div className="flex flex-col md:flex-row">
                                        {/* Ảnh trái */}
                                        <div className="w-full md:w-1/3 h-48 md:h-auto relative overflow-hidden">
                                            <img
                                                src={b.imageUrl}
                                                alt={b.hotelName}
                                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                                onError={(e) => e.target.src = "https://via.placeholder.com/300x200?text=No+Image"}
                                            />
                                            <div className="absolute top-3 left-3">
                                                {renderStatusBadge(b.status)}
                                            </div>
                                        </div>

                                        {/* Nội dung phải */}
                                        <div className="flex-1 p-5 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="text-lg font-bold text-gray-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
                                                        {b.hotelName}
                                                    </h3>
                                                    <span className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded">
                                                        #{b.bookingId}
                                                    </span>
                                                </div>

                                                <div className="space-y-2 text-sm text-gray-600">
                                                    <div className="flex items-center gap-2">
                                                        <MapPin size={14} className="text-gray-400"/>
                                                        <span className="truncate">{b.location || "Việt Nam"}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <CalendarDays size={14} className="text-gray-400"/>
                                                        <span>
                                                            {new Date(b.checkInDate).toLocaleDateString("vi-VN")} → {new Date(b.checkOutDate).toLocaleDateString("vi-VN")}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <FileText size={14} className="text-gray-400"/>
                                                        <span>{b.roomName}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col md:flex-row md:justify-between md:items-end mt-4 pt-4 border-t border-gray-100 gap-3">
                                                <div>
                                                    <span className="text-xs text-gray-500 block">Tổng thanh toán</span>
                                                    <span className="text-lg font-bold text-blue-600">
                                                        {new Intl.NumberFormat('vi-VN').format(b.totalPrice)}₫
                                                    </span>
                                                </div>
                                                
                                                <div className="flex gap-2 w-full md:w-auto">
                                                    {b.status === "PENDING_PAYMENT" && (
                                                        <Button 
                                                            size="sm" 
                                                            className="bg-green-600 hover:bg-green-700 text-white flex-1 md:flex-none"
                                                            onClick={() => navigate(`/booking/payment/${b.bookingId}`)}
                                                        >
                                                            Thanh toán ngay
                                                        </Button>
                                                    )}
                                                    
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="flex-1 md:flex-none"
                                                        onClick={() => handleViewDetails(b)}
                                                    >
                                                        Xem chi tiết
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modals & Toast */}
            <ToastPortal>
                {toast.show && (
                    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999]">
                        <Toast message={toast.msg} type={toast.type} />
                    </div>
                )}
            </ToastPortal>

            <BookingDetailModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                booking={selectedBooking}
                onCancelClick={handleStartCancel}
            />

            <CancelBookingModal
                open={isCancelModalOpen}
                onClose={handleCloseCancelModal}
                onConfirm={handleConfirmCancel}
                booking={selectedBooking}
            />
        </div>
    );
}