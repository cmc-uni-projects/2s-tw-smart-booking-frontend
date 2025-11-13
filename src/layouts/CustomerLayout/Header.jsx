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
import Avatar from "../../components/common/Avatar/Avatar"; // ✅ Import Avatar xịn

const Header = () => {
  const navigate = useNavigate();
  const { currentUser, logout, hasRole } = useAuth();

  const [supportOpen, setSupportOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

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

  // Styles
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

          {/* Nav - Center */}
          <nav className="hidden lg:flex items-center gap-6">
            <LanguageSwitcher navLinkClass={navLinkClass} />
            <Link to="/promotions" className={navLinkClass}>Khuyến mãi</Link>
            
            {/* Hỗ trợ Dropdown */}
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
            {/* Role-based Buttons */}
            {hasRole("ADMIN") ? (
              <Button variant="primary-outline" onClick={() => navigate("/admin")} size="sm">
                Quản trị viên
              </Button>
            ) : hasRole("OWNER") ? (
              <Button variant="primary-outline" onClick={() => navigate("/owner")} size="sm">
                Kênh chủ nhà
              </Button>
            ) : (
              <Button variant="ghost" onClick={() => navigate("/partner-with-us")} className="text-sm font-medium text-gray-600 hover:text-[rgb(40,169,224)]">
                Hợp tác với chúng tôi
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
              // ✅ Giao diện Profile Dropdown Mới
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full border border-transparent hover:border-gray-200 hover:bg-gray-50 transition-all"
                >
                  <Avatar 
                    src={currentUser.profilePhotoUrl} // ✅ Sử dụng ảnh từ context
                    name={currentUser.fullName} 
                    size={36} 
                  />
                  <span className="text-sm font-semibold text-gray-700 max-w-[100px] truncate">
                    {currentUser.fullName?.split(" ").pop()} {/* Chỉ hiện tên */}
                  </span>
                  <ChevronDown size={16} className="text-gray-400" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-72 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fadeIn">
                    
                    {/* Header Dropdown */}
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

                    {/* Menu Items */}
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
                      
                      {/* Link quản lý nếu có role */}
                      {hasRole("OWNER") && (
                        <Link to="/owner" className={dropdownLinkClass} onClick={() => setProfileOpen(false)}>
                          <LayoutDashboard size={18} className="text-gray-400" /> Quản lý khách sạn
                        </Link>
                      )}
                    </div>

                    {/* Footer Logout */}
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