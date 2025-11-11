// src/components/common/Input/TextArea.jsx
import React, { useState } from "react";

export default function TextArea({
  label,
  rows = 4,
  error = "",
  ...props // (name, onChange, onBlur, value, ref) từ ...register()
}) {
  const [focused, setFocused] = useState(false);

  // Lấy 'value' từ props
  const value = props.value;

  // Logic "Nổi" (Floating)
  const stringValue = String(value ?? '');
  const isFloating = focused || stringValue.length > 0;

  const hasError = !!error;

  return (
    // Bọc <div> để lỗi không làm "giật" layout
    <div className="w-full">
      <div className="relative w-full">
        <textarea
          id={label}
          rows={rows}
          {...props} // Truyền props (ref, name, value...) từ react-hook-form
          onFocus={(e) => {
            setFocused(true);
            props.onFocus && props.onFocus(e); // Gọi onFocus gốc nếu có
          }}
          onBlur={(e) => {
            setFocused(false); // Luôn set false khi blur
            props.onBlur && props.onBlur(e); // Gọi onBlur gốc của hook-form
          }}
          placeholder={label}
          className={`peer w-full rounded-xl border ${
            hasError
              ? "border-red-400 focus:border-red-400 ring-red-100"
              : "border-gray-300 focus:border-[rgb(40,169,224)] ring-[rgb(40,169,224,0.15)]"
          } bg-white py-3 px-4 text-gray-800 placeholder-transparent shadow-sm 
             focus:ring-2 transition-all duration-200 resize-none`}
        />
        {/* Label (floating) */}
        <label
          htmlFor={label}
          className={`absolute left-4 transition-all duration-200 pointer-events-none ${
            isFloating
              ? `text-xs -top-2.5 bg-white px-1 ${
                  hasError ? "text-red-500" : "text-[rgb(40,169,224)]"
                }`
              : `text-sm top-3.5 ${hasError ? "text-red-400" : "text-gray-500"}`
          }`}
        >
          {label}
        </label>
      </div>
      
      {/* Giữ chỗ cho lỗi để tránh "giật" layout */}
      <p className="text-xs text-red-500 mt-1 ml-1 h-4">
        {hasError ? error : <span>&nbsp;</span>}
      </p>
    </div>
  );
}