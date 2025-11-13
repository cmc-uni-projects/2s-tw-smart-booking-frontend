import React, { useState, useEffect } from "react";
import Card from "../../../components/common/Card/Card";
import CardHeader from "../../../components/common/Card/CardHeader";
import { CheckSquare, Loader2 } from "lucide-react"; 
import { adminService } from "@/services/admin.service"; 

// 1. Import Component Toast Custom của bạn
import Toast from "@/components/common/Notification/Toast";

// Import các component con
import ApprovalCard from "./components/ApprovalCard";
import ApproveHotelModal from "./components/ApproveHotelModal";
import RejectHotelModal from "./components/RejectHotelModal";
import ViewApplicationModal from "./components/ViewApplicationModal";

const PendingApprovalsPage = () => {
  const [applications, setApplications] = useState([]); 
  const [isLoading, setIsLoading] = useState(true); 
  const [selectedApp, setSelectedApp] = useState(null);
  
  // 2. Thêm State để quản lý Toast thông báo
  const [toastData, setToastData] = useState(null); // { message, type }

  // State cho modals
  const [isApproveModalOpen, setApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setRejectModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);

  // 3. Hàm helper để hiển thị Toast và tự ẩn sau 3 giây
  const showToast = (message, type = "info") => {
    setToastData({ message, type });
    const timer = setTimeout(() => {
      setToastData(null);
    }, 3000);
    return () => clearTimeout(timer);
  };

  // Fetch dữ liệu
  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getPendingApplications();
      
      const mappedData = data.map(app => ({
        ...app,
        id: app.id,
        hotelName: "Đơn đăng ký Chủ sở hữu",
        ownerName: app.applicantFullName,
        email: app.applicantEmail,
        submittedDate: new Date(app.createdAt).toLocaleDateString("vi-VN"),
        status: "PENDING"
      }));

      setApplications(mappedData);
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
      showToast("Không thể tải danh sách đơn đăng ký", "error"); // Dùng custom toast
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // --- CÁC HÀM XỬ LÝ MODAL ---

  const handleApproveClick = (application) => {
    setSelectedApp(application);
    setApproveModalOpen(true);
  };

  const handleRejectClick = (application) => {
    setSelectedApp(application);
    setRejectModalOpen(true);
  };

  const handleViewDetails = (application) => {
    setSelectedApp(application);
    setViewModalOpen(true);
  };

  const closeModal = () => {
    setSelectedApp(null);
    setApproveModalOpen(false);
    setRejectModalOpen(false);
    setViewModalOpen(false);
  };

  // Xử lý API khi xác nhận DUYỆT
  const onConfirmApprove = async (application) => {
    try {
      await adminService.reviewApplication(application.id, "APPROVED", null);
      
      // 4. Gọi Toast thành công
      showToast("Đã duyệt đơn thành công!", "success");
      
      fetchApplications(); 
      closeModal();
    } catch (error) {
      console.error(error);
      showToast("Có lỗi xảy ra khi duyệt đơn.", "error");
    }
  };

  // Xử lý API khi xác nhận TỪ CHỐI
  const onConfirmReject = async (application, reason) => {
    try {
      await adminService.reviewApplication(application.id, "REJECTED", reason);
      
      // 4. Gọi Toast thành công (hoặc warning tuỳ ý)
      showToast("Đã từ chối đơn đăng ký!", "success");
      
      fetchApplications();
      closeModal();
    } catch (error) {
      console.error(error);
      showToast("Có lỗi xảy ra khi từ chối đơn.", "error");
    }
  };

  return (
    <>
      {/* 5. Hiển thị Toast Custom ở góc màn hình */}
      {toastData && (
        <div className="fixed top-24 right-6 z-50 transition-all duration-300 ease-in-out">
          <Toast message={toastData.message} type={toastData.type} />
        </div>
      )}

      <Card>
        <CardHeader
          title="Phê duyệt Đăng ký Khách sạn"
          subtitle={`Bạn có ${applications.length} đơn đăng ký đang chờ xử lý`}
          icon={<CheckSquare className="text-[rgb(40,169,224)]" />}
        />

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-blue-500" size={40} />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(340px,1fr))] gap-5 mt-4">
              {applications.map((app) => (
                <ApprovalCard
                  key={app.id}
                  application={app}
                  onApprove={() => handleApproveClick(app)}
                  onReject={() => handleRejectClick(app)}
                  onViewDetails={() => handleViewDetails(app)}
                />
              ))}
            </div>

            {applications.length === 0 && (
              <p className="text-center text-gray-500 py-10">
                Hiện tại không có đơn đăng ký nào đang chờ.
              </p>
            )}
          </>
        )}
      </Card>

      {selectedApp && (
        <>
          <ApproveHotelModal
            open={isApproveModalOpen}
            onClose={closeModal}
            application={selectedApp}
            onConfirm={() => onConfirmApprove(selectedApp)}
          />

          <RejectHotelModal
            open={isRejectModalOpen}
            onClose={closeModal}
            application={selectedApp}
            onConfirm={(reason) => onConfirmReject(selectedApp, reason)}
          />

          <ViewApplicationModal
            open={isViewModalOpen}
            onClose={closeModal}
            application={selectedApp}
          />
        </>
      )}
    </>
  );
};

export default PendingApprovalsPage;