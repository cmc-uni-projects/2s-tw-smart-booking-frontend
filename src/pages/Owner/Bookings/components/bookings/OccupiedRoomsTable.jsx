import React from "react";
import { LogIn, LogOut, Eye } from "lucide-react";

const OccupiedRoomsTable = ({ data, loading, onCheckIn, onCheckOut, onViewDetail }) => {
  
  const formatDate = (date) => {
      if (!date) return "---";
      return new Date(date).toLocaleDateString('vi-VN');
  };

  if (loading) {
      return <div className="p-12 text-center text-slate-500">Đang tải dữ liệu...</div>;
  }
  
  if (!data || data.length === 0) {
      return <div className="p-12 text-center text-slate-500 italic">Không có dữ liệu phù hợp.</div>;
  }

  // Helper để hiển thị trạng thái tiếng Việt đẹp hơn
  const renderStatusLabel = (status) => {
      switch (status) {
          case 'PENDING_PAYMENT': return 'Chờ thanh toán';
          case 'CONFIRMED': return 'Sắp đến';
          case 'CHECKED_IN': return 'Đang lưu trú';
          case 'COMPLETED': return 'Hoàn thành';
          case 'CANCELLED': return 'Đã hủy';
          default: return status;
      }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold border-b border-slate-200">
          <tr>
            <th className="px-6 py-4">Mã Đơn</th>
            <th className="px-6 py-4">Phòng</th>
            <th className="px-6 py-4">Khách Hàng</th>
            <th className="px-6 py-4">Lịch Trình</th>
            <th className="px-6 py-4 text-center">Trạng Thái</th>
            <th className="px-6 py-4 text-right">Thao Tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((item) => (
            <tr key={item.bookingId} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 font-bold text-blue-600">
                  {item.bookingCode || `BK-${item.bookingId}`}
              </td>
              <td className="px-6 py-4">
                <p className="font-medium text-slate-800">{item.roomName}</p>
                {/* Nếu có số phòng thì hiện, không thì ẩn */}
                {item.roomNumber && <p className="text-xs text-slate-500">P. {item.roomNumber}</p>}
              </td>
              <td className="px-6 py-4">
                <p className="font-medium text-slate-800">{item.customerName}</p>
                <p className="text-xs text-slate-500">{item.phone || "---"}</p>
              </td>
              <td className="px-6 py-4 text-slate-600">
                <div className="flex items-center gap-1 text-xs">
                    <span className="font-medium">{formatDate(item.checkIn)}</span> 
                    <span>➝</span> 
                    <span className="font-medium">{formatDate(item.checkOut)}</span>
                </div>
                <div className="text-xs text-slate-400 mt-1">
                    {item.guestCount}
                </div>
              </td>
              <td className="px-6 py-4 text-center">
                <span className={`px-2 py-1 rounded text-xs font-bold border ${
                    item.status === 'CONFIRMED' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    item.status === 'CHECKED_IN' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    item.status === 'PENDING_PAYMENT' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    item.status === 'CANCELLED' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                    'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
                    {renderStatusLabel(item.status)}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                    
                    {/* 🟢 Nút Check-in (Chỉ hiện khi khách sắp đến - CONFIRMED) */}
                    {item.status === 'CONFIRMED' && (
                        <button 
                            onClick={() => onCheckIn(item.bookingId)}
                            className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                            title="Check In (Khách nhận phòng)"
                        >
                            <LogIn size={16} />
                        </button>
                    )}

                    {/* 🔴 Nút Check-out (Chỉ hiện khi khách đang ở - CHECKED_IN) */}
                    {item.status === 'CHECKED_IN' && (
                        <button 
                            onClick={() => onCheckOut(item.bookingId)}
                            className="p-2 bg-emerald-100 text-emerald-600 rounded hover:bg-emerald-200 transition-colors"
                            title="Check Out (Khách trả phòng)"
                        >
                            <LogOut size={16} />
                        </button>
                    )}

                    {/* ⚪ Nút Xem Chi Tiết (Luôn hiện) */}
                    <button 
                        onClick={() => onViewDetail(item)}
                        className="p-2 bg-slate-100 text-slate-600 rounded hover:bg-slate-200 transition-colors border border-slate-200"
                        title="Xem chi tiết"
                    >
                        <Eye size={16} />
                    </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OccupiedRoomsTable;