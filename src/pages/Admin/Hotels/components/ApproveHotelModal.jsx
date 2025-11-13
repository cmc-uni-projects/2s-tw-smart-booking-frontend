import React from "react";
import Modal from "@/components/common/Modal/Modal";
import Button from "@/components/common/Button/Button";
import { CheckCircle } from "lucide-react";

const ApproveHotelModal = ({ open, onClose, application, onConfirm }) => {
  return (
    <Modal 
      open={open} // ✅ Đã sửa từ isOpen thành open
      onClose={onClose} 
      title="Xác nhận phê duyệt" 
      maxWidth="max-w-sm"
    >
      <div className="text-center py-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="text-green-600" size={32} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Phê duyệt đơn đăng ký?</h3>
        <p className="text-gray-500 text-sm mb-6">
          Bạn đang duyệt đơn cho <strong>{application?.ownerName}</strong>.
        </p>

        <div className="flex justify-center gap-3">
          <Button variant="outline" onClick={onClose} className="w-full">Hủy</Button>
          <Button variant="primary" onClick={onConfirm} className="w-full bg-green-600 hover:bg-green-700 border-green-600">Xác nhận</Button>
        </div>
      </div>
    </Modal>
  );
};

export default ApproveHotelModal;