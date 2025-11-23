import React from 'react';
import { 
    X, Calendar, CreditCard, User, Phone, Mail, Building, 
    Info, RefreshCw, FileText 
} from 'lucide-react';
import Modal from '@/components/common/Modal/Modal';
import Button from '@/components/common/Button/Button';
import Badge from '@/components/common/Badge/Badge';

export default function AdminTransactionDetailModal({ isOpen, onClose, transaction, onOpenRefund }) {
    if (!transaction) return null;

    const {
        paymentId, bookingId, userName, userEmail, userPhone,
        propertyName, amount, refundedAmount,
        paymentStatus, paymentDate, paymentMethod, note
    } = transaction;

    // Helper render
    const renderStatus = (status) => {
        switch (status) {
            case 'APPROVED': return <Badge className="bg-green-100 text-green-700">Thành công</Badge>;
            case 'REFUND_REQUESTED': return <Badge className="bg-red-100 text-red-700 animate-pulse">Yêu cầu hoàn tiền</Badge>;
            case 'REFUNDED': return <Badge className="bg-purple-100 text-purple-700">Đã hoàn tiền</Badge>;
            default: return <Badge className="bg-gray-100 text-gray-600">{status}</Badge>;
        }
    };

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            title={`Chi tiết giao dịch #${paymentId}`}
            maxWidth="max-w-3xl"
        >
            <div className="space-y-6">
                
                {/* Header Status */}
                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <div>
                        <p className="text-sm text-gray-500">Trạng thái</p>
                        <div className="mt-1">{renderStatus(paymentStatus)}</div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Tổng tiền</p>
                        <p className="text-2xl font-bold text-blue-600">
                            {new Intl.NumberFormat('vi-VN').format(amount)}₫
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Cột Trái: Thông tin chung */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-gray-900 uppercase border-b pb-2">Thông tin chung</h4>
                        
                        <div className="flex items-center gap-3 text-sm">
                            <Calendar size={16} className="text-gray-400"/>
                            <div>
                                <p className="text-gray-500 text-xs">Ngày giao dịch</p>
                                <p className="font-medium text-gray-800">
                                    {paymentDate ? new Date(paymentDate).toLocaleString('vi-VN') : 'N/A'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 text-sm">
                            <CreditCard size={16} className="text-gray-400"/>
                            <div>
                                <p className="text-gray-500 text-xs">Phương thức</p>
                                <p className="font-medium text-gray-800">{paymentMethod || 'N/A'}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 text-sm">
                            <FileText size={16} className="text-gray-400"/>
                            <div>
                                <p className="text-gray-500 text-xs">Mã đặt phòng</p>
                                <p className="font-mono font-medium text-gray-800">BK-{bookingId}</p>
                            </div>
                        </div>
                    </div>

                    {/* Cột Phải: Khách hàng & Khách sạn */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-gray-900 uppercase border-b pb-2">Đối tượng</h4>
                        
                        <div className="flex items-start gap-3 text-sm">
                            <User size={16} className="text-gray-400 mt-1"/>
                            <div>
                                <p className="text-gray-500 text-xs">Khách hàng</p>
                                <p className="font-medium text-gray-800">{userName}</p>
                                <p className="text-xs text-gray-500">{userEmail} • {userPhone}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 text-sm">
                            <Building size={16} className="text-gray-400 mt-1"/>
                            <div>
                                <p className="text-gray-500 text-xs">Khách sạn</p>
                                <p className="font-medium text-gray-800">{propertyName}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Phần Ghi chú (Lý do hoàn tiền nằm ở đây) */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-2">
                        <Info size={16} className="text-blue-500"/> Ghi chú hệ thống / Lý do hoàn tiền
                    </h4>
                    <pre className="text-xs text-gray-600 whitespace-pre-wrap font-sans bg-white p-3 rounded border border-gray-100">
                        {note || "Không có ghi chú."}
                    </pre>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <Button variant="outline" onClick={onClose}>Đóng</Button>
                    
                    {paymentStatus === 'REFUND_REQUESTED' && (
                        <Button 
                            className="bg-red-600 hover:bg-red-700 text-white shadow-md"
                            onClick={() => {
                                onClose(); // Đóng modal chi tiết
                                onOpenRefund(transaction); // Mở modal hoàn tiền
                            }}
                        >
                            <RefreshCw size={16} className="mr-2"/> Tiến hành hoàn tiền
                        </Button>
                    )}
                </div>
            </div>
        </Modal>
    );
}