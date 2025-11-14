import React, { useState, useEffect } from "react";
import Card from "../../../components/common/Card/Card";
import CardHeader from "../../../components/common/Card/CardHeader";
import Badge from "../../../components/common/Badge/Badge";
// 1. Imports mới: adminService, Loader, EmptyState và Toast
import { Building2, Loader2 } from "lucide-react"; 
import  adminService  from "@/services/admin.service";
import Toast from "@/components/common/Notification/Toast";
import EmptyState from "@/components/common/EmptyState/EmptyState";

// Import các component con (giữ nguyên)
import HotelSubmissionCard from "./components/HotelSubmissionCard"; 
import ViewHotelSubmissionModal from "./components/ViewHotelSubmissionModal"; 
import ApproveHotelModal from "./components/ApproveHotelModal";
import RejectHotelModal from "./components/RejectHotelModal";

// 2. Xóa bỏ mockHotelSubmissions
// const mockHotelSubmissions = [ ... ];

const HotelSubmissionsPage = () => {
  // 3. Thêm state cho API
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastData, setToastData] = useState(null);

  // State cho modals (giữ nguyên)
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isApproveModalOpen, setApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setRejectModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);

  // 4. Thêm helper hiển thị Toast
  const showToast = (message, type = "info") => {
    setToastData({ message, type });
    setTimeout(() => setToastData(null), 3000);
  };

  // 5. Hàm gọi API để lấy danh sách khách sạn chờ duyệt
  const fetchSubmissions = async () => {
    try {
      setIsLoading(true);
      // Gọi API lấy các cơ sở có trạng thái PENDING
      const response = await adminService.getPropertiesByStatus("PENDING");
      const data = response.data || [];

      // Map dữ liệu API vào cấu trúc mà Card mong đợi
      const mappedData = data.map(sub => ({
        ...sub, // Truyền toàn bộ object DTO vào modal
        id: sub.propertyId, // Dùng propertyId làm key
        hotelName: sub.name,
        ownerName: sub.ownerName || "Chưa rõ",
        location: `${sub.address}, ${sub.city}`,
        // Giữ lại status badge
        status: <Badge color="warning">Đang chờ duyệt</Badge>,
      }));
      
      setSubmissions(mappedData);
    } catch (error) {
      console.error(error);
      showToast(error.message || "Không thể tải danh sách khách sạn", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // 6. Gọi API khi component mount
  useEffect(() => {
    fetchSubmissions();
  }, []);


  // --- Các hàm xử lý (giữ nguyên tên) ---
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

  // 7. Cập nhật hàm xử lý API DUYỆT
  const onConfirmApprove = async () => {
    if (!selectedSubmission) return;
    try {
      const payload = { status: "APPROVED", reason: null };
      // Dùng 'selectedSubmission.id' (đã map từ propertyId)
      await adminService.reviewProperty(selectedSubmission.id, payload);
      
      showToast("Phê duyệt khách sạn thành công!", "success");
      fetchSubmissions(); // Tải lại danh sách
      closeModal();
    } catch (error) {
      showToast(error.message || "Lỗi khi duyệt khách sạn", "error");
    }
  };
  
  // 8. Cập nhật hàm xử lý API TỪ CHỐI
  const onConfirmReject = async (reason) => {
    if (!selectedSubmission) return;
    try {
      const payload = { status: "REJECTED", reason: reason };
      await adminService.reviewProperty(selectedSubmission.id, payload);

      showToast("Đã từ chối khách sạn!", "success");
      fetchSubmissions(); // Tải lại danh sách
      closeModal();
    } catch (error) {
       showToast(error.message || "Lỗi khi từ chối khách sạn", "error");
    }
  };

  return (
    <>
      {/* 9. Thêm Toast vào UI */}
      {toastData && (
        <div className="fixed top-24 right-6 z-[9999]">
          <Toast message={toastData.message} type={toastData.type} />
        </div>
      )}

      <Card>
        {/* Cập nhật subtitle với dữ liệu thật */}
        <CardHeader
          title="Duyệt Khách sạn Mới"
          subtitle={`Bạn có ${submissions.length} khách sạn đang chờ phê duyệt`}
          icon={<Building2 className="text-[rgb(40,169,224)]" />}
        />
        
        {/* 10. Thêm logic Loading */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-blue-500" size={40} />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(340px,1fr))] gap-5 mt-4">
              {/* 11. Map qua 'submissions' thay vì 'mockHotelSubmissions' */}
              {submissions.length > 0 && submissions.map((sub) => (
                <HotelSubmissionCard
                  key={sub.id}
                  submission={sub}
                  onApprove={() => handleApproveClick(sub)}
                  onReject={() => handleRejectClick(sub)}
                  onViewDetails={() => handleViewDetails(sub)}
                />
              ))}
            </div>
            
            {/* 12. Thêm EmptyState khi không có dữ liệu */}
            {submissions.length === 0 && (
               <div className="col-span-full">
                <EmptyState
                  title="Không có khách sạn"
                  description="Hiện tại không có khách sạn nào đang chờ phê duyệt."
                />
              </div>
            )}
          </>
        )}
      </Card>

      {/* --- Các Modals (Quan trọng: Sửa prop 'application') --- */}
      
      {/* Các modal Approve/Reject đang mong chờ prop 'application'.
        Chúng ta truyền 'selectedSubmission' vào prop 'application' đó.
      */}
      <ApproveHotelModal
        open={isApproveModalOpen}
        onClose={closeModal}
        application={selectedSubmission} // ✅ Prop 'application'
        onConfirm={onConfirmApprove}
      />
      
      <RejectHotelModal
        open={isRejectModalOpen}
        onClose={closeModal}
        application={selectedSubmission} // ✅ Prop 'application'
        onConfirm={onConfirmReject}
      />
      
      {/* Modal này đã dùng đúng prop 'submission' */}
      {selectedSubmission && (
        <ViewHotelSubmissionModal
          open={isViewModalOpen}
          onClose={closeModal}
          submission={selectedSubmission}
        />
      )}
    </>
  );
};

export default HotelSubmissionsPage;