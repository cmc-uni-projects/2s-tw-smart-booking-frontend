// src/pages/Admin/HotelSubmissions/components/SubmissionSearchBar.jsx
import React from "react";
import { Search } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import AuthTextField from "@/components/common/Input/AuthTextField";
import { motion } from "framer-motion";

const SubmissionSearchBar = ({ onSearch }) => {
  const debounced = useDebouncedCallback((value) => {
    onSearch(value);
  }, 300);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex-grow"
    >
      <AuthTextField
        name="search"
        label="Tìm theo tên khách sạn hoặc chủ sở hữu..."
        type="text"
        icon={<Search size={18} className="text-gray-400" />}
        className="!rounded-xl !border-gray-300 hover:!border-blue-400 
                   focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-100"
        onChange={(e) => debounced(e.target.value)}
      />
    </motion.div>
  );
};

export default SubmissionSearchBar;
