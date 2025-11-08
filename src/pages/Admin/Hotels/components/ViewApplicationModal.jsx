import React from "react";
// ✅ SỬA ĐƯỜNG DẪN: Cần 4 cấp (../../../../) để ra ngoài src/components/
import Modal from "../../../../components/common/Modal/Modal";
import Button from "../../../../components/common/Button/Button";
import Badge from "../../../../components/common/Badge/Badge";

// Component con nội bộ để hiển thị thông tin cho dễ
const InfoItem = ({ label, value }) => (
  <div>
    <span className="text-sm font-medium text-gray-500">{label}</span>
    <p className="text-md text-gray-900">{value}</p>
  </div>
);

const ViewApplicationModal = ({ open, onClose, application }) => {
  if (!application) return null;

  // Lấy text từ component Badge (dùng cho mock data)
  const statusText = application.status?.props?.children || "Không rõ";

  return (
    <Modal open={open} onClose={onClose} title="Chi tiết Đơn Đăng Ký">
      <div className="space-y-4">
        <InfoItem label="Tên Khách sạn" value={application.hotelName} />
        <InfoItem label="Chủ sở hữu" value={application.ownerName} />
        <InfoItem label="Email liên hệ" value={application.email} />
        <InfoItem label="Ngày nộp đơn" value={application.submittedDate} />
        <div>
           <span className="text-sm font-medium text-gray-500">Trạng thái</span>
           <div className="mt-1">
              <Badge color={statusText === "Đang chờ" ? "warning" : "default"}>{statusText}</Badge>
           </div>
        </div>
        
        {/* TODO: Thêm các thông tin chi tiết khác sau này */}

      </div>
      <div className="flex justify-end pt-4 mt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          Đóng
        </Button>
      </div>
    </Modal>
  );
};

export default ViewApplicationModal;