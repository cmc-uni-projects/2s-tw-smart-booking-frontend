import React from "react";
import { 
  X, Calendar, MapPin, User, CreditCard, 
  CheckCircle, AlertCircle, BedDouble, Receipt, 
  Phone, Mail, UserCircle, Clock, ShieldAlert
} from "lucide-react";
import Button from "../../../components/common/Button/Button";

// API Base URL
const API_BASE_URL = "http://localhost:8386"; // Sửa port nếu cần
const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/800x400?text=No+Image";
    if (path.startsWith("http")) return path;
    return `${API_BASE_URL}/${path}`;
};

const BookingDetailModal = ({ isOpen, onClose, booking, onCancelClick, onRefundClick }) => {
  if (!isOpen || !booking) return null;

  // Helpers
  const formatCurrency = (val) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);
  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("vi-VN", { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' });

  // Badge Status Config
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

  // Payment Badge
  const renderPaymentBadge = () => {
    const status = booking.paymentStatus;
    if (status === 'APPROVED' || status === 'PAID') {
        return <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-bold flex items-center gap-1"><CheckCircle size={12}/> Đã thanh toán</span>;
    } else if (status === 'REFUNDED') {
        return <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-bold flex items-center gap-1"><CheckCircle size={12}/> Đã hoàn tiền</span>;
    } else if (status === 'REFUND_REQUESTED') {
        return <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-bold flex items-center gap-1"><Clock size={12}/> Chờ hoàn tiền</span>;
    }
    return <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-bold flex items-center gap-1"><AlertCircle size={12}/> Chưa thanh toán</span>;
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* HEADER */}
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
                {booking.propertyName}
              </h2>
            </div>
            <div className="hidden md:block">
              {renderStatusBadge()}
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50/50">
          <div className="md:hidden flex justify-center">{renderStatusBadge()}</div>

          {/* 1. Thông tin Lưu trú */}
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4 border-b pb-2">
              <BedDouble size={18} className="text-blue-500" /> Thông tin lưu trú
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <p className="text-xs text-slate-400 uppercase font-bold">Loại phòng</p>
                    <p className="font-medium text-slate-800 text-lg">{booking.roomName}</p>
                </div>
                <div>
                    <p className="text-xs text-slate-400 uppercase font-bold">Khách</p>
                    <div className="flex items-center gap-2 font-medium text-slate-800">
                        <User size={16} /> {booking.guestCount} người
                    </div>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <p className="text-xs text-blue-600 font-bold mb-1">Nhận phòng</p>
                    <div className="flex items-center gap-2 font-bold text-slate-800">
                        <Calendar size={16} /> {formatDate(booking.checkInDate)}
                    </div>
                </div>
                <div className="bg-slate-100 p-3 rounded-lg border border-slate-200">
                    <p className="text-xs text-slate-500 font-bold mb-1">Trả phòng</p>
                    <div className="flex items-center gap-2 font-bold text-slate-800">
                        <Calendar size={16} /> {formatDate(booking.checkOutDate)}
                    </div>
                </div>
            </div>
            <div className="mt-4 pt-3 border-t border-dashed border-slate-200 flex items-start gap-2 text-sm text-slate-500">
                <MapPin size={16} className="shrink-0 mt-0.5 text-slate-400" />
                {booking.propertyAddress}
            </div>
          </div>

          {/* 2. Thông tin Liên hệ (Từ User Object) */}
          {booking.user && (
            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4 border-b pb-2">
                <UserCircle size={18} className="text-blue-500" /> Thông tin liên hệ
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                        <User size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400">Người đặt</p>
                        <p className="text-sm font-bold text-slate-800">{booking.user.fullName}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                        <Mail size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400">Email</p>
                        <p className="text-sm font-medium text-slate-800 truncate">{booking.user.email}</p>
                    </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. Chi tiết Thanh toán */}
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <CreditCard size={18} className="text-blue-500" /> Chi tiết thanh toán
              </h3>
              {renderPaymentBadge()}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Giá trị đơn hàng</span>
                <span className="font-medium text-slate-700">{formatCurrency(booking.totalPrice)}</span>
              </div>
              
              {booking.penaltyAmount > 0 && (
                <div className="flex justify-between text-rose-600 bg-rose-50 p-2 rounded">
                  <span>Phí phạt hủy</span>
                  <span>- {formatCurrency(booking.penaltyAmount)}</span>
                </div>
              )}

              {booking.refundAmount > 0 && (
                <div className="flex justify-between text-emerald-600 bg-emerald-50 p-2 rounded font-bold">
                  <span>Số tiền hoàn lại</span>
                  <span>+ {formatCurrency(booking.refundAmount)}</span>
                </div>
              )}

              <div className="flex justify-between items-center pt-3 mt-2 border-t border-slate-100">
                <span className="font-bold text-slate-800 text-base">Tổng cộng</span>
                <span className="text-2xl font-bold text-blue-600">{formatCurrency(booking.totalPrice)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="p-5 border-t bg-white flex justify-end gap-3 shrink-0">
          
          {/* Nút Hủy Phòng */}
          {(booking.status === 'PENDING_PAYMENT' || booking.status === 'CONFIRMED') && (
            <Button variant="dangerSoft" onClick={onCancelClick}>
              Hủy phòng
            </Button>
          )}

          {/* Nút Thanh toán */}
          {booking.status === 'PENDING_PAYMENT' && (
            <Button variant="primary" onClick={() => alert("Chức năng thanh toán đang phát triển!")}>
              Thanh toán ngay
            </Button>
          )}

          {/* Nút Yêu cầu Hoàn tiền */}
          {booking.status === 'CANCELLED' && 
           booking.refundAmount > 0 && 
           (booking.paymentStatus === 'APPROVED' || booking.paymentStatus === 'PAID') && (
            <Button variant="secondary" onClick={onRefundClick}>
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