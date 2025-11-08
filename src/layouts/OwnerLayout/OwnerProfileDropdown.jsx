// OwnerProfileDropdown.jsx

import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Settings, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Avatar from "../../components/common/Avatar/Avatar";
import ConfirmModal from "../../components/common/Modal/ConfirmModal";

const OwnerProfileDropdown = () => {
    const [open, setOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const ref = useRef(null);

    // Logic đóng khi click ra ngoài
    useEffect(() => {
        const onClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", onClickOutside);
        return () => document.removeEventListener("mousedown", onClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        setShowLogoutConfirm(false);
        navigate("/login");
    };

    const DropdownItem = ({ icon, label, path, onClick, isDanger }) => (
        <Link
            to={path || "#"}
            onClick={(e) => {
                if (onClick) {
                    e.preventDefault();
                    onClick();
                }
                setOpen(false);
            }}
            className={`flex items-center gap-3 px-4 py-2.5 text-sm 
        ${isDanger
                    ? "text-red-600 hover:bg-red-50"
                    : "text-gray-700 hover:bg-gray-100"}
        transition-colors rounded-md`}
        >
            {icon}
            <span>{label}</span>
        </Link>
    );

    return (
        <>
            <div className="relative" ref={ref}>
                {/* Nút bấm là Avatar và Tên */}
                <button
                    onClick={() => setOpen((prev) => !prev)}
                    className="flex items-center gap-2 cursor-pointer p-1 rounded-lg hover:bg-gray-100"
                >
                    <Avatar
                        name={currentUser?.fullName || "Hotel Owner"}
                        size={36}
                    />
                    <div className="text-sm text-left hidden md:block">
                        <div className="font-semibold text-gray-800">
                            {currentUser?.fullName}
                        </div>
                        {/* ✅ THAY ĐỔI: Sửa vai trò */}
                        <div className="text-xs text-gray-500">Chủ khách sạn</div>
                    </div>
                </button>

                {/* Menu Dropdown */}
                {open && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-2">
                        <DropdownItem
                            icon={<User size={16} className="text-gray-500" />}
                            label="Hồ sơ của tôi"
                            path="/owner/profile" // ✅ Sửa đường dẫn
                        />
                        <DropdownItem
                            icon={<Settings size={16} className="text-gray-500" />}
                            label="Cài đặt khách sạn"
                            path="/owner/settings" // ✅ Sửa đường dẫn
                        />
                        <div className="h-[1px] bg-gray-100 my-1"></div>
                        <DropdownItem
                            icon={<LogOut size={16} />}
                            label="Đăng xuất"
                            onClick={() => setShowLogoutConfirm(true)}
                            isDanger
                        />
                    </div>
                )}
            </div>

            {/* Modal xác nhận đăng xuấtt */}
            <ConfirmModal
                open={showLogoutConfirm}
                onClose={() => setShowLogoutConfirm(false)}
                onConfirm={handleLogout}
                title="Xác nhận Đăng xuất"
                message="Bạn có chắc chắn muốn đăng xuất?"
                type="danger"
                confirmText="Đăng xuất"
                cancelText="Hủy"
            />
        </>
    );
};

export default OwnerProfileDropdown;
