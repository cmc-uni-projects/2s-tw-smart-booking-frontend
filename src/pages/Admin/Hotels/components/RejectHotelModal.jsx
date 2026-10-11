// src/pages/Admin/HotelSubmissions/components/RejectHotelModal.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XCircle } from "lucide-react";
import Button from "@/components/common/Button/Button";
import ModalPortal from "@/components/common/Modal/ModalPortal";
import TextArea from "@/components/common/Input/TextArea";
import { useTranslation } from "react-i18next";

export default function RejectHotelModal({
  open,
  onClose,
  onConfirm,
  application,
}) {
  const { t } = useTranslation();
  const [reason, setReason] = useState("");
  const [error, setError] = useState(false);

  const handleReject = () => {
    if (!reason.trim()) {
      setError(true);
      return;
    }
    setError(false);
    onConfirm(reason);
    onClose();
  };

  if (!open) return null;

  return (
    <ModalPortal>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-[100] bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl p-6 w-[90%] max-w-sm shadow-2xl"
            >
              {/* Header */}
              <div className="flex flex-col items-center gap-3 text-center">
                <XCircle size={32} className="text-red-500" />

                <h3 className="text-lg font-semibold text-gray-800">
                  {t("admin:RejectHotelModal.rejectProperty")}
                </h3>

                <p className="text-gray-500 text-sm">
                  {t("admin:RejectHotelModal.youAreAboutToReject")}{" "}
                  <span className="font-semibold text-gray-800">
                    {application?.hotelName}
                  </span>
                  .
                </p>
              </div>

              {/* Input */}
              <div className="mt-4">
                <TextArea
                  label={t("admin:RejectHotelModal.rejectionReason")}
                  placeholder={t("admin:RejectHotelModal.pleaseStateTheReasonClearly")}
                  rows={4}
                  value={reason}
                  onChange={(e) => {
                    setReason(e.target.value);
                    if (error) setError(false);
                  }}
                  error={error ? t("admin:RejectHotelModal.theRejectionReasonCannotBe") : null}
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="ghost" onClick={onClose}>
                  {t("admin:RejectHotelModal.cancel")}
                </Button>

                <Button
                  variant="primary"
                  className={`text-white ${
                    reason.trim()
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-red-300 cursor-not-allowed"
                  }`}
                  disabled={!reason.trim()}
                  onClick={handleReject}
                >
                  {t("admin:RejectHotelModal.rejected")}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ModalPortal>
  );
}
