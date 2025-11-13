// src/components/common/Avatar/Avatar.jsx
import React, { useState, useEffect } from "react";

// Helper: Lấy domain gốc từ biến môi trường (đã cấu hình trong .env)
// Ví dụ: "http://localhost:8386/api/v1" -> "http://localhost:8386"
const getBaseUrl = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8386/api/v1";
  try {
    const url = new URL(apiUrl);
    return url.origin; 
  } catch (e) {
    return "http://localhost:8386"; // Fallback an toàn
  }
};

const Avatar = ({ name, src, size = 64, className = "" }) => {
  const [imgSrc, setImgSrc] = useState(null);
  const [hasError, setHasError] = useState(false);

  // Lấy ký tự đầu để hiển thị nếu không có ảnh hoặc ảnh lỗi
  const initials = name ? name.charAt(0).toUpperCase() : "?";
  const baseUrl = getBaseUrl();

  // Xử lý logic đường dẫn ảnh mỗi khi prop 'src' thay đổi
  useEffect(() => {
    if (src) {
      // Nếu src bắt đầu bằng "/" (đường dẫn tương đối), nối thêm domain backend
      if (src.startsWith("/")) {
        setImgSrc(`${baseUrl}${src}`);
      } else {
        // Nếu là link tuyệt đối (http...) hoặc base64, giữ nguyên
        setImgSrc(src);
      }
      setHasError(false); // Reset trạng thái lỗi khi có ảnh mới
    } else {
      setImgSrc(null);
    }
  }, [src, baseUrl]);

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-[rgb(40,169,224)] text-white font-semibold overflow-hidden select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Chỉ hiển thị ảnh nếu có src và chưa bị lỗi */}
      {imgSrc && !hasError ? (
        <img
          src={imgSrc}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setHasError(true)} // Nếu tải ảnh thất bại, chuyển sang hiển thị tên
        />
      ) : (
        // Fallback: Hiển thị ký tự đầu tên với kích thước chữ tự động theo size
        <span style={{ fontSize: size * 0.4 }}>{initials}</span>
      )}
    </div>
  );
};

export default Avatar;