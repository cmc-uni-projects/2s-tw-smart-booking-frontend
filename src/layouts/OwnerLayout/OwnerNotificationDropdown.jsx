import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { 
    Bell, CheckCheck, Clock, Info, AlertTriangle, CheckCircle, XCircle 
} from "lucide-react";
import notificationService from "../../services/notification.service";
import Avatar from "../../components/common/Avatar/Avatar";

const OwnerNotificationDropdown = () => {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    
    const dropdownRef = useRef(null);

    // --- 1. Gọi API lấy thông báo ---
    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const data = await notificationService.getNotifications(0, 5); // Lấy 5 tin mới nhất
            if (data && data.content) {
                setNotifications(data.content);
                // Nếu API trả về unreadCount trong object data thì dùng luôn, không thì gọi API riêng
                setUnreadCount(data.unreadCount !== undefined ? data.unreadCount : 0);
            }
        } catch (error) {
            console.error("Failed to load notifications");
        } finally {
            setLoading(false);
        }
    };

    // Gọi lần đầu và thiết lập interval (tuỳ chọn)
    useEffect(() => {
        fetchNotifications();
        
        // Polling: Cập nhật mỗi 60s (hoặc dùng WebSocket nếu có)
        const interval = setInterval(fetchNotifications, 60000); 
        return () => clearInterval(interval);
    }, []);

    // Đóng dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // --- 2. Xử lý hành động ---
    const handleMarkAllRead = async () => {
        await notificationService.markAllAsRead();
        setUnreadCount(0);
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    const handleNotificationClick = async (notification) => {
        if (!notification.isRead) {
            await notificationService.markAsRead(notification.id);
            setUnreadCount(prev => Math.max(0, prev - 1));
            setNotifications(prev => 
                prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
            );
        }
        setOpen(false);
    };

    // --- 3. Helper hiển thị ---
    const getIcon = (type) => {
        switch (type) {
            case 'SUCCESS': return <CheckCircle size={18} className="text-green-500" />;
            case 'WARNING': return <AlertTriangle size={18} className="text-orange-500" />;
            case 'ERROR': return <XCircle size={18} className="text-red-500" />;
            case 'INFO': 
            default: return <Info size={18} className="text-blue-500" />;
        }
    };

    const formatTime = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / 60000);
        
        if (diffInMinutes < 1) return "Vừa xong";
        if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`;
        return date.toLocaleDateString("vi-VN");
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* --- TRIGGER BUTTON --- */}
            <button 
                onClick={() => {
                    setOpen(!open);
                    if (!open) fetchNotifications(); // Refresh khi mở
                }}
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600 hover:text-blue-600 focus:outline-none"
            >
                <Bell size={22} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm border-2 border-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* --- DROPDOWN PANEL --- */}
            {open && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden z-50 animate-fade-in-up origin-top-right ring-1 ring-black/5">
                    
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between bg-white">
                        <h3 className="font-bold text-gray-800">Thông báo</h3>
                        {unreadCount > 0 && (
                            <button 
                                onClick={handleMarkAllRead}
                                className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                            >
                                <CheckCheck size={14} />
                                Đánh dấu đã đọc
                            </button>
                        )}
                    </div>

                    {/* Notification List */}
                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar bg-gray-50/50">
                        {loading && notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-400">
                                <div className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-blue-500 rounded-full mb-2"></div>
                                <p className="text-xs">Đang tải...</p>
                            </div>
                        ) : notifications.length > 0 ? (
                            <div className="divide-y divide-gray-100">
                                {notifications.map((item) => (
                                    <div 
                                        key={item.id}
                                        onClick={() => handleNotificationClick(item)}
                                        className={`flex gap-3 px-4 py-3.5 hover:bg-gray-50 cursor-pointer transition-colors relative
                                            ${!item.isRead ? 'bg-white' : 'bg-gray-50/30 opacity-70'}
                                        `}
                                    >
                                        {/* Status Icon */}
                                        <div className="flex-shrink-0 mt-0.5">
                                            <div className={`p-2 rounded-full ${!item.isRead ? 'bg-blue-50' : 'bg-gray-100'}`}>
                                                {getIcon(item.type)}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm leading-snug mb-1 ${!item.isRead ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                                                {item.title}
                                            </p>
                                            <p className="text-xs text-gray-500 line-clamp-2">
                                                {item.message}
                                            </p>
                                            <div className="flex items-center gap-1 mt-1.5 text-[10px] text-gray-400 font-medium">
                                                <Clock size={10} />
                                                <span>{formatTime(item.createdAt)}</span>
                                            </div>
                                        </div>

                                        {/* Unread Dot */}
                                        {!item.isRead && (
                                            <div className="absolute top-4 right-4 w-2 h-2 bg-blue-500 rounded-full"></div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                                <div className="bg-gray-100 p-3 rounded-full mb-3">
                                    <Bell size={24} className="text-gray-400" />
                                </div>
                                <p className="text-gray-800 font-medium text-sm">Không có thông báo mới</p>
                                <p className="text-gray-500 text-xs mt-1">Khi có cập nhật mới, chúng sẽ hiện ở đây.</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <Link 
                        to="/owner/notifications" 
                        onClick={() => setOpen(false)}
                        className="block bg-white border-t border-gray-100 px-4 py-3 text-center text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-gray-50 transition-colors"
                    >
                        Xem tất cả thông báo
                    </Link>
                </div>
            )}
        </div>
    );
};

export default OwnerNotificationDropdown;