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
  CheckSquare, 
  List, // 1. Thêm icon List
  ChevronDown, // 1. Thêm icon ChevronDown
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  // 2. Thêm state để quản lý menu con
  const [openSubMenu, setOpenSubMenu] = useState(""); 
  const location = useLocation();
  const { logout } = useAuth(); 

  // 3. Cập nhật cấu trúc menuItems
  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/admin" },
    { name: "Quản lý Users", icon: <Users size={20} />, path: "/admin/users" },
    
    // 4. BIẾN THÀNH MENU CHA
    { 
      name: "Quản lý nơi cư trú", // Đổi tên
      icon: <Building2 size={20} />, 
      key: "residences", // Key để quản lý state
      children: [
        { 
          name: "Duyệt nơi cư trú", // Mục con 1 (đã có)
          path: "/admin/hotels/submissions", 
          icon: <CheckSquare size={16} /> 
        },
        { 
          name: "Danh sách nơi cư trú", // Mục con 2 (mới)
          path: "/admin/hotels/list", // Đường dẫn mới cho bạn
          icon: <List size={16} /> 
        },
      ]
    },
    // (Đã xóa "Quản lý Hotels" và "Duyệt Khách sạn" khỏi đây)
    
    { 
      name: "Duyệt Chủ sở hữu", 
      icon: <CheckSquare size={20} />, 
      path: "/admin/approvals" 
    },
    
    { name: "Quản lý Bookings", icon: <CalendarCheck size={20} />, path: "/admin/bookings" },
    { name: "Quản lý Reviews", icon: <Star size={20} />, path: "/admin/reviews" },
    { name: "Cài đặt Hệ thống", icon: <Settings size={20} />, path: "/admin/settings" },
  ];

  // Hàm bật/tắt menu con
  const handleSubMenuToggle = (key) => {
      setOpenSubMenu(openSubMenu === key ? "" : key);
  };

  return (
    <aside
      className={`sticky top-0 h-screen flex flex-col bg-white border-r border-gray-200 transition-all duration-300
        ${collapsed ? "w-20" : "w-64"}`} 
    >
      {/* 1. Phần Logo & Nút Toggle (Giữ nguyên) */}
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

      {/* 2. Phần Menu (Cập nhật logic render) */}
      <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          
          // --- MỤC CÓ MENU CON ---
          if (item.children) {
            const isSubMenuOpen = openSubMenu === item.key;
            // Kiểm tra xem có mục con nào đang active không
            const isParentActive = item.children.some(child => 
                location.pathname === child.path || location.pathname.startsWith(child.path)
            );
            
            return (
              <div key={item.key}>
                {/* Nút cha (để Bật/Tắt) */}
                <button
                  onClick={() => handleSubMenuToggle(item.key)}
                  className={`flex items-center justify-between gap-3 py-2.5 px-4 rounded-lg transition-all w-full
                    ${
                      isParentActive
                        ? "bg-[rgb(40,169,224)] text-white shadow-sm" // Active
                        : "text-gray-600 hover:bg-gray-100" // Default
                    }
                    ${collapsed ? "justify-center" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    {!collapsed && <span className="font-medium text-sm">{item.name}</span>}
                  </div>
                  {/* Mũi tên (chỉ hiện khi không thu gọn) */}
                  {!collapsed && (
                    <ChevronDown size={16} className={`transition-transform ${isSubMenuOpen ? "rotate-180" : ""}`} />
                  )}
                </button>

                {/* Danh sách menu con (chỉ hiện khi mở và không thu gọn) */}
                {isSubMenuOpen && !collapsed && (
                  <div className="pl-7 mt-1 space-y-1 animate-fadeIn">
                    {item.children.map(child => {
                      const isChildActive = location.pathname === child.path || location.pathname.startsWith(child.path);
                      return (
                        <Link
                          key={child.path}
                          to={child.path}
                          title={child.name} 
                          className={`flex items-center gap-3 py-2 px-3 rounded-lg transition-all text-sm
                            ${
                              isChildActive
                                ? "bg-gray-200 text-gray-900 font-medium" // Sub-item active
                                : "text-gray-500 hover:bg-gray-100" // Sub-item default
                            }`}
                        >
                          {child.icon}
                          <span>{child.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          // --- MỤC LINK ĐƠN (như cũ) ---
          const isActive = location.pathname === item.path || (item.path !== "/admin" && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path || item.name} // Dùng path hoặc name
              to={item.path}
              title={item.name} 
              className={`flex items-center gap-3 py-2.5 px-4 rounded-lg transition-all
                ${
                  isActive
                    ? "bg-[rgb(40,169,224)] text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100"
                }
                ${collapsed ? "justify-center" : ""}`}
            >
              {item.icon}
              {!collapsed && <span className="font-medium text-sm">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* 3. Phần Đăng xuất (Giữ nguyên) */}
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
            ${collapsed ? "justify-center" : ""}`}
        >
          <LogOut size={20} />
          {!collapsed && <span className="font-medium text-sm">Đăng xuất</span>}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;