// src/components/common/Input/DatePicker.jsx
import React from "react";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export default function DatePicker({ label, value, onChange }) {
  const formatDate = (date) => (date ? format(new Date(date), "dd/MM/yyyy", { locale: vi }) : "");

  return (
    <div className="flex flex-col w-full">
      {label && <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>}
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-3 text-gray-700 shadow-sm focus:border-[rgb(40,169,224)] focus:ring-2 focus:ring-[rgb(40,169,224,0.2)] transition-all"
        />
        {value && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[rgb(40,169,224)]">
            {formatDate(value)}
          </span>
        )}
      </div>
    </div>
  );
}
