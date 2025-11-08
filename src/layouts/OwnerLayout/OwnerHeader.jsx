// OwnerHeader.jsx

import React from "react";
// Giả sử bạn có SearchInput chung
import SearchInput from "../../components/common/Input/SearchInput";

// Import 2 component con MỚI, theo style của Admin
import OwnerNotificationDropdown from "./OwnerNotificationDropdown";
import OwnerProfileDropdown from "./OwnerProfileDropdown";

const OwnerHeader = () => {
    return (
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200 dark:bg-gray-800/95 dark:border-gray-700">
            <div className="flex items-center justify-between h-16 px-6">
                {/* 1. Thanh tìm kiếmm */}
                <div className="w-full max-w-md">
                    <SearchInput placeholder="Tìm kiếm booking, phòng, khách..." />
                </div>

                {/* 2. Nhóm icon bên phải */}
                <div className="flex items-center gap-4">
                    <OwnerNotificationDropdown />
                    <OwnerProfileDropdown />
                </div>
            </div>
        </header>
    );
};

export default OwnerHeader;
