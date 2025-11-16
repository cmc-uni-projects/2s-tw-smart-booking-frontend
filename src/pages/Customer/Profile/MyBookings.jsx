// src/pages/Customer/Profile/MyBookings.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/common/Card/Card";
import { CalendarDays, MapPin, Loader2, FileText, Search } from "lucide-react";
import Button from "@/components/common/Button/Button";
import Toast from "@/components/common/Notification/Toast";
import ToastPortal from "@/components/common/Notification/ToastPortal";
import { bookingService } from "@/services/booking.service";
import BookingDetailModal from "./BookingDetailModal";
import CancelBookingModal from "./CancelBookingModal";
import TabsComponent from "@/components/common/Tabs/TabsComponent";
import EmptyState from "@/components/common/EmptyState/EmptyState";

// Dữ liệu mẫu (Đã cập nhật)
const mockBookingsData = [
    {
        id: 1,
        code: "TM-12345",
        hotelName: "The Ocean Resort (Mock)",
        roomName: "Phòng Deluxe Hướng Biển",
        location: "Đà Nẵng",
        checkInDate: "2025-11-20",
        checkOutDate: "2025-11-25",
        totalPrice: 8200000,
        status: "CONFIRMED",
        imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80",
        roomCount: 2,
        adults: 2,
        children: 1,
        pets: true,
        cancellationPolicy: "Miễn phí hủy trước 18/11/2025. Hủy sau thời gian này sẽ mất 50% phí.",
        paymentMethod: "VNPay" // ✅ THÊM MỚI
    },
    {
        id: 2,
        code: "TM-67890",
        hotelName: "Hanoi Grand Hotel (Mock)",
        roomName: "Phòng Standard",
        location: "Hà Nội",
        checkInDate: "2025-12-01",
        checkOutDate: "2025-12-03",
        totalPrice: 4200000,
        status: "PENDING",
        imageUrl: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        roomCount: 1,
        adults: 2,
        children: 0,
        pets: false,
        cancellationPolicy: "Hủy trong vòng 24h trước check-in sẽ mất 100% phí.",
        paymentMethod: "Momo" // ✅ THÊM MỚI
    },
    {
        id: 3,
        code: "TM-54321",
        hotelName: "Sapa Mountain View (Mock)",
        roomName: "Bungalow Mây",
        location: "Sapa",
        checkInDate: "2025-10-15",
        checkOutDate: "2025-10-17",
        totalPrice: 2800000,
        status: "CANCELLED",
        imageUrl: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=300&q=80",
        roomCount: 1,
        adults: 1,
        children: 0,
        pets: false,
        cancellationPolicy: "Không hoàn hủy.",
        paymentMethod: "ZaloPay" // ✅ THÊM MỚI
    }
];

const TABS = [
    { id: "upcoming", name: "Sắp tới" },
    { id: "cancelled", name: "Đã hủy" },
    { id: "all", name: "Tất cả" },
];

