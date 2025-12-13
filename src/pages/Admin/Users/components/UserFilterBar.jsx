import React from "react";
import PropTypes from "prop-types"; // ✅ 1. Import PropTypes
import { Search, Plus, ChevronDown } from "lucide-react"; // ✅ 2. Thêm icon ChevronDown cho Select
import Button from "@/components/common/Button/Button";

export default function UserFilterBar({ searchTerm, onSearchChange, roleFilter, onRoleFilterChange, onAddUser }) {
    const roles = [
        { value: "ALL", label: "Tất cả vai trò" },
        { value: "CUSTOMER", label: "Khách hàng" },
        { value: "OWNER", label: "Chủ khách sạn" },
        { value: "ADMIN", label: "Quản trị viên" },
    ];

    return (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
            {/* Search & Filter Group */}
            <div className="flex flex-1 w-full md:w-auto gap-3 flex-col sm:flex-row">

                {/* Search Input */}
                <div className="relative flex-1 group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400 group-focus-within:text-[rgb(40,169,224)] transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Tìm kiếm người dùng..."
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgb(40,169,224,0.2)] focus:border-[rgb(40,169,224)] focus:bg-white transition-all duration-200"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                {/* Role Filter (Custom UI) */}
                <div className="relative w-full sm:w-48">
                    {/* ✅ 3. Thêm appearance-none để ẩn mũi tên mặc định và thêm icon custom */}
                    <select
                        value={roleFilter}
                        onChange={(e) => onRoleFilterChange(e.target.value)}
                        className="w-full pl-3 pr-10 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-sm text-gray-700 focus:outline-none focus:border-[rgb(40,169,224)] focus:bg-white transition-all appearance-none cursor-pointer"
                    >
                        {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </select>

                    {/* Custom Arrow Icon */}
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                        <ChevronDown size={16} />
                    </div>
                </div>
            </div>

            {/* Add Button */}
            <div className="w-full md:w-auto">
                <Button
                    variant="primary"
                    onClick={onAddUser}
                    leftIcon={<Plus size={18} />}
                    className="w-full md:w-auto justify-center" // Button full width trên mobile
                >
                    Thêm mới
                </Button>
            </div>
        </div>
    );
}

// ✅ 4. Định nghĩa PropTypes để code tường minh hơn
UserFilterBar.propTypes = {
    searchTerm: PropTypes.string,
    onSearchChange: PropTypes.func.isRequired,
    roleFilter: PropTypes.string,
    onRoleFilterChange: PropTypes.func.isRequired,
    onAddUser: PropTypes.func
};