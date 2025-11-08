import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    BedDouble,
    CalendarCheck,
    Star,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    ClipboardList, // Icon cho Tác vụ
} from "lucide-react";
// Giả sử bạn cũng dùng AuthContext cho Ownerr
import { useAuth } from "../../context/AuthContext";

const OwnerSidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();
    // Giả sử hook `useAuth` cũng áp dụng cho Owner
    const { logout } = useAuth();

    // Menu này dành riêng cho Owner
    const menuItems = [
        { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/owner/dashboard" },
        { name: "Bookings", icon: <CalendarCheck size={20} />, path: "/owner/bookings" },
        { name: "Quản lý Phòng", icon: <BedDouble size={20} />, path: "/owner/rooms" },
        { name: "Tác vụ (Dọn dẹp)", icon: <ClipboardList size={20} />, path: "/owner/tasks" },
        { name: "Đánh giá", icon: <Star size={20} />, path: "/owner/reviews" },
        { name: "Cài đặt Khách sạn", icon: <Settings size={20} />, path: "/owner/settings" },
    ];

    const NavLink = ({ item }) => {
        // Logic active link giống hệt AdminSidebar
        const isActive = location.pathname === item.path || (item.path !== "/owner/dashboard" && location.pathname.startsWith(item.path));

        return (
            <Link
                to={item.path}
                title={item.name}
                className={`flex items-center gap-3 py-2.5 px-4 rounded-lg transition-all
          ${isActive
                        ? "bg-[rgb(40,169,224)] text-white shadow-sm" // Style active giống Admin
                        : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    }
          ${collapsed ? "justify-center" : ""}`}
            >
                {item.icon}
                {!collapsed && <span className="font-medium text-sm">{item.name}</span>}
            </Link>
        );
    };

    return (
        <aside
            className={`sticky top-0 h-screen flex flex-col bg-white border-r border-gray-200 transition-all duration-300 dark:bg-gray-800 dark:border-gray-700
        ${collapsed ? "w-20" : "w-64"}`}
        >
            {/* Logo và Nút Collapse (giống Admin) */}
            <div
                className={`flex items-center p-4 border-b border-gray-200 h-16 dark:border-gray-700
          ${collapsed ? "justify-center" : "justify-between"}`}
            >
                {!collapsed && (
                    <Link to="/owner/dashboard" className="flex items-center gap-2">
                        {/* ✅ Thay bằng Logo khách sạn của bạn */}
                        <span className="text-2xl">🏨</span>
                        <span className="font-bold text-xl text-gray-800 dark:text-white">MyHotel</span>
                    </Link>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-1 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            {/* Menu (giống Admin) */}
            <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
                {menuItems.map((item) => (
                    <NavLink key={item.name} item={item} />
                ))}
            </nav>

            {/* Logout (giống Admin) */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                <button
                    onClick={() => {
                        // Giả sử bạn có ConfirmModal
                        if (confirm("Bạn có chắc muốn đăng xuất?")) {
                            logout();
                        }
                    }}
                    title="Đăng xuất"
                    className={`flex items-center gap-3 py-2.5 px-4 rounded-lg transition-all w-full
            text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20
            ${collapsed ? "justify-center" : ""}`}
                >
                    <LogOut size={20} />
                    {!collapsed && <span className="font-medium text-sm">Đăng xuất</span>}
                </button>
            </div>
        </aside>
    );
};

export default OwnerSidebar;
