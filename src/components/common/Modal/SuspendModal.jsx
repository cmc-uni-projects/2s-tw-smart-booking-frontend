import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import Button from "../Button/Button";
import { useTranslation, Trans } from "react-i18next";

const SuspendModal = ({ isOpen, onClose, onConfirm, title, itemName }) => {
  const { t } = useTranslation();
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Reset form mỗi khi mở modal
  useEffect(() => {
    if (isOpen) {
      setReason("");
      setError("");
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    // 1. Validate chặt chẽ: Cắt khoảng trắng thừa
    if (!reason.trim()) {
      setError(t("suspend.reasonRequired"));
      return;
    }
    
    // 2. Clear lỗi cũ nếu có
    setError("");
    setIsLoading(true);

    try {
      await onConfirm(reason);
      onClose();
    } catch (err) {
      // Giữ modal mở nếu có lỗi từ server trả về
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal 
      open={isOpen} 
      onClose={onClose} 
      title={title || t("suspend.title")}
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        {/* Thông báo cảnh báo */}
        <div className="bg-yellow-50 text-yellow-800 p-3 rounded-lg text-sm border border-yellow-200">
          <Trans t={t} i18nKey="suspend.text" values={{ name: itemName }} components={{ b: <strong /> }} />
          <br />
          {t("suspend.emailNotice")}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            {t("suspend.reason")} <span className="text-red-500">*</span>
          </label>
          <textarea
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:outline-none transition-colors resize-none ${
              error 
                ? "border-red-500 focus:ring-red-200" 
                : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            }`}
            rows={4}
            placeholder={t("suspend.placeholder")}
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (e.target.value.trim()) setError(""); // Xóa lỗi khi người dùng bắt đầu nhập
            }}
          />
          {error && <p className="text-red-500 text-sm mt-1 animate-pulse">{error}</p>}
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-gray-100 mt-2">
          <Button 
            variant="ghost" 
            onClick={onClose} 
            disabled={isLoading}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700"
          >
            {t("actions.cancelLong")}
          </Button>
          
          {/* Nút bị disable nếu chưa nhập lý do */}
          <Button 
            className={`text-white transition-all ${
              !reason.trim() || isLoading
                ? "bg-gray-300 cursor-not-allowed" 
                : "bg-red-600 hover:bg-red-700 shadow-sm"
            }`}
            onClick={handleSubmit} 
            isLoading={isLoading}
            disabled={!reason.trim() || isLoading} // ✅ BẮT BUỘC NHẬP MỚI SÁNG NÚT
          >
            {t("suspend.confirm")}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SuspendModal;