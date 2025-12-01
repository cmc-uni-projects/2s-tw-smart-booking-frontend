// src/layouts/CustomerLayout/ChatBot/ChatMessage.jsx
import React from "react";
import { Bot, User } from "lucide-react"; // Import icon để làm Avatar

const ChatMessage = ({ message }) => {
  const { text, sender } = message;
  const isBot = sender === "ai" || sender === "bot";

  return (
    <div className={`flex w-full ${isBot ? "justify-start" : "justify-end"} mb-4`}>
      
      {/* --- AVATAR CHO BOT (Chỉ hiện khi là AI) --- */}
      {isBot && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white mr-2 shadow-sm shrink-0 mt-1">
          <Bot size={16} />
        </div>
      )}

      {/* --- BONG BÓNG CHAT --- */}
      <div
        className={`p-3 rounded-2xl max-w-[75%] break-words shadow-sm text-sm leading-relaxed
          ${isBot
            ? "bg-white text-gray-800 border border-gray-100 rounded-tl-none shadow-md" // Style cho Bot: Trắng, sạch sẽ
            : "bg-[#28A9E0] text-white rounded-tr-none shadow-md" // Style cho User: Xanh thương hiệu
          }`}
      >
        {text}
      </div>

    </div>
  );
};

export default ChatMessage;