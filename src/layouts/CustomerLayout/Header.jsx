import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Inbox,
  HelpCircle,
  Phone,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { userService } from "../../services/user.service"; // ✅ Import Service
import Button from "../../components/common/Button/Button";
import ConfirmModal from "../../components/common/Modal/ConfirmModal";
import LanguageSwitcher from "./LanguageSwitcher";
import Avatar from "../../components/common/Avatar/Avatar";
// Import Component Dropdown mới tách ra
import CustomerProfileDropdown from "./CustomerProfileDropdown";

const Header = () => {
  const navigate = useNavigate();
  const { currentUser, logout, hasRole, updateUser } = useAuth(); // ✅ Lấy thêm updateUser

  const [supportOpen, setSupportOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  // ✅ State lưu avatar hiển thị trên Header (khởi tạo bằng context cũ trước)
  const [headerAvatar, setHeaderAvatar] = useState(currentUser?.profilePhotoUrl);

  const supportRef = useRef(null);
  const profileRef = useRef(null);

  // ======================================================
  // 🔥 1. GỌI API LẤY AVATAR MỚI NHẤT KHI MOUNT
  // ======================================================
  useEffect(() => {
    const fetchFreshAvatar = async () => {
      if (currentUser) {
        try {
          const data = await userService.getUserDetail();
          if (data && data.profilePhotoUrl) {
            // 1. Cập nhật hiển thị ngay tại Header
            setHeaderAvatar(data.profilePhotoUrl);
            
            // 2. (Tuỳ chọn) Cập nhật ngược lại vào Context để đồng bộ toàn app
            if (data.profilePhotoUrl !== currentUser.profilePhotoUrl) {
                updateUser({ profilePhotoUrl: data.profilePhotoUrl });
            }
          }
        } catch (error) {
          console.error("Failed to fetch header avatar:", error);
        }
      }
    };

    fetchFreshAvatar();
  }, [currentUser?.userId]); // Chạy lại nếu userId thay đổi (login account khác)

  // Đồng bộ state nếu context thay đổi (ví dụ sau khi upload ảnh ở trang Profile)
  useEffect(() => {
    setHeaderAvatar(currentUser?.profilePhotoUrl);
  }, [currentUser?.profilePhotoUrl]);


  // ========================
  // CLICK OUTSIDE
  // ========================
  useEffect(() => {
    const handler = (e) => {
      if (
        !supportRef.current?.contains(e.target) &&
        !profileRef.current?.contains(e.target)
      ) {
        setSupportOpen(false);
        setProfileOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  // ========================
  // SCROLL EFFECT
  // ========================
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

  // Logic lấy link cho nút Button lớn ở Header
  const getPartnerNavigation = () => {
    if (!currentUser) return { label: "Hợp tác với chúng tôi", path: "/partner-with-us" };
    if (hasRole("ADMIN")) return { label: "Trang quản trị", path: "/admin" };
    if (hasRole("OWNER")) return { label: "Trang quản lý", path: "/owner" };
    return { label: "Hợp tác với chúng tôi", path: "/partner-with-us" };
  };

  const handleAccessOwnerChannel = () => {
    const roleLink = getPartnerNavigation();
    navigate(roleLink.path);
  };

  // Xử lý khi click đóng dropdown
  const handleDropdownClose = (action) => {
    setProfileOpen(false);
    if (action === "LOGOUT_ACTION") {
      setShowLogoutConfirm(true);
    }
  };

  // Styles
  const navLinkClass = "flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-[rgb(40,169,224)] transition-colors";
  const dropdownLinkClass = "flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors";

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/95 backdrop-blur-lg shadow-md" : "bg-white/90 backdrop-blur-lg"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/assets/logo/logo_travelmate_xoafont.png"
              alt="TravelMate"
              style={{ width: "135px", height: "43px" }}
              className="object-contain"
            />
          </Link>

          {/* MID NAV */}
          <nav className="hidden lg:flex items-center gap-6">
            <LanguageSwitcher navLinkClass={navLinkClass} />
            <Link to="/promotions" className={navLinkClass}>
              Khuyến mãi
            </Link>

            <div className="relative" ref={supportRef}>
              <button onClick={() => setSupportOpen(!supportOpen)} className={navLinkClass}>
                Hỗ trợ <ChevronDown size={16} />
              </button>

              {supportOpen && (
                <div className="absolute mt-2 bg-white border border-gray-100 shadow-xl rounded-xl w-56 py-2 z-50 overflow-hidden">
                  {currentUser && (
                    <Link to="/customer/my-inbox" className={dropdownLinkClass} onClick={() => setSupportOpen(false)}>
                      <Inbox size={18} className="text-gray-400" /> Hộp thư của tôi
                    </Link>
                  )}
                  <Link to="/help" className={dropdownLinkClass} onClick={() => setSupportOpen(false)}>
                    <HelpCircle size={18} className="text-gray-400" /> Trợ giúp
                  </Link>
                  <Link to="/about#contact" className={dropdownLinkClass} onClick={() => setSupportOpen(false)}>
                    <Phone size={18} className="text-gray-400" /> Liên hệ
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* RIGHT SIDE */}
          <div className="hidden lg:flex items-center gap-3">
            
            <Button
              variant={currentUser ? "primary-outline" : "ghost"}
              onClick={handleAccessOwnerChannel}
              className="text-sm font-medium text-gray-600 hover:text-[rgb(40,169,224)]"
            >
              {getPartnerNavigation().label}
            </Button>

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
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full border border-transparent hover:border-gray-200 hover:bg-gray-50 transition-all"
                >
                  {/* 🔥 2. SỬ DỤNG STATE headerAvatar thay vì currentUser.profilePhotoUrl */}
                  <Avatar
                    src={headerAvatar} 
                    name={currentUser.fullName}
                    size={36}
                  />
                  <span className="text-sm font-semibold text-gray-700 max-w-[100px] truncate">
                    {currentUser.fullName?.split(" ").pop()}
                  </span>
                  <ChevronDown size={16} className="text-gray-400" />
                </button>

                {profileOpen && (
                  <CustomerProfileDropdown onClose={handleDropdownClose} />
                )}
              </div>
            )}

          </div>
        </div>
      </header>

      {/* CONFIRM LOGOUT MODAL */}
      <ConfirmModal
        open={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleConfirmLogout}
        title="Đăng xuất"
        message="Bạn có chắc chắn muốn đăng xuất?"
        type="danger"
        confirmText="Đăng xuất"
        cancelText="Hủy"
      />
    </>
  );
};

export default Header;
