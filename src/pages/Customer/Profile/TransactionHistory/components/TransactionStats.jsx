// src/pages/Customer/Profile/TransactionHistory/components/TransactionTable.jsx
import React from "react";
import Table from "@/components/common/Table/Table";
import Badge from "@/components/common/Badge/Badge";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";

// Helper Functions (để nội bộ hoặc tách ra utils nếu cần dùng chung)
const getStatusBadge = (status) => {
    switch (status) {
        case "SUCCESS": return <Badge color="success">Thành công</Badge>;
        case "PENDING": return <Badge color="warning">Đang xử lý</Badge>;
        case "FAILED": return <Badge color="danger">Thất bại</Badge>;
        default: return <Badge color="gray">{status}</Badge>;
    }
};

export default function TransactionTable({ transactions }) {
    if (!transactions || transactions.length === 0) {
        return (
            <div className="py-16 bg-white">
                <EmptyState
                    title="Không tìm thấy giao dịch"
                    description="Thử thay đổi bộ lọc hoặc khoảng thời gian tìm kiếm."
                />
            </div>
        );
    }

    // Chuẩn bị dữ liệu cho Table Component
    const tableData = transactions.map(item => ({
        ...item,
        displayIcon: (
            <div className={`p-2 rounded-full w-fit ${
                item.type === 'REFUND' || item.type === 'DEPOSIT'
                    ? 'bg-green-50 text-green-600'
                    : 'bg-gray-100 text-gray-600'
            }`}>
                {item.type === 'REFUND' || item.type === 'DEPOSIT'
                    ? <ArrowDownLeft size={18} />
                    : <ArrowUpRight size={18} />}
            </div>
        ),
        displayAmount: (
            <span className={`font-bold ${
                item.type === 'REFUND' || item.type === 'DEPOSIT'
                    ? 'text-green-600'
                    : 'text-gray-800'
            }`}>
                {item.amount > 0 ? '+' : ''}{item.amount.toLocaleString('vi-VN')}₫
            </span>
        ),
        displayStatus: getStatusBadge(item.status),
        displayDate: new Date(item.date).toLocaleDateString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        })
    }));

    const columns = [
        { key: "displayIcon", label: "" },
        { key: "id", label: "Mã GD" },
        { key: "displayDate", label: "Thời gian" },
        { key: "description", label: "Nội dung" },
        { key: "method", label: "Phương thức" },
        { key: "displayAmount", label: "Số tiền" },
        { key: "displayStatus", label: "Trạng thái" },
    ];

    return (
        <div className="bg-white min-h-[400px]">
            <Table columns={columns} data={tableData} />
        </div>
    );
}