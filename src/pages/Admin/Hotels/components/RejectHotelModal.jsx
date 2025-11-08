import React, { useState } from "react";
// ✅ SỬA ĐƯỜNG DẪN: Cần 4 cấp (../../../../) để ra ngoài src/components/
import Modal from "../../../../components/common/Modal/Modal";
import Button from "../../../../components/common/Button/Button";
import TextArea from "../../../../components/common/Input/TextArea";

const RejectHotelModal = ({ open, onClose, application, onConfirm }) => {
  // State nội bộ để lưu lý do từ chối
  const [reason, setReason] = useState("");

  // Không render gì nếu không có đơn nào được chọn
  if (!application) return null;

  // Hàm xử lý khi bấm nút "Xác nhận"
  const handleConfirm = () => {
    // Gọi hàm onConfirm (truyền từ trang "cha")
    // và gửi kèm lý do
    onConfirm(application, reason);
    setReason(""); // Reset lý do sau khi gửi
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Xác nhận Từ chối Đơn đăng ký"
    >
      <div className="space-y-4">
        {/* Thông báo xác nhận */}
        <p>
          Bạn có chắc chắn muốn từ chối đơn đăng ký cho khách sạn{" "}
          <strong className="text-red-600">{application.hotelName}</strong>?
        </p>
        
        {/* Ô nhập lý do */}
        <TextArea
          label="Lý do từ chối (bắt buộc)"
          placeholder="Ví dụ: Thông tin cung cấp không chính xác..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
        />
        
        {/* Các nút hành động */}
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirm}
            // ✅ Chỉ cho phép bấm khi đã nhập lý do
            disabled={!reason} 
          >
            Xác nhận Từ chối
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RejectHotelModal;