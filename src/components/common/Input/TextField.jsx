import React, { useState } from "react";

export default function TextField({
  name,
  label,
  type = "text",
  value,
  onChange,
  required = false,
  error = "", // ✅ thêm prop error
}) {
  const [focused, setFocused] = useState(false);
  const isFloating = focused || value?.length > 0;

  return (
    <div className="relative w-full">
      <input
        id={label}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={(e) => setFocused(e.target.value !== "")}
        placeholder={label}
        className={`peer w-full rounded-xl border bg-white py-3 px-4 text-gray-800 placeholder-transparent shadow-sm transition-all duration-200
          ${
            error
              ? "border-red-400 focus:border-red-400 focus:ring-red-100"
              : "border-gray-300 focus:border-[rgb(40,169,224)] focus:ring-[rgb(40,169,224,0.15)]"
          }`}
      />

      <label
        htmlFor={label}
        className={`absolute left-4 transition-all duration-200 ${
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
