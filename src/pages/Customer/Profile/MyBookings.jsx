// src/pages/Customer/Profile/MyBookings.jsx
import React, { useEffect, useState } from "react";
import Card from "@/components/common/Card/Card";
import { CalendarDays, MapPin, Loader2, FileText } from "lucide-react";
import Button from "@/components/common/Button/Button";
import Toast from "@/components/common/Notification/Toast";
import ToastPortal from "@/components/common/Notification/ToastPortal";
import { bookingService } from "@/services/booking.service";
import BookingDetailModal from "./BookingDetailModal"; // Import Modal
import CancelBookingModal from "./CancelBookingModal"; // Import Modal Hủy

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
        // --- Thông tin thêm ---
        roomCount: 2,
        adults: 2,
        children: 1,
        pets: true,
        cancellationPolicy: "Miễn phí hủy trước 18/11/2025. Hủy sau thời gian này sẽ mất 50% phí."
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
        imageUrl: "https://images.unsplash.com/photo-1582719478250-c89caE4dc85b?auto=format&fit=crop&w=300&q=80",
        roomCount: 1,
        adults: 2,
        children: 0,
        pets: false,
        cancellationPolicy: "Hủy trong vòng 24h trước check-in sẽ mất 100% phí."
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
        cancellationPolicy: "Không hoàn hủy."
    }
];

export default function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ show: false, msg: "", type: "info" });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

    const showToast = (msg, type = "info", duration = 2500) => {
        setToast({ show: true, msg, type });
        setTimeout(() => setToast({ show: false, msg: "", type: "info" }), duration);
    };

    // ✅ SỬA LỖI LOGIC TRONG useEffect
    useEffect(() => {
        let mounted = true;
        // Bỏ 'async' vì chúng ta đang dùng setTimeout
        const load = () => {
            setLoading(true);
            try {
                // Giả lập API call
                setTimeout(() => {
                    if (mounted) {
                        setBookings(mockBookingsData);
                        setLoading(false); // ✅ GỌI setLoading(false) Ở ĐÂY
                    }
                }, 1000); // Đặt cả hai trong cùng 1 timeout

            } catch (err) {
                console.error("fetch bookings error:", err);
                showToast("Lỗi kết nối. Vui lòng thử lại.", "error");
                if (mounted) {
                    setLoading(false); // ✅ Đặt false nếu có lỗi
                }
            }
            // ❌ Bỏ khối 'finally' có chứa setTimeout
        };

        load();
        return () => { mounted = false; };
    }, []); // Dependency rỗng là đúng

    // (Hàm renderStatusBadge giữ nguyên)
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

    // (Các hàm handler giữ nguyên)
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
        // TODO: Gọi API hủy và fetch lại danh sách booking
    };


    if (loading) {
        return (
            <div className="py-10 flex justify-center items-center">
                <Loader2 className="animate-spin w-7 h-7 text-gray-600" />
            </div>
        );
    }

    if (!bookings || bookings.length === 0) {
        return <div className="py-10 text-center text-gray-500">Bạn chưa có đơn đặt phòng nào.</div>;
    }

    return (
        <div className="space-y-6">
            {bookings.map((b) => (
                <Card key={b.bookingId || b.id} className="p-0 overflow-hidden">
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