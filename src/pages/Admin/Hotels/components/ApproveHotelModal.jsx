import React from "react";
// ✅ SỬA ĐƯỜNG DẪN: Cần 4 cấp (../../../../) để ra ngoài src/components/
import ConfirmModal from "../../../../components/common/Modal/ConfirmModal";

const ApproveHotelModal = ({ open, onClose, application, onConfirm }) => {
  if (!application) return null;

  return (
    <ConfirmModal
      open={open}
      onClose={onClose}
      onConfirm={() => onConfirm(application)}
      title="Xác nhận Phê duyệt Đơn đăng ký"
      message={
        <span>
          Bạn có chắc chắn muốn phê duyệt đơn đăng ký cho khách sạn{" "}
          <strong className="text-green-600">{application.hotelName}</strong>?
        </span>
      }
      type="success"
      confirmText="Phê duyệt"
      cancelText="Hủy"
    />
  );
};

export default ApproveHotelModal;