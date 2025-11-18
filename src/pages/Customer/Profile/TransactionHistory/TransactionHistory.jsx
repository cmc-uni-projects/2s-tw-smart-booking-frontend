import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AccountMenu from "../AccountMenu";
import { useAuth } from "@/context/AuthContext";

// Import các component con từ thư mục components
import TransactionCard from "./components/TransactionCard";
import TransactionDetailModal from "./components/TransactionDetailModal";
import TransactionTabs from "./components/TransactionTabs"; // ✅ Import component mới

// Dữ liệu Mock
const MOCK_TRANSACTIONS = [
    {
        id: "TRX-241101",
        date: "2025-11-18T08:30:00",
        description: "Thanh toán đặt phòng: The Ocean Resort (Deluxe King)",
        amount: -2500000,
        method: "Ví MoMo",
        status: "SUCCESS"
    },
    {
        id: "TRX-241102",
        date: "2025-11-15T14:20:00",
        description: "Hoàn tiền hủy phòng: Hanoi Grand Hotel",
        amount: 1200000,
        method: "Cổng VNPay",
        status: "SUCCESS"
    },
    {
        id: "TRX-241103",
        date: "2025-11-10T10:00:00",
        description: "Thanh toán giữ chỗ: Dalat Dream",
        amount: -500000,
        method: "Ví ZaloPay",
        status: "PENDING"
    },
    {
        id: "TRX-241104",
        date: "2025-11-09T18:45:00",
        description: "Thanh toán thất bại: Vinpearl Resort Nha Trang",
        amount: -3200000,
        method: "Ví MoMo",
        status: "FAILED"
    },
    {
        id: "TRX-241105",
        date: "2025-11-08T09:15:00",
        description: "Thanh toán lỗi hệ thống: Sapa Jade Hill",
        amount: -1800000,
        method: "Cổng VNPay",
        status: "FAILED"
    },
    {
        id: "TRX-241106",
        date: "2025-11-07T16:30:00",
        description: "Hoàn tiền: Hủy chuyến do bão (Mường Thanh Luxury)",
        amount: 2100000,
        method: "Ví ZaloPay",
        status: "SUCCESS"
    },
    {
        id: "TRX-241107",
        date: "2025-11-05T11:20:00",
        description: "Hoàn tiền cọc: Pullman Saigon Centre",
        amount: 500000,
        method: "Ví MoMo",
        status: "SUCCESS"
    },
    {
        id: "TRX-241108",
        date: "2025-11-01T08:00:00",
        description: "Hoàn tiền dịch vụ: Đưa đón sân bay (Đà Nẵng)",
        amount: 300000,
        method: "Cổng VNPay",
        status: "SUCCESS"
    },
    {
        id: "TRX-241109",
        date: "2025-11-20T09:30:00",
        description: "Thanh toán giữ chỗ: Flamingo Đại Lải Resort",
        amount: -2000000,
        method: "Ví ZaloPay",
        status: "PENDING"
    },
    {
        id: "TRX-241110",
        date: "2025-11-21T15:00:00",
        description: "Hoàn tiền cọc: Sun World Ba Na Hills",
        amount: 800000,
        method: "Ví MoMo",
        status: "REFUNDED"
    }
];

export default function TransactionHistory() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const mockUserData = currentUser || {
        fullName: "Khách hàng Demo",
        email: "demo@travelmate.vn",
        profilePhotoUrl: "https://i.pravatar.cc/150?img=12"
    };

    const [transactions] = useState(MOCK_TRANSACTIONS);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    // State quản lý Tab đang active
    const [activeTab, setActiveTab] = useState("ALL");

    // ✅ Logic lọc dữ liệu theo STATUS (trạng thái)
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
                        userData={mockUserData}
                        isUploadingAvatar={false}
                    />
                </div>

                <div className="lg:col-span-9 space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Lịch sử giao dịch</h2>
                            <p className="text-gray-500 text-sm">Theo dõi dòng tiền và trạng thái thanh toán của bạn.</p>
                        </div>
                    </div>

                    {/* ✅ Sử dụng Component Tabs mới */}
                    <TransactionTabs
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                    />

                    {/* Danh sách Card */}
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
                                <p className="text-gray-500">Không có giao dịch nào cho trạng thái này.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal Chi Tiết */}
            <TransactionDetailModal
                open={!!selectedTransaction}
                onClose={() => setSelectedTransaction(null)}
                transaction={selectedTransaction}
            />
        </div>
    );
}