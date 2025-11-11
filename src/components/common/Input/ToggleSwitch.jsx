import React from "react";
import { Controller } from "react-hook-form";

/**
 * Component Toggle Switch (Bật/Tắt) đồng bộ giao diện
 * Tương thích với react-hook-form (sử dụng <Controller>)
 * @param {object} control - Từ useForm()
 * @param {string} name - Tên trường
 * @param {string} label - Nhãn hiển thị
 */
export default function ToggleSwitch({ control, name, label }) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <label className="flex flex-col justify-center items-start cursor-pointer w-full">
          {/* Label */}
          <span className="text-xs text-[rgb(40,169,224)] bg-white px-1 relative -mb-2 ml-3 z-10">
            {label}
          </span>
          
          <div className="relative flex items-center justify-between w-full rounded-xl border border-gray-300 bg-white py-3 px-4 shadow-sm h-[58px]">
            <span className="text-sm font-medium text-gray-700">
              {field.value ? "Đang kích hoạt (Hiển thị)" : "Đã vô hiệu hóa (Ẩn)"}
            </span>
            {/* Toggle Switch */}
            <button
              type="button" // Ngăn submit form
              onClick={() => field.onChange(!field.value)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[rgb(40,169,224)] focus:ring-offset-2
                ${field.value ? "bg-[rgb(40,169,224)]" : "bg-gray-200"}
              `}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                  ${field.value ? "translate-x-5" : "translate-x-0"}
                `}
              />
            </button>
          </div>
          {/* Giữ chỗ cho lỗi (nếu có) */}
          <div className="h-4"></div>
        </label>
      )}
    />
  );
}