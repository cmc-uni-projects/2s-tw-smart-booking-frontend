// src/pages/Owner/Properties/AddPropertySteps/components/AmenityOption.jsx
import React from "react";
import { Check } from "lucide-react";

/**
 * Component con cho mỗi lựa chọn tiện nghi.
 * Sử dụng kỹ thuật "peer-checked" của Tailwind để tạo kiểu cho thẻ khi checkbox được chọn.
 * @param {string} id - ID định danh cho input và label
 * @param {string} label - Tên tiện nghi
 * @param {React.ReactNode} icon - Icon từ lucide-react
 * @param {Function} register - Hàm register từ react-hook-form
 */
const AmenityOption = ({ id, label, icon, register }) => (
  <label
    htmlFor={id}
    className="relative flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer 
               transition-all has-[:checked]:border-[rgb(40,169,224)] 
               has-[:checked]:bg-[rgb(40,169,224,0.05)] has-[:checked]:shadow-sm
               hover:bg-gray-50"
  >
    {/* Checkbox ẩn */}
    <input
      type="checkbox"
      id={id}
      {...register(`amenities.${id}`)} // Đăng ký với react-hook-form
      className="absolute opacity-0 w-0 h-0 peer" 
    />
    
    {/* Icon */}
    <span className="text-[rgb(40,169,224)]">{icon}</span>
    
    {/* Nhãn */}
    <span className="text-sm font-medium text-gray-700">{label}</span>
    
    {/* Dấu check (chỉ hiển thị khi được chọn) */}
    <span className="absolute top-2 right-2 hidden h-5 w-5 items-center justify-center 
                   rounded-full bg-[rgb(40,169,224)] text-white 
                   peer-checked:flex">
      <Check size={12} />
    </span>
  </label>
);

export default AmenityOption;