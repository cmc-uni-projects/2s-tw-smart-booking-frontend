// src/components/common/Input/FloatingTextField.jsx
import React, { useState } from "react";

export default function FloatingTextField({
  label,
  type = "text",
  icon,
  error = "",
  disabled = false,
  ...props 
}) {
  const [focused, setFocused] = useState(false);
  const value = props.value;
  const stringValue = String(value ?? '');
  const isFloating = focused || stringValue.length > 0;
  const hasError = !!error;

  return (
    <div className="w-full">
      <div className="relative w-full">
        {icon && (
          <span className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${
            hasError ? "text-red-400" : "text-gray-400"
          }`}>
            {icon}
          </span>
        )}

        {/* ✅ SỬA LỖI 2: Thêm class `h-[58px]` */}
        <input
          id={label}
          type={type}
          {...props} 
          onFocus={(e) => {
            setFocused(true);
            props.onFocus && props.onFocus(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur && props.onBlur(e);
          }}
          placeholder={label}
          disabled={disabled}
          className={`peer w-full h-[58px] rounded-xl border ${
            hasError
              ? "border-red-400 focus:border-red-400 ring-red-100" 
              : "border-gray-300 focus:border-[rgb(40,169,224)] ring-[rgb(40,169,224,0.15)]"
          } bg-white py-3 ${icon ? "pl-10" : "pl-4"} pr-4 text-gray-800 placeholder-transparent shadow-sm 
            focus:ring-2 transition-all duration-200
            ${disabled ? "bg-gray-50 cursor-not-allowed" : ""}`}
        />

        {/* Label (floating) */}
        <label
          htmlFor={label}
          className={`absolute ${icon ? "left-10" : "left-4"} transition-all duration-200 pointer-events-none ${
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

      <p className="text-xs text-red-500 mt-1 ml-1 h-4">
        {hasError ? error : <span>&nbsp;</span>}
      </p>
    </div>
  );
}