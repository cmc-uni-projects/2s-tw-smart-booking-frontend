// src/layouts/CustomerLayout/ChatBot/ChatMessage.jsx
import React from "react";

const ChatMessage = ({ message, sender = "bot" }) => {
  const isBot = sender === "bot";

  return (
    <div className={`flex ${isBot ? "justify-start" : "justify-end"}`}>
      <span
        className={`p-3 rounded-lg max-w-xs break-words shadow-sm
          ${isBot
            ? "rounded-bl-none bg-gray-100 text-gray-800"
            : "rounded-br-none bg-[rgb(40,169,224)] text-white"
          }`}
      >
        {message}
      </span>
    </div>
  );
};

export default ChatMessage;