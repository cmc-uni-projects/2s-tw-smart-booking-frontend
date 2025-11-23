import React, { useState } from 'react';
import { CheckCircle, Copy, AlertTriangle, Landmark, User, Hash } from 'lucide-react';
import Modal from '@/components/common/Modal/Modal';
import Button from '@/components/common/Button/Button';
import Toast from '@/components/common/Notification/Toast';

export default function AdminRefundModal({ isOpen, onClose, onConfirm, transaction }) {
    const [showToast, setShowToast] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    if (!transaction) return null;

    // Helper: Trích xuất thông tin từ Note
    // Note format: "... [THÔNG TIN NHẬN TIỀN]: - Ngân hàng: ABC - STK: 123 ..."
    const extractBankInfo = (note) => {
        if (!note) return null;
        const bankMatch = note.match(/Ngân hàng:\s*(.+?)(\n|$)/);
        const stkMatch = note.match(/STK:\s*(.+?)(\n|$)/);
        const ownerMatch = note.match(/Chủ TK:\s*(.+?)(\n|$)/);

        return {
            bankName: bankMatch ? bankMatch[1].trim() : "Không rõ",
            accountNumber: stkMatch ? stkMatch[1].trim() : "Không rõ",
            accountHolder: ownerMatch ? ownerMatch[1].trim() : "Không rõ"
        };
    };

    const bankInfo = extractBankInfo(transaction.note);

    // Copy to clipboard
    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
    };

    const handleConfirm = async () => {
        if(!window.confirm("Bạn xác nhận ĐÃ CHUYỂN KHOẢN thành công cho khách hàng?")) return;
        
        setIsProcessing(true);
        await onConfirm(transaction.bookingId);
        setIsProcessing(false);
        onClose();
    };

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            title="Xác nhận hoàn tiền thủ công"
            maxWidth="max-w-lg"
        >
            <div className="space-y-6">
                {/* Cảnh báo */}
                <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg border border-yellow-200 text-sm flex gap-3">
                    <AlertTriangle className="shrink-0 w-5 h-5" />
                    <p>
                        Vui lòng thực hiện <b>chuyển khoản ngân hàng</b> theo thông tin bên dưới. 
                        Sau khi chuyển khoản thành công, hãy ấn nút <b>"Đã thanh toán"</b> để cập nhật hệ thống.
                    </p>
                </div>

                {/* Số tiền cần hoàn */}
                <div className="text-center py-2">
                    <p className="text-sm text-gray-500 mb-1">Số tiền cần hoàn lại</p>
                    <p className="text-3xl font-bold text-red-600">
                        {new Intl.NumberFormat('vi-VN').format(transaction.refundedAmount || transaction.amount)}₫
                    </p>
                </div>

                {/* Thông tin tài khoản khách */}
                <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                    <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 font-bold text-gray-700 text-sm">
                        Thông tin nhận tiền (Từ khách hàng)
                    </div>
                    <div className="p-4 space-y-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Landmark size={16} /> Ngân hàng
                            </div>
                            <span className="font-bold text-gray-900">{bankInfo?.bankName}</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Hash size={16} /> Số tài khoản
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-blue-700 text-lg">{bankInfo?.accountNumber}</span>
                                <button onClick={() => handleCopy(bankInfo?.accountNumber)} className="text-gray-400 hover:text-blue-600">
                                    <Copy size={14} />
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <User size={16} /> Chủ tài khoản
                            </div>
                            <span className="font-bold text-gray-900 uppercase">{bankInfo?.accountHolder}</span>
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <Button variant="outline" onClick={onClose} disabled={isProcessing}>
                        Hủy bỏ
                    </Button>
                    <Button 
                        className="bg-green-600 hover:bg-green-700 text-white shadow-md pl-3 pr-4"
                        onClick={handleConfirm}
                        disabled={isProcessing}
                    >
                        <CheckCircle size={18} className="mr-2"/>
                        {isProcessing ? "Đang xử lý..." : "Xác nhận Đã thanh toán"}
                    </Button>
                </div>

                {/* Toast nhỏ hiển thị khi copy */}
                {showToast && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-3 py-1 rounded text-xs animate-fade-in-up">
                        Đã sao chép
                    </div>
                )}
            </div>
        </Modal>
    );
}