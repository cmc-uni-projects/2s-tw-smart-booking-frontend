import React, { useState } from "react";
import Card from "../../../components/common/Card/Card";
import CardHeader from "../../../components/common/Card/CardHeader";
import Badge from "../../../components/common/Badge/Badge";
// 1. Đổi icon từ CheckSquare sang Building2 cho phù hợp với "Khách sạn"
import { Building2 } from "lucide-react"; 

// 2. Import các component con MỚI (chúng ta sẽ tạo các file này sau)
import HotelSubmissionCard from "./components/HotelSubmissionCard"; 
import ViewHotelSubmissionModal from "./components/ViewHotelSubmissionModal"; 

// 3. Tái sử dụng các modal xác nhận chung
import ApproveHotelModal from "./components/ApproveHotelModal";
import RejectHotelModal from "./components/RejectHotelModal";

// 4. Tạo dữ liệu mock MỚI cho đơn đăng ký KHÁCH SẠN
const mockHotelSubmissions = [
  {
    id: "HSUB-001",
    hotelName: "The Grand Plaza",
    ownerName: "Nguyễn Văn A", // Chủ sở hữu đã được duyệt
    location: "Quận 1, TP. Hồ Chí Minh",
    roomCount: 120,
    status: <Badge color="warning">Đang chờ duyệt</Badge>,
    // (sẽ thêm nhiều dữ liệu chi tiết hơn cho modal)
  },
  {
    id: "HSUB-002",
    hotelName: "La Siesta Hội An",
    ownerName: "Trần Thị B", // Chủ sở hữu đã được duyệt
    location: "TP. Hội An, Quảng Nam",
    roomCount: 45,
    status: <Badge color="warning">Đang chờ duyệt</Badge>,
  },
];


const HotelSubmissionsPage = () => {
  // 5. Đổi tên state cho rõ nghĩa
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isApproveModalOpen, setApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setRejectModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);

  // --- Các hàm xử lý (thay đổi tên biến) ---
  const handleApproveClick = (submission) => {
    setSelectedSubmission(submission);
    setApproveModalOpen(true);
  };

  const handleRejectClick = (submission) => {
    setSelectedSubmission(submission);
    setRejectModalOpen(true);
  };
  
  const handleViewDetails = (submission) => {
     setSelectedSubmission(submission);
     setViewModalOpen(true);
  };

  const closeModal = () => {
    setSelectedSubmission(null);
    setApproveModalOpen(false);
    setRejectModalOpen(false);
    setViewModalOpen(false);
  };

  const onConfirmApprove = (submission) => {
    console.log("ĐÃ PHÊ DUYỆT KHÁCH SẠN:", submission);
    closeModal();
  };
  const onConfirmReject = (submission, reason) => {
    console.log("ĐÃ TỪ CHỐI KHÁCH SẠN:", submission, "Lý do:", reason);
    closeModal();
  };

  return (
    <>
      <Card>
        {/* 6. Cập nhật tiêu đề và icon */}
        <CardHeader
          title="Duyệt Khách sạn Mới"
          subtitle={`Bạn có ${mockHotelSubmissions.length} khách sạn đang chờ phê duyệt`}
          icon={<Building2 className="text-[rgb(40,169,224)]" />}
        />
        
        <div className="grid grid-cols-[repeat(auto-fit,minmax(340px,1fr))] gap-5 mt-4">
          {/* 7. Map qua mock data MỚI và render Card MỚI */}
          {mockHotelSubmissions.map((sub) => (
            <HotelSubmissionCard
              key={sub.id}
              submission={sub}
              onApprove={() => handleApproveClick(sub)}
              onReject={() => handleRejectClick(sub)}
              onViewDetails={() => handleViewDetails(sub)}
            />
          ))}
        </div>
        
        {mockHotelSubmissions.length === 0 && (
           <p className="text-center text-gray-500 py-10">Không có khách sạn nào đang chờ duyệt.</p>
        )}
      </Card>

      {/* --- Các Modals --- */}
      
      {/* Tái sử dụng modal Phê duyệt */}
      <ApproveHotelModal
        open={isApproveModalOpen}
        onClose={closeModal}
        application={selectedSubmission} // Prop vẫn tên là 'application'
        onConfirm={onConfirmApprove}
      />
      
      {/* Tái sử dụng modal Từ chối */}
      <RejectHotelModal
        open={isRejectModalOpen}
        onClose={closeModal}
        application={selectedSubmission} // Prop vẫn tên là 'application'
        onConfirm={onConfirmReject}
      />
      
      {/* 8. Sử dụng Modal MỚI để xem chi tiết */}
      <ViewHotelSubmissionModal
        open={isViewModalOpen}
        onClose={closeModal}
        submission={selectedSubmission} // Truyền prop là 'submission'
      />
    </>
  );
};

export default HotelSubmissionsPage;