// src/pages/Customer/Profile/BookingDetailModal.jsx
import React from 'react';
import Modal from "@/components/common/Modal/Modal";
import Button from "@/components/common/Button/Button";
import { X, CalendarDays, MapPin, Building, BedDouble, User, Hash, CreditCard } from 'lucide-react';

// Hàm helper để render Badge (Tương tự MyBookings.jsx)
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

// Hàm helper để render các dòng chi tiết
const DetailRow = ({ icon, label, children }) => (
    <div className="flex items-start py-3">
        <div className="flex-shrink-0 w-8 text-gray-500">{icon}</div>
        <div className="flex-1">
            <div className="text-sm text-gray-500">{label}</div>
            <div className="text-base font-medium text-gray-800">{children}</div>
        </div>
    </div>
);

export default function BookingDetailModal({ isOpen, onClose, booking }) {
    if (!booking) {
        return null;
    }

    const checkIn = new Date(booking.checkInDate).toLocaleDateString("vi-VN");
    const checkOut = new Date(booking.checkOutDate).toLocaleDateString("vi-VN");
    const price = booking.totalPrice.toLocaleString("vi-VN") + "₫";

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        Chi tiết đơn đặt chỗ
                    </h2>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800"
                    >
                        <X size={24} />
                    </Button>
                </div>

                {/* Body */}
                <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-x-8">
                    {/* Cột 1: Thông tin phòng & khách sạn */}
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Thông tin đặt phòng</h3>
                        <DetailRow icon={<Hash size={18} />} label="Mã đặt chỗ">
                            {booking.code}
                        </DetailRow>
                        <DetailRow icon={<Building size={18} />} label="Khách sạn">
                            {booking.hotelName}
                        </DetailRow>
                        <DetailRow icon={<MapPin size={18} />} label="Địa chỉ">
                            {booking.location}
                        </DetailRow>
                        <DetailRow icon={<BedDouble size={18} />} label="Loại phòng">
                            {booking.roomName}
                        </DetailRow>
                    </div>

                    {/* Cột 2: Thời gian & Thanh toán */}
                    <div className="space-y-2 mt-6 md:mt-0">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Chi tiết</h3>
                        <DetailRow icon={<CalendarDays size={18} />} label="Nhận phòng">
                            {checkIn}
                        </DetailRow>
                        <DetailRow icon={<CalendarDays size={18} />} label="Trả phòng">
                            {checkOut}
                        </DetailRow>
                        <DetailRow icon={<CreditCard size={18} />} label="Tổng thanh toán">
                            <span className="text-xl font-bold text-blue-600">{price}</span>
                        </DetailRow>
                        <DetailRow icon={<User size={18} />} label="Trạng thái">
                            {renderStatusBadge(booking.status)}
                        </DetailRow>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-200">
                    <Button variant="outline" onClick={onClose}>
                        Đóng
                    </Button>
                    {/* Nút Hủy phòng (nếu trạng thái cho phép) */}
                    {booking.status === "CONFIRMED" && (
                        <Button variant="danger" onClick={() => alert("Chức năng Hủy phòng (TODO)")}>
                            Hủy đặt phòng
                        </Button>
                    )}
                </div>
            </div>
        </Modal>
    );
}