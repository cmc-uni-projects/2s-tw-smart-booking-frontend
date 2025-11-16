import React from 'react';
import { ChevronDown } from 'lucide-react';

// --- TẠO CÁC LỰA CHỌN (OPTIONS) BÊN NGOÀI ---
const generateOptions = (start, end) => {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

const dayOptions = generateOptions(1, 31).map(d => ({ 
  label: String(d).padStart(2, '0'), 
  value: String(d).padStart(2, '0') 
}));

const monthOptions = generateOptions(1, 12).map(m => ({ 
  label: `Tháng ${m}`, 
  value: String(m).padStart(2, '0') 
}));

const currentYear = new Date().getFullYear();
const yearOptions = generateOptions(currentYear - 100, currentYear - 16).reverse().map(y => ({ 
  label: String(y), 
  value: String(y) 
}));

// Class CSS để style <select> trông giống TextField
const selectClassName = [
  "relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10",
  "text-left border border-gray-300 shadow-sm",
  "focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500",
  "sm:text-sm",
  "appearance-none" // Quan trọng: Tắt giao diện <select> gốc
].join(" ");

/**
 * Component ngày sinh ĐƠN GIẢN, dùng <select> gốc (Đã sửa lỗi lặp)
 */
const DateOfBirthInput = ({ label, value, onChange, error }) => {
  
  // 1. Lấy day, month, year từ 'value' prop (YYYY-MM-DD)
  // Logic này chạy mỗi khi render, không cần useEffect
  let day = '', month = '', year = '';
  if (value && typeof value === 'string' && value.includes('-')) {
    const parts = value.split('-');
    if (parts.length === 3) {
      [year, month, day] = parts;
    }
  }

  // 2. Hàm xử lý khi một <select> thay đổi
  const handleChange = (part, newValue) => {
    let newDay = day, newMonth = month, newYear = year;

    if (part === 'day') newDay = newValue;
    if (part === 'month') newMonth = newValue;
    if (part === 'year') newYear = newValue;

    // Nếu cả 3 đều rỗng (vd: chọn "Năm"), gửi null
    if (!newDay && !newMonth && !newYear) {
      onChange(null);
      return;
    }

    // Nếu cả 3 đều CÓ GIÁ TRỊ, gửi ngày hoàn chỉnh
    if (newDay && newMonth && newYear) {
      onChange(`${newYear}-${newMonth}-${newDay}`);
      return;
    }
    
    // Nếu đang chọn dở dang (ví dụ mới chọn Ngày),
    // chúng ta KHÔNG gọi onChange, vì ngày chưa hoàn chỉnh.
    // Điều này cũng phá vỡ vòng lặp.
    // (Hoặc bạn có thể gửi 'null' nếu muốn)
    if (value !== null) {
      onChange(null);
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="flex items-center gap-2">
        
        {/* Day Select */}
        <div className="relative w-1/3">
          <select
            value={day}
            onChange={(e) => handleChange('day', e.target.value)}
            className={`${selectClassName} ${!day && "text-gray-400"}`}
          >
            <option value="">Ngày</option>
            {dayOptions.map(opt => (
              <option key={`day-${opt.value}`} value={opt.value} className="text-gray-900">{opt.label}</option>
            ))}
          </select>
          <ChevronDown size={20} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        {/* Month Select */}
         <div className="relative w-1/3">
          <select
            value={month}
            onChange={(e) => handleChange('month', e.target.value)}
            className={`${selectClassName} ${!month && "text-gray-400"}`}
          >
            <option value="">Tháng</option>
            {monthOptions.map(opt => (
              <option key={`month-${opt.value}`} value={opt.value} className="text-gray-900">{opt.label}</option>
            ))}
          </select>
          <ChevronDown size={20} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        {/* Year Select */}
         <div className="relative w-1/3">
          <select
            value={year}
            onChange={(e) => handleChange('year', e.target.value)}
            className={`${selectClassName} ${!year && "text-gray-400"}`}
          >
            <option value="">Năm</option>
            {yearOptions.map(opt => (
              <option key={`year-${opt.value}`} value={opt.value} className="text-gray-900">{opt.label}</option>
            ))}
          </select>
          <ChevronDown size={20} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default DateOfBirthInput;