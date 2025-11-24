import React, { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Hotel, Loader2, RefreshCw } from "lucide-react";

// Components
import Card from "@/components/common/Card/Card";
import CardHeader from "@/components/common/Card/CardHeader";
import Button from "@/components/common/Button/Button";
import Toast from "@/components/common/Notification/Toast";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import LoadingOverlay from "@/components/common/Loading/LoadingOverlay"; // ✅ Import LoadingOverlay

// Sub-components
import SubmissionSearchBar from "./components/SubmissionSearchBar";
import SubmissionTypeFilter from "./components/SubmissionTypeFilter";
import SubmissionStatusFilter from "./components/SubmissionStatusFilter";
import HotelSubmissionCard from "./components/HotelSubmissionCard";

// Modals
import ViewHotelSubmissionModal from "./components/ViewHotelSubmissionModal";
import ApproveHotelModal from "./components/ApproveHotelModal";
import RejectHotelModal from "./components/RejectHotelModal";

// Services
import adminService from "@/services/admin.service";

const API_BASE = (import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:8386/api/v1")
  .replace("/api/v1", "");

const HotelSubmissionsPage = () => {
  // --- State ---
  const [allSubmissions, setAllSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false); // ✅ State cho loading khi duyệt/từ chối
  
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [toastData, setToastData] = useState(null);

  // Modal visibility
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("PENDING");

  // --- Helpers ---
  const showToast = (message, type = "info") => {
    setToastData({ message, type });
    setTimeout(() => setToastData(null), 3000);
  };

  // --- Fetch Data ---
  const fetchSubmissions = async () => {
    try {
      setIsLoading(true);
      let data = [];

      if (filterStatus === "ALL") {
        const [pending, approved, rejected] = await Promise.allSettled([
          adminService.getPropertiesByStatus("PENDING"),
          adminService.getPropertiesByStatus("APPROVE"),
          adminService.getPropertiesByStatus("REJECTED")
        ]);
        
        if (pending.status === "fulfilled") data = [...data, ...pending.value];
        if (approved.status === "fulfilled") data = [...data, ...approved.value];
        if (rejected.status === "fulfilled") data = [...data, ...rejected.value];

      } else {
        let statusToSend = filterStatus;
        if (filterStatus === "APPROVED") statusToSend = "APPROVE";
        data = await adminService.getPropertiesByStatus(statusToSend);
      }

      // Mapping data
      const mappedData = data.map((hotel) => {
        // Parse images string to array
        let images = [];
        try {
            if (Array.isArray(hotel.images)) {
                images = hotel.images; // Nếu backend trả về list object
            } else if (hotel.imageUrlsJson) {
                const raw = JSON.parse(hotel.imageUrlsJson);
                images = raw.map(img => ({ imageUrl: `${API_BASE}${img.startsWith("/") ? img : "/" + img}` }));
            }
        } catch (e) { images = []; }

        // Xử lý ảnh hiển thị (Ưu tiên coverImage -> ảnh đầu tiên -> placeholder)
        let displayImage = "/assets/images/placeholder.png";
        if (hotel.coverImage) {
            displayImage = `${API_BASE}${hotel.coverImage.startsWith("/") ? hotel.coverImage : "/" + hotel.coverImage}`;
        } else if (images.length > 0) {
            displayImage = images[0].imageUrl || images[0];
        }

        return {
          ...hotel,
          id: hotel.propertyId, // Đảm bảo có ID cho key list
          hotelName: hotel.propertyName,
          ownerName: hotel.ownerName || hotel.owner?.fullName || "Chưa rõ",
          imageUrl: displayImage,
          images: images,
          submittedDate: hotel.createdAt ? new Date(hotel.createdAt).toLocaleDateString("vi-VN") : "N/A",
        };
      });

      // Sort: Mới nhất lên đầu
      mappedData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setAllSubmissions(mappedData);

    } catch (error) {
      console.error(error);
      showToast("Lỗi tải dữ liệu. Vui lòng thử lại.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [filterStatus]);

  // --- Filter Logic ---
  const filteredSubmissions = useMemo(() => {
    let submissions = [...allSubmissions];

    if (filterType !== "ALL") {
      submissions = submissions.filter((s) => s.propertyType === filterType);
    }

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      submissions = submissions.filter(
        (s) =>
          (s.hotelName && s.hotelName.toLowerCase().includes(q)) ||
          (s.ownerName && s.ownerName.toLowerCase().includes(q))
      );
    }
    return submissions;
  }, [allSubmissions, searchTerm, filterType]);

  // --- Handlers ---
  const handleViewDetails = (hotel) => {
    setSelectedHotel(hotel);
    setIsViewOpen(true);
  };

  const handleApproveClick = (hotel) => {
    setSelectedHotel(hotel);
    setIsApproveOpen(true);
  };

  const handleRejectClick = (hotel) => {
    setSelectedHotel(hotel);
    setIsRejectOpen(true);
  };

  const closeModals = () => {
    setIsViewOpen(false);
    setIsApproveOpen(false);
    setIsRejectOpen(false);
    setTimeout(() => setSelectedHotel(null), 200);
  };

  // --- API Actions (Có Loading Overlay) ---
  const onConfirmApprove = async () => {
    if (!selectedHotel) return;
    setIsActionLoading(true); // Bật loading overlay
    try {
      await adminService.reviewProperty(selectedHotel.id, {
        status: "APPROVE",
        reason: null,
      });
      showToast(`Đã phê duyệt "${selectedHotel.hotelName}"`, "success");
      await fetchSubmissions(); // Tải lại danh sách
      closeModals();
    } catch (err) {
      showToast(err.message || "Lỗi khi duyệt cơ sở", "error");
    } finally {
      setIsActionLoading(false); // Tắt loading
    }
  };

  const onConfirmReject = async (reason) => {
    if (!selectedHotel) return;
    setIsActionLoading(true); // Bật loading overlay
    try {
      await adminService.reviewProperty(selectedHotel.id, {
        status: "REJECTED",
        reason,
      });
      showToast(`Đã từ chối "${selectedHotel.hotelName}"`, "success");
      await fetchSubmissions(); // Tải lại danh sách
      closeModals();
    } catch (err) {
      showToast(err.message || "Lỗi khi từ chối cơ sở", "error");
    } finally {
      setIsActionLoading(false); // Tắt loading
    }
  };

  // --- Render ---
  return (
    <>
      {/* Toast */}
      {toastData && (
        <div className="fixed top-24 right-6 z-[9999]">
          <Toast message={toastData.message} type={toastData.type} />
        </div>
      )}

      {/* ✅ Loading Overlay cho thao tác Duyệt/Từ chối */}
      {isActionLoading && <LoadingOverlay message="Đang xử lý yêu cầu..." />}

      <Card className="overflow-hidden min-h-screen bg-gray-50/50 border-none shadow-none">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
           <CardHeader
            title="Quản lý Đơn đăng ký"
            subtitle="Phê duyệt và quản lý các cơ sở lưu trú mới"
            icon={<Hotel className="text-blue-600" />}
            className="p-0"
          />
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchSubmissions} 
            leftIcon={<RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />}
            className="bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            Làm mới
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-200 mb-6">
          <div className="w-full overflow-x-auto pb-2 md:pb-0">
            <SubmissionStatusFilter currentStatus={filterStatus} onStatusChange={setFilterStatus} />
          </div>
          <div className="h-px bg-gray-100 w-full"></div>
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="w-full md:w-2/3">
                 <SubmissionSearchBar onSearch={setSearchTerm} initialValue={searchTerm} />
            </div>
            <div className="w-full md:w-1/3 flex justify-end">
                 <SubmissionTypeFilter currentType={filterType} onTypeChange={setFilterType} />
            </div>
          </div>
        </div>

        {/* Submission Grid */}
        <div className="mt-2">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-dashed border-gray-200">
              <Loader2 className="animate-spin text-blue-500 mb-3" size={42} />
              <p className="text-gray-500 text-sm font-medium">Đang tải dữ liệu...</p>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              <AnimatePresence mode="popLayout">
                {filteredSubmissions.length > 0 ? (
                  filteredSubmissions.map((hotel) => (
                    <motion.div
                        key={hotel.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Sử dụng HotelSubmissionCard đã fix */}
                        <HotelSubmissionCard
                          hotel={hotel} // ✅ Truyền đúng tên prop 'hotel'
                          onViewDetails={() => handleViewDetails(hotel)}
                        />
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full">
                     <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
                      >
                        <EmptyState
                          title="Không tìm thấy dữ liệu"
                          description="Danh sách hiện tại đang trống hoặc không khớp với bộ lọc."
                        />
                      </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </Card>

      {/* Modals */}
      {selectedHotel && (
        <>
          <ViewHotelSubmissionModal
            isOpen={isViewOpen} // ✅ Đổi tên prop từ 'open' thành 'isOpen' cho đúng chuẩn chung
            onClose={closeModals}
            submission={selectedHotel} // ✅ Đổi prop 'application' thành 'submission' cho khớp
            onApprove={handleApproveClick} // Mở modal confirm approve
            onReject={handleRejectClick}   // Mở modal confirm reject
          />

          <ApproveHotelModal
            open={isApproveOpen}
            onClose={closeModals}
            application={{ hotelName: selectedHotel.hotelName }}
            onConfirm={onConfirmApprove}
          />

          <RejectHotelModal
            open={isRejectOpen}
            onClose={closeModals}
            application={{ hotelName: selectedHotel.hotelName }}
            onConfirm={onConfirmReject}
          />
        </>
      )}
    </>
  );
};

export default HotelSubmissionsPage;