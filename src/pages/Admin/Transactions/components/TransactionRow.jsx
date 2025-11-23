import React from 'react';
import { RefreshCw, User, Building, Calendar, Mail, Phone, ArrowRight, AlertCircle } from 'lucide-react';
import Button from '@/components/common/Button/Button';
import Badge from '@/components/common/Badge/Badge';

const TransactionRow = ({ transaction, onViewDetail }) => {
    // Destructure dữ liệu từ API (Dạng phẳng)
    const {
        paymentId, bookingId, userName, userEmail, userPhone,
        propertyName, amount, refundedAmount,
        paymentStatus, paymentDate
    } = transaction || {};

    const formatMoney = (val) => new Intl.NumberFormat('vi-VN').format(val || 0);
    
    const formatDate = (str) => {
        if (!str) return 'N/A';
        return new Date(str).toLocaleDateString('vi-VN', { 
            day: '2-digit', month: '2-digit', year: 'numeric', 
            hour: '2-digit', minute: '2-digit' 
        });
    };

    // Render Badge Trạng thái (Màu sắc theo yêu cầu)
    const renderStatus = () => {
        switch (paymentStatus) {
            case 'APPROVED': 
                return <Badge className="bg-green-100 text-green-700 border-green-200">Thành công</Badge>;
            case 'REFUND_REQUESTED': 
                return (
                    <Badge className="bg-red-100 text-red-700 border-red-200 animate-pulse flex items-center gap-1">
                        <AlertCircle size={12} /> Yêu cầu hoàn tiền
                    </Badge>
                );
            case 'REFUNDED': 
                return <Badge className="bg-purple-100 text-purple-700 border-purple-200">Đã hoàn tiền</Badge>;
            case 'FAILED': 
                return <Badge className="bg-gray-100 text-gray-600 border border-gray-200">Thất bại</Badge>;
            default: 
                return <Badge className="bg-gray-100 text-gray-500">{paymentStatus}</Badge>;
        }
    };

    return (
        <div className="group bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 flex flex-col md:flex-row items-start md:items-center gap-4">
            
            {/* 1. ID & Ngày */}
            <div className="w-full md:w-[15%] shrink-0 flex md:flex-col justify-between md:justify-center gap-1">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">#{paymentId}</span>
                    <span className="text-[10px] font-mono bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded border border-gray-200">
                        BK-{bookingId}
                    </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Calendar size={12} /> {formatDate(paymentDate)}
                </div>
            </div>

            {/* 2. Thông tin Khách hàng */}
            <div className="w-full md:w-[25%] pl-0 md:pl-4 md:border-l border-gray-100">
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 mt-1">
                        <User size={16} />
                    </div>
                    <div className="overflow-hidden min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate" title={userName}>
                            {userName || "Khách vãng lai"}
                        </p>
                        <div className="flex flex-col gap-0.5 mt-0.5">
                            <span className="flex items-center gap-1 text-xs text-gray-500 truncate" title={userEmail}>
                                <Mail size={10}/> {userEmail || "No Email"}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                                <Phone size={10}/> {userPhone || "No Phone"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Thông tin Khách sạn */}
            <div className="w-full md:w-[20%] pl-0 md:pl-4 md:border-l border-gray-100">
                <div className="flex items-center gap-2">
                    <Building size={16} className="text-gray-400 shrink-0" />
                    <span className="text-sm font-medium text-gray-700 truncate" title={propertyName}>
                        {propertyName || "Unknown Hotel"}
                    </span>
                </div>
            </div>

            {/* 4. Số tiền & Trạng thái */}
            <div className="w-full md:w-[25%] flex flex-row md:flex-col justify-between md:justify-center items-center md:items-end pl-0 md:pl-4 md:border-l border-gray-100">
                <div className="text-right">
                    <span className="block text-lg font-bold text-blue-600">{formatMoney(amount)}₫</span>
                    {refundedAmount > 0 && (
                        <span className="block text-xs text-purple-600 font-medium bg-purple-50 px-1.5 py-0.5 rounded mt-0.5">
                            - {formatMoney(refundedAmount)}₫ (Hoàn)
                        </span>
                    )}
                </div>
                <div className="mt-0 md:mt-1">
                    {renderStatus()}
                </div>
            </div>

            {/* 5. Nút Hành động: LUÔN HIỆN NÚT "XEM CHI TIẾT" */}
            <div className="w-full md:w-[15%] flex justify-end pl-0 md:pl-2">
                <Button 
                    variant="outline" 
                    size="sm" 
                    className={`w-full md:w-auto border-gray-200 hover:border-blue-300 hover:text-blue-600 ${
                        paymentStatus === 'REFUND_REQUESTED' ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:border-red-300' : ''
                    }`}
                    onClick={() => onViewDetail(transaction)}
                >
                    {paymentStatus === 'REFUND_REQUESTED' ? (
                        <span className="flex items-center font-bold">
                            <AlertCircle size={14} className="mr-1.5" /> Xử lý
                        </span>
                    ) : (
                        <span className="flex items-center">
                            Xem chi tiết <ArrowRight size={14} className="ml-1" />
                        </span>
                    )}
                </Button>
            </div>

        </div>
    );
};

export default TransactionRow;