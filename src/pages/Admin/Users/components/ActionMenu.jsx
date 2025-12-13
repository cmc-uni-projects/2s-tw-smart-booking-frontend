import React from "react";
import { Edit, Lock, Unlock, Trash2 } from "lucide-react";

// ✅ Thêm prop 'isLocked' để biết trạng thái hiện tại
export default function ActionMenu({ onEdit, onLock, onDelete, isLocked }) {
    return (
        <div className="flex justify-end gap-2">
            {/* Nút Sửa */}
            <button
                onClick={onEdit}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Chỉnh sửa thông tin"
            >
                <Edit size={16} />
            </button>

            {/* Nút Khóa / Mở khóa (Logic động) */}
            <button
                onClick={onLock}
                className={`p-2 rounded-lg transition-colors ${
                    isLocked
                        ? "text-orange-500 hover:text-orange-600 hover:bg-orange-50" // Đã khóa -> Hiện màu cam
                        : "text-gray-400 hover:text-red-500 hover:bg-red-50"         // Chưa khóa -> Hover màu đỏ
                }`}
                title={isLocked ? "Mở khóa tài khoản" : "Khóa tài khoản"}
            >
                {/* Nếu đã khóa thì hiện icon Mở, ngược lại hiện icon Khóa */}
                {isLocked ? <Unlock size={16} /> : <Lock size={16} />}
            </button>

            {/* Nút Xóa */}
            <button
                onClick={onDelete}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Xóa vĩnh viễn"
            >
                <Trash2 size={16} />
            </button>
        </div>
    );
}