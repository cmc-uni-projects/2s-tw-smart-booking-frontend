import React from "react";
import { 
  X, Calendar, MapPin, User, CreditCard, 
  CheckCircle, AlertCircle, BedDouble, Receipt, 
  Phone, Mail, UserCircle, Clock, ShieldAlert,
  RefreshCcw // Thêm icon hoàn tiền
} from "lucide-react";
import Button from "@/components/common/Button/Button"; // Đảm bảo đường dẫn import đúng

// --- HELPER XỬ LÝ ẢNH ---
const API_BASE_URL = "http://localhost:8386"; 
const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/800x400?text=No+Image";
    if (path.startsWith("http")) return path;
    return `${API_BASE_URL}/${path}`; 
};

const BookingDetailModal = ({ isOpen, onClose, booking, onCancelClick, onRefundClick }) => {
  if (!isOpen || !booking) return null;

  // --- LOGIC TÍNH TOÁN MỚI ---
  const formatCurrency = (val) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);
  
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("vi-VN", { 
      weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit' 
    });
  };

  // Xác định trạng thái
  const isCancelled = booking.status === 'CANCELLED';
  // Lấy phí phạt (ưu tiên penaltyAmount, nếu không có thì lấy cancellationFee hoặc 0)
  const penaltyAmount = booking.penaltyAmount || booking.cancellationFee || 0;
  // Tính tổng thực nhận về
  const totalReceived = (booking.totalPrice || 0) - penaltyAmount;

  // Badge Booking Status
  const renderStatusBadge = () => {
    const config = {
      PENDING_PAYMENT: { text: "Chờ thanh toán", bg: "bg-amber-500", icon: AlertCircle },
      CONFIRMED: { text: "Đã xác nhận", bg: "bg-blue-500", icon: CheckCircle },
      CHECKED_IN: { text: "Đang lưu trú", bg: "bg-emerald-500", icon: BedDouble },
      COMPLETED: { text: "Hoàn thành", bg: "bg-slate-500", icon: CheckCircle },
      CANCELLED: { text: "Đã hủy", bg: "bg-rose-500", icon: X },
    };
    const current = config[booking.status] || config.PENDING_PAYMENT;
    const Icon = current.icon;

    return (
      <div className={`${current.bg} text-white px-4 py-1.5 rounded-full flex items-center gap-2 text-sm font-bold shadow-md`}>
        <Icon size={16} /> {current.text}
      </div>
    );
  };

  // Badge Payment Status
  const renderPaymentBadge = () => {
    const status = booking.paymentStatus;
    let style = "bg-gray-100 text-gray-700";
    let label = "Chưa thanh toán";
    let Icon = AlertCircle;

    if (status === 'APPROVED' || status === 'PAID') {
      style = "bg-emerald-100 text-emerald-700";
      label = "Đã thanh toán";
      Icon = CheckCircle;
    } else if (status === 'REFUNDED') {
      style = "bg-purple-100 text-purple-700";
      label = "Đã hoàn tiền";
      Icon = CheckCircle;
    } else if (status === 'REFUND_REQUESTED') {
      style = "bg-orange-100 text-orange-700";
      label = "Chờ hoàn tiền";
      Icon = Clock;
    }

    return (
      <span className={`text-xs font-bold px-2 py-1 rounded flex items-center gap-1 ${style}`}>
        <Icon size={12} /> {label}
      </span>
    );
  };

  const handlePayment = () => {
    alert("Vui lòng thanh toán qua ứng dụng hoặc tại quầy!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* --- 1. HEADER IMAGE --- */}
        <div className="relative h-40 bg-slate-800 shrink-0">
          <img 
            src={getImageUrl(booking.propertyImage)} 
            className="w-full h-full object-cover opacity-50"
            alt="header"
            onError={(e) => e.target.src = "https://via.placeholder.com/800x400?text=Hotel"}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
          
          <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 rounded-full text-white backdrop-blur-sm transition-all">
            <X size={20} />
          </button>

          <div className="absolute bottom-0 left-0 w-full p-6 flex justify-between items-end">
            <div>
              <div className="flex items-center gap-2 text-slate-300 text-sm mb-1">
                <Receipt size={14} /> Mã đơn: <span className="font-mono text-white font-bold">BK-{booking.bookingId}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white truncate max-w-md shadow-sm">
                {booking.propertyName || "Tên khách sạn"}
              </h2>
            </div>
            <div className="hidden md:block">
              {renderStatusBadge()}
            </div>
          </div>
        </div>

        {/* --- 2. BODY CONTENT (Scrollable) --- */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50/50">
          
          <div className="md:hidden flex justify-center">
            {renderStatusBadge()}
          </div>

          {/* Block 1: Thông tin Phòng */}
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4 border-b pb-2">
              <BedDouble size={18} className="text-[#28A9E0]" /> Thông tin lưu trú
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-slate-500 mb-1">Loại phòng</p>
                <p className="font-medium text-slate-800">{booking.roomName}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Số lượng khách</p>
                <div className="flex items-center gap-2">
                  <User size={16} className="text-slate-400" />
                  <span className="font-medium text-slate-800">{booking.guestCount} người</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Nhận phòng</p>
                <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg">
                  <Calendar size={16} />
                  <span className="font-bold">{formatDate(booking.checkInDate)}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Trả phòng</p>
                <div className="flex items-center gap-2 bg-slate-100 text-slate-700 px-3 py-2 rounded-lg">
                  <Calendar size={16} />
                  <span className="font-bold">{formatDate(booking.checkOutDate)}</span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-dashed border-slate-200 flex items-start gap-2 text-sm text-slate-500">
              <MapPin size={16} className="shrink-0 mt-0.5 text-slate-400" />
              {booking.propertyAddress || "Địa chỉ đang cập nhật"}
            </div>
          </div>

          {/* Block 2: Thông tin Khách hàng */}
          {booking.user && (
            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4 border-b pb-2">
                <UserCircle size={18} className="text-[#28A9E0]" /> Thông tin liên hệ
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Người đặt</p>
                    <p className="text-sm font-bold text-slate-800">{booking.user.fullName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Email</p>
                    <p className="text-sm font-medium text-slate-800 truncate max-w-[150px] sm:max-w-xs">
                      {booking.user.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 md:col-span-2">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Số điện thoại</p>
                    <p className="text-sm font-medium text-slate-800">
                      {booking.user.phoneNumber || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Block 3: Thanh toán & Hoàn tiền (LOGIC MỚI) */}
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <CreditCard size={18} className="text-[#28A9E0]" /> Chi tiết thanh toán
              </h3>
              {renderPaymentBadge()}
            </div>

            <div className="space-y-2">
              {/* Dòng 1: Giá gốc */}
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Giá trị đơn hàng</span>
                <span className="font-medium text-slate-700">{formatCurrency(booking.totalPrice)}</span>
              </div>
              
              {/* Dòng 2: Phí phạt (Chỉ hiện khi đã hủy) */}
              {isCancelled && penaltyAmount > 0 && (
                <div className="flex justify-between text-sm text-rose-600 bg-rose-50 p-2 rounded">
                  <span>Phí phạt hủy</span>
                  <span>- {formatCurrency(penaltyAmount)}</span>
                </div>
              )}

              {/* Dòng 3: Tổng kết */}
              <div className="flex justify-between items-center pt-2 mt-2 border-t border-slate-100">
                <span className="font-bold text-slate-800">
                    {/* Đổi chữ dựa theo trạng thái */}
                    {isCancelled ? "Tổng nhận được" : "Tổng thanh toán"}
                </span>
                <span className={`text-xl font-bold ${isCancelled ? "text-emerald-600" : "text-[#28A9E0]"}`}>
                    {/* Hiển thị giá trị đã trừ phí nếu hủy */}
                    {formatCurrency(isCancelled ? totalReceived : booking.totalPrice)}
                </span>
              </div>
            </div>
          </div>

          {/* Block 4: Policy */}
          <div className="bg-blue-50/50 p-4 rounded-lg flex gap-3 text-sm text-slate-600 border border-blue-100">
            <ShieldAlert size={20} className="text-blue-500 shrink-0" />
            <p>
              Miễn phí hủy phòng trong vòng 15 phút sau khi đặt. Sau đó áp dụng chính sách hoàn tiền của khách sạn.
              Vui lòng liên hệ bộ phận hỗ trợ nếu cần giúp đỡ.
            </p>
          </div>
        </div>

        {/* --- 3. FOOTER ACTIONS --- */}
        <div className="p-5 border-t bg-white flex justify-end gap-3 shrink-0">
          
          {/* Nút Hủy Phòng (Chỉ hiện khi chưa hủy) */}
          {!isCancelled && (booking.status === 'PENDING_PAYMENT' || booking.status === 'CONFIRMED') && (
            <Button 
              className="bg-rose-600 hover:bg-rose-700 text-white shadow-rose-100 border-none"
              onClick={onCancelClick}
            >
              Hủy phòng
            </Button>
          )}

          {/* Nút Thanh toán (Chỉ hiện khi chờ thanh toán) */}
          {booking.status === 'PENDING_PAYMENT' && (
            <Button variant="primary" onClick={handlePayment}>
              Thanh toán ngay
            </Button>
          )}

          {/* Nút Yêu Cầu Hoàn Tiền (Chỉ hiện khi Đã hủy + Đã thanh toán + Chưa hoàn) */}
          {isCancelled && 
           (booking.paymentStatus === 'APPROVED' || booking.paymentStatus === 'PAID') && 
           booking.paymentStatus !== 'REFUNDED' && (
            <Button 
                onClick={onRefundClick}
                className="bg-orange-500 hover:bg-orange-600 text-white border-none flex items-center gap-2"
            >
              <RefreshCcw size={18} />
              Yêu cầu hoàn tiền
            </Button>
          )}

          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailModal;