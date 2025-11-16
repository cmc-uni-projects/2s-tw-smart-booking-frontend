import React, { useState, useEffect } from 'react';

// Hàm helper để tạo danh sách số (ví dụ: [1, 2, ... 31])
const generateOptions = (start, end) => {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

/**
 * Component nhập ngày sinh tùy chỉnh bằng 3 dropdown.
 * @param {string} label - Nhãn hiển thị bên trên.
 * @param {string} value - Giá trị ngày tháng (định dạng "YYYY-MM-DD" hoặc null).
 * @param {function} onChange - Hàm callback khi ngày thay đổi, trả về chuỗi "YYYY-MM-DD".
 * @param {boolean} required - Hiển thị dấu *
 * @param {string} error - Chuỗi lỗi (nếu có).
 */
const DateOfBirthInput = ({ label, value, onChange, required, error }) => {
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  // 1. Phân tích giá trị `value` (VD: "1990-05-15")
  useEffect(() => {
    if (value && typeof value === 'string' && value.includes('-')) {
      const parts = value.split('-');
      if (parts.length === 3) {
        setYear(parts[0]);
        setMonth(parts[1]);
        setDay(parts[2]);
      }
    } else if (!value) {
      // Reset nếu giá trị là null
      setDay('');
      setMonth('');
      setYear('');
    }
  }, [value]);

  // 2. Gửi thay đổi về cho component cha
  const handleChange = (part, val) => {
    let newDay = day, newMonth = month, newYear = year;

    if (part === 'day') {
      newDay = val;
      setDay(val);
    } else if (part === 'month') {
      newMonth = val;
      setMonth(val);
    } else if (part === 'year') {
      newYear = val;
      setYear(val);
    }

    // Chỉ gọi onChange nếu cả 3 phần đều hợp lệ (hoặc đều rỗng)
    if (newDay && newMonth && newYear) {
      onChange(`${newYear}-${newMonth}-${newYear}`);
    } else if (!newDay && !newMonth && !newYear) {
      // Cho phép xóa (clear)
      onChange(null);
    }
    // Nếu đang chọn dở dang, không gọi onChange
  };

  // 3. Tạo các lựa chọn (options) cho dropdowns
  const dayOptions = [
    { label: 'Ngày', value: '' },
    ...generateOptions(1, 31).map(d => ({ label: String(d).padStart(2, '0'), value: String(d).padStart(2, '0') }))
  ];
  const monthOptions = [
    { label: 'Tháng', value: '' },
    ...generateOptions(1, 12).map(m => ({ label: `Tháng ${m}`, value: String(m).padStart(2, '0') }))
  ];
  const currentYear = new Date().getFullYear();
  // Giả sử người dùng ít nhất 16 tuổi và nhiều nhất 100 tuổi
  const yearOptions = [
    { label: 'Năm', value: '' },
    ...generateOptions(currentYear - 100, currentYear - 16).reverse().map(y => ({ label: String(y), value: String(y) }))
  ];

  // 4. Render UI
  // Các class CSS (border, rounded-lg, focus:...) được dùng để đồng bộ
  // với giao diện của Select và TextField.
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="flex items-center gap-2">
        {/* Day Select */}
        <select
          value={day}
          onChange={(e) => handleChange('day', e.target.value)}
          className="block w-1/3 px-3 py-2 text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          {dayOptions.map(opt => (
            <option key={`day-${opt.value}`} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        {/* Month Select */}
        <select
          value={month}
          onChange={(e) => handleChange('month', e.target.value)}
          className="block w-1/3 px-3 py-2 text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          {monthOptions.map(opt => (
            <option key={`month-${opt.value}`} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        {/* Year Select */}
        <select
          value={year}
          onChange={(e) => handleChange('year', e.target.value)}
          className="block w-1/3 px-3 py-2 text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          {yearOptions.map(opt => (
            <option key={`year-${opt.value}`} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default DateOfBirthInput;