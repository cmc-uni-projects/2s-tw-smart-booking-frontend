import React from "react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import Modal from "@/components/common/Modal/Modal";
import Badge from "@/components/common/Badge/Badge";
import { Calendar, CreditCard, FileText, Hash } from "lucide-react"; // ❌ Đã xóa import Info

const getStatusBadge = (status) => {
    switch (status) {
        case "SUCCESS": return <Badge color="success">{i18n.t("profile:tx.status.SUCCESS")}</Badge>;
        case "PENDING": return <Badge color="warning">{i18n.t("profile:tx.status.PENDING")}</Badge>;
        case "FAILED": return <Badge color="danger">{i18n.t("profile:tx.status.FAILED")}</Badge>;
        case "REFUNDED": return <Badge color="primary">{i18n.t("profile:tx.status.REFUNDED")}</Badge>;
        default: return <Badge color="gray">{status}</Badge>;
    }
};

const DetailRow = ({ icon, label, value }) => (
    <div className="flex items-start py-3 border-b border-gray-50 last:border-0">
        <div className="text-gray-400 mt-0.5 mr-3">
            {icon}
        </div>
        <div className="flex-1">
            <p className="text-xs text-gray-500 uppercase font-medium mb-0.5">{label}</p>
            <div className="text-gray-800 font-medium text-sm">{value}</div>
        </div>
    </div>
);

export default function TransactionDetailModal({ open, onClose, transaction }) {
    const { t } = useTranslation("profile");
    if (!transaction) return null;

    // Logic màu sắc cho số tiền
    const isIncome = transaction.type === 'REFUND' || transaction.type === 'DEPOSIT';

    const dateObj = new Date(transaction.date);
    const dateTimeStr = dateObj.toLocaleString('vi-VN');

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={t("tx.detailTitle")}
            maxWidth="max-w-lg"
        >
            <div className="space-y-1">
                <div className="text-center py-6 bg-gray-50 rounded-xl mb-4 border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1 font-medium uppercase">{t("tx.amount")}</p>
                    <p className={`text-3xl font-bold ${isIncome ? 'text-green-600' : 'text-gray-900'}`}>
                        {isIncome ? '+' : ''}{transaction.amount.toLocaleString('vi-VN')}₫
                    </p>
                    <div className="mt-3 flex justify-center">
                        {getStatusBadge(transaction.status)}
                    </div>
                </div>

                <DetailRow icon={<Hash size={18} />} label={t("tx.idLabel")} value={<span className="font-mono text-gray-600 tracking-wide">{transaction.id}</span>} />
                <DetailRow icon={<FileText size={18} />} label={t("tx.content")} value={transaction.description} />
                <DetailRow icon={<Calendar size={18} />} label={t("tx.time")} value={dateTimeStr} />
                <DetailRow icon={<CreditCard size={18} />} label={t("tx.method")} value={transaction.method} />

                {/* ❌ Đã xóa dòng DetailRow hiển thị Loại giao dịch ở đây */}
            </div>
        </Modal>
    );
}