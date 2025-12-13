import React from "react";
import PropTypes from "prop-types";
import { Edit, Lock, Unlock, Trash2 } from "lucide-react";

export default function ActionMenu({ onEdit, onLock, onDelete, isLocked }) {
    return (
        // ✅ SỬA: justify-end -> justify-center để căn giữa
        <div className="flex justify-center gap-2">
            <button
                onClick={onEdit}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Sửa thông tin"
            >
                <Edit size={16} />
            </button>

            <button
                onClick={onLock}
                className={`p-2 rounded-lg transition-colors ${
                    isLocked
                        ? "text-orange-500 hover:bg-orange-50"
                        : "text-gray-400 hover:text-orange-600 hover:bg-orange-50"
                }`}
                title={isLocked ? "Mở khóa" : "Khóa"}
            >
                {isLocked ? <Unlock size={16} /> : <Lock size={16} />}
            </button>

            <button
                onClick={onDelete}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Xóa user"
            >
                <Trash2 size={16} />
            </button>
        </div>
    );
}

ActionMenu.propTypes = {
    onEdit: PropTypes.func,
    onLock: PropTypes.func,
    onDelete: PropTypes.func,
    isLocked: PropTypes.bool
};