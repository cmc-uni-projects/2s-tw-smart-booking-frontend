// src/pages/Customer/About/MyInboxPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { 
  CheckCircle2, XCircle, Bell, X, Search, 
  MoreVertical, Mail, Trash2,
  AlertTriangle 
} from 'lucide-react';
import inboxIllustration from '../../../assets/logo/inbox-illustration.png';
import { useNavigate } from 'react-router-dom';
import { authService } from "@/services/auth.service";
import Button from "@/components/common/Button/Button";

const DUMMY_NOTIFICATIONS = [
  { id: 1, type: 'APPVAL', title: 'Yêu cầu được duyệt', message: "Yêu cầu 'Trở thành chủ khách sạn' của bạn đã được phê duyệt.", createdAt: '2025-11-13T09:30:00Z', isRead: false },
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

const typeToVietnamese = {
  'APPROVAL': 'duyệt',
  'REJECTION': 'từ chối',
  'GENERAL': 'chung'
};

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
  const { currentUser, updateUser, logout, hasRole } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNoti, setSelectedNoti] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState(''); 
  const [currentSearchTerm, setCurrentSearchTerm] = useState(''); 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [openMenuId, setOpenMenuId] = useState(null);
  const [notificationToDelete, setNotificationToDelete] = useState(null);
  const [isRefreshingRole, setIsRefreshingRole] = useState(false);

  const activeFilterClass = "bg-[rgb(40,169,224)] text-white hover:bg-[#1b98d6]";

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchTerm]); 

  useEffect(() => {
    const fetchNotifications = () => {
      if (!currentUser) return;
      setLoading(true);
      try {
        setNotifications(DUMMY_NOTIFICATIONS);
      } catch (err) {
        setError("Không thể tải thông báo. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [currentUser]);

  const handleAccessOwnerChannel = async () => {
    setIsRefreshingRole(true);
    if (hasRole("OWNER")) {
      navigate("/owner");
      setIsRefreshingRole(false);
      return;
    }
    try {
      const res = await authService.getMe();
      if (res.data.success && res.data.data) {
        const backendUser = res.data.data;
        const newRoles = backendUser.authorities.map(a => a.authority.replace("ROLE_", ""));
        if (newRoles.includes("OWNER")) {
          const userForContext = {
            ...currentUser,
            userId: backendUser.userId,
            fullName: backendUser.fullName,
            email: backendUser.email,
            isEmailVerified: backendUser.emailVerified,
            status: backendUser.status,
            roles: newRoles,
          };
          updateUser(userForContext);
          navigate("/owner");
        } else {
          alert("Đơn của bạn vẫn đang chờ. Vui lòng thử lại sau.");
        }
      }
    } catch (error) {
      console.error("Lỗi khi làm mới quyền:", error);
      alert("Có lỗi xảy ra, vui lòng đăng nhập lại.");
      logout();
    } finally {
      setIsRefreshingRole(false);
      setSelectedNoti(null);
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };
  const handleMarkAsUnread = (e, id) => {
    e.stopPropagation(); 
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: false } : n));
    setOpenMenuId(null); 
  };
  const promptDelete = (e, id) => {
    e.stopPropagation(); 
    setOpenMenuId(null); 
    setNotificationToDelete(id); 
  };
  const handleDeleteConfirm = () => {
    if (!notificationToDelete) return;
    setNotifications(prev => prev.filter(n => n.id !== notificationToDelete));
    setNotificationToDelete(null); 
  };
  const handleDeleteCancel = () => {
    setNotificationToDelete(null); 
  };
  const handleMenuToggle = (e, id) => {
    e.stopPropagation(); 
    setOpenMenuId(prevId => (prevId === id ? null : id)); 
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
      if (!term) return true;
      const vietnameseType = (typeToVietnamese[n.type] || '').toLowerCase();
      return (
        n.title.toLowerCase().includes(term) ||
        n.message.toLowerCase().includes(term) ||
        n.type.toLowerCase().includes(term) ||
        vietnameseType.includes(term)
      );
    });

  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const paginatedNotifications = filteredNotifications.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const renderContent = () => {
    if (loading) return <div className="p-16 text-center text-gray-500">Đang tải thông báo...</div>;
    if (error) return <div className="p-16 text-center text-red-600">{error}</div>;
    if (!loading && !error && filteredNotifications.length === 0) {
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
        <div className="flex flex-col md:flex-row justify-between items-center p-4 border-b gap-4">
          <button onClick={markAllAsRead} className="text-sm text-blue-600 hover:underline">
            Đánh dấu tất cả là đã đọc
          </button>
          <div className="relative w-full md:w-auto">
            <Search size={18} className="text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm và nhấn Enter..."
              value={currentSearchTerm} 
              onChange={(e) => setCurrentSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setSearchTerm(e.target.value); 
                }
              }}
              className="border rounded px-2 py-1 text-sm w-full md:w-64 pl-10" 
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
                  setOpenMenuId(null); 
                  if (!noti.isRead) {
                    setNotifications(prev => prev.map(n => n.id === noti.id ? { ...n, isRead: true } : n));
                  }
                }}
                className={`relative flex items-start gap-4 p-4 md:p-6 cursor-pointer ${
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
                
                <div className="w-2.5 flex-shrink-0 mt-1.5">
                    {!noti.isRead && (
                        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" title="Chưa đọc" />
                    )}
                </div>
                
                <div className="relative z-20 flex-shrink-0 ml-2">
                  <button
                    onClick={(e) => handleMenuToggle(e, noti.id)}
                    className="p-2 rounded-full text-gray-500 hover:bg-gray-200"
                    aria-label="Tùy chọn"
                  >
                    <MoreVertical size={18} />
                  </button>

                  {openMenuId === noti.id && (
                    <div 
                      className="absolute top-full right-0 mt-1 bg-white shadow-lg rounded-lg border w-56"
                      onClick={(e) => e.stopPropagation()} 
                    >
                      <ul className="py-2">
                        {noti.isRead && (
                          <li 
                            onClick={(e) => handleMarkAsUnread(e, noti.id)} 
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                          >
                            <Mail size={16} /> Đánh dấu là chưa đọc
                          </li>
                        )}

                        <li 
                          onClick={(e) => promptDelete(e, noti.id)} 
                          className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                        >
                          <Trash2 size={16} /> Xoá thông báo
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
        
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 p-4">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-3 py-1 border rounded disabled:opacity-50">Trước</button>
            <span className="text-sm">Trang {currentPage}/{totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="px-3 py-1 border rounded disabled:opacity-50">Sau</button>
          </div>
        )}
      </>
    );
  };

  return (
    <>
      {openMenuId && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setOpenMenuId(null)} 
        />
      )}

      <div className="bg-gray-50 min-h-screen pt-6">
        <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col md:flex-row gap-8">
          
          {/* SIDEBAR */}
          <aside className="w-full md:w-64 bg-white shadow-lg rounded-lg p-6 h-fit flex-shrink-0 animate-fadeIn">
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-3">Trạng thái</h2>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => { 
                      setFilter('ALL'); 
                      setSearchTerm('');
                      setCurrentSearchTerm(''); 
                    }} 
                    className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition ${filter === 'ALL' ? activeFilterClass : 'hover:bg-gray-100'}`}
                  >
                    <Bell size={18} /> Tất cả
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setFilter('UNREAD')} 
                    className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition ${filter === 'UNREAD' ? activeFilterClass : 'hover:bg-gray-100'}`}
                  >
                    <span className="w-2.5 h-2.5 bg-blue-500 rounded-full ml-1 mr-0.5"></span> Chưa đọc
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setFilter('READ')} 
                    className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition ${filter === 'READ' ? activeFilterClass : 'hover:bg-gray-100'}`}
                  >
                    <CheckCircle2 size={18} /> Đã đọc
                  </button>
                </li>
              </ul>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Hộp thư của tôi</h1>
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL Xem chi tiết */}
      {selectedNoti && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <button onClick={() => setSelectedNoti(null)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-2">{selectedNoti.title}</h2>
            <p className="text-gray-600 mb-4">{selectedNoti.message}</p>
            <p className="text-xs text-gray-400 mb-6">Thời gian: {new Date(selectedNoti.createdAt).toLocaleString()}</p>

            {selectedNoti.type === 'APPROVAL' && (
              <Button
                fullWidth
                onClick={handleAccessOwnerChannel}
                isLoading={isRefreshingRole}
                disabled={isRefreshingRole}
              >
                {isRefreshingRole ? "Đang kiểm tra..." : "Đến Kênh Chủ nhà"}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* MODAL Xác nhận xóa */}
      {notificationToDelete && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn"
          onClick={handleDeleteCancel} 
        >
          <div 
            className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 relative"
            onClick={(e) => e.stopPropagation()} 
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <AlertTriangle size={24} className="text-red-600" />
              </div>
              <h2 className="text-xl font-bold mb-2">Xác nhận xoá</h2>
              <p className="text-gray-600 mb-6">Bạn có chắc chắn muốn xoá thông báo này không?</p>
              <div className="flex justify-center gap-4 w-full">
                <button
                  onClick={handleDeleteCancel}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Huỷ
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Xoá
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default MyInboxPage;
