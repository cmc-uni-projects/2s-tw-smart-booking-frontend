import React, { useState, useEffect } from 'react';
// ✅ SỬ DỤNG COMPONENT MỚI
import CustomSelect from '@/components/common/Select/CustomSelect';

// (Hàm helper và options giữ nguyên)
const generateOptions = (start, end) => {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

const dayOptions = [
  ...generateOptions(1, 31).map(d => ({ 
    label: String(d).padStart(2, '0'), 
    value: String(d).padStart(2, '0') 
  }))
];

const monthOptions = [
  ...generateOptions(1, 12).map(m => ({ 
    label: `Tháng ${m}`, 
    value: String(m).padStart(2, '0') 
  }))
];

const currentYear = new Date().getFullYear();
const yearOptions = [
  ...generateOptions(currentYear - 100, currentYear - 16).reverse().map(y => ({ 
    label: String(y), 
    value: String(y) 
  }))
];

/**
 * Component nhập ngày sinh (Đã sửa lỗi lặp vô hạn)
 */
const DateOfBirthInput = ({ label, value, onChange, error }) => {
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  // 1. Phân tích `value` (useEffect này được dùng để 'props' cập nhật 'state')
  useEffect(() => {
    if (value && typeof value === 'string' && value.includes('-')) {
      const parts = value.split('-');
      if (parts.length === 3) {
        if(parts[0] !== year) setYear(parts[0]);
        if(parts[1] !== month) setMonth(parts[1]);
        if(parts[2] !== day) setDay(parts[2]);
      }
    } else if (!value) {
      if(day) setDay('');
      if(month) setMonth('');
      if(year) setYear('');
    }
  // ✅ SỬA LỖI LẶP: Mảng dependency CHỈ ĐƯỢC chứa 'value'.
  }, [value]); 

  // 2. Gửi thay đổi (useEffect này được dùng để 'state' cập nhật 'props')
  useEffect(() => {
    if (typeof onChange !== 'function') {
      return;
    }
    
    const currentDate = (day && month && year) ? `${year}-${month}-${day}` : null;

    // Chỉ gọi 'onChange' nếu giá trị state nội bộ (currentDate)
    // khác với giá trị prop (value).
    if (currentDate !== value) {
        onChange(currentDate);
    }
    
  // Mảng dependency này đã an toàn vì 'onChange' (từ cha) đã được bọc trong useCallback.
  }, [day, month, year, value, onChange]); 

  // 3. Render UI (Giữ nguyên)
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="flex items-center gap-2">
        <CustomSelect
          value={day}
          onChange={setDay} 
          options={dayOptions}
          placeholder="Ngày"
        />
        <CustomSelect
          value={month}
          onChange={setMonth}
          options={monthOptions}
          placeholder="Tháng"
        />
        <CustomSelect
          value={year}
          onChange={setYear}
          options={yearOptions}
          placeholder="Năm"
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default DateOfBirthInput;