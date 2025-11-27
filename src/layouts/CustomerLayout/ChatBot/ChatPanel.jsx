// src/layouts/CustomerLayout/ChatBot/ChatPanel.jsx
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";

const panelVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

const ChatPanel = ({ onClose, messages, isLoading, onSendMessage }) => {
  const messagesEndRef = useRef(null);

  // Tự động cuộn xuống khi messages thay đổi
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <motion.div
      variants={panelVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      style={{ transformOrigin: "bottom right" }}
      // ✅ CẬP NHẬT KÍCH THƯỚC TẠI ĐÂY:
      // - w-[450px]: Tăng chiều rộng (cũ là w-80)
      // - h-[600px]: Tăng chiều cao (cũ là h-[450px])
      // - max-h-[80vh]: Đảm bảo không tràn màn hình trên thiết bị thấp
      className="fixed bottom-24 right-6 bg-white w-[450px] max-w-[90vw] h-[600px] max-h-[80vh] 
                 rounded-2xl shadow-2xl overflow-hidden z-[9999] 
                 flex flex-col border border-gray-200/50"
    >
      <ChatHeader onClose={onClose} />

      {/* Danh sách tin nhắn */}
      <div className="flex-1 p-4 overflow-y-auto text-sm space-y-3 bg-gray-50 custom-scrollbar">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-gray-200 text-gray-500 rounded-2xl rounded-tl-none px-4 py-2 text-xs">
              Đang soạn tin...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input gửi tin */}
      <ChatInput onSend={onSendMessage} disabled={isLoading} />
    </motion.div>
  );
};

export default ChatPanel;