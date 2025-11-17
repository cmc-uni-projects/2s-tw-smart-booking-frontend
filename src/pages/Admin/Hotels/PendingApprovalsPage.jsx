import React, { useState, useEffect, useMemo } from "react";
import Card from "@/components/common/Card/Card";
import CardHeader from "@/components/common/Card/CardHeader";
import { Users, Loader2, RefreshCw, ShieldCheck } from "lucide-react";
import adminService from "@/services/admin.service";
import Toast from "@/components/common/Notification/Toast";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import { AnimatePresence, motion } from "framer-motion";
import Button from "@/components/common/Button/Button";

// Filters
import SubmissionSearchBar from "./components/SubmissionSearchBar";
import SubmissionStatusFilter from "./components/SubmissionStatusFilter";

// Components
import ApprovalCard from "./components/ApprovalCard";
import ViewApplicationModal from "./components/ViewApplicationModal";
import ApproveOwnerModal from "./components/ApproveOwnerModal";
import RejectOwnerModal from "./components/RejectOwnerModal";

const PendingApprovalsPage = () => {
  // --- State ---
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [toastData, setToastData] = useState(null);

  // Filter State
  const [filterStatus, setFilterStatus] = useState("PENDING");
  const [searchTerm, setSearchTerm] = useState("");

  // Modals
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);

  // --- Fetch Data ---
  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      let data = [];

      if (filterStatus === "ALL") {
        const [pending, approved, rejected] = await Promise.allSettled([
          adminService.getOwnerApplications("PENDING"),
          adminService.getOwnerApplications("APPROVED"),
          adminService.getOwnerApplications("REJECTED")
        ]);

        if (pending.status === "fulfilled") data = [...data, ...(pending.value.data || [])];
        if (approved.status === "fulfilled") data = [...data, ...(approved.value.data || [])];
        if (rejected.status === "fulfilled") data = [...data, ...(rejected.value.data || [])];
      } else {
        const res = await adminService.getOwnerApplications(filterStatus);
        data = res.data || [];
      }

      // ✅ CẬP NHẬT MAPPING DỮ LIỆU (QUAN TRỌNG)
      const mappedData = data.map((app) => ({
        ...app,
        id: app.id, // Backend trả về "id"
        
        // Map các trường thông tin người dùng mới
        fullName: app.applicantFullName || "Chưa rõ",
        email: app.applicantEmail,
        phoneNumber: app.applicantPhoneNumber || "Chưa cập nhật",
        avatar: app.applicantAvatar, 
        
        // Hiển thị số GPKD
        businessName: app.businessLicenseNumber ? `GPKD: ${app.businessLicenseNumber}` : "Cá nhân",
        
        status: app.status,
        submittedDate: app.createdAt
          ? new Date(app.createdAt).toLocaleDateString("vi-VN")
          : "N/A",
      }));

      // Sort mới nhất
      mappedData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setApplications(mappedData);

    } catch (error) {
      console.error(error);
      showToast("Không thể tải danh sách đơn đăng ký.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [filterStatus]);

  // --- Filtering ---
  const filteredList = useMemo(() => {
    if (!searchTerm) return applications;
    const q = searchTerm.toLowerCase();
    return applications.filter(
      (app) =>
        app.fullName.toLowerCase().includes(q) ||
        app.email.toLowerCase().includes(q) ||
        (app.phoneNumber && app.phoneNumber.includes(q))
    );
  }, [applications, searchTerm]);

  // --- Helpers ---
  const showToast = (message, type = "info") => {
    setToastData({ message, type });
    setTimeout(() => setToastData(null), 3000);
  };

  const closeModals = () => {
    setIsViewOpen(false);
    setIsApproveOpen(false);
    setIsRejectOpen(false);
    setTimeout(() => setSelectedApp(null), 200);
  };

  // --- Handlers ---
  const handleViewDetails = (app) => { setSelectedApp(app); setIsViewOpen(true); };
  const handleApprove = (app) => { setSelectedApp(app); setIsApproveOpen(true); };
  const handleReject = (app) => { setSelectedApp(app); setIsRejectOpen(true); };

  const onConfirmApprove = async () => {
    if (!selectedApp) return;
    try {
      await adminService.reviewOwnerApplication(selectedApp.id, { status: "APPROVED" });
      showToast(`Đã duyệt chủ sở hữu ${selectedApp.fullName}`, "success");
      fetchApplications();
      closeModals();
    } catch (error) {
      showToast(error.message || "Lỗi khi duyệt", "error");
    }
  };

  const onConfirmReject = async (reason) => {
    if (!selectedApp) return;
    try {
      await adminService.reviewOwnerApplication(selectedApp.id, { status: "REJECTED", reason });
      showToast(`Đã từ chối đơn của ${selectedApp.fullName}`, "success");
      fetchApplications();
      closeModals();
    } catch (error) {
      showToast(error.message || "Lỗi khi từ chối", "error");
    }
  };

  return (
    <>
      {toastData && (
        <div className="fixed top-24 right-6 z-[9999]">
          <Toast message={toastData.message} type={toastData.type} />
        </div>
      )}

      <Card className="overflow-hidden min-h-screen bg-gray-50/50 border-none shadow-none">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <CardHeader
            title="Phê duyệt Đối tác (Owner)"
            subtitle="Xác minh thông tin và cấp quyền cho chủ sở hữu mới"
            icon={<Users className="text-blue-600" />}
            className="p-0"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={fetchApplications}
            leftIcon={<RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />}
            className="bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            Làm mới
          </Button>
        </div>

        <div className="flex flex-col gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-200 mb-6">
          <div className="w-full overflow-x-auto pb-2 md:pb-0">
            <SubmissionStatusFilter
              currentStatus={filterStatus}
              onStatusChange={setFilterStatus}
            />
          </div>
          <div className="h-px bg-gray-100 w-full"></div>
          <div className="w-full md:w-1/2">
            <SubmissionSearchBar 
                onSearch={setSearchTerm} 
                initialValue={searchTerm} 
                placeholder="Tìm theo tên, email hoặc số điện thoại..."
            />
          </div>
        </div>

        <div className="mt-2">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-dashed border-gray-200">
              <Loader2 className="animate-spin text-blue-500 mb-3" size={42} />
              <p className="text-gray-500 text-sm font-medium">Đang tải danh sách...</p>
            </div>
          ) : (
            <motion.div layout className="flex flex-col gap-3">
              <AnimatePresence mode="popLayout">
                {filteredList.length > 0 ? (
                  filteredList.map((app) => (
                    <ApprovalCard
                      key={app.id}
                      application={app}
                      onViewDetails={handleViewDetails}
                      onApprove={handleApprove}
                      onReject={handleReject}
                    />
                  ))
                ) : (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
                  >
                    <EmptyState
                      title="Không tìm thấy đơn đăng ký"
                      description={
                        searchTerm || filterStatus !== "ALL"
                          ? "Không có kết quả nào khớp với bộ lọc."
                          : "Hiện tại không có yêu cầu nào."
                      }
                      icon={<ShieldCheck className="text-gray-300 w-16 h-16 mb-4" />}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </Card>

      {selectedApp && (
        <>
          <ViewApplicationModal
            open={isViewOpen}
            onClose={closeModals}
            application={selectedApp}
          />
          <ApproveOwnerModal
            open={isApproveOpen}
            onClose={closeModals}
            application={selectedApp}
            onConfirm={onConfirmApprove}
          />
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