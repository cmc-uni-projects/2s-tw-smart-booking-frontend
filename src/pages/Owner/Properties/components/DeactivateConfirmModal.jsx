import React, { useState, useEffect } from "react";
import Modal from "@/components/common/Modal/Modal";
import Button from "@/components/common/Button/Button";
import { AlertTriangle, Info } from "lucide-react";
import TextField from "@/components/common/Input/TextField";
import { useTranslation } from "react-i18next"; // Hoặc Input của bạn

const DeactivateConfirmModal = ({ isOpen, onClose, onConfirm, propertyName, isLoading }) => {
  const { t } = useTranslation();
  const [confirmText, setConfirmText] = useState("");
  const REQUIRED_TEXT = "tamngungkinhdoanh";
  const isMatch = confirmText === REQUIRED_TEXT;

  // Reset text khi mở lại modal
  useEffect(() => {
    if (isOpen) setConfirmText("");
  }, [isOpen]);

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={t("owner:DeactivateConfirmModal.confirmBusinessSuspension")}
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        {/* Cảnh báo */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
          <AlertTriangle className="text-red-600 flex-shrink-0" size={24} />
          <div className="text-sm text-red-800">
            <p className="font-bold mb-1">{t("owner:DeactivateConfirmModal.importantActionWarning")}</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>{t("owner:DeactivateConfirmModal.guestsWill")} <strong>{t("owner:DeactivateConfirmModal.notBeAbleToFind")}</strong> "{propertyName}{t("owner:DeactivateConfirmModal.onThePlatform")}</li>
              <li>{t("owner:DeactivateConfirmModal.existingBookingsStayUnchangedBut")}</li>
              <li>{t("owner:DeactivateConfirmModal.youCanTurnBusinessBack")}</li>
            </ul>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-2 items-center text-sm text-blue-800">
          <Info size={18} />
          <span>{t("owner:DeactivateConfirmModal.toContinuePleaseTypeThe")} <strong>{REQUIRED_TEXT}</strong></span>
        </div>

        {/* Input nhập text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("owner:DeactivateConfirmModal.typeConfirmation")}
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
            placeholder={t("owner:DeactivateConfirmModal.type", { REQUIRED_TEXT })}
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            // Chặn copy paste nếu muốn bảo mật cao hơn (tuỳ chọn)
            onPaste={(e) => e.preventDefault()}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {t("owner:DeactivateConfirmModal.cancel")}
          </Button>
          <Button
            variant="danger" // Giả sử bạn có variant này, nếu không dùng className="bg-red-600 text-white..."
            onClick={onConfirm}
            disabled={!isMatch || isLoading}
            isLoading={isLoading}
            className={`transition-all ${!isMatch ? 'opacity-50 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white'}`}
          >
            {t("owner:DeactivateConfirmModal.confirmSuspension")}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeactivateConfirmModal;