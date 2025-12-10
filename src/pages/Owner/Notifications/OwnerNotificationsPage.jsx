import React, { useEffect, useState } from "react";
import { 
    CheckCheck, Bell, Calendar 
} from "lucide-react";
import notificationService from "@/services/notification.service";
import LoadingOverlay from "@/components/common/Loading/LoadingOverlay";
import Pagination from "@/pages/Owner/Bookings/components/common/Pagination";

const OwnerNotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [filterType, setFilterType] = useState("ALL");

    // ✅ SỬA LẠI: NGÔN NGỮ NGHIỆP VỤ (Thay vì Lỗi/Cảnh báo)
    const TYPE_LABELS = {
        ALL: "Tất cả",
        SUCCESS: "Thành công",      // Đặt phòng, Thanh toán
        WARNING: "Cần chú ý",       // Hoàn tiền, Thay đổi lịch
        ERROR: "Đã hủy",            // Khách hủy, Từ chối
        INFO: "Thông tin"           // Tin tức chung
    };

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const data = await notificationService.getNotifications(page, 10);
            if (data) {
                setNotifications(data.content || []);
                setTotalPages(data.totalPages || 1);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [page]);

    const handleMarkAllRead = async () => {
        await notificationService.markAllAsRead();
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    const handleMarkRead = async (id) => {
        await notificationService.markAsRead(id);
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    };

    // Giữ nguyên màu sắc để phân loại mức độ quan trọng
    const getBorderColor = (type) => {
        switch (type) {
            case 'SUCCESS': return 'border-l-green-500';
            case 'WARNING': return 'border-l-orange-500'; 
            case 'ERROR': return 'border-l-rose-500'; // Màu đỏ hồng nhẹ hơn chút cho đỡ gắt
            default: return 'border-l-blue-500';
        }
    };

    // Filter local
    const filteredNotifications = filterType === "ALL" 
        ? notifications 
        : notifications.filter(n => n.type === filterType);

    return (
        <div className="space-y-6 fade-in-up">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Bell className="text-teal-600" />
                        Thông báo hệ thống
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Cập nhật hoạt động đặt phòng và tài chính</p>
                </div>
                <button 
                    onClick={handleMarkAllRead}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm font-medium"
                >
                    <CheckCheck size={18} className="text-blue-600" />
                    Đánh dấu tất cả đã đọc
                </button>
            </div>

            {/* FILTERS */}
            <div className="flex flex-wrap gap-3">
                {['ALL', 'SUCCESS', 'WARNING', 'ERROR'].map(type => (
                    <button
                        key={type}
                        onClick={() => setFilterType(type)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                            filterType === type 
                            ? 'bg-teal-600 text-white border-teal-600 shadow-md' 
                            : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-200'
                        }`}
                    >
                        {TYPE_LABELS[type]}
                    </button>
                ))}
            </div>

            {/* LIST */}
            {loading ? (
                <div className="h-64 flex items-center justify-center">
                    <LoadingOverlay isLoading={true} />
                </div>
            ) : filteredNotifications.length > 0 ? (
                <div className="space-y-3">
                    {filteredNotifications.map((item) => (
                        <div 
                            key={item.id}
                            onClick={() => handleMarkRead(item.id)}
                            className={`group relative bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer border-l-[4px] ${getBorderColor(item.type)} 
                                ${!item.isRead ? 'bg-blue-50/40' : ''}
                            `}
                        >
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        {/* ✅ SỬA: Badge hiển thị text nghiệp vụ thay vì code */}
                                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase border tracking-wide
                                            ${item.type === 'SUCCESS' ? 'text-green-700 border-green-200 bg-green-50' : 
                                              item.type === 'WARNING' ? 'text-orange-700 border-orange-200 bg-orange-50' : 
                                              item.type === 'ERROR' ? 'text-rose-700 border-rose-200 bg-rose-50' : 
                                              'text-blue-700 border-blue-200 bg-blue-50'}`}>
                                            {TYPE_LABELS[item.type]}
                                        </span>
                                        <h3 className={`text-base ${!item.isRead ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                                            {item.title}
                                        </h3>
                                    </div>
                                    
                                    <p className="text-gray-600 text-sm leading-relaxed">{item.message}</p>
                                    
                                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-400 font-medium">
                                        <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-gray-500">
                                            <Calendar size={12} />
                                            {new Date(item.createdAt).toLocaleString('vi-VN')}
                                        </span>
                                        {!item.isRead && <span className="text-blue-600 font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span> Chưa đọc</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                    <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Bell className="text-gray-300" size={32} />
                    </div>
                    <p className="text-gray-500 font-medium">Không tìm thấy thông báo nào</p>
                </div>
            )}

            {/* PAGINATION */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                    <Pagination 
                        currentPage={page + 1} 
                        totalPages={totalPages} 
                        onPageChange={(p) => setPage(p - 1)} 
                    />
                </div>
            )}
        </div>
    );
};


export default OwnerNotificationsPage;