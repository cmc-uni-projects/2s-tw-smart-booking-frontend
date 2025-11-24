import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AccountMenu from "../AccountMenu";
import { useAuth } from "@/context/AuthContext";
import paymentService from "@/services/payment.service"; // ✅ Import service
import { format } from "date-fns";

import TransactionCard from "./components/TransactionCard";
import TransactionDetailModal from "./components/TransactionDetailModal";
import TransactionTabs from "./components/TransactionTabs";
import Spinner from "@/components/common/Loading/Spinner"; // ✅ Import Spinner nếu có

export default function TransactionHistory() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [activeTab, setActiveTab] = useState("ALL");

    // ✅ 1. Fetch Data từ API
    useEffect(() => {
        const fetchHistory = async () => {
            if (!currentUser) return;
            setLoading(true);
            try {
                const data = await paymentService.getHistoryByUser(currentUser.userId); // Lưu ý: dùng userId hay id tùy AuthContext
                
                // Map dữ liệu Backend sang format Frontend cần
                const mappedData = data.map(item => ({
                    id: `TRX-${item.paymentId}`,
                    bookingId: item.bookingId,
                    date: item.paymentDate,
                    description: `Thanh toán đặt phòng: ${item.propertyName}`,
                    amount: -item.amount, // Tiền ra là số âm
                    refunded: item.refundedAmount, // Tiền hoàn (nếu có)
                    method: item.paymentMethod || "Online Payment",
                    status: mapStatus(item.paymentStatus),
                    rawStatus: item.paymentStatus // Giữ status gốc để check logic khác nếu cần
                }));

                setTransactions(mappedData);
            } catch (error) {
                console.error("Failed to load transactions:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [currentUser]);

    // ✅ Helper map status từ Backend (Enum) sang Frontend
    const mapStatus = (backendStatus) => {
        switch (backendStatus) {
            case 'APPROVED': return 'SUCCESS';
            case 'PENDING': return 'PENDING';
            case 'REJECTED': return 'FAILED';
            case 'REFUNDED': return 'REFUNDED';
            default: return 'PENDING';
        }
    };

    // ✅ Logic lọc hiển thị
    const filteredTransactions = transactions.filter(item => {
        if (activeTab === "ALL") return true;
        return item.status === activeTab;
    });

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-3">
                    <AccountMenu
                        activeSection="transactions"
                        onSelect={(path) => navigate(`/customer/${path}`)}
                        userData={currentUser}
                    />
                </div>

                <div className="lg:col-span-9 space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Lịch sử giao dịch</h2>
                            <p className="text-gray-500 text-sm">Theo dõi dòng tiền và trạng thái thanh toán của bạn.</p>
                        </div>
                    </div>

                    <TransactionTabs
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                    />

                    {/* Danh sách Giao dịch */}
                    {loading ? (
                        <div className="flex justify-center py-10"><Spinner /></div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {filteredTransactions.length > 0 ? (
                                filteredTransactions.map((item) => (
                                    <TransactionCard
                                        key={item.id}
                                        transaction={item}
                                        onClick={() => setSelectedTransaction(item)}
                                    />
                                ))
                            ) : (
                                <div className="py-10 text-center bg-white rounded-xl border border-dashed border-gray-300">
                                    <p className="text-gray-500">Không có giao dịch nào.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            <TransactionDetailModal
                open={!!selectedTransaction}
                onClose={() => setSelectedTransaction(null)}
                transaction={selectedTransaction}
            />
        </div>
    );
}
