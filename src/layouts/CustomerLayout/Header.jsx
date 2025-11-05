import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Globe, ChevronDown, User, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/auth.service"; // dùng cho logout API
import Button from "../../components/common/Button/Button";

const Header = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useAuth(); // giả sử context có setCurrentUser
  const [langOpen, setLangOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const langRef = useRef(null);
  const supportRef = useRef(null);
  const profileRef = useRef(null);

  // click outside
  useEffect(() => {
    const handler = (e) => {
      if (
        !langRef.current?.contains(e.target) &&
        !supportRef.current?.contains(e.target) &&
        !profileRef.current?.contains(e.target)
      ) {
        setLangOpen(false);
        setSupportOpen(false);
        setProfileOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  // header scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // handle logout
  const handleLogout = async () => {
    try {
      await authService.logout(); // ✅ gọi API thật
      setCurrentUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-lg shadow-md"
          : "bg-white/90 backdrop-blur-lg"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* ✅ Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="src/assets/logo/logo_travelmate_xoafont.png"
            alt="TravelMate"
            style={{ width: "135px", height: "43px" }}
            className="object-contain"
          />
        </Link>

        {/* ✅ Nav */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-700">
          {/* Ngôn ngữ / tiền tệ */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 hover:text-[rgb(40,169,224)]"
            >
              <Globe size={18} /> Tiếng Việt (VND)
              <ChevronDown size={16} />
            </button>

            {langOpen && (
              <div className="absolute mt-2 bg-white border border-gray-100 shadow-xl rounded-lg w-52 py-2 z-50">
                <p className="px-3 py-1 text-xs text-gray-500 uppercase">
                  Ngôn ngữ
                </p>
                <button
                  onClick={() => setLangOpen(false)}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-50"
                >
                  🇻🇳 Tiếng Việt
                </button>
                <button
                  onClick={() => setLangOpen(false)}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-50"
                >
                  🇬🇧 English
                </button>
                <p className="px-3 py-1 text-xs text-gray-500 uppercase border-t">
                  Tiền tệ
                </p>
                <button
                  onClick={() => setLangOpen(false)}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-50"
                >
                  🇻🇳 VND
                </button>
                <button
                  onClick={() => setLangOpen(false)}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-50"
                >
                  💵 USD
                </button>
              </div>
            )}
          </div>

          {/* Khuyến mãi */}
          <Link
            to="/promotions"
            className="hover:text-[rgb(40,169,224)] transition-colors"
          >
            Khuyến mãi
          </Link>

          {/* Hỗ trợ */}
          <div className="relative" ref={supportRef}>
            <button
              onClick={() => setSupportOpen(!supportOpen)}
              className="flex items-center gap-1 hover:text-[rgb(40,169,224)]"
            >
              Hỗ trợ <ChevronDown size={16} />
            </button>

            {supportOpen && (
              <div className="absolute mt-2 bg-white border border-gray-100 shadow-xl rounded-lg w-56 py-2 z-50">
                <Link
                  to="/help"
                  onClick={() => setSupportOpen(false)}
                  className="block px-4 py-2 hover:bg-gray-50"
                >
                  Trợ giúp
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setSupportOpen(false)}
                  className="block px-4 py-2 hover:bg-gray-50"
                >
                  Liên hệ với chúng tôi
                </Link>
              </div>
            )}
          </div>

          {/* Hợp tác */}
          <Link
            to="/partner/register"
            className="hover:text-[rgb(40,169,224)] transition-colors"
          >
            Hợp tác với chúng tôi
          </Link>
        </nav>

        {/* ✅ Auth actions */}
        <div className="hidden lg:flex items-center gap-3">
          {!currentUser ? (
            <>
              <Button
                variant="outline"
                onClick={() => navigate("/register")}
                className="border-[rgb(40,169,224)] text-[rgb(40,169,224)] hover:bg-[rgb(40,169,224)] hover:text-white font-medium"
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
                    className="block px-4 py-2 text-sm hover:bg-gray-50"
                    onClick={() => setProfileOpen(false)}
                  >
                    Chỉnh sửa hồ sơ
                  </Link>
                  <Link
                    to="/customer/payments"
                    className="block px-4 py-2 text-sm hover:bg-gray-50"
                    onClick={() => setProfileOpen(false)}
                  >
                    Lịch sử thanh toán
                  </Link>
                  <Link
                    to="/customer/bookings"
                    className="block px-4 py-2 text-sm hover:bg-gray-50"
                    onClick={() => setProfileOpen(false)}
                  >
                    Lịch sử đặt chỗ
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-50"
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
  );
};

export default Header;
