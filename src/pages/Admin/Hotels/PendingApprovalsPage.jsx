import React, { useState, useEffect } from "react";
import Card from "@/components/common/Card/Card";
import CardHeader from "@/components/common/Card/CardHeader";
// 1. Đã đổi icon sang UserCheck cho phù hợp với "Chủ sở hữu"
import { UserCheck, Loader2 } from "lucide-react";
import adminService from "@/services/admin.service"; // 2. Import service (bỏ 'the')
import Toast from "@/components/common/Notification/Toast";

// Import components (Đảm bảo đường dẫn đúng)
import ApprovalCard from "./components/ApprovalCard";
import ApproveHotelModal from "./components/ApproveHotelModal";
import RejectHotelModal from "./components/RejectHotelModal";
import ViewApplicationModal from "./components/ViewApplicationModal";
// 3. Import EmptyState để hiển thị khi không có dữ liệu
import EmptyState from "@/components/common/EmptyState/EmptyState";

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

  // 4. CẬP NHẬT LOGIC FETCH API
  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      // Sử dụng API getOwnerApplications với status PENDING
      const response = await adminService.getOwnerApplications("PENDING");
      
      // Đảm bảo response.data là một mảng
      const data = response.data || []; 

      const mappedData = data.map(app => ({
        ...app, // Giữ nguyên toàn bộ dữ liệu gốc để modal có thể đọc
        id: app.id,
        hotelName: "Đơn đăng ký Chủ sở hữu", // Đây là label cho Card
        ownerName: app.applicantFullName || "Chưa cập nhật",
        email: app.applicantEmail,
        submittedDate: app.createdAt ? new Date(app.createdAt).toLocaleDateString("vi-VN") : "N/A",
        status: "PENDING"
      }));
      setApplications(mappedData);
    } catch (error) {
      console.error(error);
      showToast(error.message || "Không thể tải danh sách đơn đăng ký", "error");
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

  // 5. CẬP NHẬT LOGIC DUYỆT API
  const onConfirmApprove = async () => {
    if (!selectedApp) return;
    try {
      // Sử dụng reviewOwnerApplication và gửi payload đúng
      const payload = { status: "APPROVED", reason: null };
      await adminService.reviewOwnerApplication(selectedApp.id, payload);
      
      showToast("Đã duyệt đơn thành công!", "success");
      fetchApplications(); // Tải lại danh sách
      closeModals();
    } catch (error) {
      showToast(error.message || "Có lỗi khi duyệt đơn", "error");
    }
  };

  // 6. CẬP NHẬT LOGIC TỪ CHỐI API
  const onConfirmReject = async (reason) => {
    if (!selectedApp) return;
    try {
      // Sử dụng reviewOwnerApplication và gửi payload đúng
      const payload = { status: "REJECTED", reason: reason };
      await adminService.reviewOwnerApplication(selectedApp.id, payload);

      showToast("Đã từ chối đơn đăng ký!", "success");
      fetchApplications(); // Tải lại danh sách
      closeModals();
    } catch (error) {
      showToast(error.message || "Có lỗi khi từ chối đơn", "error");
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
        {/* 7. Cập nhật Tiêu đề và Icon */}
        <CardHeader
          title="Phê duyệt Đăng ký Chủ sở hữu"
          subtitle={`Bạn có ${applications.length} đơn đăng ký đang chờ xử lý`}
          icon={<UserCheck className="text-[rgb(40,169,224)]" />}
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
              // 8. Sử dụng EmptyState component
              <div className="col-span-full">
                <EmptyState
                  title="Không có đơn đăng ký"
                  description="Hiện tại không có đơn đăng ký chủ sở hữu nào đang chờ xử lý."
                />
              </div>
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