import React, { useState } from "react";

export default function TextArea({ label, value = "", onChange, rows = 4 }) {
  const [focused, setFocused] = useState(false);
  const isFloating = focused || value?.length > 0;

  return (
    <div className="relative w-full">
      <textarea
        id={label}
        rows={rows}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={(e) => setFocused(e.target.value !== "")}
        placeholder={label}
        className="peer w-full rounded-xl border border-gray-300 bg-white py-3 px-4 text-gray-800 placeholder-transparent shadow-sm focus:border-[rgb(40,169,224)] focus:ring-2 focus:ring-[rgb(40,169,224,0.15)] transition-all duration-200 resize-none"
      />
      <label
        htmlFor={label}
        className={`absolute left-4 transition-all duration-200 text-gray-500 ${
          isFloating
            ? "text-xs -top-2.5 bg-white px-1 text-[rgb(40,169,224)]"
            : "text-sm top-3.5"
        }`}
      >
        {label}
      </label>
    </div>
  );
}
