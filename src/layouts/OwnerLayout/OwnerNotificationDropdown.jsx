import React from "react";
import { Link } from "react-router-dom";
import { Bell, Check, Clock, Info, AlertCircle, CheckCircle2 } from "lucide-react";
import Button from "@/components/common/Button/Button";

// Mock data thông báo (Sau này thay bằng API)
const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: "Đặt phòng mới #BK-2024001",
    message: "Nguyễn Văn A vừa đặt phòng Deluxe tại Ocean Villa.",
    time: "5 phút trước",
    type: "booking", // booking, system, alert
    isRead: false,
  },
  {
    id: 2,
    title: "Cập nhật chính sách",
    message: "Hệ thống vừa cập nhật chính sách hủy phòng mới.",
    time: "1 giờ trước",
    type: "system",
    isRead: false,
  },
  {
    id: 3,
    title: "Thanh toán thành công",
    message: "Bạn đã nhận được thanh toán 2.500.000đ.",
    time: "1 ngày trước",
    type: "alert",
    isRead: true,
  },
];

const OwnerNotificationDropdown = () => {
  
  const getIcon = (type) => {
    switch (type) {
      case 'booking': return <CheckCircle2 size={18} className="text-green-500" />;
      case 'alert': return <AlertCircle size={18} className="text-orange-500" />;
      default: return <Info size={18} className="text-blue-500" />;
    }
  };

  return (
    <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border border-gray-100 rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] z-50 overflow-hidden animate-fadeIn origin-top-right ring-1 ring-black/5">
      
      {/* 1. Header Gradient */}
      <div className="bg-gradient-to-r from-[rgb(40,169,224)] to-[#006494] p-4 flex justify-between items-center text-white">
        <h3 className="font-bold text-lg flex items-center gap-2">
           <Bell size={18} /> Thông báo
        </h3>
        <button className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-colors text-white">
           Đánh dấu đã đọc
        </button>
      </div>

      {/* 2. Danh sách thông báo */}
      <div className="max-h-[400px] overflow-y-auto">
        {MOCK_NOTIFICATIONS.length > 0 ? (
          <ul className="divide-y divide-gray-50">
            {MOCK_NOTIFICATIONS.map((item) => (
              <li key={item.id} className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer group ${!item.isRead ? 'bg-blue-50/30' : ''}`}>
                <div className="flex gap-3">
                  {/* Icon Type */}
                  <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${!item.isRead ? 'bg-white shadow-sm' : 'bg-gray-100'}`}>
                     {getIcon(item.type)}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                       <h4 className={`text-sm ${!item.isRead ? 'font-bold text-gray-800' : 'font-medium text-gray-600'}`}>
                          {item.title}
                       </h4>
                       {!item.isRead && <span className="w-2 h-2 bg-red-500 rounded-full mt-1.5"></span>}
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-1 leading-relaxed group-hover:text-gray-700">
                       {item.message}
                    </p>
                    <span className="text-[10px] text-gray-400 flex items-center gap-1">
                       <Clock size={10} /> {item.time}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-8 text-center text-gray-500">
             <Bell size={40} className="mx-auto text-gray-200 mb-2" />
             <p className="text-sm">Không có thông báo mới</p>
          </div>
        )}
      </div>

      {/* 3. Footer */}
      <div className="p-2 bg-gray-50 border-t border-gray-100 text-center">
        <Link to="/owner/notifications" className="text-xs font-semibold text-[rgb(40,169,224)] hover:underline">
           Xem tất cả thông báo
        </Link>
      </div>
    </div>
  );
};

export default OwnerNotificationDropdown;