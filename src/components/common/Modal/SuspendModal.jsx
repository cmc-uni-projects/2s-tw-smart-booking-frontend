// src/components/common/Modal/SuspendModal.jsx
import React, { useState } from "react";
import Modal from "./Modal"; // Component Modal có sẵn của bạn
import Button from "../Button/Button";
import TextArea from "../Input/TextArea"; // Hoặc dùng textarea thường nếu chưa có component này

const SuspendModal = ({ isOpen, onClose, onConfirm, title, itemName }) => {
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!reason.trim()) {
      setError("Vui lòng nhập lý do.");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      await onConfirm(reason);
      setReason(""); // Reset sau khi thành công
      onClose();
    } catch (err) {
      // Lỗi sẽ được xử lý ở parent component
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose} title={title || "Xác nhận dừng hoạt động"}>
      <div className="space-y-4">
        <p className="text-gray-600">
          Bạn đang thực hiện dừng hoạt động: <strong>{itemName}</strong>.
          <br />
          Hành động này sẽ gửi email thông báo cho chủ sở hữu.
        </p>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lý do dừng hoạt động <span className="text-red-500">*</span>
          </label>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            rows={4}
            placeholder="Nhập lý do chi tiết..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Hủy bỏ
          </Button>
          <Button 
            className="bg-red-600 hover:bg-red-700 text-white" 
            onClick={handleSubmit} 
            isLoading={isLoading}
          >
            Xác nhận Dừng
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SuspendModal;