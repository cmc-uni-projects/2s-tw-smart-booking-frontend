import React, { useState, useEffect } from "react";
import Modal from "@/components/common/Modal/Modal";
import Button from "@/components/common/Button/Button";
import TextArea from "@/components/common/Input/TextArea";
import { XCircle , AlertCircle} from "lucide-react";
import CancelReasonSelect from "./CancelReasonSelect.jsx";
import LoadingOverlay from "@/components/common/Loading/LoadingOverlay";
import { useTranslation, Trans } from "react-i18next";

// --- Dữ liệu lý do giữ nguyên ---
const CANCELLATION_REASONS = [
    { value: "NO_CONFIRMATION" },
    { value: "NO_TRUST" },
    { value: "SAFETY_CONCERNS" },
    { value: "FOUND_ELSEWHERE" },
    { value: "POLICY_DISLIKE" },
    { value: "PAYMENT_DISLIKE" },
    { value: "FORCED_CANCEL" },
    { value: "FOUND_CHEAPER_ONLINE" },
    { value: "FOUND_CHEAPER_LOCAL" },
    { value: "NATURAL_DISASTER" },
    { value: "BOOK_ANOTHER" },
    { value: "BOOK_DIRECT" },
    { value: "OTHER" },
];

const Step1_Confirm = ({ onKeep, onContinue }) => {
    const { t } = useTranslation("profile");
    return (
  <div className="px-7 pt-6 pb-6 sm:px-8">
    {/* Hero */}
    <div className="flex items-start gap-4">
      <div className="h-12 w-12 rounded-2xl bg-red-50 ring-1 ring-red-100 flex items-center justify-center shadow-sm">
        <XCircle size={22} className="text-red-600" />
      </div>

      <div className="flex-1">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
          {t("cancel.confirmTitle")}
        </h2>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          <Trans t={t} i18nKey="cancel.confirmText" components={{ b: <span className="font-semibold text-slate-800" /> }} />
        </p>
      </div>
    </div>

    {/* Info cards */}
    <div className="mt-5 space-y-3">
      <div className="rounded-2xl border border-amber-200/60 bg-amber-50/70 p-4">
        <p className="text-sm font-bold text-amber-900 flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-white/70 ring-1 ring-amber-200/60">⚠️</span>
          {t("cancel.beforeTitle")}
        </p>
        <ul className="mt-2 space-y-1.5 text-sm text-amber-900/80 leading-relaxed list-disc list-inside">
          <li>{t("cancel.before1")}</li>
          <li>{t("cancel.before2")}</li>
          <li>{t("cancel.before3")}</li>
        </ul>
      </div>

      <div className="rounded-2xl border border-slate-200/70 bg-slate-50 p-4">
        <p className="text-sm text-slate-700 leading-relaxed">
          <Trans t={t} i18nKey="cancel.tip" components={{ b: <span className="font-semibold" /> }} />
        </p>
      </div>
    </div>

    {/* Actions */}
    <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
      <Button
        onClick={onContinue}
        variant="ghost"
        fullWidth
        className="sm:!w-auto !text-red-600 hover:!bg-red-50"
      >
        {t("cancel.stillCancel")}
      </Button>

      <Button
        onClick={onKeep}
        variant="primary"
        fullWidth
        className="sm:!w-auto shadow-lg shadow-blue-500/20"
      >
        {t("cancel.keep")}
      </Button>
    </div>
  </div>
    );
};

