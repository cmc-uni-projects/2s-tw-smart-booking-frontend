// src/components/common/Input/ImageUploadGrid.jsx
import React, { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Component "Thêm ảnh" (ô vuông có dấu +)
 */
const AddImageButton = ({ onChange, multiple, accept }) => (
  <label className="relative flex aspect-square w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-gray-400 transition-colors hover:border-[rgb(40,169,224)] hover:text-[rgb(40,169,224)]">
    <Plus size={32} />
    <input
      type="file"
      multiple={multiple}
      accept={accept}
      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      onChange={onChange}
    />
  </label>
);

/**
 * Component "Ảnh xem trước" (hình vuông)
 */
const ImagePreview = ({ file, onRemove }) => {
  const [previewUrl, setPreviewUrl] = useState(null);

  // Tạo URL tạm thời để xem trước
  useEffect(() => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    // Thu hồi URL khi component bị hủy
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <motion.div
      className="relative aspect-square w-full overflow-hidden rounded-lg shadow-sm"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      layout
    >
      {previewUrl ? (
        <img
          src={previewUrl}
          alt={file.name}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gray-100">...</div>
      )}
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-1.5 right-1.5 z-10 rounded-full bg-black/50 p-1 text-white backdrop-blur-sm transition-all hover:bg-red-500"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
};

/**
 * Component chính: Lưới quản lý upload ảnh
 * Tương thích với react-hook-form (nhận 'value' và 'onChange')
 */
export default function ImageUploadGrid({
  value, // Đây là một FileList (từ react-hook-form)
  onChange, // Đây là hàm (files) => setValue(...)
  multiple = true,
  accept = "image/png, image/jpeg, image/webp",
  error = "",
}) {
  // Chuyển FileList (đối tượng giống object) thành Array
  const filesArray = value ? Array.from(value) : [];

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    if (!newFiles.length) return;
    
    // Tạo một FileList mới (kết hợp file cũ và file mới)
    const dataTransfer = new DataTransfer();
    filesArray.forEach(file => dataTransfer.items.add(file));
    newFiles.forEach(file => dataTransfer.items.add(file));
    
    onChange(dataTransfer.files); // Gửi FileList mới lên react-hook-form
  };

  const handleRemoveFile = (indexToRemove) => {
    const dataTransfer = new DataTransfer();
    filesArray
      .filter((_, index) => index !== indexToRemove)
      .forEach(file => dataTransfer.items.add(file));

    onChange(dataTransfer.files); // Gửi FileList đã cập nhật
  };

  return (
    <div>
      {/* Grid: 5 cột trên desktop, 3 cột trên mobile */}
      <div className="grid grid-cols-3 gap-3 md:grid-cols-5">
        <AnimatePresence>
          {filesArray.map((file, index) => (
            <ImagePreview
              key={index} // Sử dụng index vì FileList không có ID ổn định
              file={file}
              onRemove={() => handleRemoveFile(index)}
            />
          ))}
        </AnimatePresence>

        {/* Ô dấu "+" */}
        <AddImageButton
          onChange={handleFileChange}
          multiple={multiple}
          accept={accept}
        />
      </div>

      {/* Hiển thị lỗi validation */}
      {error && (
        <p className="text-xs text-red-500 mt-2">{error}</p>
      )}
    </div>
  );
}