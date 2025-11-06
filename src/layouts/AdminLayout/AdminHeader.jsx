import React from "react";
import SearchInput from "../../components/common/Input/SearchInput"; // Dùng component common

// Import 2 component con ta vừa tạo
import AdminNotificationDropdown from "./AdminNotificationDropdown";
import AdminProfileDropdown from "./AdminProfileDropdown";

const AdminHeader = () => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-6">
        {/* 1. Thanh tìm kiếm */}
        <div className="w-full max-w-md">
          <SearchInput placeholder="Tìm kiếm user, booking, khách sạn..." />
        </div>

        {/* 2. Nhóm icon bên phải */}
        <div className="flex items-center gap-4">
          <AdminNotificationDropdown />
          <AdminProfileDropdown />
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;