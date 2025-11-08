// src/components/common/Input/TextField.jsx
import React from "react";

export default function TextField({
                                      name,
                                      label,
                                      type = "text",
                                      value,
                                      onChange,
                                      required = false,
                                      error = "",
                                      icon, // <-- Thêm prop 'icon'
                                  }) {
    return (
        // 1. Vẫn giữ 'flex-col' cho nhãn cố định
        <div className="flex flex-col w-full">
            {/* 2. Nhãn (label) cố định ở trên */}
            {label && (
                <label
                    htmlFor={label}
                    className="mb-1 text-sm font-medium text-gray-700"
                >
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            {/* 3. Thêm 'relative' để chứa icon bên trong */}
            <div className="relative w-full">
                {/* 4. Thêm icon nếu được cung cấp */}
                {icon && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </span>
                )}

                <input
                    id={label}
                    name={name}
                    type={type}
                    value={value || ""} // Đảm bảo value là string
                    onChange={onChange}
                    placeholder={label}
                    // 5. Điều chỉnh padding (pl-10) nếu có icon
                    className={`w-full rounded-xl border bg-white py-3 pr-4 text-gray-800 shadow-sm transition-all duration-200
            ${icon ? "pl-10" : "px-4"}
            ${
                        error
                            ? "border-red-400 focus:border-red-400 focus:ring-red-100 placeholder-red-400"
                            : "border-gray-300 focus:border-[rgb(40,169,224)] focus:ring-[rgb(40,169,224,0.15)] placeholder-gray-400"
                    }
          `}
                />
            </div>

            {/* Phần hiển thị lỗi giữ nguyên */}
            {error && <p className="text-xs text-red-500 mt-1 ml-1">{error}</p>}
        </div>
    );
}