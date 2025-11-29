import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  MapPin,
  Loader2,
  FileText,
  Building2,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from "lucide-react";

// Components UI
import Button from "@/components/common/Button/Button";
import Toast from "@/components/common/Notification/Toast";
import ToastPortal from "@/components/common/Notification/ToastPortal";
import TabsComponent from "@/components/common/Tabs/TabsComponent";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import AccountMenu from "./AccountMenu";

// Modals
import BookingDetailModal from "./BookingDetailModal";
import CancelBookingModal from "./CancelBookingModal";
import RequestRefundModal from "./RequestRefundModal";
import ReviewBookingModal from "./ReviewBookingModal";

// Services & Context
import bookingService from "@/services/booking.service";
import paymentService from "@/services/payment.service";
import { createRating } from "@/services/rating.service";
import { useAuth } from "@/context/AuthContext";

// Helpers
const API_BASE_URL = "http://localhost:8386";
const getImageUrl = (path) => {
  if (!path) return "https://via.placeholder.com/300x200?text=No+Image";
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL}/${path}`;
};

const TABS = [
  { id: "upcoming", name: "Sắp tới" },
  { id: "cancelled", name: "Đã hủy" },
  { id: "all", name: "Tất cả" },
];

// --- COMPONENT CARD ---
const BookingCard = ({ booking, onClick }) => {
  const formatCurrency = (val) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);

  const renderStatusBadge = (status) => {
    const config = {
      CONFIRMED: {
        style: "bg-blue-100 text-blue-700 border-blue-200",
        label: "Đã xác nhận",
        icon: CheckCircle2,
      },
      PENDING_PAYMENT: {
        style: "bg-amber-100 text-amber-700 border-amber-200",
        label: "Chờ thanh toán",
        icon: AlertCircle,
      },
      COMPLETED: {
        style: "bg-slate-100 text-slate-700 border-slate-200",
        label: "Hoàn thành",
        icon: CheckCircle2,
      },
      CANCELLED: {
        style: "bg-rose-100 text-rose-700 border-rose-200",
        label: "Đã hủy",
        icon: XCircle,
      },
      CHECKED_IN: {
        style: "bg-emerald-100 text-emerald-700 border-emerald-200",
        label: "Đang lưu trú",
        icon: Building2,
      },
    };

    const current =
      config[status] || {
        style: "bg-gray-100 text-gray-600",
        label: status,
        icon: AlertCircle,
      };
    const Icon = current.icon;

    return (
      <span
        className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${current.style}`}
      >
        <Icon size={14} strokeWidth={2.5} />
        {current.label}
      </span>
    );
  };

  return (
    <div
      onClick={onClick}
      className={`group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-300 hover:border-blue-300 hover:shadow-lg md:flex-row ${
        booking.status === "CANCELLED" ? "opacity-80 grayscale-[0.2]" : ""
      }`}
    >
      {/* Image Section */}
      <div className="relative h-48 w-full shrink-0 bg-slate-100 md:h-auto md:w-56">
        <img
          src={getImageUrl(booking.propertyImage)}
          alt={booking.propertyName}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/300x200?text=Hotel";
          }}
        />
        <div className="absolute left-3 top-3 md:hidden">
          {renderStatusBadge(booking.status)}
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="line-clamp-1 text-lg font-bold text-slate-800 transition-colors group-hover:text-blue-600">
                {booking.propertyName}
              </h3>
              <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                <MapPin size={14} /> {booking.propertyAddress}
              </p>
            </div>
            <div className="hidden md:block">
              {renderStatusBadge(booking.status)}
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-2 rounded bg-slate-50 p-2">
              <CalendarDays size={16} className="text-blue-500" />
              <div>
                <p className="text-xs text-slate-400">Nhận phòng</p>
                <p className="font-medium">
                  {new Date(booking.checkInDate).toLocaleDateString(
                    "vi-VN"
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded bg-slate-50 p-2">
              <FileText size={16} className="text-blue-500" />
              <div>
                <p className="text-xs text-slate-400">Loại phòng</p>
                <p className="truncate font-medium">{booking.roomName}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-end justify-between border-t border-slate-100 pt-3">
          <div>
            {booking.paymentStatus === "REFUND_REQUESTED" && (
              <span className="mb-1 flex items-center gap-1 text-xs font-bold text-orange-600">
                <Loader2 size={10} className="animate-spin" /> Đang chờ hoàn
                tiền
              </span>
            )}
            {booking.paymentStatus === "REFUNDED" && (
              <span className="mb-1 block text-xs font-bold text-green-600">
                ✔ Đã hoàn tiền
              </span>
            )}
            <p className="text-xs text-slate-400">Tổng thanh toán</p>
            <p className="text-xl font-bold text-blue-600">
              {formatCurrency(booking.totalPrice)}
            </p>
          </div>

          <Button
            size="sm"
            variant="outline"
            className="group-hover:border-blue-200 group-hover:bg-blue-50"
          >
            Xem chi tiết
          </Button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE ---
export default function MyBookings() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Data States
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({
    show: false,
    msg: "",
    type: "info",
  });
  const [activeTab, setActiveTab] = useState("upcoming");

  // Modals State
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const showToast = (msg, type = "info") => {
    setToast({ show: true, msg, type });
    setTimeout(
      () =>
        setToast({
          show: false,
          msg: "",
          type: "info",
        }),
      3000
    );
  };

  // --- FETCH DATA ---
  const fetchBookings = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const data = await bookingService.getBookingsByUserId(
        currentUser.userId
      );
      setBookings((data || []).reverse());
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [currentUser]);

  // --- FILTER LOGIC ---
  const filteredBookings = useMemo(() => {
    if (activeTab === "upcoming") {
      return bookings.filter(
        (b) =>
          b.status === "CONFIRMED" ||
          b.status === "PENDING_PAYMENT" ||
          b.status === "CHECKED_IN"
      );
    }
    if (activeTab === "cancelled") {
      return bookings.filter((b) => b.status === "CANCELLED");
    }
    return bookings;
  }, [bookings, activeTab]);

  // --- HANDLERS ---
  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setIsDetailModalOpen(true);
  };

  const handleStartCancel = (booking) => {
    const targetBooking = booking || selectedBooking;
    setSelectedBooking(targetBooking);
    setIsDetailModalOpen(false);
    setTimeout(() => setIsCancelModalOpen(true), 200);
  };

  const handleConfirmCancel = async (booking, reason) => {
    try {
      await bookingService.cancelBooking(booking.bookingId);
      showToast("Hủy đặt phòng thành công!", "success");
      fetchBookings();
    } catch (err) {
      showToast(err.message || "Lỗi khi hủy đơn.", "error");
    } finally {
      setIsCancelModalOpen(false);
      setSelectedBooking(null);
    }
  };

  const handleOpenRefundModal = (booking) => {
    setSelectedBooking(booking);
    setIsRefundModalOpen(true);
    setIsDetailModalOpen(false);
  };

  const handleConfirmRefundRequest = async (bookingId, refundData) => {
    try {
      await paymentService.requestRefund(bookingId, refundData);
      showToast("Đã gửi yêu cầu hoàn tiền thành công!", "success");
      fetchBookings();
    } catch (err) {
      showToast(err.message || "Lỗi khi gửi yêu cầu.", "error");
    } finally {
      setIsRefundModalOpen(false);
      setSelectedBooking(null);
    }
  };

  const handleOpenReviewModal = (booking) => {
    setSelectedBooking(booking);
    setIsDetailModalOpen(false); // đóng modal chi tiết
    setIsReviewModalOpen(true); // mở modal đánh giá
  };

  // --- SUBMIT REVIEW ---
  const handleSubmitReview = async ({ rating, comment, images, videos }) => {
    try {
      if (!selectedBooking || !currentUser) {
        throw new Error("Thiếu thông tin booking hoặc người dùng.");
      }

      // hiện tại BE chỉ lưu rating + comment,
      // files được truyền vào nhưng createRating đang bỏ qua
      const allFiles = [...(images || []), ...(videos || [])];

      await createRating({
        bookingId: selectedBooking.bookingId,
        userId: currentUser.userId,
        rating,
        comment,
        files: allFiles,
      });

      showToast("Đánh giá thành công!", "success");
      setIsReviewModalOpen(false);
      setSelectedBooking(null);
      // nếu cần: await fetchBookings();
    } catch (err) {
      console.error("Submit review error:", err);

      const uiMessage =
        err?.message || "Gửi đánh giá thất bại, vui lòng thử lại.";

      showToast(uiMessage, "error");

      // để ReviewBookingModal hiển thị message này ngay dưới ô comment
      throw new Error(uiMessage);
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-6 animate-fade-in">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* MENU SIDEBAR */}
        <div className="lg:col-span-3">
          <AccountMenu
            activeSection="my-bookings"
            onSelect={(path) => navigate(`/customer/${path}`)}
            userData={currentUser}
          />
        </div>

        {/* MAIN CONTENT */}
        <div className="space-y-6 lg:col-span-9">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Đặt chỗ của tôi
              </h2>
              <p className="text-sm text-gray-500">
                Quản lý các chuyến đi sắp tới và lịch sử đặt phòng.
              </p>
            </div>
          </div>

          <div className="border-b border-gray-200">
            <TabsComponent
              tabs={TABS}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="py-10">
              <EmptyState
                title="Chưa có đơn đặt phòng nào"
                description="Bạn chưa có chuyến đi nào trong mục này."
              />
              <div className="mt-6 text-center">
                <Button size="lg" onClick={() => navigate("/hotels")}>
                  Tìm khách sạn ngay
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((b) => (
                <BookingCard
                  key={b.bookingId}
                  booking={b}
                  onClick={() => handleViewDetails(b)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --- TOAST --- */}
      <ToastPortal>
        {toast.show && (
          <div className="fixed bottom-6 left-1/2 z-[9999] -translate-x-1/2">
            <Toast message={toast.msg} type={toast.type} />
          </div>
        )}
      </ToastPortal>

      {/* --- MODALS --- */}
      <BookingDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        booking={selectedBooking}
        onCancelClick={() => handleStartCancel(selectedBooking)}
        onRefundClick={() => handleOpenRefundModal(selectedBooking)}
        onReviewClick={() => handleOpenReviewModal(selectedBooking)}
      />

      <CancelBookingModal
        open={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={(reason) =>
          handleConfirmCancel(selectedBooking, reason)
        }
        booking={selectedBooking}
      />

      <RequestRefundModal
        isOpen={isRefundModalOpen}
        onClose={() => setIsRefundModalOpen(false)}
        onConfirm={(data) =>
          handleConfirmRefundRequest(selectedBooking.bookingId, data)
        }
        booking={selectedBooking}
      />

      <ReviewBookingModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        booking={selectedBooking}
        onSubmit={handleSubmitReview}
      />
    </div>
  );
}
