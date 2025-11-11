import React from "react";
// 1. Import thêm icon
import { X, FileText } from "lucide-react";

export default function FileUpload({
  label,
  icon,
  multiple = false,
  accept = "*",
  helpText = "",
  onChange,
  value, // 2. Thêm prop 'value' (từ react-hook-form watch)
  onClear, // 3. Thêm prop 'onClear' (để gọi setValue(null))
  error = "",
}) {
  // Lấy file đầu tiên từ danh sách (vì chúng ta không cho multiple)
  const file = value && value.length > 0 ? value[0] : null;
  const fileName = file ? file.name : null;

  // 4. Nếu CÓ file, hiển thị giao diện xem trước
  if (fileName) {
    return (
      <div className="w-full">
        <div
          className={`flex items-center justify-between w-full h-auto p-4 
                     border-2 border-dashed rounded-xl 
                     transition-colors
                     ${
                       error
                         ? "border-red-400 bg-red-50 text-red-700"
                         : "border-green-500 bg-green-50 text-green-800" // Đổi sang màu xanh khi thành công
                     }
                    `}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <FileText size={20} className="flex-shrink-0" />
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold truncate" title={fileName}>
                {fileName}
              </span>
              <span className="text-xs">{label}</span>
            </div>
          </div>
          {/* Nút "X" để xóa file */}
          <button
            type="button"
            onClick={onClear} 
            className="flex-shrink-0 p-1 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        {/* Vẫn hiển thị lỗi nếu file sai định dạng */}
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    );
  }

  // 5. Nếu KHÔNG có file, hiển thị giao diện upload (code cũ)
  return (
    <div className="w-full">
      <label
        htmlFor={`file-upload-${label}`}
        className={`flex flex-col items-center justify-center w-full h-32 
                   border-2 border-dashed rounded-xl cursor-pointer 
                   bg-gray-50 transition-colors
                   ${
                     error
                       ? "border-red-400 text-red-500 hover:bg-red-50"
                       : "border-gray-300 text-gray-500 hover:border-[rgb(40,169,224)] hover:bg-[rgb(40,169,224,0.05)] hover:text-[rgb(40,169,224)]"
                   }
                  `}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <div className={`${error ? "text-red-500" : ""}`}>{icon}</div>
          <p className="mb-1 text-sm font-semibold">{label}</p>
          <input
            type="file"
            multiple={multiple}
            accept={accept}
            onChange={onChange}
            className="hidden"
            id={`file-upload-${label}`}
          />
        </div>
      </label>

      {error ? (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      ) : (
        <p className="text-xs text-gray-400 mt-1">{helpText}</p>
      )}
    </div>
  );
}