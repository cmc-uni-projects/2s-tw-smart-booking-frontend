import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarCheck,
  Star,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/admin" },
    { name: "Quản lý Users", icon: <Users size={20} />, path: "/admin/users" },
    { name: "Quản lý Hotels", icon: <Building2 size={20} />, path: "/admin/hotels" },
    { name: "Quản lý Bookings", icon: <CalendarCheck size={20} />, path: "/admin/bookings" },
    { name: "Quản lý Reviews", icon: <Star size={20} />, path: "/admin/reviews" },
    { name: "Cài đặt Hệ thống", icon: <Settings size={20} />, path: "/admin/settings" },
  ];

  const NavLink = ({ item }) => {
    const isActive = location.pathname === item.path || (item.path !== "/admin" && location.pathname.startsWith(item.path));
    
    return (
      <Link
        to={item.path}
        title={item.name}
        className={`flex items-center gap-3 py-2.5 px-4 rounded-lg transition-all
          ${
            isActive
              ? "bg-[rgb(40,169,224)] text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-100"
          }
          ${collapsed ? "justify-center" : ""}`} // <-- Icon đã được căn giữa
      >
        {item.icon}
        {!collapsed && <span className="font-medium text-sm">{item.name}</span>}
      </Link>
    );
  };

  return (
    <aside
      className={`sticky top-0 h-screen flex flex-col bg-white border-r border-gray-200 transition-all duration-300
        ${collapsed ? "w-20" : "w-64"}`}
    >
      {/* Logo */}
      {/* ✅ SỬA ĐỔI: Thêm logic căn giữa khi collapse */}
      <div 
        className={`flex items-center p-4 border-b border-gray-200 h-16 
          ${collapsed ? "justify-center" : "justify-between"}`}
      >
        {!collapsed && (
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/assets/logo/logo_travelmate_xoafont.png"
              alt="TravelMate"
              style={{ width: "135px", height: "43px" }}
              className="object-contain"
            />
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-full text-gray-500 hover:bg-gray-100"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink key={item.name} item={item} />
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-gray-200">
        <button
          onClick={() => {
            if (confirm("Bạn có chắc muốn đăng xuất?")) {
              logout();
            }
          }}
          title="Đăng xuất"
          className={`flex items-center gap-3 py-2.5 px-4 rounded-lg transition-all w-full
            text-red-500 hover:bg-red-50
            ${collapsed ? "justify-center" : ""}`} // <-- Icon đã được căn giữa
        >
          <LogOut size={20} />
          {!collapsed && <span className="font-medium text-sm">Đăng xuất</span>}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;