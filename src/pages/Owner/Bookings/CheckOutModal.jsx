// File: CheckOutModal.jsx
import React, { useState, useEffect } from "react";
import { X, LogOut, CheckCircle, Printer, Home, User } from "lucide-react";
import Button from "./components/common/Button";

const CheckOutModal = ({ isOpen, onClose, onConfirm, room }) => {
    const [isSuccess, setIsSuccess] = useState(false);

    // Reset lại trạng thái mỗi khi mở modal lên
    useEffect(() => {
        if (isOpen) {
            setIsSuccess(false);
        }
    }, [isOpen]);

    if (!isOpen || !room) return null;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    // --- LOGIC QUAN TRỌNG Ở ĐÂY ---
    const handleConfirmClick = () => {
        onConfirm();        // 1. Gọi hàm xử lý logic của Cha (xóa data, update api...)
        setIsSuccess(true); // 2. KHÔNG ĐÓNG MODAL, mà chuyển sang màn hình Success
    };

    const handleCloseFull = () => {
        onClose();          // Lúc này mới thực sự đóng Modal
        setTimeout(() => setIsSuccess(false), 200);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col animate-in fade-in zoom-in-95 duration-200 overflow-hidden relative">
                
                {/* Nút đóng */}
                <button 
                    onClick={handleCloseFull} 
                    className="absolute right-4 top-4 p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors z-10"
                >
                    <X size={20} />
                </button>

                {/* --- MÀN HÌNH 1: XÁC NHẬN (ĐỎ) --- */}
                {!isSuccess ? (
                    <>
                        <div className="p-6 text-center">
                            <div className="w-14 h-14 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <LogOut size={28} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Xác nhận trả phòng?</h2>
                            <p className="text-slate-500 text-sm mt-2">
                                Hành động này sẽ cập nhật trạng thái phòng sang "Trống" và ghi nhận doanh thu.
                            </p>
                        </div>

                        <div className="px-6 py-4 bg-slate-50 border-y border-slate-100">
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Phòng:</span>
                                    <span className="font-bold text-slate-800">{room.roomName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Khách hàng:</span>
                                    <span className="font-medium text-slate-800">{room.customerName}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-slate-200 mt-2">
                                    <span className="text-slate-500">Tổng thanh toán:</span>
                                    <span className="font-bold text-rose-600 text-lg">
                                        {formatCurrency(room.totalPrice)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 flex gap-3 bg-white">
                            <Button variant="outline" className="flex-1 justify-center" onClick={handleCloseFull}>
                                Hủy bỏ
                            </Button>
                            <Button 
                                className="flex-1 justify-center bg-rose-500 hover:bg-rose-600 text-white" 
                                onClick={handleConfirmClick}
                            >
                                Đồng ý trả phòng
                            </Button>
                        </div>
                    </>
                ) : (
                    /* --- MÀN HÌNH 2: THÀNH CÔNG (XANH) --- */
                    <>
                        <div className="pt-8 pb-4 flex justify-center bg-white">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-bounce-short">
                                <CheckCircle size={40} className="text-green-500" />
                            </div>
                        </div>
                        <div className="text-center px-6 mb-6">
                            <h2 className="text-xl font-bold text-slate-800">Trả phòng thành công!</h2>
                            <p className="text-slate-500 text-sm mt-1">Giao dịch đã được ghi nhận.</p>
                        </div>
                        {/* Box Hoá đơn tóm tắt */}
                        <div className="mx-6 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                            <div className="space-y-3">
                                <div className="flex justify-between"><span className="text-slate-500 text-sm">Phòng:</span><span className="font-bold text-sm">{room.roomName}</span></div>
                                <div className="flex justify-between"><span className="text-slate-500 text-sm">Khách:</span><span className="font-medium text-sm">{room.customerName}</span></div>
                                <div className="h-px bg-slate-200 my-2"></div>
                                <div className="flex justify-between"><span className="font-medium text-sm">Tổng thu:</span><span className="text-lg font-bold text-[#28A9E0]">{formatCurrency(room.totalPrice)}</span></div>
                            </div>
                        </div>
                        <div className="p-6 flex flex-col gap-3">
                            <Button className="w-full justify-center bg-[#28A9E0]" onClick={handleCloseFull}>Hoàn tất</Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CheckOutModal;