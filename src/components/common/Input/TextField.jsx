// src/components/common/Input/TextField.jsx
import React, { useState } from "react";

export default function TextField({
  label,
  placeholder,
  type = "text",
  value = "",
  onChange,
  required,
  icon,
}) {
  const [focused, setFocused] = useState(false);

  const isFloating = focused || value?.length > 0;

  return (
    <div className="relative w-full">
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
          {icon}
        </span>
      )}
      <input
        id={label}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={(e) => setFocused(e.target.value !== "")}
        placeholder={placeholder || label}
        className={`peer w-full rounded-xl border border-gray-300 bg-white py-3 ${
          icon ? "pl-10" : "pl-4"
        } pr-4 text-gray-800 placeholder-transparent shadow-sm focus:border-[rgb(40,169,224)] focus:ring-2 focus:ring-[rgb(40,169,224,0.15)] transition-all duration-200`}
      />

      <label
        htmlFor={label}
        className={`absolute ${
          icon ? "left-10" : "left-4"
        } transition-all duration-200 text-gray-500 ${
          isFloating
            ? "text-xs -top-2.5 bg-white px-1 text-[rgb(40,169,224)]"
            : "text-sm top-3.5"
        }`}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    </div>
  );
}
