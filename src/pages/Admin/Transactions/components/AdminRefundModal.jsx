import React, { useEffect, useState } from "react";
import { X, CheckCircle, XCircle, AlertTriangle, Send } from "lucide-react";
import Button from "@/components/common/Button/Button";
import ModalPortal from "@/components/common/Modal/ModalPortal";
import { useTranslation } from "react-i18next";

const AdminRefundModal = ({ isOpen, onClose, onConfirm, type }) => {
  const { t } = useTranslation();
  const [note, setNote] = useState("");
  const isApprove = type === "APPROVE";

  // ✅ Lock scroll nền khi mở modal
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

  // ✅ Reset note mỗi lần mở (tuỳ bạn thích, không ảnh hưởng logic confirm)
  useEffect(() => {
    if (isOpen) setNote("");
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    onConfirm(note);
    setNote("");
  };

  return (
    <ModalPortal>
      <div
        className="fixed -inset-[1px] z-[99999] bg-slate-900/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      >
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className={[
                "p-4 border-b flex justify-between items-center",
                isApprove
                  ? "bg-emerald-50 border-emerald-100"
                  : "bg-rose-50 border-rose-100",
              ].join(" ")}
            >
              <h3
                className={[
                  "text-lg font-bold flex items-center gap-2",
                  isApprove ? "text-emerald-700" : "text-rose-700",
                ].join(" ")}
              >
                {isApprove ? <CheckCircle size={20} /> : <XCircle size={20} />}
                {isApprove ? t("admin:AdminRefundModal.confirmApproval") : t("admin:AdminRefundModal.confirmRejection")}
              </h3>

              <button
                onClick={onClose}
                className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-white/60 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {isApprove ? (
                <div className="bg-emerald-50 p-3 rounded-xl text-emerald-800 text-sm flex gap-2 border border-emerald-100">
                  <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                  <p>
                    {t("admin:AdminRefundModal.theStatusWillChangeTo")} <strong>{t("admin:AdminRefundModal.refunded")}</strong>{t("admin:AdminRefundModal.makeSureYouHaveSuccessfully")}
                  </p>
                </div>
              ) : (
                <div className="bg-rose-50 p-3 rounded-xl text-rose-800 text-sm flex gap-2 border border-rose-100">
                  <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                  <p>
                    {t("admin:AdminRefundModal.theRequestWillBeCancelled")}{" "}
                    <strong>{t("admin:AdminRefundModal.paid")}</strong>.
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {t("admin:AdminRefundModal.transactionNote")} <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                  rows={3}
                  placeholder={
                    isApprove
                      ? t("admin:AdminRefundModal.enterTheBankTransactionCode")
                      : t("admin:AdminRefundModal.enterTheRejectionReason")
                  }
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t bg-slate-50 flex justify-end gap-3">
              <Button
                className={[
                  "flex items-center gap-2 text-white !border-none shadow-md",
                  isApprove
                    ? "bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300"
                    : "bg-red-600 hover:bg-red-700 disabled:bg-red-300",
                ].join(" ")}
                onClick={handleSubmit}
                disabled={!note.trim()}
              >
                {isApprove ? <Send size={18} /> : <XCircle size={18} />}
                {isApprove ? t("admin:AdminRefundModal.moneyTransferred") : t("admin:AdminRefundModal.rejectRefund")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};

export default AdminRefundModal;
