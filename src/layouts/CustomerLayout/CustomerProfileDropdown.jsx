import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LogOut,
  User,
  History,
  Heart,
  LayoutDashboard,
  ShieldCheck,
  Building2,
  Smile,
  ChevronRight
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { userService } from "../../services/user.service"; // Đảm bảo import đúng đường dẫn service
import Avatar from "../../components/common/Avatar/Avatar";

const CustomerProfileDropdown = ({ onClose }) => {
  const { currentUser, logout, hasRole } = useAuth();
  const navigate = useNavigate();

  // State lưu avatar mới nhất từ API
  const [currentAvatar, setCurrentAvatar] = useState(currentUser?.profilePhotoUrl);
  const [roleLabel, setRoleLabel] = useState("KHÁCH HÀNG");

  const handleLogout = () => {
    if (onClose) onClose(); // Đóng dropdown trước khi logout
    // Logic logout sẽ được kích hoạt từ Header hoặc gọi trực tiếp
    // Ở đây ta trigger event hoặc gọi hàm logout từ context
    logout();
    navigate("/login");
  };

  // === 1. CALL API LẤY INFO MỚI NHẤT (AVATAR) ===
  useEffect(() => {
    const fetchLatestUserInfo = async () => {
      try {
        const data = await userService.getUserDetail();
        if (data && data.profilePhotoUrl) {
          setCurrentAvatar(data.profilePhotoUrl);
        }
      } catch (error) {
        console.error("Failed to fetch fresh user details:", error);
      }
    };

    if (currentUser) {
      fetchLatestUserInfo();
      determineRoleLabel();
    }
  }, [currentUser]);

  // === 2. LOGIC XÁC ĐỊNH ROLE LABEL ===
  const determineRoleLabel = () => {
    if (hasRole("ADMIN")) {
      setRoleLabel("QUẢN TRỊ VIÊN");
    } else if (hasRole("OWNER")) {
      setRoleLabel("ĐỐI TÁC");
    } else {
      setRoleLabel("KHÁCH HÀNG");
    }
  };

  // Icon cho badge role
  const getRoleIcon = () => {
    if (hasRole("ADMIN")) return <ShieldCheck size={10} className="mr-1" />;
    if (hasRole("OWNER")) return <Building2 size={10} className="mr-1" />;
    return <Smile size={10} className="mr-1" />;
  };

  // Logic lấy link dashboard/partner (copy từ Header cũ để hiển thị trong menu)
  const getPartnerNavigation = () => {
    if (hasRole("ADMIN")) return { label: "Trang quản trị", path: "/admin" };
    if (hasRole("OWNER")) return { label: "Trang quản lý", path: "/owner" };
    return { label: "Hợp tác với chúng tôi", path: "/partner-with-us" };
  };

  const partnerNav = getPartnerNavigation();

  // Style chung
  const dropdownLinkClass =
    "flex items-center justify-between w-full text-left px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-[rgb(40,169,224)] transition-all group";

  if (!currentUser) return null;

  return (
    <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-100 rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] z-50 overflow-hidden animate-fadeIn origin-top-right ring-1 ring-black/5">
      
      {/* === HEADER GRADIENT === */}
      <div className="bg-gradient-to-r from-[rgb(40,169,224)] to-[#006494] p-5 text-white relative overflow-hidden">
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        
        <div className="flex items-center gap-3 relative z-10">
          <Avatar
            src={currentAvatar} // Dùng state avatar mới nhất
            name={currentUser.fullName}
            size={52}
            className="border-[3px] border-white/30 shadow-md"
          />
          <div className="overflow-hidden">
            <p className="font-bold text-lg truncate leading-tight">{currentUser.fullName}</p>
            <p className="text-xs text-blue-100 truncate font-medium opacity-90">{currentUser.email}</p>
            
            {/* Badge Role */}
            <div className="mt-1.5 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-white/20 text-white border border-white/20 shadow-sm">
               {getRoleIcon()} {roleLabel}
            </div>
          </div>
        </div>
      </div>

      {/* === MENU ITEMS === */}
      <div className="py-2">
        <Link to="/customer/profile" className={dropdownLinkClass} onClick={onClose}>
          <div className="flex items-center gap-3">
            <User size={18} className="text-gray-400 group-hover:text-[rgb(40,169,224)] transition-colors" />
            <span className="font-medium">Hồ sơ cá nhân</span>
          </div>
          <ChevronRight size={14} className="text-gray-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
        </Link>

        <Link to="/customer/bookings" className={dropdownLinkClass} onClick={onClose}>
          <div className="flex items-center gap-3">
            <History size={18} className="text-gray-400 group-hover:text-[rgb(40,169,224)] transition-colors" />
            <span className="font-medium">Lịch sử đặt chỗ</span>
          </div>
           <ChevronRight size={14} className="text-gray-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
        </Link>

        <Link to="/customer/wishlist" className={dropdownLinkClass} onClick={onClose}>
          <div className="flex items-center gap-3">
            <Heart size={18} className="text-gray-400 group-hover:text-[rgb(40,169,224)] transition-colors" />
            <span className="font-medium">Yêu thích</span>
          </div>
           <ChevronRight size={14} className="text-gray-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
        </Link>

        <div className="h-px bg-gray-100 my-1 mx-4"></div>

        {/* Link Dynamic theo Role */}
        <Link to={partnerNav.path} className={dropdownLinkClass} onClick={onClose}>
          <div className="flex items-center gap-3">
            <LayoutDashboard size={18} className="text-gray-400 group-hover:text-[rgb(40,169,224)] transition-colors" />
            <span className="font-medium">{partnerNav.label}</span>
          </div>
           <ChevronRight size={14} className="text-gray-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
        </Link>
      </div>

      {/* === FOOTER LOGOUT === */}
      <div className="bg-gray-50 p-2 border-t border-gray-100">
        <button
          onClick={() => {
             // Gọi callback để mở modal confirm ở Header (nếu muốn) hoặc xử lý logout luôn
             // Ở đây tôi giả định Header truyền callback trigger modal logout
             if(onClose) onClose("LOGOUT_ACTION"); 
          }}
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-white hover:shadow-sm hover:border-red-100 border border-transparent rounded-xl transition-all font-semibold"
        >
          <LogOut size={16} />
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default CustomerProfileDropdown;