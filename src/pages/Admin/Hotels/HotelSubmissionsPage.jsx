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
      const response = await adminService.getPropertiesByStatus("PENDING");
      const data = response.data || [];

      const mappedData = data.map((hotel) => ({
        ...hotel,
        id: hotel.propertyId,
        hotelName: hotel.name,
        ownerName: hotel.owner?.fullName || "Chủ sở hữu ẩn",
        imageUrl:
          hotel.images?.[0]?.imageUrl ||
          "https://via.placeholder.com/400x300?text=No+Image",
        submittedDate: hotel.createdAt
          ? new Date(hotel.createdAt).toLocaleDateString("vi-VN")
          : "N/A",
        propertyType: hotel.propertyType || "UNKNOWN",
      }));

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
      submissions = submissions.filter((s) => s.propertyType === filterType);
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

  // TODO: add your confirm handlers here
  const onConfirmApprove = async () => {};
  const onConfirmReject = async () => {};

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
