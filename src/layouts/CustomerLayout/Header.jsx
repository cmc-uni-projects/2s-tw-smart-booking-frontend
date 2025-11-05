// src/layouts/CustomerLayout/Header.jsx

import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  User,
  LogOut,
  History,
  CreditCard,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/common/Button/Button";
import ConfirmModal from "../../components/common/Modal/ConfirmModal";
import LanguageSwitcher from "./LanguageSwitcher";

const Header = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  
  const [supportOpen, setSupportOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const supportRef = useRef(null);
  const profileRef = useRef(null);

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
  
  const navLinkClass = "flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-[rgb(40,169,224)] transition-colors";
  
  // ✅ (YÊU CẦU CỦA BẠN) Class mới cho link trong dropdown hỗ trợ
  const dropdownLinkClass = "block px-4 py-2 text-sm text-gray-700 hover:bg-[rgb(40,169,224)]/10 hover:text-[rgb(40,169,224)] transition-colors";

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-lg shadow-md"
            : "bg-white/90 backdrop-blur-lg"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/src/assets/logo/logo_travelmate_xoafont.png"
              alt="TravelMate"
              style={{ width: "135px", height: "43px" }}
              className="object-contain"
            />
          </Link>

          {/* Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            
            <LanguageSwitcher navLinkClass={navLinkClass} />

            {/* Khuyến mãi */}
            <Link
              to="/promotions"
              className={navLinkClass}
            >
              Khuyến mãi
            </Link>

            {/* Hỗ trợ */}
            <div className="relative" ref={supportRef}>
              <button
                onClick={() => setSupportOpen(!supportOpen)}
                className={navLinkClass}
              >
                Hỗ trợ <ChevronDown size={16} />
              </button>

              {supportOpen && (
                <div className="absolute mt-2 bg-white border border-gray-100 shadow-xl rounded-lg w-56 py-2 z-50">
                  <Link
                    to="/help"
                    onClick={() => setSupportOpen(false)}
                    // ✅ (YÊU CẦU CỦA BẠN) Cập nhật class
                    className={dropdownLinkClass}
                  >
                    Trợ giúp
                  </Link>
                  <Link
                    // ✅ (YÊU CẦU CỦA BẠN) Cập nhật link
                    to="/about#contact" 
                    onClick={() => setSupportOpen(false)}
                    // ✅ (YÊU CẦU CỦA BẠN) Cập nhật class
                    className={dropdownLinkClass}
                  >
                    Liên hệ với chúng tôi
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Auth actions */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => navigate("/partner/register")}
              className="border-[rgb(40,169,224)] text-[rgb(40,169,224)] hover:bg-[rgb(40,169,224)] hover:text-white font-medium"
            >
              Hợp tác với chúng tôi
            </Button>
            
            {!currentUser ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => navigate("/register")}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Đăng ký
                </Button>
                <Button
                  onClick={() => navigate("/login")}
                  className="bg-[rgb(40,169,224)] hover:bg-[#1b98d6]"
                >
                  Đăng nhập
                </Button>
              </>
            ) : (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 bg-[rgb(40,169,224)] text-white px-3 py-2 rounded-full hover:bg-[#1b98d6]"
                >
                  <User size={18} />
                  <span className="text-sm font-medium">
                    {currentUser.fullName || "Tài khoản"}
                  </span>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-50">
                    <Link
                      to="/customer/profile"
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setProfileOpen(false)}
                    >
                      <User size={16} className="text-gray-500"/> Chỉnh sửa hồ sơ
                    </Link>
                    <Link
                      to="/customer/bookings"
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setProfileOpen(false)}
                    >
                      <History size={16} className="text-gray-500"/> Lịch sử đặt chỗ
                    </Link>
                    <Link
                      to="/customer/payments"
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setProfileOpen(false)}
                    >
                      <CreditCard size={16} className="text-gray-500"/> Lịch sử thanh toán
                    </Link>
                    <button
                      onClick={() => {
                        setProfileOpen(false); 
                        setShowLogoutConfirm(true);
                      }}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                    >
                      <LogOut size={16} /> Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modal xác nhận Đăng xuất */}
      <ConfirmModal
        open={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleConfirmLogout}
        title="Xác nhận Đăng xuất"
        message="Bạn có chắc chắn muốn đăng xuất khỏi TravelMate?"
        type="warning"
        confirmText="Đăng xuất"
        cancelText="Hủy"
      />
    </>
  );
};

export default Header;