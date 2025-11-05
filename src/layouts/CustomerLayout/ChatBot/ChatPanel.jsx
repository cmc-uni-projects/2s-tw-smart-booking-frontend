// src/layouts/CustomerLayout/ChatBot/ChatPanel.jsx
import React from "react";
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

// ✅ (Yêu cầu 2) Xóa prop 'onClose'
const ChatPanel = () => {
  return (
    <motion.div
      variants={panelVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      style={{ transformOrigin: "bottom right" }}
      className="fixed bottom-24 right-6 bg-white w-80 max-w-[90vw] h-[450px] max-h-[80vh] 
                 rounded-2xl shadow-2xl overflow-hidden z-50 
                 flex flex-col border border-gray-200/50"
    >
      {/* ✅ (Yêu cầu 2) Xóa prop 'onClose' */}
      <ChatHeader />

      {/* Body (Phần tin nhắn) */}
      <div className="flex-1 p-4 overflow-y-auto text-sm space-y-3">
        <ChatMessage
          sender="bot"
          message="Xin chào 👋 Tôi có thể giúp bạn tìm khách sạn hoặc gợi ý điểm đến!"
        />
      </div>

      <ChatInput />
    </motion.div>
  );
};

export default ChatPanel;