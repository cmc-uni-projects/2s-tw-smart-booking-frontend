// src/pages/Admin/Transactions/components/AdminRefundDetailModal.jsx
import React, { useEffect } from "react";
import ModalPortal from "@/components/common/Modal/ModalPortal";
import {
  X, FileText, CreditCard, User, Calendar,
  CheckCircle, XCircle, AlertTriangle, Copy,
  Check, Ban
} from "lucide-react";
import Button from "@/components/common/Button/Button";
import { useTranslation } from "react-i18next";

const AdminRefundDetailModal = ({ isOpen, onClose, refund, onApprove, onReject }) => {
  const { t } = useTranslation();
  useEffect(() => {
    if (!isOpen) return;

    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  if (!isOpen || !refund) return null;

  const { refundInfo, bookingId, amount } = refund;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert(t("admin:AdminRefundDetailModal.copied") + text);
  };

  const formatMoney = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);
  const formatDate = (date) => date ? new Date(date).toLocaleString('vi-VN') : "N/A";
  const handleApproveClick = () => {
    onClose?.();     // ✅ đóng modal detail trước
    onApprove?.();   // ✅ mở modal confirm ở component cha
  };

  const handleRejectClick = () => {
    onClose?.();
    onReject?.();
  };


  return (

    <ModalPortal>
      <div
        className="fixed -inset-[1px] z-[99999] bg-slate-900/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <FileText className="text-blue-600" size={20} />
                  {t("admin:AdminRefundDetailModal.refundRequestDetails")}
                </h3>
                <p className="text-sm text-slate-500 mt-1">{t("admin:AdminRefundDetailModal.orderCode")} <span className="font-mono font-bold text-slate-700">BK-{bookingId}</span></p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar">

              {/* Cảnh báo trạng thái */}
              {refundInfo.status === 'PENDING' ? (
                <div className="bg-orange-50 border border-orange-100 p-4 rounded-lg flex gap-3">
                  <AlertTriangle className="text-orange-600 shrink-0" size={20} />
                  <div>
                    <p className="text-sm font-bold text-orange-800">{t("admin:AdminRefundDetailModal.requestPending")}</p>
                    <p className="text-xs text-orange-600 mt-1">
                      {t("admin:AdminRefundDetailModal.pleaseCheckTheBankDetails")}
                    </p>
                  </div>
                </div>
              ) : (
                <div className={`p-4 rounded-lg flex gap-3 border ${refundInfo.status === 'APPROVED'
                  ? 'bg-emerald-50 border-emerald-100'
                  : 'bg-rose-50 border-rose-100'
                  }`}>
                  {refundInfo.status === 'APPROVED' ? <CheckCircle className="text-emerald-600" /> : <XCircle className="text-rose-600" />}
                  <div>
                    <p className={`text-sm font-bold ${refundInfo.status === 'APPROVED' ? 'text-emerald-800' : 'text-rose-800'}`}>
                      {refundInfo.status === 'APPROVED' ? t("admin:AdminRefundDetailModal.refundedSuccessfully") : t("admin:AdminRefundDetailModal.requestRejected")}
                    </p>
                    <p className="text-xs mt-1 opacity-80">
                      {t("admin:AdminRefundDetailModal.processedAt", { value: formatDate(refundInfo.resolveDate) })}
                    </p>
                  </div>
                </div>
              )}

              {/* Grid Thông tin */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider border-b pb-2">{t("admin:AdminRefundDetailModal.requestInformation")}</h4>

                  {/* ✅ HIỂN THỊ CẢ 2 SỐ TIỀN */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-slate-500">{t("admin:AdminRefundDetailModal.originalAmount")}</p>
                      <p className="text-base font-semibold text-slate-700">{formatMoney(amount)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">{t("admin:AdminRefundDetailModal.toRefund")}</p>
                      <p className="text-xl font-bold text-blue-600">{formatMoney(refundInfo.amount)}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">{t("admin:AdminRefundDetailModal.guestSCancellationRequestReason")}</p>
                    <div className="bg-slate-50 p-3 rounded border border-slate-100 text-sm text-slate-700 italic">
                      "{refundInfo.reason}"
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">{t("admin:AdminRefundDetailModal.requestDate")}</p>
                    <p className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <Calendar size={14} /> {formatDate(refundInfo.requestDate)}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider border-b pb-2">{t("admin:AdminRefundDetailModal.receivingAccount")}</h4>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="bg-white p-2 rounded shadow-sm text-blue-600">
                        <CreditCard size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-slate-500">{t("admin:AdminRefundDetailModal.bank")}</p>
                        <p className="font-bold text-slate-800">{refundInfo.bankName || t("admin:AdminRefundDetailModal.noData")}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-white p-2 rounded shadow-sm text-purple-600">
                        <User size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-slate-500">{t("admin:AdminRefundDetailModal.accountHolder")}</p>
                        <p className="font-bold text-slate-800 uppercase">{refundInfo.accountHolder || "---"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-white p-2 rounded shadow-sm text-emerald-600">
                        <FileText size={20} />
                      </div>
                      <div className="flex-1 group cursor-pointer" onClick={() => handleCopy(refundInfo.accountNumber)}>
                        <p className="text-xs text-slate-500">{t("admin:AdminRefundDetailModal.accountNumber")}</p>
                        <p className="font-mono font-bold text-lg text-slate-800 flex items-center gap-2">
                          {refundInfo.accountNumber || "---"}
                          {refundInfo.accountNumber && <Copy size={14} className="text-slate-400 group-hover:text-blue-500" />}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {refundInfo.adminNote && (
                <div className="mt-4">
                  <p className="text-xs text-slate-500 mb-1">{t("admin:AdminRefundDetailModal.adminNote")}</p>
                  <div className="bg-gray-100 p-3 rounded text-sm text-gray-700">
                    {refundInfo.adminNote}
                  </div>
                </div>
              )}

            </div>

            {/* Footer Actions */}
            {refundInfo.status === 'PENDING' && (
              <div className="p-5 border-t bg-slate-50 flex justify-end gap-3">
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white shadow-red-100 flex items-center gap-2 !border-none"
                  onClick={handleRejectClick}
                >
                  <Ban size={18} />
                  {t("admin:AdminRefundDetailModal.rejectRefund")}
                </Button>

                <Button
                  className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-100 flex items-center gap-2 !border-none"
                  onClick={handleApproveClick}
                >
                  <Check size={18} />
                  {t("admin:AdminRefundDetailModal.confirmRefund")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>


    </ModalPortal>
  );
};

export default AdminRefundDetailModal;