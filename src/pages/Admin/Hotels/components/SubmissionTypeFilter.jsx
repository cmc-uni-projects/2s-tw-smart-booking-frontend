// src/pages/Admin/HotelSubmissions/components/SubmissionTypeFilter.jsx
import React from "react";
import { Building } from "lucide-react";
import Select from "@/components/common/Select/Select";
import { motion } from "framer-motion";

const PROPERTY_TYPES = [
  { value: "ALL", label: "Tất cả loại hình" },
  { value: "HOTEL", label: "Khách sạn (Hotel)" },
  { value: "APARTMENT", label: "Căn hộ (Apartment)" },
  { value: "RESORT", label: "Khu nghỉ dưỡng (Resort)" },
  { value: "VILLA", label: "Biệt thự (Villa)" },
  { value: "HOMESTAY", label: "Homestay" },
  { value: "UNKNOWN", label: "Khác" },
];

const SubmissionTypeFilter = ({ currentType, onTypeChange }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="md:w-1/3 lg:w-1/4"
    >
      <Select
        label="Lọc theo loại hình"
        options={PROPERTY_TYPES}
        value={currentType}
        onChange={(e) => onTypeChange(e.target.value)}
        icon={<Building size={18} className="text-gray-400" />}
        className="
          !rounded-xl
          !border-gray-300
          hover:!border-blue-400
          focus:!border-blue-500
          focus:!ring-2
          focus:!ring-blue-100
          transition-all
        "
      />
    </motion.div>
  );
};

export default SubmissionTypeFilter;
