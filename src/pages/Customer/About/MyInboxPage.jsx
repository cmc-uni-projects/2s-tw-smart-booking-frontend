import React, { useState, useEffect } from 'react';
import CustomerLayout from "@/layouts/CustomerLayout/CustomerLayout";
import { useAuth } from '../../../context/AuthContext';
import { CheckCircle2, XCircle, Bell, X, Search } from 'lucide-react';
import inboxIllustration from '../../../assets/logo/inbox-illustration.png';

// === DỮ LIỆU GIẢ LẬP ===
const DUMMY_NOTIFICATIONS = [
  { id: 1, type: 'APPROVAL', title: 'Yêu cầu được duyệt', message: "Yêu cầu 'Trở thành chủ khách sạn' của bạn đã được phê duyệt.", createdAt: '2025-11-13T09:30:00Z', isRead: false },
  { id: 2, type: 'REJECTION', title: 'Yêu cầu bị từ chối', message: "Yêu cầu thêm khách sạn 'Khách sạn Sông Hàn' đã bị từ chối.", createdAt: '2025-11-12T15:00:00Z', isRead: true },
  { id: 3, type: 'GENERAL', title: 'Chào mừng đến với TravelMate', message: 'Cảm ơn bạn đã đăng ký tài khoản.', createdAt: '2025-11-11T10:00:00Z', isRead: true },
  ...Array.from({ length: 20 }, (_, i) => ({
    id: i + 4,
    type: ['APPROVAL', 'REJECTION', 'GENERAL'][i % 3],
    title: `Thông báo số ${i + 4}`,
    message: `Nội dung chi tiết của thông báo số ${i + 4}.`,
    createdAt: '2025-11-06T09:00:00Z',
    isRead: i % 2 === 0
  }))
];
// === KẾT THÚC DỮ LIỆU GIẢ LẬP ===

const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " năm trước";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " tháng trước";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " ngày trước";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " giờ trước";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " phút trước";
  return "Vài giây trước";
};

const getNotificationIcon = (type) => {
  switch (type) {
    case 'APPROVAL': return { icon: <CheckCircle2 size={18} />, class: "text-green-500" };
    case 'REJECTION': return { icon: <XCircle size={18} />, class: "text-red-500" };
    default: return { icon: <Bell size={18} />, class: "text-blue-500" };
  }
};

