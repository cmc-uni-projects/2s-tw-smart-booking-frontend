import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw, Loader2, Search, Clock, CheckCircle } from "lucide-react";
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
            if (!currentUser) return;
            setLoading(true);
            try {
                const data = await paymentService.getHistoryByUser(currentUser.userId);
                
                // Lọc lấy các giao dịch CÓ HOÀN TIỀN HOẶC ĐANG CHỜ HOÀN
                const refundList = data.filter(item => 
                    item.paymentStatus === 'REFUNDED' || (item.refundedAmount && item.refundedAmount > 0)
                ).map(item => ({
                    id: `RF-${item.paymentId}`,
                    bookingId: item.bookingId,
                    hotelName: item.propertyName,
                    refundAmount: item.refundedAmount || item.amount,
                    date: item.paymentDate,
                    // Logic Status: Nếu paymentStatus = REFUNDED là xong, ngược lại là đang chờ
                    status: item.paymentStatus === 'REFUNDED' ? 'COMPLETED' : 'PENDING',
                    method: item.paymentMethod || "Chuyển khoản"
                }));

                setRefunds(refundList);
            } catch (error) {
                console.error("Failed to load refunds:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRefunds();
    }, [currentUser]);

    return (
        <div className="max-w-7xl mx-auto p-6">
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
                            <h2 className="text-2xl font-bold text-gray-800">Khoản hoàn tiền</h2>
                            <p className="text-gray-500 text-sm">Quản lý các khoản tiền được hoàn lại từ việc hủy đặt phòng.</p>
                        </div>
                    </div>

                    {/* DANH SÁCH */}
                    {loading ? (
                        <div className="flex justify-center py-10"><Loader2 className="animate-spin text-blue-600" /></div>
                    ) : refunds.length === 0 ? (
                        <div className="py-10">
                            <EmptyState
                                title="Chưa có khoản hoàn tiền nào"
                                description="Khi bạn hủy phòng đủ điều kiện hoàn tiền, thông tin sẽ xuất hiện tại đây."
                            />
                            <div className="text-center mt-6">
                                <Button size="lg" onClick={() => navigate("/customer/bookings")} leftIcon={<Search size={18} />}>
                                    Xem đặt chỗ của tôi
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {refunds.map((item) => (
                                <Card key={item.id} className="p-5 border hover:shadow-md transition-all">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className={`p-3 rounded-full ${item.status === 'COMPLETED' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                                <RefreshCw size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-800 text-lg">
                                                    {item.status === 'COMPLETED' ? 'Đã hoàn tiền:' : 'Đang xử lý hoàn tiền:'} {item.hotelName}
                                                </h4>
                                                <p className="text-sm text-gray-500">Mã đặt chỗ: #{item.bookingId} • {item.method}</p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    Ngày cập nhật: {format(new Date(item.date), "dd/MM/yyyy HH:mm")}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="text-right">
                                            <span className={`block text-xl font-bold ${item.status === 'COMPLETED' ? 'text-green-600' : 'text-yellow-600'}`}>
                                                +{new Intl.NumberFormat('vi-VN').format(item.refundAmount)}₫
                                            </span>
                                            
                                            {item.status === 'COMPLETED' ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 mt-1 text-xs font-bold bg-green-100 text-green-700 rounded-md">
                                                    <CheckCircle size={12} /> Đã hoàn tất
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 mt-1 text-xs font-bold bg-yellow-100 text-yellow-700 rounded-md">
                                                    <Clock size={12} /> Chờ xử lý
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}