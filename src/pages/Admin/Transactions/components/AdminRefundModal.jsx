import React, { useState } from 'react';
import { CheckCircle, Copy, AlertTriangle, Landmark, User, Hash, FileText } from 'lucide-react';
import Modal from '@/components/common/Modal/Modal';
import Button from '@/components/common/Button/Button';

export default function AdminRefundModal({ isOpen, onClose, onConfirm, transaction }) {
    const [showToast, setShowToast] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    if (!transaction) return null;

    const refundInfo = transaction.refundRequest || {};

    const originalAmount = transaction.amount || 0;
    const refundAmount = transaction.refundedAmount || 0;
    const penaltyAmount = originalAmount - refundAmount;
    const penaltyPercent = originalAmount > 0 ? Math.round((penaltyAmount / originalAmount) * 100) : 0;

    const formatMoney = (val) => new Intl.NumberFormat('vi-VN').format(val);

    const handleCopy = (text) => {
        if (!text) return;
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
            title="Xác nhận hoàn tiền"
            maxWidth="max-w-md"
        >
            <div className="space-y-5">
                
                {/* 1. SỐ TIỀN CẦN HOÀN */}
                <div className="text-center bg-[rgb(40,169,224)]/5 rounded-xl p-4 border border-[rgb(40,169,224)]/20">
                    <p className="text-xs font-bold text-[rgb(40,169,224)] uppercase tracking-widest mb-1">
                        Số tiền cần chuyển khoản
                    </p>
                    <p className="text-3xl font-bold text-[rgb(40,169,224)] mb-2">
                        {formatMoney(refundAmount)}₫
                    </p>

                    {/* Breakdown */}
                    {penaltyAmount > 0 ? (
                        <div className="inline-flex items-center gap-2 text-xs bg-white px-3 py-1 rounded-full border border-[rgb(40,169,224)]/20 shadow-sm">
                            <span className="text-red-500 font-semibold">
                                -{penaltyPercent}% Phí ({formatMoney(penaltyAmount)})
                            </span>
                            <span className="text-gray-300">|</span>
                            <span className="text-gray-500">
                                Gốc: {formatMoney(originalAmount)}
                            </span>
                        </div>
                    ) : (
                        <div className="text-xs text-[rgb(40,169,224)] font-semibold bg-white px-2 py-1 rounded-full border border-[rgb(40,169,224)]/20 inline-block">
                            Hoàn tiền 100%
                        </div>
                    )}
                </div>

                {/* 2. Cảnh báo */}
                <div className="bg-gray-50 text-gray-600 p-3 rounded-lg border border-gray-200 text-xs flex gap-2 items-start">
                    <AlertTriangle className="shrink-0 w-4 h-4 mt-0.5 text-orange-500" />
                    <p>
                        Vui lòng chuyển khoản thủ công vào STK dưới đây, sau đó ấn <b>"Đã thanh toán"</b>.
                    </p>
                </div>

                {/* 3. Thông tin tài khoản */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className="bg-gray-50 px-3 py-2 border-b border-gray-200 font-bold text-gray-700 text-xs uppercase">
                        Thông tin người nhận
                    </div>
                    
                    <div className="p-3 space-y-3 text-sm">
                        <div className="flex justify-between items-center border-b border-dashed border-gray-100 pb-2">
                            <span className="text-gray-500 flex items-center gap-1.5 text-xs"><Landmark size={14}/> Ngân hàng</span>
                            <span className="font-bold text-gray-900">{refundInfo.bankName || "---"}</span>
                        </div>

                        <div className="flex justify-between items-center border-b border-dashed border-gray-100 pb-2">
                            <span className="text-gray-500 flex items-center gap-1.5 text-xs"><Hash size={14}/> Số tài khoản</span>
                            <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-[rgb(40,169,224)] text-base select-all">
                                    {refundInfo.accountNumber || "---"}
                                </span>
                                {refundInfo.accountNumber && (
                                    <button onClick={() => handleCopy(refundInfo.accountNumber)} className="text-gray-400 hover:text-[rgb(40,169,224)]" title="Sao chép">
                                        <Copy size={14} />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 flex items-center gap-1.5 text-xs"><User size={14}/> Chủ tài khoản</span>
                            <span className="font-bold text-gray-900 uppercase">{refundInfo.accountHolder || "---"}</span>
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                    <Button variant="outline" size="sm" onClick={onClose} disabled={isProcessing}>
                        Hủy
                    </Button>
                    <Button 
                        size="sm"
                        className="bg-[rgb(40,169,224)] hover:bg-blue-500 text-white shadow-md border-none"
                        onClick={handleConfirm}
                        disabled={isProcessing}
                    >
                        <CheckCircle size={16} className="mr-1.5"/>
                        {isProcessing ? "Đang xử lý..." : "Đã thanh toán"}
                    </Button>
                </div>

                {/* Toast */}
                {showToast && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 text-white px-3 py-1.5 rounded text-xs font-medium animate-fade-in shadow-lg z-50">
                        Đã sao chép!
                    </div>
                )}
            </div>
        </Modal>
    );
}