const Step2_Reason = ({ onClose, onConfirmSubmit, booking }) => {
  const { t } = useTranslation("profile");
  const reasons = CANCELLATION_REASONS.map((r) => ({ ...r, label: t(`cancel.reasons.${r.value}`) }));
  const [reasonLabel, setReasonLabel] = useState("");
  const [otherText, setOtherText] = useState("");
  const [error, setError] = useState("");

  const isOther = reasons.find((r) => r.label === reasonLabel)?.value === "OTHER";
  const showOtherInput = isOther;

  const isFreeCancel = booking?.cancellationPolicy?.includes("Miễn phí"); // i18n-ignore (matches backend text)
  const policyText = isFreeCancel ? t("cancel.freeTitle") : t("cancel.feeTitle");
  const policyDesc = isFreeCancel
    ? t("cancel.freeText")
    : booking?.cancellationPolicy || t("cancel.checkPolicy");

  const handleSubmit = () => {
    const selectedOption = reasons.find(r => r.label === reasonLabel);
    const reasonValue = selectedOption ? selectedOption.value : "";

    if (!reasonValue) {
      setError(t("cancel.chooseReason"));
      return;
    }
    if (reasonValue === "OTHER" && !otherText.trim()) {
      setError(t("cancel.otherRequired"));
      return;
    }

    setError("");
    onConfirmSubmit(reasonValue, otherText);
  };

  const isSubmitDisabled =
    !reasonLabel || (isOther && !otherText.trim());

  return (
    <div className="px-6 pt-6 pb-7 sm:px-8 bg-gradient-to-b from-white to-slate-50/40">
      {/* Header */}
      <div className="mb-5">
        <h3 className="text-lg font-extrabold text-slate-900">
          {t("cancel.reasonTitle")}
        </h3>
        <p className="text-sm text-slate-600 mt-1">
          {t("cancel.reasonText")}
        </p>
      </div>

      {/* Main card */}
      <div className="rounded-2xl border border-slate-200/60 bg-white shadow-[0_10px_30px_-20px_rgba(15,23,42,0.25)] p-5 sm:p-6 space-y-4">
        <CancelReasonSelect
          label={t("cancel.reasonLabel")}
          options={reasons}
          value={reasonLabel}
          onChange={(label) => {
            setReasonLabel(label);
            setError("");
          }}
        />

        {showOtherInput && (
          <div className="animate-fadeIn">
            <TextArea
              label={t("cancel.moreDetails")}
              value={otherText}
              onChange={(e) => {
                setOtherText(e.target.value);
                setError("");
              }}
              rows={4}
              error={error && isOther ? error : ""}
            />
          </div>
        )}

        {error && !showOtherInput && (
          <div className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700 flex items-start gap-2">
            <AlertCircle size={18} className="mt-0.5" />
            <span className="font-medium">{error}</span>
          </div>
        )}
      </div>

      {/* Policy */}
      <div
        className={[
          "mt-4 rounded-2xl border p-4 flex items-start gap-3",
          isFreeCancel
            ? "bg-emerald-50/60 border-emerald-200/60"
            : "bg-amber-50/60 border-amber-200/60",
        ].join(" ")}
      >
        <div
          className={[
            "h-10 w-10 rounded-2xl bg-white flex items-center justify-center ring-1",
            isFreeCancel
              ? "text-emerald-600 ring-emerald-200/70"
              : "text-amber-700 ring-amber-200/70",
          ].join(" ")}
        >
          <AlertCircle size={18} />
        </div>

        <div className="flex-1">
          <h4 className="text-sm font-extrabold text-slate-900">
            {policyText}
          </h4>
          <p className="text-sm text-slate-700 mt-1 leading-relaxed">
            {policyDesc}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-7 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
        <Button variant="outline" onClick={onClose} fullWidth className="sm:!w-auto">
          {t("common:actions.close")}
        </Button>

        <Button
          variant="primary"
          className="!bg-red-600 hover:!bg-red-700 disabled:!bg-slate-300 disabled:!opacity-70 shadow-lg shadow-red-500/20 sm:!w-auto"
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
          fullWidth
        >
          {t("cancel.continue")}
        </Button>
      </div>
    </div>
  );
};



export default function CancelBookingModal({ open, onClose, booking, onConfirm }) {
    const { t } = useTranslation("profile");
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (open) {
            setStep(1);
            setIsLoading(false);
        }
    }, [open]);
    useEffect(() => {
  if (!open) return;

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
}, [open]);


    const handleConfirmCancel = async (reasonValue, otherText) => {
        setIsLoading(true);
        try {
            // ✅ SỬA LOGIC: Gọi onConfirm với tham số phù hợp
            // MyBookings đang dùng: onConfirm={(reason) => ...}
            // Nên ta truyền reasonValue (hoặc kết hợp với otherText) vào.
            // Component cha (MyBookings) đã giữ 'selectedBooking' nên không cần truyền lại booking object từ đây.
            await onConfirm(reasonValue, otherText); 
        } catch (error) {
            console.error("Cancellation failed:", error);
        } finally {
            // ✅ SỬA LỖI LOADING: Luôn tắt loading khi kết thúc (dù thành công hay thất bại)
            setIsLoading(false);
        }
    };

    const title = t("cancel.title");

    return (
        <>
            <Modal
                open={open}
                onClose={isLoading ? undefined : onClose}
                title={title}
                maxWidth={step === 1 ? "max-w-2xl" : "max-w-3xl"}
            >
                {step === 1 ? (
                    <Step1_Confirm
                        onKeep={onClose}
                        onContinue={() => setStep(2)}
                    />
                ) : (
                    <Step2_Reason
                        onClose={onClose}
                        onConfirmSubmit={handleConfirmCancel}
                        booking={booking}
                    />
                )}
            </Modal>

            {isLoading && (
                <LoadingOverlay message={t("cancel.processing")} />
            )}
        </>
    );
}