import React, { useState, useEffect } from "react";
import { 
  RotateCcw, Search, Eye, Loader2 
} from "lucide-react";
import paymentService from "../../../services/payment.service";
import AdminRefundModal from "./components/AdminRefundModal"; // Modal nhập Note (nhỏ)
import AdminRefundDetailModal from "./components/AdminRefundDetailModal"; // Modal chi tiết (lớn)
import Toast from "../../../components/common/Notification/Toast";
import ToastPortal from "../../../components/common/Notification/ToastPortal";

const RefundManagementPage = () => {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("PENDING"); // PENDING, APPROVED, REJECTED
  const [searchTerm, setSearchTerm] = useState("");

  // Modal State
  const [selectedRefund, setSelectedRefund] = useState(null); // Lưu object refund đang xem
  const [isDetailOpen, setIsDetailOpen] = useState(false);    // Trạng thái mở modal chi tiết
  const [confirmType, setConfirmType] = useState(null);       // APPROVE/REJECT để mở modal nhập note
  
  const [toast, setToast] = useState({ show: false, message: "", type: "info" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await paymentService.getAllTransactions();
      const data = res.data || res;
      
      // Lọc ra các giao dịch có thông tin hoàn tiền
      const refundList = Array.isArray(data) 
        ? data.filter(t => t.refundInfo !== null)
        : [];
      
      // Sắp xếp mới nhất lên đầu (dựa vào requestDate)
      refundList.sort((a, b) => new Date(b.refundInfo.requestDate) - new Date(a.refundInfo.requestDate));
        
      setRefunds(refundList);
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter Logic
  const filteredData = refunds.filter(r => {
    const matchStatus = filterStatus === 'ALL' || r.refundInfo?.status === filterStatus;
    const matchSearch = r.bookingId.toString().includes(searchTerm) || 
                        r.refundInfo?.accountHolder?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  // --- HANDLERS ---

  // 1. Mở Modal Chi tiết
  const handleViewDetail = (refund) => {
    setSelectedRefund(refund);
    setIsDetailOpen(true);
  };

  // 2. Từ Modal Chi tiết -> Bấm nút Duyệt/Từ chối -> Mở Modal Xác nhận (Nhập Note)
  const handleTriggerConfirm = (type) => {
    setConfirmType(type); // 'APPROVE' hoặc 'REJECT'
    // Không đóng Detail Modal vội, để Modal Confirm đè lên hoặc đóng Detail tùy ý bạn.
    // Ở đây tôi sẽ giữ Detail Modal ở dưới để context rõ ràng.
  };

  // 3. Thực hiện API Call sau khi nhập Note xong
  const handleProcessRefund = async (note) => {
    if (!selectedRefund) return;
    
    // Giả sử refundInfo chưa có ID, dùng paymentId hoặc bookingId tạm (Backend nên trả về ID của Request)
    // Tốt nhất là: selectedRefund.refundInfo.id
    // Fallback: Dùng paymentId nếu Backend map chưa chuẩn
    const refundRequestId = selectedRefund.refundInfo.id || selectedRefund.paymentId; 

    try {
      await paymentService.processRefundRequest(
        refundRequestId, 
        confirmType === 'APPROVE', 
        note
      );
      
      setToast({ show: true, message: "Xử lý thành công!", type: "success" });
      
      // Đóng tất cả modal
      setConfirmType(null);
      setIsDetailOpen(false);
      setSelectedRefund(null);
      
      fetchData(); // Reload data
    } catch (error) {
      setToast({ show: true, message: error.message || "Có lỗi xảy ra", type: "error" });
    }
  };

  // Format
  const formatMoney = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  const formatDate = (date) => date ? new Date(date).toLocaleDateString('vi-VN') : 'N/A';

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <RotateCcw className="text-orange-600" /> Quản lý Hoàn tiền
          </h1>
          <p className="text-slate-500 text-sm">Xử lý các yêu cầu hoàn tiền và khiếu nại từ khách hàng.</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Tìm theo Mã đơn hoặc Tên chủ tài khoản..." 
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {[
            { id: "PENDING", label: "Chờ xử lý", color: "bg-orange-100 text-orange-700" },
            { id: "APPROVED", label: "Đã hoàn tiền", color: "bg-emerald-100 text-emerald-700" },
            { id: "REJECTED", label: "Từ chối", color: "bg-rose-100 text-rose-700" },
            { id: "ALL", label: "Tất cả", color: "bg-slate-100 text-slate-600" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                filterStatus === tab.id
                  ? tab.color + " shadow-sm ring-1 ring-inset ring-black/5"
                  : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-200"
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
                <th className="px-6 py-4">Mã đơn</th>
                <th className="px-6 py-4">Ngày yêu cầu</th>
                <th className="px-6 py-4">Số tiền</th>
                <th className="px-6 py-4">Chủ tài khoản</th>
                <th className="px-6 py-4 text-center">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="6" className="p-8 text-center text-slate-500"><Loader2 className="animate-spin mx-auto"/></td></tr>
              ) : filteredData.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-slate-500 italic">Không tìm thấy yêu cầu nào.</td></tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item.paymentId} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 font-bold text-blue-600">
                      BK-{item.bookingId}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {formatDate(item.refundInfo?.requestDate)}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800">
                      {formatMoney(item.refundInfo?.amount || 0)}
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium uppercase text-xs">
                      {item.refundInfo?.accountHolder || "---"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {item.refundInfo?.status === 'PENDING' && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-bold">Chờ xử lý</span>
                      )}
                      {item.refundInfo?.status === 'APPROVED' && (
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-bold">Đã duyệt</span>
                      )}
                      {item.refundInfo?.status === 'REJECTED' && (
                        <span className="px-2 py-1 bg-rose-100 text-rose-700 rounded text-xs font-bold">Từ chối</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {/* NÚT XEM CHI TIẾT (Thay cho nút duyệt trực tiếp) */}
                      <button 
                        onClick={() => handleViewDetail(item)}
                        className="p-2 bg-white border border-slate-200 text-slate-500 rounded-lg hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm" 
                        title="Xem chi tiết"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODALS --- */}
      
      {/* 1. Modal Chi tiết (Lớn) */}
      <AdminRefundDetailModal 
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        refund={selectedRefund}
        onApprove={() => handleTriggerConfirm('APPROVE')}
        onReject={() => handleTriggerConfirm('REJECT')}
      />

      {/* 2. Modal Xác nhận nhập Note (Nhỏ) */}
      <AdminRefundModal 
        isOpen={!!confirmType} 
        onClose={() => setConfirmType(null)}
        onConfirm={handleProcessRefund}
        type={confirmType}
      />

      <ToastPortal>
        {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}
      </ToastPortal>
    </div>
  );
};

export default RefundManagementPage;