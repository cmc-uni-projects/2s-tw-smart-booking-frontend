import React, { useState, useEffect, useMemo } from "react";
import Card from "@/components/common/Card/Card";
import CardHeader from "@/components/common/Card/CardHeader";
import { Hotel, Loader2 } from "lucide-react";
import adminService from "@/services/admin.service";
import Toast from "@/components/common/Notification/Toast";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import { AnimatePresence, motion } from "framer-motion";

// Filters
import SubmissionSearchBar from "./components/SubmissionSearchBar";
import SubmissionTypeFilter from "./components/SubmissionTypeFilter";

// Cards + Modals
import HotelSubmissionCard from "./components/HotelSubmissionCard";
import ViewHotelSubmissionModal from "./components/ViewHotelSubmissionModal";
import ApproveHotelModal from "./components/ApproveHotelModal";
import RejectHotelModal from "./components/RejectHotelModal";

const API_BASE =
  (import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:8386/api/v1")
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

  // --- Fetch ---
  const fetchSubmissions = async () => {
    try {
      setIsLoading(true);

      // Backend trả về: { success, message, data }
      const data = await adminService.getPropertiesByStatus("PENDING");

      // Mapping để đồng bộ với FE
      const mappedData = data.map((hotel) => {
        // Parse images
        const imagesRaw = hotel.imageUrlsJson
          ? JSON.parse(hotel.imageUrlsJson)
          : [];

        const images = imagesRaw.map((img) => ({
          imageUrl: `${API_BASE}${img.startsWith("/") ? img : "/" + img}`,
        }));

        // Tên chủ sở hữu
        const ownerName = hotel.ownerFullName || "Chưa rõ";

        return {
          ...hotel,
          id: hotel.propertyId,
          hotelName: hotel.propertyName,
          ownerName,
          images,
          imageUrl: images[0]?.imageUrl || "/no-image.png",
          submittedDate: hotel.createdAt
            ? new Date(hotel.createdAt).toLocaleDateString("vi-VN")
            : "N/A",
        };
      });

      setAllSubmissions(mappedData);
    } catch (error) {
      showToast(
        error.message || "Không thể tải danh sách cơ sở",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  // --- Filtering ---
  const filteredSubmissions = useMemo(() => {
    let submissions = [...allSubmissions];

    if (filterType !== "ALL") {
      submissions = submissions.filter(
        (s) => s.propertyType === filterType
      );
    }

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      submissions = submissions.filter(
        (s) =>
          s.hotelName.toLowerCase().includes(q) ||
          s.ownerName.toLowerCase().includes(q)
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

  // --- DUYỆT ---
  const onConfirmApprove = async () => {
    if (!selectedHotel) return;
    try {
      await adminService.reviewProperty(selectedHotel.id, {
        status: "APPROVE",
        reason: null,
      });
      showToast("Đã duyệt cơ sở thành công!", "success");
      fetchSubmissions();
      closeModals();
    } catch (err) {
      showToast(err.message || "Lỗi khi duyệt cơ sở", "error");
    }
  };

  // --- TỪ CHỐI ---
  const onConfirmReject = async (reason) => {
    if (!selectedHotel) return;
    try {
      await adminService.reviewProperty(selectedHotel.id, {
        status: "REJECTED",
        reason,
      });
      showToast("Đã từ chối cơ sở!", "success");
      fetchSubmissions();
      closeModals();
    } catch (err) {
      showToast(err.message || "Lỗi khi từ chối cơ sở", "error");
    }
  };

  return (
    <>
      {/* Toast */}
      {toastData && (
        <div className="fixed top-24 right-6 z-[9999]">
          <Toast message={toastData.message} type={toastData.type} />
        </div>
      )}

      <Card className="overflow-hidden">
        <CardHeader
          title="Phê duyệt Đơn đăng ký Cơ sở"
          subtitle={`Bạn có ${filteredSubmissions.length} cơ sở đang chờ phê duyệt`}
          icon={<Hotel className="text-blue-600" />}
        />

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 bg-gray-50 border rounded-lg p-4 mt-4 shadow-inner">
          <SubmissionSearchBar onSearch={setSearchTerm} />
          <SubmissionTypeFilter
            currentType={filterType}
            onTypeChange={setFilterType}
          />
        </div>

        {/* List */}
        <div className="mt-6">
          {isLoading ? (
            <div className="flex justify-center py-24">
              <Loader2 className="animate-spin text-blue-500" size={42} />
            </div>
          ) : (
            <motion.div layout className="flex flex-col gap-6">
              <AnimatePresence>
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
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <EmptyState
                      title="Không tìm thấy cơ sở"
                      description={
                        allSubmissions.length
                          ? "Không có cơ sở nào khớp với tiêu chí tìm kiếm/lọc."
                          : "Hiện tại không có cơ sở nào đang chờ xử lý."
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
