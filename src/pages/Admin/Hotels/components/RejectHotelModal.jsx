import React, { useState } from "react";
import Modal from "@/components/common/Modal/Modal";
import Button from "@/components/common/Button/Button";
import TextArea from "@/components/common/Input/TextArea";
import { AlertTriangle } from "lucide-react";

const RejectHotelModal = ({ open, onClose, application, onConfirm }) => {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!reason.trim()) {
      setError("Vui lòng nhập lý do từ chối");
      return;
    }
    onConfirm(reason);
    setReason("");
    setError("");
  };

  return (
    <Modal 
      open={open} // ✅ Đã sửa từ isOpen thành open
      onClose={onClose} 
      title="Từ chối đơn đăng ký" 
      maxWidth="max-w-md"
    >
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="text-red-600" size={24} />
        </div>
        <p className="text-gray-600 text-sm">
          Bạn có chắc chắn muốn từ chối đơn của <strong>{application?.ownerName}</strong>?
        </p>
      </div>

      <div className="mb-6">
        <TextArea
          label="Lý do từ chối"
          placeholder="Nhập lý do..."
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
            if (error) setError("");
          }}
          error={error}
          rows={4}
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onClose}>Hủy bỏ</Button>
        <Button variant="danger" onClick={handleSubmit}>Xác nhận</Button>
      </div>
    </Modal>
  );
};

export default RejectHotelModal;