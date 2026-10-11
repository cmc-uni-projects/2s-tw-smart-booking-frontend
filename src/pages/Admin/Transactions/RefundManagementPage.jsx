import React, { useState, useEffect } from "react";
import { 
  RotateCcw, Search, Loader2 
} from "lucide-react";
import paymentService from "../../../services/payment.service";
import AdminRefundModal from "./components/AdminRefundModal";
import AdminRefundDetailModal from "./components/AdminRefundDetailModal";
import Toast from "../../../components/common/Notification/Toast";
import ToastPortal from "../../../components/common/Notification/ToastPortal";

// Component con hiển thị từng dòng (Đảm bảo bạn đã tạo file này)
import RefundRow from "./components/RefundRow";
import { useTranslation } from "react-i18next";

const RefundManagementPage = () => {
  const { t } = useTranslation();
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("PENDING"); 
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedRefund, setSelectedRefund] = useState(null); 
  const [isDetailOpen, setIsDetailOpen] = useState(false);    
  const [confirmType, setConfirmType] = useState(null);       
  
  const [toast, setToast] = useState({ show: false, message: "", type: "info" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await paymentService.getAllTransactions();
      const data = res.data || res;
      
      const refundList = Array.isArray(data) 
        ? data.filter(t => t.refundInfo !== null)
        : [];
      
      // Sắp xếp: Mới nhất lên đầu
      refundList.sort((a, b) => new Date(b.refundInfo.requestDate) - new Date(a.refundInfo.requestDate));
        
      setRefunds(refundList);
    } catch (error) {
      console.error("Failed to load data:", error);
      showToast(t("admin:RefundManagementPage.failedToLoadData") + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Hàm helper hiển thị Toast
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    // Tự động tắt sau 3 giây
    setTimeout(() => {
      setToast({ show: false, message: "", type: "info" });
    }, 3000);
  };

  const filteredData = refunds.filter(r => {
    const matchStatus = filterStatus === 'ALL' || r.refundInfo?.status === filterStatus;
    const matchSearch = r.bookingId.toString().includes(searchTerm) || 
                        r.refundInfo?.accountHolder?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleViewDetail = (refund) => {
    setSelectedRefund(refund);
    setIsDetailOpen(true);
  };

  const handleTriggerConfirm = (type) => {
    setConfirmType(type); 
  };

  const handleProcessRefund = async (note) => {
    if (!selectedRefund) return;
    const refundRequestId = selectedRefund.refundInfo.id || selectedRefund.paymentId; 

    try {
      await paymentService.processRefundRequest(refundRequestId, confirmType === 'APPROVE', note);
      
      showToast(t("admin:RefundManagementPage.requestProcessedSuccessfully"), "success"); // ✅ Dùng hàm helper
      
      setConfirmType(null);
      setIsDetailOpen(false);
      setSelectedRefund(null);
      fetchData(); 
    } catch (error) {
      showToast(error.message || t("admin:RefundManagementPage.somethingWentWrong"), "error"); // ✅ Dùng hàm helper
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in relative">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <RotateCcw className="text-orange-600" /> {t("admin:RefundManagementPage.refundManagement")}
          </h1>
          <p className="text-slate-500 text-sm">{t("admin:RefundManagementPage.processRefundRequestsAndComplaints")}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder={t("admin:RefundManagementPage.searchByOrderCodeOr")} 
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
          {[
            { id: "PENDING", label: t("admin:RefundManagementPage.pending"), color: "bg-orange-100 text-orange-700 border-orange-200" },
            { id: "APPROVED", label: t("admin:RefundManagementPage.refunded"), color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
            { id: "REJECTED", label: t("admin:RefundManagementPage.rejected"), color: "bg-slate-100 text-slate-600 border-slate-200" },
            { id: "ALL", label: t("admin:RefundManagementPage.all"), color: "bg-white text-slate-600 border-slate-200 hover:bg-slate-50" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap border ${
                filterStatus === tab.id
                  ? tab.color + " shadow-sm ring-1 ring-inset ring-black/5"
                  : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {tab.label}
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
                <th className="px-6 py-4">{t("admin:RefundManagementPage.orderCode")}</th>
                <th className="px-6 py-4">{t("admin:RefundManagementPage.requestDate")}</th>
                <th className="px-6 py-4">{t("admin:RefundManagementPage.amountToRefund")}</th>
                <th className="px-6 py-4">{t("admin:RefundManagementPage.accountHolder")}</th>
                <th className="px-6 py-4 text-center">{t("admin:RefundManagementPage.status")}</th>
                <th className="px-6 py-4 text-right">{t("admin:RefundManagementPage.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="6" className="p-8 text-center text-slate-500"><Loader2 className="animate-spin mx-auto"/></td></tr>
              ) : filteredData.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-slate-500 italic">{t("admin:RefundManagementPage.noRequestsFound")}</td></tr>
              ) : (
                filteredData.map((item) => (
                  <RefundRow 
                    key={item.paymentId} 
                    item={item} 
                    onViewDetail={handleViewDetail} 
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AdminRefundDetailModal 
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        refund={selectedRefund}
        onApprove={() => handleTriggerConfirm('APPROVE')}
        onReject={() => handleTriggerConfirm('REJECT')}
      />

      <AdminRefundModal 
        isOpen={!!confirmType} 
        onClose={() => setConfirmType(null)}
        onConfirm={handleProcessRefund}
        type={confirmType}
      />

      {/* ✅ FIX TOAST: Thêm vị trí cố định để Toast luôn nổi lên trên */}
      <ToastPortal>
        {toast.show && (
            <div className="fixed bottom-5 right-5 z-[9999] animate-slideInRight">
                <Toast 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={() => setToast({ ...toast, show: false })} 
                />
            </div>
        )}
      </ToastPortal>
    </div>
  );
};

export default RefundManagementPage;
