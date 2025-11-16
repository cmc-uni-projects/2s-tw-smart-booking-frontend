import React, { useState, useEffect } from "react";
import Card from "@/components/common/Card/Card";
import CardHeader from "@/components/common/Card/CardHeader";
import { UserCheck, Loader2 } from "lucide-react";
import adminService from "@/services/admin.service"; 
import Toast from "@/components/common/Notification/Toast";

// Import components (Đảm bảo đường dẫn đúng)
import ApprovalCard from "./components/ApprovalCard";
import EmptyState from "@/components/common/EmptyState/EmptyState";

// ✅ SỬA 1: IMPORT CÁC MODAL ĐÚNG
import ViewApplicationModal from "./components/ViewApplicationModal";
import ApproveOwnerModal from "./components/ApproveOwnerModal"; // <-- Sửa
import RejectOwnerModal from "./components/RejectOwnerModal";   // <-- Sửa


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

  // Logic Fetch API (Đã chính xác)
  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getOwnerApplications("PENDING");

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
    setTimeout(() => setSelectedApp(null), 200); 
  };

  // --- XỬ LÝ API (Đã chính xác) ---

  const onConfirmApprove = async () => {
    if (!selectedApp) return;
    try {
      const payload = { status: "APPROVED", reason: null };
      await adminService.reviewOwnerApplication(selectedApp.id, payload);
      
      showToast("Đã duyệt đơn thành công!", "success");
      fetchApplications(); 
      closeModals();
    } catch (error) {
      showToast(error.message || "Có lỗi khi duyệt đơn", "error");
    }
  };

  const onConfirmReject = async (reason) => {
    if (!selectedApp) return;
    try {
      const payload = { status: "REJECTED", reason: reason };
      await adminService.reviewOwnerApplication(selectedApp.id, payload);

      showToast("Đã từ chối đơn đăng ký!", "success");
      fetchApplications(); 
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
      {selectedApp && (
        <>
          {/* 1. Modal Xem chi tiết (Đã đúng) */}
          <ViewApplicationModal
            open={isViewOpen}
            onClose={closeModals}
            application={selectedApp}
          />

          {/* ✅ SỬA 2: Dùng MODAL DUYỆT OWNER */}
          <ApproveOwnerModal
            open={isApproveOpen}
            onClose={closeModals}
            application={selectedApp}
            onConfirm={onConfirmApprove}
          />

          {/* ✅ SỬA 3: Dùng MODAL TỪ CHỐI OWNER */}
          <RejectOwnerModal
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
