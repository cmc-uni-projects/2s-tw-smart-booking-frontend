// src/pages/Customer/Profile/BookingDetailModal.jsx
import React from 'react';
import Modal from "@/components/common/Modal/Modal";
import Button from "@/components/common/Button/Button";
import {
    CalendarDays, MapPin, Building, BedDouble, User, Hash, CreditCard,
    Package, Users, PawPrint, ShieldAlert, Wallet // ✅ 1. Thêm icon Wallet
} from 'lucide-react';

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

// (Hàm DetailRow giữ nguyên)
const DetailRow = ({ icon, label, children }) => (
    <div className="flex items-start py-3">
        <div className="flex-shrink-0 w-8 text-gray-500 group-hover:text-[rgb(40,169,224)]">
            {icon}
        </div>
        <div className="flex-1">
            <div className="text-sm text-gray-500">{label}</div>
            <div className="text-base font-medium text-gray-800">{children}</div>
        </div>
    </div>
);

export default function BookingDetailModal({ isOpen, onClose, booking, onCancelClick }) {
    if (!booking) {
        return null;
    }

    const checkIn = new Date(booking.checkInDate).toLocaleDateString("vi-VN");
    const checkOut = new Date(booking.checkOutDate).toLocaleDateString("vi-VN");
    const price = booking.totalPrice.toLocaleString("vi-VN") + "₫";

    const {
        roomCount = 1,
        adults = 0,
        children = 0,
        pets = false,
        cancellationPolicy = "Không có thông tin chính sách hủy.",
        paymentMethod = "Chưa rõ" // ✅ 2. Lấy dữ liệu paymentMethod
    } = booking;

    const guestString = `${adults} người lớn` + (children > 0 ? `, ${children} trẻ em` : "");
    const petString = pets ? "Có mang theo" : "Không mang theo";


    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            title="Chi tiết đơn đặt chỗ"
            maxWidth="max-w-4xl"
        >

            {/* Body */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                {/* Cột 1 (Giữ nguyên) */}
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
                    <DetailRow icon={<Package size={18} />} label="Số lượng phòng">
                        {roomCount} phòng
                    </DetailRow>
                    <DetailRow icon={<Users size={18} />} label="Số khách">
                        {guestString}
                    </DetailRow>
                    <DetailRow icon={<PawPrint size={18} />} label="Thú cưng">
                        {petString}
                    </DetailRow>
                </div>

                {/* Cột 2 (Thêm Phương thức thanh toán) */}
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

                    {/* ✅ 3. THÊM MỚI TẠI ĐÂY */}
                    <DetailRow icon={<Wallet size={18} />} label="Phương thức thanh toán">
                        {paymentMethod}
                    </DetailRow>

                    <DetailRow icon={<User size={18} />} label="Trạng thái">
                        {renderStatusBadge(booking.status)}
                    </DetailRow>
                </div>
            </div>

            {/* (Chính sách hủy và Footer giữ nguyên) */}
            <div className="mt-4 pt-4 border-t">
                <DetailRow icon={<ShieldAlert size={18} className="text-yellow-600" />} label="Chính sách hủy">
                    {cancellationPolicy}
                </DetailRow>
            </div>

            <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-200">
                {(booking.status === "CONFIRMED" || booking.status === "PENDING") && (
                    <Button
                        variant="primary"
                        className="!bg-red-600 hover:!bg-red-700 focus:!ring-red-300"
                        onClick={onCancelClick}
                    >
                        Hủy đặt phòng
                    </Button>
                )}
            </div>
        </Modal>
    );
}