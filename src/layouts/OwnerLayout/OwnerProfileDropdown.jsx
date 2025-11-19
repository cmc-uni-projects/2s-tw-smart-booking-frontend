import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, User, Home, LayoutDashboard, Building2, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Avatar from "@/components/common/Avatar/Avatar";

const OwnerProfileDropdown = ({ onClose }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Style giống hệt Customer
  const dropdownLinkClass =
    "flex items-center justify-between w-full text-left px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-[rgb(40,169,224)] transition-all group";

  if (!currentUser) return null;

  return (
    <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-100 rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] z-50 overflow-hidden animate-fadeIn origin-top-right ring-1 ring-black/5">
      
      {/* === 1. HEADER GRADIENT (Đồng bộ Customer) === */}
      <div className="bg-gradient-to-r from-[rgb(40,169,224)] to-[#006494] p-5 text-white relative overflow-hidden">
        {/* Họa tiết nền mờ cho đẹp */}
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        
        <div className="flex items-center gap-3 relative z-10">
          <Avatar
            src={currentUser.profilePhotoUrl}
            name={currentUser.fullName}
            size={52} // Size lớn hơn chút cho Owner
            className="border-[3px] border-white/30 shadow-md"
          />
          <div className="overflow-hidden">
            <p className="font-bold text-lg truncate leading-tight">{currentUser.fullName}</p>
            <p className="text-xs text-blue-100 truncate font-medium opacity-90">{currentUser.email}</p>
            <div className="mt-1.5 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-white/20 text-white border border-white/20 shadow-sm">
               <Building2 size={10} className="mr-1" /> ĐỐI TÁC
            </div>
          </div>
        </div>
      </div>

      {/* === 2. MENU ITEMS === */}
      <div className="py-2">
        <Link
          to="/owner/dashboard"
          className={dropdownLinkClass}
          onClick={onClose}
        >
          <div className="flex items-center gap-3">
            <LayoutDashboard size={18} className="text-gray-400 group-hover:text-[rgb(40,169,224)] transition-colors" />
            <span className="font-medium">Bảng điều khiển</span>
          </div>
          <ChevronRight size={14} className="text-gray-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
        </Link>

        <Link
          to="/owner/properties"
          className={dropdownLinkClass}
          onClick={onClose}
        >
           <div className="flex items-center gap-3">
            <Building2 size={18} className="text-gray-400 group-hover:text-[rgb(40,169,224)] transition-colors" />
            <span className="font-medium">Quản lý tài sản</span>
          </div>
          <ChevronRight size={14} className="text-gray-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
        </Link>

        <Link
          to="/owner/profile"
          className={dropdownLinkClass}
          onClick={onClose}
        >
          <div className="flex items-center gap-3">
            <User size={18} className="text-gray-400 group-hover:text-[rgb(40,169,224)] transition-colors" />
            <span className="font-medium">Hồ sơ đối tác</span>
          </div>
          <ChevronRight size={14} className="text-gray-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
        </Link>

        <div className="h-px bg-gray-100 my-1 mx-4"></div>

        <Link
          to="/"
          className={dropdownLinkClass}
          onClick={onClose}
        >
           <div className="flex items-center gap-3">
            <Home size={18} className="text-gray-400 group-hover:text-[rgb(40,169,224)] transition-colors" />
            <span className="font-medium">Về trang khách hàng</span>
          </div>
        </Link>
      </div>

      {/* === 3. FOOTER LOGOUT === */}
      <div className="bg-gray-50 p-2 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-white hover:shadow-sm hover:border-red-100 border border-transparent rounded-xl transition-all font-semibold"
        >
          <LogOut size={16} />
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default OwnerProfileDropdown;