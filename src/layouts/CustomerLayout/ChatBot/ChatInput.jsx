// src/layouts/CustomerLayout/ChatBot/ChatInput.jsx
import React from "react";
// (Không cần import icon)

const ChatInput = ({ value, onChange, onSubmit }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-3 border-t border-gray-100 flex gap-2 items-center bg-white"
    >
      <input
        type="text"
        placeholder="Nhập tin nhắn..."
        value={value}
        onChange={onChange}
        className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm
                   focus:ring-2 focus:ring-[rgb(40,169,224,0.5)] focus:border-[rgb(40,169,224)] 
                   transition-all outline-none"
      />
      {/* ✅ SỬA LỖI: Thay thế icon bằng Button dạng Text */}
      <button
        type="submit"
        aria-label="Gửi tin nhắn"
        className="flex-shrink-0 px-4 py-2 rounded-full bg-[rgb(40,169,224)] text-white text-sm font-semibold hover:bg-[#1b98d6] transition-colors"
      >
        Gửi
      </button>
    </form>
  );
};

export default ChatInput;