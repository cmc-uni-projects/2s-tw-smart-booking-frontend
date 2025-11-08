import React, { useState, useRef, useEffect } from "react";
import { UploadCloud, File, X } from "lucide-react";

export default function FileUpload({
                                       label,
                                       required = false,
                                       onChange,
                                       name,
                                       error = "",
                                   }) {
    const [file, setFile] = useState(null);
    const inputRef = useRef(null);

    // Xử lý khi file bị xóa từ bên ngoài (reset form)
    useEffect(() => {
        // Logic này có thể không chạy đúng như mong đợi vì onChange là một function,
        // nhưng tôi giữ nguyên theo file gốc bạn cung cấp.
        if (onChange === null) {
            setFile(null);
            if (inputRef.current) {
                inputRef.current.value = null;
            }
        }
    }, [onChange]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            if (onChange) {
                onChange(name, selectedFile);
            }
        }
    };

    const removeFile = () => {
        setFile(null);
        if (onChange) {
            onChange(name, null);
        }
        if (inputRef.current) {
            inputRef.current.value = null;
        }
    };

    return (
        <div className="w-full">
            <label className="block mb-1 text-sm font-medium text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            {!file ? (
                <>
                    <label
                        className={`relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer bg-white hover:bg-gray-50 transition-colors
            ${error ? "border-red-400 text-red-500" : "border-gray-300"}
          `}
                    >
                        <UploadCloud
                            size={24}
                            className={error ? "text-red-400" : "text-gray-400"}
                        />
                        <span
                            className={`mt-2 text-sm ${
                                error ? "text-red-600" : "text-gray-600"
                            }`}
                        >
              {error ? error : "Nhấn để tải lên"}
            </span>

                        {/* ✅ THAY ĐỔI 1: Cập nhật text hiển thị (bỏ PDF) */}
                        {!error && (
                            <p className="text-xs text-gray-500">PNG, JPG hoặc WebP</p>
                        )}

                        <input
                            ref={inputRef}
                            type="file"
                            name={name}
                            className="opacity-0 absolute inset-0 w-full h-full"
                            onChange={handleFileChange}

                            // ✅ THAY ĐỔI 2: Cập nhật prop 'accept' (thêm webp, bỏ pdf)
                            accept="image/png, image/jpeg, image/webp"
                        />
                    </label>
                </>
            ) : (
                <div className="flex items-center justify-between w-full h-16 px-4 py-2 border border-green-300 rounded-xl bg-green-50">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <File size={20} className="text-green-600 flex-shrink-0" />
                        <span className="text-sm text-green-800 font-medium truncate">
              {file.name}
            </span>
                    </div>
                    <button
                        type="button"
                        onClick={removeFile}
                        className="text-red-500 hover:text-red-700"
                    >
                        <X size={18} />
                    </button>
                </div>
            )}
        </div>
    );
}