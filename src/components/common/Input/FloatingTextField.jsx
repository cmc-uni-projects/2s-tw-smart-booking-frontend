// src/components/common/Input/FloatingTextField.jsx
import React, { useState } from "react";

/**
 * Component Input với hiệu ứng "floating label"
 * Tương thích với react-hook-form (truyền {...register("name")} và value={watch("name")})
 * ĐÃ SỬA: Lỗi nhãn (label) chìm và lỗi layout "giật" khi validation.
 */
export default function FloatingTextField({
  label,
  type = "text",
  icon,
  error = "",
  disabled = false,
  ...props // (name, onChange, onBlur, value, ref)
}) {
  const [focused, setFocused] = useState(false);
  
  // Lấy 'value' từ props (do react-hook-form VÀ parent truyền vào)
  const value = props.value;

  // ✅ SỬA LỖI 1 (Chồng chéo):
  // Chuyển 'value' (có thể là number) thành string để kiểm tra length
  // Label sẽ nổi nếu: 
  // 1. Đang được focus (focused = true)
  // 2. Hoặc đã có nội dung (kể cả số 0)
  const stringValue = String(value ?? ''); // Xử lý null/undefined
  const isFloating = focused || stringValue.length > 0;
  
  const hasError = !!error;

  return (
    // ✅ SỬA LỖI 2 (Layout "giật"):
    // Bọc component bằng <div> để thông báo lỗi không ảnh hưởng
    // đến vị trí của input/icon.
    <div className="w-full">
      <div className="relative w-full">
        {/* Icon (nếu có) */}
        {icon && (
          <span className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${
            hasError ? "text-red-400" : "text-gray-400"
          }`}>
            {icon}
          </span>
        )}

        {/* Input */}
        <input
          id={label}
          type={type}
          {...props} // Đưa props của react-hook-form vào đây
          onFocus={(e) => {
            setFocused(true);
            props.onFocus && props.onFocus(e); // Gọi onFocus gốc nếu có
          }}
          onBlur={(e) => {
            setFocused(false); // Luôn set false khi blur
            props.onBlur && props.onBlur(e); // Gọi onBlur gốc của hook-form
          }}
          placeholder={label}
          disabled={disabled}
          className={`peer w-full rounded-xl border ${
            hasError
              ? "border-red-400 focus:border-red-400 ring-red-100" // Lỗi
              : "border-gray-300 focus:border-[rgb(40,169,224)] ring-[rgb(40,169,224,0.15)]" // Bình thường
          } bg-white py-3 ${icon ? "pl-10" : "pl-4"} pr-4 text-gray-800 placeholder-transparent shadow-sm 
            focus:ring-2 transition-all duration-200
            ${disabled ? "bg-gray-50 cursor-not-allowed" : ""}`}
        />

        {/* Label (floating) */}
        <label
          htmlFor={label}
          className={`absolute ${icon ? "left-10" : "left-4"} transition-all duration-200 pointer-events-none ${
            isFloating // Dùng logic 'isFloating' mới
              ? `text-xs -top-2.5 bg-white px-1 ${
                  hasError ? "text-red-500" : "text-[rgb(40,169,224)]"
                }`
              : `text-sm top-3.5 ${hasError ? "text-red-400" : "text-gray-500"}`
          }`}
        >
          {label}
        </label>
      </div>

      {/* ✅ SỬA LỖI 2 (tiếp):
          Đặt chiều cao cố định (h-4) để giữ không gian cho lỗi.
          Điều này ngăn icon bị "giật" xuống khi lỗi xuất hiện. */}
      <p className="text-xs text-red-500 mt-1 ml-1 h-4">
        {hasError ? error : <span>&nbsp;</span>} {/* &nbsp; để giữ khoảng trống */}
      </p>
    </div>
  );
}