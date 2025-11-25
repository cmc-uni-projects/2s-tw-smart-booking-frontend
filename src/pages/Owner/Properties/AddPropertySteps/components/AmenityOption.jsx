import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const AmenityOption = ({ id, label, icon, register, isSelected }) => {
  return (
    <motion.label
      htmlFor={id}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`relative flex flex-col items-center justify-center p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 h-32 gap-3 shadow-sm
        ${
          isSelected
            ? "border-[rgb(40,169,224)] bg-[rgb(40,169,224)]/5 shadow-md"
            : "border-gray-100 bg-white hover:border-gray-300 hover:shadow-md"
        }
      `}
    >
      {/* Input ẩn của React Hook Form */}
      <input
        type="checkbox"
        id={id}
        {...register(`amenities.${id}`)}
        className="hidden"
      />

      {/* Icon */}
      <div
        className={`p-3 rounded-full transition-colors duration-300 ${
          isSelected
            ? "bg-[rgb(40,169,224)] text-white"
            : "bg-gray-50 text-gray-500"
        }`}
      >
        {icon}
      </div>

      {/* Label */}
      <span
        className={`text-sm font-semibold transition-colors ${
          isSelected ? "text-[rgb(40,169,224)]" : "text-gray-700"
        }`}
      >
        {label}
      </span>

      {/* Checkmark Badge (Chỉ hiện khi chọn) */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 right-3"
        >
          <div className="bg-[rgb(40,169,224)] text-white rounded-full p-1 shadow-sm">
            <Check size={12} strokeWidth={3} />
          </div>
        </motion.div>
      )}
    </motion.label>
  );
};

export default AmenityOption;