const MyInboxPage = () => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNoti, setSelectedNoti] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!currentUser) return;
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setNotifications(DUMMY_NOTIFICATIONS);
      } catch (err) {
        setError("Không thể tải thông báo. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [currentUser]);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const filteredNotifications = notifications
    .filter(n => {
      if (filter === 'UNREAD') return !n.isRead;
      if (filter === 'READ') return n.isRead;
      if (['APPROVAL', 'REJECTION', 'GENERAL'].includes(filter)) return n.type === filter;
      return true;
    })
    .filter(n => {
      const term = searchTerm.trim().toLowerCase();
      return (
        n.title.toLowerCase().includes(term) ||
        n.message.toLowerCase().includes(term) ||
        n.type.toLowerCase().includes(term)
      );
    });

  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const paginatedNotifications = filteredNotifications.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const renderContent = () => {
    if (loading) return <div className="p-16 text-center text-gray-500">Đang tải thông báo...</div>;
    if (error) return <div className="p-16 text-center text-red-600">{error}</div>;
    if (filteredNotifications.length === 0) {
      return (
        <div className="p-8 md:p-16 flex flex-col items-center text-center animate-fadeIn">
          <img src={inboxIllustration} alt="Hộp thư trống" className="w-full max-w-xs h-auto mb-8" />
          <h2 className="text-xl md:text-2xl font-semibold mb-2">Không tìm thấy thông báo</h2>
          <p className="text-gray-500">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
        </div>
      );
    }

    return (
      <>
        <div className="flex justify-between items-center p-4 border-b">
          <button onClick={markAllAsRead} className="text-sm text-blue-600 hover:underline">Đánh dấu tất cả là đã đọc</button>
          <div className="flex items-center gap-2">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tiêu đề, nội dung hoặc loại..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded px-2 py-1 text-sm w-64"
            />
          </div>
        </div>
        <ul className="divide-y divide-gray-200 animate-fadeIn">
          {paginatedNotifications.map((noti) => {
            const iconInfo = getNotificationIcon(noti.type);
            return (
              <li
                key={noti.id}
                onClick={() => {
                  setSelectedNoti(noti);
                  if (!noti.isRead) {
                    setNotifications(prev => prev.map(n => n.id === noti.id ? { ...n, isRead: true } : n));
                  }
                }}
                className={`flex items-start gap-4 p-4 md:p-6 cursor-pointer transition-transform hover:scale-[1.02] ${
                  !noti.isRead ? 'bg-blue-50' : 'bg-white'
                } hover:bg-gray-50`}
              >
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-gray-100`}>
                  {iconInfo.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold">{noti.title}</h3>
                  <p className="text-sm text-gray-600 mt-1 truncate">{noti.message}</p>
                  <p className="text-xs text-gray-400 mt-2">{formatTimeAgo(noti.createdAt)}</p>
                </div>
                {!noti.isRead && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" title="Chưa đọc" />}
              </li>
            );
          })}
        </ul>
        <div className="flex justify-center items-center gap-2 p-4">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-3 py-1 border rounded disabled:opacity-50">Trước</button>
          <span className="text-sm">Trang {currentPage}/{totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="px-3 py-1 border rounded disabled:opacity-50">Sau</button>
        </div>
      </>
    );
  };

  return (
    <CustomerLayout>
      <div className="bg-gray-50 min-h-screen flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg p-4 hidden md:block animate-fadeIn">
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-3">Trạng thái</h2>
            <ul className="space-y-2">
              <li>
                <button onClick={() => { setFilter('ALL'); setCurrentPage(1); }} className={`flex items-center gap-2 w-full px-3 py-2 rounded transition hover:bg-gray-100 ${filter === 'ALL' ? 'bg-blue-500 text-white' : ''}`}>
                  <Bell size={18} /> Tất cả
                </button>
              </li>
              <li>
                <button onClick={() => { setFilter('UNREAD'); setCurrentPage(1); }} className={`flex items-center gap-2 w-full px-3 py-2 rounded transition hover:bg-gray-100 ${filter === 'UNREAD' ? 'bg-blue-500 text-white' : ''}`}>
                  <span className="w-2.5 h-2.5 bg-blue-500 rounded-full"></span> Chưa đọc
                </button>
              </li>
              <li>
                <button onClick={() => { setFilter('READ'); setCurrentPage(1); }} className={`flex items-center gap-2 w-full px-3 py-2 rounded transition hover:bg-gray-100 ${filter === 'READ' ? 'bg-blue-500 text-white' : ''}`}>
                  ✓ Đã đọc
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-3">Loại thông báo</h2>
            <ul className="space-y-2">
              <li>
                <button onClick={() => { setFilter('APPROVAL'); setCurrentPage(1); }} className={`flex items-center gap-2 w-full px-3 py-2 rounded transition hover:bg-gray-100 ${filter === 'APPROVAL' ? 'bg-blue-500 text-white' : ''}`}>
                  <CheckCircle2 size={18} className="text-green-500" /> Duyệt
                </button>
              </li>
              <li>
                <button onClick={() => { setFilter('REJECTION'); setCurrentPage(1); }} className={`flex items-center gap-2 w-full px-3 py-2 rounded transition hover:bg-gray-100 ${filter === 'REJECTION' ? 'bg-blue-500 text-white' : ''}`}>
                  <XCircle size={18} className="text-red-500" /> Từ chối
                </button>
              </li>
              <li>
                <button onClick={() => { setFilter('GENERAL'); setCurrentPage(1); }} className={`flex items-center gap-2 w-full px-3 py-2 rounded transition hover:bg-gray-100 ${filter === 'GENERAL' ? 'bg-blue-500 text-white' : ''}`}>
                  <Bell size={18} className="text-blue-500" /> Chung
                </button>
              </li>
            </ul>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 w-full py-6 text-white shadow-sm">
            <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-1">Hộp thư của tôi</h1>
                <p className="text-sm text-blue-100">Xin chào, {currentUser?.name || 'Người dùng'}!</p>
              </div>
            </div>
          </div>
          <div className="max-w-4xl mx-auto p-4 md:p-8">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              {renderContent()}
            </div>
          </div>
        </div>

        {/* Modal chi tiết */}
        {selectedNoti && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
              <button onClick={() => setSelectedNoti(null)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
              <h2 className="text-xl font-bold mb-2">{selectedNoti.title}</h2>
              <p className="text-gray-600 mb-4">{selectedNoti.message}</p>
              <p className="text-xs text-gray-400 mb-4">Thời gian: {new Date(selectedNoti.createdAt).toLocaleString()}</p>
            </div>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
};

export default MyInboxPage;