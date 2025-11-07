// src/components/common/Input/TextField.jsx
import React, { useState } from "react";

export default function TextField({
  name,
  label,
  type = "text",
  value,
  onChange,
  required = false,
  error = "",
  icon, // <-- 1. Thêm prop icon
}) {
  const [focused, setFocused] = useState(false);
  // 2. Đảm bảo value không phải null/undefined khi kiểm tra length
  const isFloating = focused || (value && value.length > 0);

  return (
    <div className="relative w-full">
      {/* 3. Thêm icon nếu được cung cấp */}
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
        onFocus={() => setFocused(true)}
        onBlur={(e) => setFocused(e.target.value !== "")}
        placeholder={label}
        className={`peer w-full rounded-xl border bg-white py-3 ${
          icon ? "pl-10" : "px-4" // 4. Điều chỉnh padding nếu có icon
        } pr-4 text-gray-800 placeholder-transparent shadow-sm transition-all duration-200
          ${
            error
              ? "border-red-400 focus:border-red-400 focus:ring-red-100"
              : "border-gray-300 focus:border-[rgb(40,169,224)] focus:ring-[rgb(40,169,224,0.15)]"
          }`}
      />

      <label
        htmlFor={label}
        className={`absolute ${
          icon ? "left-10" : "left-4" // 5. Điều chỉnh vị trí label nếu có icon
        } transition-all duration-200 ${
          isFloating
            ? `text-xs -top-2.5 bg-white px-1 ${
                error ? "text-red-500" : "text-[rgb(40,169,224)]"
              }`
            : "text-sm top-3.5 text-gray-500"
        }`}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {error && <p className="text-xs text-red-500 mt-1 ml-1">{error}</p>}
    </div>
  );
}