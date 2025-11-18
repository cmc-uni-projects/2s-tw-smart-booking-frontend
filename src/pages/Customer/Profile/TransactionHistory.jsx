import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/common/Card/Card";
import Button from "@/components/common/Button/Button";
import { Download } from "lucide-react";
// Lưu ý đường dẫn import AccountMenu phải lùi ra 2 cấp thư mục
import AccountMenu from "../../AccountMenu";
import { useAuth } from "@/context/AuthContext";

import TransactionFilter from "./components/TransactionFilter";
import TransactionTable from "./components/TransactionTable";

const MOCK_TRANSACTIONS = [
    {
        id: "TRX-241101",
        date: "2025-11-18T08:30:00",
        description: "Thanh toán đặt phòng: The Ocean Resort (Deluxe King)",
        amount: -2500000,
        method: "Thẻ tín dụng (**4242)",
        status: "SUCCESS",
        type: "PAYMENT"
    },
    {
        id: "TRX-241102",
        date: "2025-11-15T14:20:00",
        description: "Hoàn tiền hủy phòng: Hanoi Grand Hotel",
        amount: 1200000,
        method: "Ví TravelMate",
        status: "SUCCESS",
        type: "REFUND"
    },
    {
        id: "TRX-241103",
        date: "2025-11-10T10:00:00",
        description: "Thanh toán giữ chỗ: Dalat Dream",
        amount: -500000,
        method: "Chuyển khoản NH",
        status: "PENDING",
        type: "PAYMENT"
    },
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
    const [filteredData, setFilteredData] = useState(MOCK_TRANSACTIONS);
    const [searchTerm, setSearchTerm] = useState("");
    const [dateRange, setDateRange] = useState({ start: "", end: "" });

    useEffect(() => {
        let result = transactions;

        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            result = result.filter(t =>
                t.id.toLowerCase().includes(lower) ||
                t.description.toLowerCase().includes(lower)
            );
        }

        if (dateRange.start) {
            result = result.filter(t => new Date(t.date) >= new Date(dateRange.start));
        }
        if (dateRange.end) {
            result = result.filter(t => new Date(t.date) <= new Date(dateRange.end));
        }

        setFilteredData(result);
    }, [searchTerm, dateRange, transactions]);

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
                        <Button variant="outline" size="sm" leftIcon={<Download size={16} />}>
                            Xuất sao kê
                        </Button>
                    </div>

                    <Card className="p-0 overflow-hidden shadow-sm border border-gray-200">
                        <TransactionFilter
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                            dateRange={dateRange}
                            onDateChange={setDateRange}
                        />
                        <TransactionTable transactions={filteredData} />
                    </Card>
                </div>
            </div>
        </div>
    );
}