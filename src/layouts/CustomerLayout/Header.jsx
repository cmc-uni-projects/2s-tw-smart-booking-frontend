// src/layouts/CustomerLayout/Header.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  User,
  LogOut,
  History,
  CreditCard,
  Inbox, 
  HelpCircle,
  Phone,
  LayoutDashboard,
  MapPin,
  Heart
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/common/Button/Button";
import ConfirmModal from "../../components/common/Modal/ConfirmModal";
import LanguageSwitcher from "./LanguageSwitcher";
import Avatar from "../../components/common/Avatar/Avatar";
// ✅ 1. Import service
import { authService } from "../../services/auth.service";

const Header = () => {
  const navigate = useNavigate();
  // ✅ 2. Lấy thêm `updateUser`
  const { currentUser, logout, hasRole, updateUser } = useAuth();

  const [supportOpen, setSupportOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  // ✅ 3. Thêm state loading cho nút "Kênh chủ nhà"
  const [isRefreshingRole, setIsRefreshingRole] = useState(false);

  const supportRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (!supportRef.current?.contains(e.target) && !profileRef.current?.contains(e.target)) {
        setSupportOpen(false);
        setProfileOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleConfirmLogout = () => {
    logout();
    setProfileOpen(false);
    setShowLogoutConfirm(false);
    navigate("/login");
  };

  // ✅ 4. THÊM HÀM MỚI: Xử lý làm mới quyền
  const handleAccessOwnerChannel = async () => {
    setIsRefreshingRole(true);
    
    // 1. Kiểm tra quyền hiện tại (trong state)
    if (hasRole("OWNER")) {
      navigate("/owner");
      setIsRefreshingRole(false);
      return;
    }

    // 2. Nếu không có, gọi API /me để làm mới
    try {
      const res = await authService.getMe();

      if (res.data.success && res.data.data) {
        const backendUser = res.data.data;
        
        // 3. Backend /me trả về { authorities: [{ authority: "ROLE_CUSTOMER" }] }
        const newRoles = backendUser.authorities.map(a => a.authority.replace("ROLE_", ""));

        if (newRoles.includes("OWNER")) {
          // 4. Map dữ liệu trả về từ /me (CustomUserDetails) sang 
          //    định dạng của currentUser (LoginResponse.UserResponse)
          const userForContext = {
            ...currentUser, // Giữ lại SĐT (phone) từ context cũ
            userId: backendUser.userId,
            fullName: backendUser.fullName,
            email: backendUser.email,
            isEmailVerified: backendUser.emailVerified,
            status: backendUser.status,
            roles: newRoles, // ✅ Quan trọng nhất
          };
          
          updateUser(userForContext); // Cập nhật state toàn cục
          navigate("/owner"); // Điều hướng
        } else {
          // Admin chưa duyệt
          alert("Đơn đăng ký của bạn đang chờ duyệt hoặc đã bị từ chối. Vui lòng thử lại sau.");
          navigate("/partner/register"); // Điều hướng đến trang đơn
        }
      }
    } catch (error) {
      console.error("Lỗi khi làm mới quyền:", error);
      alert("Có lỗi xảy ra, vui lòng đăng nhập lại.");
      logout();
    } finally {
      setIsRefreshingRole(false);
    }
  };


  // Styles (giữ nguyên)
  const navLinkClass = "flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-[rgb(40,169,224)] transition-colors";
  const dropdownLinkClass = "flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors";
  const iconClass = "text-gray-400 group-hover:text-[rgb(40,169,224)] transition-colors";

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/95 backdrop-blur-lg shadow-md" : "bg-white/90 backdrop-blur-lg"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/assets/logo/logo_travelmate_xoafont.png"
              alt="TravelMate"
              style={{ width: "135px", height: "43px" }}
              className="object-contain"
            />
          </Link>

          {/* Nav - Center (giữ nguyên) */}
          <nav className="hidden lg:flex items-center gap-6">
            <LanguageSwitcher navLinkClass={navLinkClass} />
            <Link to="/promotions" className={navLinkClass}>Khuyến mãi</Link>
            
            <div className="relative" ref={supportRef}>
              <button onClick={() => setSupportOpen(!supportOpen)} className={navLinkClass}>
                Hỗ trợ <ChevronDown size={16} />
              </button>
              {supportOpen && (
                <div className="absolute mt-2 bg-white border border-gray-100 shadow-xl rounded-xl w-56 py-2 z-50 overflow-hidden">
                  {currentUser && (
                    <Link to="/customer/my-inbox" onClick={() => setSupportOpen(false)} className={dropdownLinkClass}>
                      <Inbox size={18} className={iconClass} /> Hộp thư của tôi
                    </Link>
                  )}
                  <Link to="/help" onClick={() => setSupportOpen(false)} className={dropdownLinkClass}>
                    <HelpCircle size={18} className={iconClass} /> Trợ giúp
                  </Link>
                  <Link to="/about#contact" onClick={() => setSupportOpen(false)} className={dropdownLinkClass}>
                    <Phone size={18} className={iconClass} /> Liên hệ
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Auth Actions - Right */}
          <div className="hidden lg:flex items-center gap-3">
            {/* ✅ 5. THAY ĐỔI LOGIC NÚT "KÊNH CHỦ NHÀ" */}
            {hasRole("ADMIN") ? (
              <Button variant="primary-outline" onClick={() => navigate("/admin")} size="sm">
                Quản trị viên
              </Button>
            ) : hasRole("OWNER") ? (
              // Nếu đã có quyền, vào thẳng
              <Button variant="primary-outline" onClick={() => navigate("/owner")} size="sm">
                Kênh chủ nhà
              </Button>
            ) : (
              // Nếu chưa có quyền, gọi hàm làm mới
              <Button 
                variant="ghost" 
                onClick={handleAccessOwnerChannel} // Dùng hàm mới
                isLoading={isRefreshingRole}
                disabled={isRefreshingRole}
                className="text-sm font-medium text-gray-600 hover:text-[rgb(40,169,224)]"
              >
                {isRefreshingRole ? "Đang kiểm tra..." : "Kênh chủ nhà"}
              </Button>
            )}

            {!currentUser ? (
              <>
                <div className="h-6 w-[1px] bg-gray-300 mx-1"></div>
                <Button variant="ghost" onClick={() => navigate("/register")} className="text-gray-700 font-medium">
                  Đăng ký
                </Button>
                <Button onClick={() => navigate("/login")} className="bg-[rgb(40,169,224)] hover:bg-[#1b98d6] shadow-md shadow-blue-200">
                  Đăng nhập
                </Button>
              </>
            ) : (
              // Profile Dropdown (giữ nguyên)
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full border border-transparent hover:border-gray-200 hover:bg-gray-50 transition-all"
                >
                  <Avatar 
                    src={currentUser.profilePhotoUrl} 
                    name={currentUser.fullName} 
                    size={36} 
                  />
                  <span className="text-sm font-semibold text-gray-700 max-w-[100px] truncate">
                    {currentUser.fullName?.split(" ").pop()}
                  </span>
                  <ChevronDown size={16} className="text-gray-400" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-72 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fadeIn">
                    
                    <div className="bg-gradient-to-r from-[rgb(40,169,224)] to-[#006494] p-5 text-white">
                      <div className="flex items-center gap-3">
                        <Avatar 
                          src={currentUser.profilePhotoUrl} 
                          name={currentUser.fullName} 
                          size={48} 
                          className="border-2 border-white/30"
                        />
                        <div className="overflow-hidden">
                          <p className="font-bold text-lg truncate">{currentUser.fullName}</p>
                          <p className="text-xs text-blue-100 truncate">{currentUser.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="py-2">
                      <Link to="/customer/profile" className={dropdownLinkClass} onClick={() => setProfileOpen(false)}>
                        <User size={18} className="text-gray-400" /> Hồ sơ cá nhân
                      </Link>
                      <Link to="/customer/bookings" className={dropdownLinkClass} onClick={() => setProfileOpen(false)}>
                        <History size={18} className="text-gray-400" /> Lịch sử đặt chỗ
                      </Link>
                      <Link to="/customer/wishlist" className={dropdownLinkClass} onClick={() => setProfileOpen(false)}>
                        <Heart size={18} className="text-gray-400" /> Yêu thích
                      </Link>
                      
                      {/* ✅ 6. THAY ĐỔI LOGIC NÚT TRONG DROPDOWN */}
                      {hasRole("OWNER") ? (
                        <Link to="/owner" className={dropdownLinkClass} onClick={() => setProfileOpen(false)}>
                          <LayoutDashboard size={18} className="text-gray-400" /> Quản lý khách sạn
                        </Link>
                      ) : (
                        // Nếu chưa có quyền, gọi hàm làm mới
                        <button 
                          className={dropdownLinkClass} 
                          onClick={() => {
                            setProfileOpen(false);
                            handleAccessOwnerChannel();
                          }}
                          disabled={isRefreshingRole}
                        >
                          <LayoutDashboard size={18} className="text-gray-400" /> 
                          {isRefreshingRole ? "Đang kiểm tra..." : "Kênh chủ nhà"}
                        </button>
                      )}
                    </div>

                    <div className="border-t border-gray-100 p-2 bg-gray-50">
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          setShowLogoutConfirm(true);
                        }}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-100 rounded-lg transition-colors font-medium"
                      >
                        <LogOut size={18} /> Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modal xác nhận (giữ nguyên) */}
      <ConfirmModal
        open={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleConfirmLogout}
        title="Đăng xuất"
        message="Bạn có chắc chắn muốn đăng xuất khỏi TravelMate?"
        type="danger"
        confirmText="Đăng xuất"
        cancelText="Hủy"
      />
    </>
  );
};

export default Header;