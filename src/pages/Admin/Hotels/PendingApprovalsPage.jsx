import React, { useState } from "react";
import Card from "../../../components/common/Card/Card";
import CardHeader from "../../../components/common/Card/CardHeader";
import Badge from "../../../components/common/Badge/Badge"; // Cần import Badge cho mock data
import { CheckSquare } from "lucide-react";

// Import các component con
import ApprovalCard from "./components/ApprovalCard"; 
import ApproveHotelModal from "./components/ApproveHotelModal";
import RejectHotelModal from "./components/RejectHotelModal";
import ViewApplicationModal from "./components/ViewApplicationModal";

// Dữ liệu mock
const mockApplications = [
  {
    id: "APP-001",
    hotelName: "Sunrise Resort",
    ownerName: "Nguyễn Văn A",
    email: "owner.a@gmail.com",
    submittedDate: "2025-11-08",
    status: <Badge color="warning">Đang chờ</Badge>,
  },
  {
    id: "APP-002",
    hotelName: "Ocean View",
    ownerName: "Trần Thị B",
    email: "owner.b@gmail.com",
    submittedDate: "2025-11-07",
    status: <Badge color="warning">Đang chờ</Badge>,
  },
];


const PendingApprovalsPage = () => {
  const [selectedApp, setSelectedApp] = useState(null);
  const [isApproveModalOpen, setApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setRejectModalOpen] = useState(false); // State cho modal Từ chối
  const [isViewModalOpen, setViewModalOpen] = useState(false); // State cho modal Xem

  // HÀM 1: Bật modal Phê duyệt
  const handleApproveClick = (application) => {
    setSelectedApp(application);
    setApproveModalOpen(true);
  };

  // HÀM 2: Bật modal Từ chối
  const handleRejectClick = (application) => {
    setSelectedApp(application);
    setRejectModalOpen(true); // <-- Kích hoạt state 'isRejectModalOpen'
  };
  
  // HÀM 3: Bật modal Xem
  const handleViewDetails = (application) => {
     setSelectedApp(application);
     setViewModalOpen(true); // <-- Kích hoạt state 'isViewModalOpen'
  };

  // Hàm đóng tất cả modal
  const closeModal = () => {
    setSelectedApp(null);
    setApproveModalOpen(false);
    setRejectModalOpen(false);
    setViewModalOpen(false);
  };

  // Logic khi xác nhận (giữ nguyên)
  const onConfirmApprove = (application) => {
    console.log("ĐÃ PHÊ DUYỆT:", application);
    closeModal();
  };
  const onConfirmReject = (application, reason) => {
    console.log("ĐÃ TỪ CHỐI:", application, "Lý do:", reason);
    closeModal();
  };

  return (
    <>
      {/* Card ngoài cùng */}
      <Card>
        <CardHeader
          title="Phê duyệt Đăng ký Khách sạn"
          subtitle={`Bạn có ${mockApplications.length} đơn đăng ký đang chờ xử lý`}
          icon={<CheckSquare className="text-[rgb(40,169,224)]" />}
        />
        
        {/* Phần hiển thị các Card con */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(340px,1fr))] gap-5 mt-4">
          {mockApplications.map((app) => (
            <ApprovalCard
              key={app.id}
              application={app}
              onApprove={() => handleApproveClick(app)}
              onReject={() => handleRejectClick(app)}     // <-- Truyền HÀM 2
              onViewDetails={() => handleViewDetails(app)} // <-- Truyền HÀM 3
            />
          ))}
        </div>
        
        {/* (Nếu không có đơn nào) */}
        {mockApplications.length === 0 && (
           <p className="text-center text-gray-500 py-10">Không có đơn đăng ký nào đang chờ.</p>
        )}
      </Card>

      {/* Các Modals (Phần này render dựa trên state) */}
      
      <ApproveHotelModal
        open={isApproveModalOpen}
        onClose={closeModal}
        application={selectedApp}
        onConfirm={onConfirmApprove}
      />
      
      {/* Modal này chỉ hiện khi 'isRejectModalOpen' là true */}
      <RejectHotelModal
        open={isRejectModalOpen}
        onClose={closeModal}
        application={selectedApp}
        onConfirm={onConfirmReject}
      />
      
      {/* Modal này chỉ hiện khi 'isViewModalOpen' là true */}
      <ViewApplicationModal
        open={isViewModalOpen}
        onClose={closeModal}
        application={selectedApp}
      />
    </>
  );
};

export default PendingApprovalsPage;