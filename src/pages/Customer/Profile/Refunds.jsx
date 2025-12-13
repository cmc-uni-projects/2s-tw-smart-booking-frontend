import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
    RefreshCw, Loader2, Search, Clock, CheckCircle, XCircle, 
    CreditCard, Building2, AlertCircle 
} from "lucide-react";
import { format } from "date-fns";

// Components
import Card from "@/components/common/Card/Card";
import Button from "@/components/common/Button/Button";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import AccountMenu from "./AccountMenu";

// Services & Context
import { useAuth } from "@/context/AuthContext";
import paymentService from "@/services/payment.service";

export default function Refunds() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const [refunds, setRefunds] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- FETCH DATA ---
    useEffect(() => {
        const fetchRefunds = async () => {
            setLoading(true);
            try {
                // 1. Gọi API lấy lịch sử giao dịch của user
                // Endpoint: /api/v1/payments/my-history
                const data = await paymentService.getMyTransactionHistory();
                
                // 2. Xử lý dữ liệu:
                // - Lọc ra các item có refundInfo (tức là đã gửi yêu cầu hoàn tiền)
                // - Map dữ liệu để tiện hiển thị
                const refundList = Array.isArray(data) ? data
                    .filter(item => item.refundInfo != null)
                    .map(item => {
                        const info = item.refundInfo;
                        return {
                            id: info.id,
                            bookingId: item.bookingId,
                            amount: info.amount,
                            reason: info.reason,
                            requestDate: info.requestDate,
                            resolveDate: info.resolveDate,
                            status: info.status, // PENDING, APPROVED, REJECTED
                            adminNote: info.adminNote,
                            // Thông tin ngân hàng
                            bankName: info.bankName,
                            accountNumber: info.accountNumber,
                            accountHolder: info.accountHolder
                        };
                    })
                    // Sắp xếp đơn mới nhất lên đầu
                    .sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate))
                    : [];

                setRefunds(refundList);
            } catch (error) {
                console.error("Failed to load refunds:", error);
            } finally {
                setLoading(false);
            }
        };

        if (currentUser) {
            fetchRefunds();
        }
    }, [currentUser]);

    // Helper: Hiển thị badge trạng thái
    const renderStatusBadge = (status) => {
        switch (status) {
            case 'APPROVED':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-semibold">
                        <CheckCircle size={14} /> Đã hoàn tiền
                    </span>
                );
            case 'REJECTED':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-xs font-semibold">
                        <XCircle size={14} /> Bị từ chối
                    </span>
                );
            default: // PENDING
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-full text-xs font-semibold">
                        <Clock size={14} /> Đang xử lý
                    </span>
                );
        }
    };

    // Helper: Format tiền tệ VNĐ
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    // Helper: Format ngày tháng
    const formatDate = (dateString) => {
        if (!dateString) return "";
        return format(new Date(dateString), "dd/MM/yyyy HH:mm");
    };

    return (
        <div className="max-w-7xl mx-auto p-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* MENU TRÁI */}
                <div className="lg:col-span-3">
                    <AccountMenu
                        activeSection="refunds"
                        onSelect={(path) => navigate(`/customer/${path}`)}
                        userData={currentUser}
                    />
                </div>

                {/* NỘI DUNG PHẢI */}
                <div className="lg:col-span-9 space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">Yêu cầu hoàn tiền</h2>
                            <p className="text-slate-500 text-sm">Quản lý và theo dõi trạng thái các yêu cầu hoàn tiền của bạn.</p>
                        </div>
                    </div>

                    {/* DANH SÁCH YÊU CẦU */}
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                        </div>
                    ) : refunds.length === 0 ? (
                        <div className="py-16">
                            <EmptyState
                                title="Chưa có yêu cầu nào"
                                description="Bạn chưa gửi yêu cầu hoàn tiền nào gần đây."
                            />
                            <div className="text-center mt-6">
                                <Button size="lg" onClick={() => navigate("/customer/my-bookings")} leftIcon={<Search size={18} />}>
                                    Xem lịch sử đặt phòng
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {refunds.map((item) => (
                                <Card key={item.id} className="group relative overflow-hidden bg-white border border-slate-200 rounded-xl p-0 hover:shadow-lg transition-all duration-300">
                                    
                                    {/* --- HEADER: Mã đơn & Trạng thái --- */}
                                    <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row justify-between gap-4 bg-slate-50/50">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                                <RefreshCw size={20} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mã đơn đặt phòng:</span>
                                                    <span className="font-mono font-bold text-slate-800 text-base">#{item.bookingId}</span>
                                                </div>
                                                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                                                    Ngày gửi: {formatDate(item.requestDate)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            {renderStatusBadge(item.status)}
                                        </div>
                                    </div>

                                    {/* --- BODY: Chi tiết --- */}
                                    <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                                        
                                        {/* Cột 1: Thông tin Refund */}
                                        <div className="space-y-4">
                                            <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                                <AlertCircle size={16} className="text-orange-500"/> Chi tiết yêu cầu
                                            </h4>
                                            
                                            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                                                <p className="text-xs text-orange-800/70 font-medium mb-1">Số tiền yêu cầu hoàn:</p>
                                                <p className="text-2xl font-bold text-orange-600">
                                                    {formatCurrency(item.amount)}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-slate-500 font-medium mb-1">Lý do hủy phòng:</p>
                                                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                                    <p className="text-sm text-slate-700 italic">"{item.reason}"</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Cột 2: Thông tin Ngân hàng */}
                                        <div className="space-y-4">
                                            <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                                <CreditCard size={16} className="text-blue-500"/> Tài khoản nhận tiền
                                            </h4>
                                            
                                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                                                <div className="flex justify-between items-center text-sm pb-2 border-b border-slate-100">
                                                    <span className="text-slate-500 flex gap-2 items-center"><Building2 size={14}/> Ngân hàng</span>
                                                    <span className="font-semibold text-slate-800">{item.bankName}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm pb-2 border-b border-slate-100">
                                                    <span className="text-slate-500">Số tài khoản</span>
                                                    <span className="font-mono font-bold text-slate-800 tracking-wide text-md">{item.accountNumber}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-slate-500">Chủ tài khoản</span>
                                                    <span className="font-bold text-slate-800 uppercase">{item.accountHolder}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* --- FOOTER: Phản hồi Admin (Chỉ hiện khi có note) --- */}
                                    {item.adminNote && (
                                        <div className="px-5 py-3 bg-blue-50 border-t border-blue-100 text-sm flex items-start gap-2">
                                            <span className="font-bold text-blue-700 whitespace-nowrap">💬 Phản hồi từ Admin:</span> 
                                            <span className="text-slate-700">{item.adminNote}</span>
                                        </div>
                                    )}
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}