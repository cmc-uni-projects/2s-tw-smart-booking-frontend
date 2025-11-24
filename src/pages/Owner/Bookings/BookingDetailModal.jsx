// File: BookingDetailModal.jsx
import React from "react";
import {
    X,
    Phone,
    Mail,
    CreditCard,
    FileText,
    CheckCircle2,
    MapPin,
    Users,
    LogOut // Đã thêm icon LogOut
} from "lucide-react";
import Button from "./components/common/Button";

// Đã thêm prop onCheckOut vào đây
const BookingDetailModal = ({ isOpen, onClose, booking, onCheckOut }) => {
    if (!isOpen || !booking) return null;

    // Format tiền tệ
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    // Tính số đêm (phòng trường hợp data không có sẵn số đêm)
    const nights = Math.ceil((new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24));

    // Hàm xử lý khi bấm nút Trả phòng trong Modal
    const handleModalCheckOut = () => {
        if (onCheckOut) {
            onCheckOut(booking.id); // Gọi hàm trả phòng từ cha
            onClose(); // Đóng modal ngay lập tức
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col animate-in fade-in zoom-in-95 duration-200">
                
                {/* Modal Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Chi tiết đặt phòng</h2>
                        <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                            Mã đặt chỗ: <span className="font-mono font-bold text-[#28A9E0]">{booking.bookingCode || "N/A"}</span>
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* Cột trái: Thông tin khách & Thanh toán */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Thông tin liên hệ */}
                        <section>
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Users size={16} className="text-[#28A9E0]" /> Thông tin khách hàng
                            </h3>
                            <div className="bg-slate-50 p-4 rounded-xl space-y-3 border border-slate-100">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-slate-500 block mb-1">Họ và tên</label>
                                        <p className="font-medium text-slate-900">{booking.customerName}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-500 block mb-1">Số điện thoại</label>
                                        <div className="flex items-center gap-2 text-slate-900">
                                            <Phone size={14} className="text-slate-400"/>
                                            <span className="font-medium">{booking.phone || "Chưa cập nhật"}</span>
                                        </div>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="text-xs text-slate-500 block mb-1">Email</label>
                                        <div className="flex items-center gap-2 text-slate-900">
                                            <Mail size={14} className="text-slate-400"/>
                                            <span className="font-medium">{booking.email || "Chưa cập nhật"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Phương thức thanh toán */}
                        <section>
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <CreditCard size={16} className="text-[#28A9E0]" /> Thanh toán
                            </h3>
                            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-slate-600">Phương thức:</span>
                                    <span className="font-medium text-slate-900 flex items-center gap-2">
                                        {/* Logic hiển thị màu sắc tuỳ loại ví */}
                                        {booking.paymentMethod?.includes("MoMo") && <span className="w-2 h-2 rounded-full bg-pink-500"></span>}
                                        {booking.paymentMethod?.includes("VNPay") && <span className="w-2 h-2 rounded-full bg-blue-500"></span>}
                                        {booking.paymentMethod || "Tại quầy"}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                    <span className="text-slate-600">Trạng thái:</span>
                                    <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold border border-green-200 flex items-center gap-1">
                                        <CheckCircle2 size={12} /> {booking.status || "Đã thanh toán"}
                                    </span>
                                </div>
                            </div>
                        </section>

                        {/* Yêu cầu đặc biệt */}
                        <section>
                             <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <FileText size={16} className="text-[#28A9E0]" /> Yêu cầu đặc biệt
                            </h3>
                            <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl text-slate-700 text-sm italic">
                                "{booking.specialRequest || "Không có yêu cầu đặc biệt nào."}"
                            </div>
                        </section>
                    </div>

                    {/* Cột phải: Tóm tắt phòng */}
                    <div className="md:col-span-1">
                         <div className="bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden sticky top-6">
                            <div className="bg-slate-100 p-4 border-b border-slate-200">
                                <h3 className="font-bold text-slate-800">Tóm tắt phòng</h3>
                            </div>
                            <div className="p-4 space-y-4">
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">Phòng</p>
                                    <p className="text-[#28A9E0] font-bold text-lg">{booking.roomName}</p>
                                    <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                                        <MapPin size={12} /> The Ocean Resort
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    <div>
                                        <p className="text-xs text-slate-400">Nhận phòng</p>
                                        <p className="font-semibold text-slate-700 text-sm">{booking.checkIn}</p>
                                        <p className="text-xs text-slate-400">Từ 14:00</p>
                                    </div>
                                    <div className="text-right border-l border-slate-200 pl-3">
                                        <p className="text-xs text-slate-400">Trả phòng</p>
                                        <p className="font-semibold text-slate-700 text-sm">{booking.checkOut}</p>
                                        <p className="text-xs text-slate-400">Trước 12:00</p>
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm text-slate-600 border-b border-slate-100 pb-4">
                                    <div className="flex justify-between">
                                        <span>Số đêm:</span>
                                        <span className="font-medium">{nights} đêm</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Khách:</span>
                                        <span className="font-medium">{booking.guestCount || "2 khách"}</span>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-slate-600 font-medium">Tổng cộng</span>
                                        <span className="text-xl font-bold text-slate-900">{formatCurrency(booking.totalPrice)}</span>
                                    </div>
                                    <p className="text-right text-xs text-green-600 font-medium">Đã bao gồm thuế và phí</p>
                                </div>
                            </div>
                            
                            {/* PHẦN NÚT BẤM (Đã cập nhật) */}
                            <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col gap-3">
                                <Button 
                                    className="w-full justify-center bg-rose-500 hover:bg-rose-600 text-white shadow-rose-200" 
                                    icon={LogOut}
                                    onClick={handleModalCheckOut}
                                >
                                    Trả phòng ngay
                                </Button>
                                <Button 
                                    variant="outline" 
                                    className="w-full justify-center" 
                                    onClick={onClose}
                                >
                                    Đóng
                                </Button>
                            </div>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingDetailModal;