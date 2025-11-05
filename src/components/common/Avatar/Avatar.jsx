import React from "react";

const Avatar = ({ name, src, size = 64, className = "" }) => {
  // Nếu có hình thì hiển thị hình, nếu không thì hiển thị ký tự đầu
  const initials = name ? name.charAt(0).toUpperCase() : "?";

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-[rgb(40,169,224)] text-white font-semibold ${className}`}
      style={{ width: size, height: size }}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover rounded-full"
        />
      ) : (
        <span className="text-lg">{initials}</span>
      )}
    </div>
  );
};

// ✅ BẮT BUỘC CÓ DÒNG NÀY để import default hoạt động
export default Avatar;