export default function MyBookings() {
    const [bookings, setBookings] = useState([]); // State gốc
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ show: false, msg: "", type: "info" });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("upcoming");
    const navigate = useNavigate();

    const showToast = (msg, type = "info", duration = 2500) => {
        setToast({ show: true, msg, type });
        setTimeout(() => setToast({ show: false, msg: "", type: "info" }), duration);
    };

    useEffect(() => {
        let mounted = true;
        const load = () => {
            setLoading(true);
            try {
                setTimeout(() => {
                    if (mounted) {
                        setBookings(mockBookingsData);
                        setLoading(false);
                    }
                }, 1000);
            } catch (err) {
                console.error("fetch bookings error:", err);
                showToast("Lỗi kết nối. Vui lòng thử lại.", "error");
                if (mounted) {
                    setLoading(false);
                }
            }
        };
        load();
        return () => { mounted = false; };
    }, []);

    const filteredBookings = useMemo(() => {
        if (activeTab === "upcoming") {
            return bookings.filter(b => b.status === "CONFIRMED" || b.status === "PENDING");
        }
        if (activeTab === "cancelled") {
            return bookings.filter(b => b.status === "CANCELLED");
        }
        return bookings; // "all"
    }, [bookings, activeTab]);

    // (Các hàm renderStatusBadge, handleViewDetails, handleCloseModal, handleStartCancel, handleCloseCancelModal, handleConfirmCancel giữ nguyên)
    const renderStatusBadge = (status) => {
        switch (status) {
            case "CONFIRMED":
                return <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Đã xác nhận</span>;
            case "PENDING":
                return <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">Đang chờ</span>;
            case "CANCELLED":
                return <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">Đã hủy</span>;
            default:
                return <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">{status || "Không rõ"}</span>;
        }
    };

    const handleViewDetails = (booking) => {
        setSelectedBooking(booking);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        if (!isCancelModalOpen) {
            setTimeout(() => {
                setSelectedBooking(null);
            }, 300);
        }
    };

    const handleStartCancel = () => {
        setIsModalOpen(false);
        setTimeout(() => {
            setIsCancelModalOpen(true);
        }, 300);
    };

    const handleCloseCancelModal = () => {
        setIsCancelModalOpen(false);
        setTimeout(() => {
            setSelectedBooking(null);
        }, 300);
    };

    const handleConfirmCancel = (booking, reason, otherText) => {
        console.log("🚀 [MOCK API] YÊU CẦU HỦY:", {
            bookingId: booking.id,
            reason: reason,
            details: otherText
        });

        handleCloseCancelModal();
        showToast("Đã gửi yêu cầu hủy đặt phòng (mock)", "success");
    };
    // ------------------------------------

    if (loading) {
        return (
            <div className="py-10 flex justify-center items-center">
                <Loader2 className="animate-spin w-7 h-7 text-gray-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="border-b border-gray-200">
                <TabsComponent
                    tabs={TABS}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />
            </div>

            {filteredBookings.length === 0 ? (
                <div className="py-10">
                    <EmptyState
                        title={bookings.length === 0 ? "Bạn chưa có đơn đặt phòng nào" : "Không tìm thấy đơn đặt phòng"}
                        description={bookings.length === 0 ? "Hãy bắt đầu chuyến đi của bạn và đặt ngay!" : "Không có đơn đặt phòng nào khớp với bộ lọc này."}
                    />
                    {bookings.length === 0 && (
                        <div className="text-center mt-6">
                            <Button
                                size="lg"
                                onClick={() => navigate("/hotels")}
                                leftIcon={<Search size={18} />}
                            >
                                Tìm khách sạn ngay
                            </Button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-6">
                    {filteredBookings.map((b) => (
                        <Card
                            key={b.bookingId || b.id}
                            className={`p-0 overflow-hidden transition-all duration-300 ${
                                b.status === "CANCELLED" ? "opacity-60 grayscale" : ""
                            }`}
                        >
                            <div className="flex flex-col md:flex-row">
                                <div className="flex-shrink-0 w-full md:w-1/3 h-48 md:h-56">
                                    <img
                                        src={b.imageUrl}
                                        alt={b.hotelName}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                                <div className="flex-1 p-5 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-xl font-semibold text-gray-800">
                                                {b.roomName || b.hotelName || "Đặt chỗ"}
                                            </h3>
                                            {renderStatusBadge(b.status)}
                                        </div>
                                        <div className="mt-2 text-sm text-gray-600 space-y-2">
                                            {b.hotelName && (
                                                <div className="flex items-center gap-2">
                                                    <MapPin size={14} className="text-gray-500"/>
                                                    <span>{b.hotelName}{b.location ? ` — ${b.location}` : ""}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2">
                                                <CalendarDays size={14} className="text-gray-500"/>
                                                <span>
                                                    {new Date(b.checkInDate).toLocaleDateString("vi-VN")} → {new Date(b.checkOutDate).toLocaleDateString("vi-VN")}
                                                </span>
                                            </div>
                                            {b.code && (
                                                <div className="flex items-center gap-2">
                                                    <FileText size={14} className="text-gray-500"/>
                                                    <span><span className="font-medium">Mã đặt chỗ:</span> {b.code}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                                        <div className="text-lg text-gray-800">
                                            <span className="font-medium">Tổng tiền: </span>
                                            <span className="font-bold text-blue-600">
                                                {typeof b.totalPrice === "number"
                                                    ? b.totalPrice.toLocaleString("vi-VN")
                                                    : b.totalPrice || "—"}₫
                                            </span>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleViewDetails(b)}
                                        >
                                            Xem chi tiết
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

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