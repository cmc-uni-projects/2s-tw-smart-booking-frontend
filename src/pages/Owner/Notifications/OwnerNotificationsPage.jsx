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

    // --- MAP DỊCH THUẬT ---
    const TYPE_LABELS = {
        ALL: "Tất cả",
        SUCCESS: "Thành công",
        WARNING: "Cảnh báo",
        ERROR: "Lỗi",
        INFO: "Thông tin"
    };

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            // Nếu backend hỗ trợ filter thì truyền thêm params filterType ở đây
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

    const getBorderColor = (type) => {
        switch (type) {
            case 'SUCCESS': return 'border-l-green-500';
            case 'WARNING': return 'border-l-orange-500';
            case 'ERROR': return 'border-l-red-500';
            default: return 'border-l-blue-500';
        }
    };

    // Filter local nếu backend chưa hỗ trợ
    const filteredNotifications = filterType === "ALL" 
        ? notifications 
        : notifications.filter(n => n.type === filterType);

    return (
        <div className="space-y-6 fade-in-up">
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Bell className="text-teal-600" />
                        Thông báo hệ thống
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Cập nhật tất cả các hoạt động liên quan đến tài sản của bạn</p>
                </div>
                <button 
                    onClick={handleMarkAllRead}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm font-medium"
                >
                    <CheckCheck size={18} className="text-blue-600" />
                    Đánh dấu tất cả đã đọc
                </button>
            </div>

            {/* --- FILTERS (ĐÃ VIỆT HÓA) --- */}
            <div className="flex flex-wrap gap-3">
                {['ALL', 'SUCCESS', 'WARNING', 'ERROR'].map(type => (
                    <button
                        key={type}
                        onClick={() => setFilterType(type)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            filterType === type 
                            ? 'bg-teal-600 text-white shadow-md' 
                            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                        }`}
                    >
                        {TYPE_LABELS[type]}
                    </button>
                ))}
            </div>

            {/* --- LIST --- */}
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
                            className={`group relative bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer border-l-4 ${getBorderColor(item.type)} 
                                ${!item.isRead ? 'bg-blue-50/30' : ''}
                            `}
                        >
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        {/* Badge loại thông báo */}
                                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase border 
                                            ${item.type === 'SUCCESS' ? 'text-green-600 border-green-200 bg-green-50' : 
                                              item.type === 'WARNING' ? 'text-orange-600 border-orange-200 bg-orange-50' : 
                                              item.type === 'ERROR' ? 'text-red-600 border-red-200 bg-red-50' : 
                                              'text-blue-600 border-blue-200 bg-blue-50'}`}>
                                            {TYPE_LABELS[item.type] || item.type}
                                        </span>
                                        <h3 className={`text-base ${!item.isRead ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                                            {item.title}
                                        </h3>
                                    </div>
                                    
                                    <p className="text-gray-600 text-sm leading-relaxed">{item.message}</p>
                                    
                                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-400 font-medium">
                                        <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                                            <Calendar size={12} />
                                            {new Date(item.createdAt).toLocaleString('vi-VN')}
                                        </span>
                                        {!item.isRead && <span className="text-blue-600 font-bold">• Chưa đọc</span>}
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
                    <p className="text-gray-500 font-medium">Bạn chưa có thông báo nào</p>
                </div>
            )}

            {/* --- PAGINATION --- */}
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