import React, { useState, useEffect } from "react";
import Card from "@/components/common/Card/Card";
import CardHeader from "@/components/common/Card/CardHeader";
import { CheckSquare, Loader2 } from "lucide-react";
import { adminService } from "@/services/admin.service";
import Toast from "@/components/common/Notification/Toast";

// Import components (Đảm bảo đường dẫn đúng)
import ApprovalCard from "./components/ApprovalCard";
import ApproveHotelModal from "./components/ApproveHotelModal";
import RejectHotelModal from "./components/RejectHotelModal";
import ViewApplicationModal from "./components/ViewApplicationModal";

const PendingApprovalsPage = () => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [toastData, setToastData] = useState(null);

  // Tách state để tránh lỗi logic
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);

  // Helper hiển thị Toast
  const showToast = (message, type = "info") => {
    setToastData({ message, type });
    setTimeout(() => setToastData(null), 3000);
  };

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getPendingApplications();
      const mappedData = data.map(app => ({
        ...app,
        id: app.id,
        hotelName: "Đơn đăng ký Chủ sở hữu",
        ownerName: app.applicantFullName || "Chưa cập nhật",
        email: app.applicantEmail,
        submittedDate: app.createdAt ? new Date(app.createdAt).toLocaleDateString("vi-VN") : "N/A",
        status: "PENDING"
      }));
      setApplications(mappedData);
    } catch (error) {
      console.error(error);
      showToast("Không thể tải danh sách đơn đăng ký", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // --- XỬ LÝ CLICK (MỞ MODAL) ---
  const handleViewDetails = (app) => {
    setSelectedApp(app);
    setIsViewOpen(true);
  };

  const handleApproveClick = (app) => {
    setSelectedApp(app);
    setIsApproveOpen(true);
  };

  const handleRejectClick = (app) => {
    setSelectedApp(app);
    setIsRejectOpen(true);
  };

  // Đóng tất cả modal
  const closeModals = () => {
    setIsViewOpen(false);
    setIsApproveOpen(false);
    setIsRejectOpen(false);
    setTimeout(() => setSelectedApp(null), 200); // Delay nhỏ để tránh giật UI
  };

  // --- XỬ LÝ API ---
  const onConfirmApprove = async () => {
    if (!selectedApp) return;
    try {
      await adminService.reviewApplication(selectedApp.id, "APPROVED", null);
      showToast("Đã duyệt đơn thành công!", "success");
      fetchApplications();
      closeModals();
    } catch (error) {
      showToast("Có lỗi khi duyệt đơn", "error");
    }
  };

  const onConfirmReject = async (reason) => {
    if (!selectedApp) return;
    try {
      await adminService.reviewApplication(selectedApp.id, "REJECTED", reason);
      showToast("Đã từ chối đơn đăng ký!", "success");
      fetchApplications();
      closeModals();
    } catch (error) {
      showToast("Có lỗi khi từ chối đơn", "error");
    }
  };

  return (
    <>
      {toastData && (
        <div className="fixed top-24 right-6 z-[9999]">
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
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-blue-500" size={40} />
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(340px,1fr))] gap-5 mt-4">
            {applications.length > 0 ? (
              applications.map((app) => (
                <ApprovalCard
                  key={app.id}
                  application={app}
                  onViewDetails={() => handleViewDetails(app)}
                  onApprove={() => handleApproveClick(app)}
                  onReject={() => handleRejectClick(app)}
                />
              ))
            ) : (
              <p className="text-center text-gray-500 py-10 col-span-full">
                Hiện tại không có đơn đăng ký nào đang chờ.
              </p>
            )}
          </div>
        )}
      </Card>

      {/* --- RENDER MODALS --- */}
      {/* Kiểm tra selectedApp trước khi render để tránh lỗi null */}
      {selectedApp && (
        <>
          <ViewApplicationModal
            open={isViewOpen}
            onClose={closeModals}
            application={selectedApp}
          />

          <ApproveHotelModal
            open={isApproveOpen}
            onClose={closeModals}
            application={selectedApp}
            onConfirm={onConfirmApprove}
          />

          <RejectHotelModal
            open={isRejectOpen}
            onClose={closeModals}
            application={selectedApp}
            onConfirm={onConfirmReject}
          />
        </>
      )}
    </>
  );
};

export default PendingApprovalsPage;