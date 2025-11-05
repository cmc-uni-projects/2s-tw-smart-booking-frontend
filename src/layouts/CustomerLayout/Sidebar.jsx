import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  User,
  History,
  Heart,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    { name: "Tổng quan", icon: <Home size={20} />, path: "/customer/dashboard" },
    { name: "Hồ sơ cá nhân", icon: <User size={20} />, path: "/customer/profile" },
    { name: "Lịch sử đặt phòng", icon: <History size={20} />, path: "/customer/bookings" },
    { name: "Yêu thích", icon: <Heart size={20} />, path: "/customer/favorites" },
    { name: "Cài đặt", icon: <Settings size={20} />, path: "/customer/settings" },
  ];

  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-64"
      } bg-white shadow-md transition-all duration-300 h-screen sticky top-0 flex flex-col justify-between`}
    >
      {/* Logo & Toggle */}
      <div className="p-4 flex justify-between items-center border-b border-gray-100">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/assets/logo/logo_travelmate_xoafont.png"
            alt="TravelMate"
            className="h-8 object-contain"
          />
          {!collapsed && (
            <span className="font-semibold text-[rgb(40,169,224)] text-lg">
              TravelMate
            </span>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-500 hover:text-[rgb(40,169,224)]"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Menu items */}
      <nav className="flex-1 mt-4 space-y-1">
        {menuItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-all
                ${
                  active
                    ? "bg-[rgb(40,169,224)] text-white shadow-sm"
                    : "text-gray-700 hover:bg-[rgb(40,169,224)]/10"
                }`}
            >
              {item.icon}
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-gray-100">
        <button className="flex items-center gap-3 text-sm text-red-500 hover:text-red-600">
          <LogOut size={20} />
          {!collapsed && <span>Đăng xuất</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
