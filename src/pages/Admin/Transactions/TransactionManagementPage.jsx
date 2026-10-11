import React, { useState, useEffect } from "react";
import { 
  Search, Filter, Download, ArrowUpRight, ArrowDownLeft, Wallet, RefreshCw, CheckCircle, XCircle
} from "lucide-react";
import Button from "../../../components/common/Button/Button";
import paymentService from "../../../services/payment.service";
import { useTranslation } from "react-i18next"; // Cần hàm getAllTransactions

// Badge Status Component
const TransactionStatusBadge = ({ status }) => {
  const { t } = useTranslation();
  const styles = {
    APPROVED: "bg-emerald-100 text-emerald-700 border-emerald-200", // Đã thu tiền
    PAID: "bg-emerald-100 text-emerald-700 border-emerald-200",     // Đã thu tiền
    PENDING: "bg-amber-100 text-amber-700 border-amber-200",         // Đang chờ
    REFUNDED: "bg-purple-100 text-purple-700 border-purple-200",     // Đã chi hoàn tiền
    REFUND_REQUESTED: "bg-orange-100 text-orange-700 border-orange-200", // Đang khiếu nại
    REJECTED: "bg-rose-100 text-rose-700 border-rose-200"            // Thất bại/Từ chối
  };

  const labels = {
    APPROVED: t("admin:TransactionManagementPage.collected"),
    PAID: t("admin:TransactionManagementPage.collected"),
    PENDING: t("admin:TransactionManagementPage.inProgress"),
    REFUNDED: t("admin:TransactionManagementPage.refunded"),
    REFUND_REQUESTED: t("admin:TransactionManagementPage.refundRequested"),
    REJECTED: t("admin:TransactionManagementPage.failed")
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border flex items-center gap-1 w-fit ${styles[status] || "bg-gray-100"}`}>
      {status === 'REFUNDED' ? <ArrowDownLeft size={12}/> : <ArrowUpRight size={12}/>}
      {labels[status] || status}
    </span>
  );
};

const TransactionManagementPage = () => {
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("ALL"); // ALL, IN (Thu), OUT (Chi/Hoàn)

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Gọi API lấy tất cả giao dịch (backend trả về List<PaymentResponseDTO>)
      // Cấu trúc response: { success: true, data: [...] } hoặc [...] tùy API
      const res = await paymentService.getAllTransactions(); 
      const data = res.data || res; 
      setTransactions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter Logic
  const filteredData = transactions.filter(t => {
    const matchSearch = 
      t.transactionReference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.bookingId?.toString().includes(searchTerm);
    
    let matchFilter = true;
    if (filter === 'IN') matchFilter = t.status === 'APPROVED' || t.status === 'PAID';
    if (filter === 'OUT') matchFilter = t.status === 'REFUNDED';
    if (filter === 'PENDING') matchFilter = t.status === 'REFUND_REQUESTED' || t.status === 'PENDING';

    return matchSearch && matchFilter;
  });

  // Tính tổng doanh thu (chỉ tính đơn thành công, trừ đơn đã hoàn)
  const totalRevenue = transactions
    .filter(t => t.status === 'APPROVED' || t.status === 'PAID')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const formatMoney = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  const formatDate = (date) => new Date(date).toLocaleString('vi-VN');

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Wallet className="text-blue-600" /> {t("admin:TransactionManagementPage.cashFlowManagement")}
          </h1>
          <p className="text-slate-500 text-sm">{t("admin:TransactionManagementPage.trackAllOfThePlatform")}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" icon={Download}>{t("admin:TransactionManagementPage.exportReport")}</Button>
          <Button variant="primary" icon={RefreshCw} onClick={fetchData}>{t("admin:TransactionManagementPage.refresh")}</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-sm font-medium">{t("admin:TransactionManagementPage.totalActualIncome")}</p>
            <p className="text-2xl font-bold text-emerald-600">{formatMoney(totalRevenue)}</p>
          </div>
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
            <ArrowUpRight size={20} />
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-sm font-medium">{t("admin:TransactionManagementPage.totalRefunds")}</p>
            <p className="text-2xl font-bold text-purple-600">
              {t("admin:TransactionManagementPage.orders", { length: transactions.filter(t => t.status === 'REFUNDED').length })}
            </p>
          </div>
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
            <ArrowDownLeft size={20} />
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-sm font-medium">{t("admin:TransactionManagementPage.failedTransactions")}</p>
            <p className="text-2xl font-bold text-rose-600">
              {transactions.filter(t => t.status === 'REJECTED').length}
            </p>
          </div>
          <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center text-rose-600">
            <XCircle size={20} />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder={t("admin:TransactionManagementPage.searchByTransactionCodeBooking")} 
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {['ALL', 'IN', 'OUT', 'PENDING'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                filter === f ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f === 'ALL' ? t("admin:TransactionManagementPage.all") : f === 'IN' ? t("admin:TransactionManagementPage.income") : f === 'OUT' ? t("admin:TransactionManagementPage.expenses") : t("admin:TransactionManagementPage.inProgress")}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">{t("admin:TransactionManagementPage.transactionCode")}</th>
                <th className="px-6 py-4">Booking ID</th>
                <th className="px-6 py-4">{t("admin:TransactionManagementPage.duration")}</th>
                <th className="px-6 py-4">{t("admin:TransactionManagementPage.method")}</th>
                <th className="px-6 py-4">{t("admin:TransactionManagementPage.amount")}</th>
                <th className="px-6 py-4 text-center">{t("admin:TransactionManagementPage.status")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="6" className="p-8 text-center text-slate-500">{t("admin:TransactionManagementPage.loadingData")}</td></tr>
              ) : filteredData.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-slate-500">{t("admin:TransactionManagementPage.noTransactionsFound")}</td></tr>
              ) : (
                filteredData.map((t) => (
                  <tr key={t.paymentId} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-slate-700">
                      {t.transactionReference || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-blue-600 font-bold">BK-{t.bookingId}</td>
                    <td className="px-6 py-4 text-slate-600">{formatDate(t.paymentDate)}</td>
                    <td className="px-6 py-4 text-slate-600">{t.paymentMethod || "Unknown"}</td>
                    <td className={`px-6 py-4 font-bold ${
                      t.status === 'REFUNDED' ? 'text-rose-600' : 'text-emerald-600'
                    }`}>
                      {t.status === 'REFUNDED' ? '-' : '+'}{formatMoney(t.amount)}
                    </td>
                    <td className="px-6 py-4 text-center flex justify-center">
                      <TransactionStatusBadge status={t.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionManagementPage;