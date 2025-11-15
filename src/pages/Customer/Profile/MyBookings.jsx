// src/pages/Customer/Profile/MyBookings.jsx
import React, { useEffect, useState } from "react";
import Card from "@/components/common/Card/Card";
import { CalendarDays, MapPin, Loader2 } from "lucide-react";
import Toast from "@/components/common/Notification/Toast";
import ToastPortal from "@/components/common/Notification/ToastPortal";
import { bookingService } from "@/services/booking.service";

/**
 * MyBookings component (section inside Profile)
 * Expects bookingService.getMyBookings() to return { success: true, data: [...] }
 * Booking object fields used: bookingId/id, code, hotelName, roomName, location, checkInDate, checkOutDate, totalPrice, status
 */

export default function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ show: false, msg: "", type: "info" });

    const showToast = (msg, type = "info", duration = 2500) => {
        setToast({ show: true, msg, type });
        setTimeout(() => setToast({ show: false, msg: "", type: "info" }), duration);
    };

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            setLoading(true);
            try {
                const res = await bookingService.getMyBookings();
                if (res && res.success) {
                    if (mounted) setBookings(res.data || []);
                } else {
                    showToast("Không thể tải danh sách đặt chỗ.", "error");
                }
            } catch (err) {
                console.error("fetch bookings error:", err);
                showToast("Lỗi kết nối. Vui lòng thử lại.", "error");
            } finally {
                if (mounted) setLoading(false);
            }
        };

        load();
        return () => { mounted = false; };
    }, []);

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
        <div className="space-y-4">
            {bookings.map((b) => (
                <Card key={b.bookingId || b.id} className="p-4">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">
                                {b.roomName || b.hotelName || "Đặt chỗ"}
                            </h3>

                            <div className="mt-2 text-sm text-gray-600 space-y-1">
                                {b.code && <div><span className="font-medium">Mã đặt chỗ:</span> {b.code}</div>}
                                {b.hotelName && (
                                    <div className="flex items-center gap-2">
                                        <MapPin size={14} />
                                        <span>{b.hotelName}{b.location ? ` — ${b.location}` : ""}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <CalendarDays size={14} />
                                    <span>
                    {b.checkInDate || "-"} → {b.checkOutDate || "-"}
                  </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-start md:items-end gap-2">
                            <div className="text-sm text-gray-600">
                                <div>
                                    <span className="font-medium">Tổng tiền: </span>
                                    <span className="text-blue-600">
                    {typeof b.totalPrice === "number"
                        ? b.totalPrice.toLocaleString()
                        : b.totalPrice || "—"}₫
                  </span>
                                </div>
                            </div>

                            <div>
                <span
                    className={`px-3 py-1 rounded text-sm font-medium ${
                        b.status === "CONFIRMED"
                            ? "bg-green-100 text-green-700"
                            : b.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-700"
                    }`}
                >
                  {b.status || "UNKNOWN"}
                </span>
                            </div>

                            {/* Placeholder cho action button nếu BE hỗ trợ */}
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
        </div>
    );
}
