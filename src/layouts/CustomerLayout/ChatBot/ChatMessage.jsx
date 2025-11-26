// src/layouts/CustomerLayout/ChatBot/ChatMessage.jsx
import React from "react";

const ChatMessage = ({ message }) => {
  // 1. Destructure lấy 'text' và 'sender' từ object message
  const { text, sender } = message;

  // 2. Kiểm tra sender là 'ai' (theo code mới của bạn) hoặc 'bot'
  const isBot = sender === "ai" || sender === "bot";

  return (
    <div className={`flex ${isBot ? "justify-start" : "justify-end"}`}>
      <span
        className={`p-3 rounded-2xl max-w-[80%] break-words shadow-sm text-sm
          ${isBot
            ? "rounded-tl-none bg-gray-100 text-gray-800 border border-gray-200"
            : "rounded-tr-none bg-[rgb(40,169,224)] text-white"
          }`}
      >
        {/* 3. Chỉ render phần text */}
        {text}
      </span>
    </div>
  );
};

export default ChatMessage;