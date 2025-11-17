import React, { useState, useEffect, useMemo } from "react";
import Card from "@/components/common/Card/Card";
import CardHeader from "@/components/common/Card/CardHeader";
import { Hotel, Loader2, RefreshCw } from "lucide-react";
import adminService from "@/services/admin.service";
import Toast from "@/components/common/Notification/Toast";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import { AnimatePresence, motion } from "framer-motion";
import Button from "@/components/common/Button/Button";

// Filters Components
import SubmissionSearchBar from "./components/SubmissionSearchBar";
import SubmissionTypeFilter from "./components/SubmissionTypeFilter";
import SubmissionStatusFilter from "./components/SubmissionStatusFilter";

// Cards + Modals
import HotelSubmissionCard from "./components/HotelSubmissionCard";
import ViewHotelSubmissionModal from "./components/ViewHotelSubmissionModal";
import ApproveHotelModal from "./components/ApproveHotelModal";
import RejectHotelModal from "./components/RejectHotelModal";

const API_BASE = (import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:8386/api/v1")
  .replace("/api/v1", "");

const HotelSubmissionsPage = () => {
  // --- State ---
  const [allSubmissions, setAllSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [toastData, setToastData] = useState(null);

  // Modals
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("PENDING"); // Mặc định là Chờ duyệt

  // --- Fetch Data ---
  const fetchSubmissions = async () => {
    try {
      setIsLoading(true);
      let data = [];

      // Logic lấy dữ liệu dựa trên Tab đang chọn
      if (filterStatus === "ALL") {
        // Nếu chọn tất cả, gọi song song các trạng thái để gộp lại
        // Lưu ý: Backend enum là "APPROVE" chứ không phải "APPROVED"
        const [pending, approved, rejected] = await Promise.allSettled([
          adminService.getPropertiesByStatus("PENDING"),
          adminService.getPropertiesByStatus("APPROVE"), 
          adminService.getPropertiesByStatus("REJECTED")
        ]);
        
        // Gộp kết quả từ các promise thành công
        if (pending.status === "fulfilled") data = [...data, ...pending.value];
        if (approved.status === "fulfilled") data = [...data, ...approved.value];
        if (rejected.status === "fulfilled") data = [...data, ...rejected.value];

      } else {
        // Map UI Status sang Backend Enum
        let statusToSend = filterStatus;
        if (filterStatus === "APPROVED") statusToSend = "APPROVE"; // Fix lệch tên Enum

        data = await adminService.getPropertiesByStatus(statusToSend);
      }

      // Mapping dữ liệu để đồng bộ với Frontend
      const mappedData = data.map((hotel) => {
        // Parse images
        let images = [];
        try {
          const imagesRaw = hotel.imageUrlsJson ? JSON.parse(hotel.imageUrlsJson) : [];
          images = imagesRaw.map((img) => ({
            imageUrl: `${API_BASE}${img.startsWith("/") ? img : "/" + img}`,
          }));
        } catch (e) {
          images = [];
        }

        // Xử lý ảnh bìa (ưu tiên coverImage từ DTO mới, fallback sang ảnh đầu tiên hoặc placeholder)
        let displayImage = "/assets/images/placeholder.png"; // Ảnh mặc định
        if (hotel.coverImage) {
            displayImage = `${API_BASE}${hotel.coverImage.startsWith("/") ? hotel.coverImage : "/" + hotel.coverImage}`;
        } else if (images.length > 0) {
            displayImage = images[0].imageUrl;
        }

        return {
          ...hotel,
          id: hotel.propertyId,
          hotelName: hotel.propertyName,
          ownerName: hotel.ownerName || "Chưa rõ",
          images,
          imageUrl: displayImage, // Dùng trường này để hiển thị Card
          submittedDate: hotel.createdAt
            ? new Date(hotel.createdAt).toLocaleDateString("vi-VN")
            : "N/A",
        };
      });

      // Sắp xếp: Mới nhất lên đầu
      mappedData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setAllSubmissions(mappedData);
    } catch (error) {
      console.error(error);
      showToast("Không thể tải danh sách cơ sở. Vui lòng thử lại.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Gọi API khi filterStatus thay đổi (Chuyển Tab)
  useEffect(() => {
    fetchSubmissions();
  }, [filterStatus]);

  // --- Client-side Filtering (Search & Type) ---
  const filteredSubmissions = useMemo(() => {
    let submissions = [...allSubmissions];

    // 1. Lọc theo Loại hình
    if (filterType !== "ALL") {
      submissions = submissions.filter((s) => s.propertyType === filterType);
    }

    // 2. Lọc theo Từ khóa (Tên khách sạn hoặc Chủ sở hữu)
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

  // --- Helpers ---
  const showToast = (message, type = "info") => {
    setToastData({ message, type });
    setTimeout(() => setToastData(null), 3000);
  };

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

  // --- API Actions ---
  const onConfirmApprove = async () => {
    if (!selectedHotel) return;
    try {
      await adminService.reviewProperty(selectedHotel.id, {
        status: "APPROVE",
        reason: null,
      });
      showToast(`Đã duyệt "${selectedHotel.hotelName}" thành công!`, "success");
      fetchSubmissions(); // Reload list
      closeModals();
    } catch (err) {
      showToast(err.message || "Lỗi khi duyệt cơ sở", "error");
    }
  };

  const onConfirmReject = async (reason) => {
    if (!selectedHotel) return;
    try {
      await adminService.reviewProperty(selectedHotel.id, {
        status: "REJECTED",
        reason,
      });
      showToast(`Đã từ chối "${selectedHotel.hotelName}"!`, "success");
      fetchSubmissions(); // Reload list
      closeModals();
    } catch (err) {
      showToast(err.message || "Lỗi khi từ chối cơ sở", "error");
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {toastData && (
        <div className="fixed top-24 right-6 z-[9999]">
          <Toast message={toastData.message} type={toastData.type} />
        </div>
      )}

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

        {/* --- BỘ LỌC GIAO DIỆN MỚI --- */}
        <div className="flex flex-col gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-200 mb-6">
          
          {/* Dòng 1: Tabs Trạng thái */}
          <div className="w-full overflow-x-auto pb-2 md:pb-0">
            <SubmissionStatusFilter
              currentStatus={filterStatus}
              onStatusChange={setFilterStatus}
            />
          </div>

          <div className="h-px bg-gray-100 w-full"></div>

          {/* Dòng 2: Tìm kiếm & Loại hình */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="w-full md:w-2/3">
                 <SubmissionSearchBar onSearch={setSearchTerm} initialValue={searchTerm} />
            </div>
            <div className="w-full md:w-1/3 flex justify-end">
                 <SubmissionTypeFilter
                    currentType={filterType}
                    onTypeChange={setFilterType}
                 />
            </div>
          </div>
        </div>

        {/* --- DANH SÁCH KẾT QUẢ --- */}
        <div className="mt-2">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-dashed border-gray-200">
              <Loader2 className="animate-spin text-blue-500 mb-3" size={42} />
              <p className="text-gray-500 text-sm font-medium">Đang tải dữ liệu...</p>
            </div>
          ) : (
            <motion.div layout className="flex flex-col gap-4">
              <AnimatePresence mode="popLayout">
                {filteredSubmissions.length > 0 ? (
                  filteredSubmissions.map((hotel) => (
                    <HotelSubmissionCard
                      key={hotel.id}
                      hotel={hotel}
                      onViewDetails={() => handleViewDetails(hotel)}
                      onApprove={() => handleApproveClick(hotel)}
                      onReject={() => handleRejectClick(hotel)}
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
                      title="Không tìm thấy dữ liệu"
                      description={
                        searchTerm || filterType !== "ALL"
                          ? "Không có kết quả nào khớp với bộ lọc của bạn."
                          : "Danh sách hiện tại đang trống."
                      }
                    />
                  </motion.div>
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
            open={isViewOpen}
            onClose={closeModals}
            application={selectedHotel}
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