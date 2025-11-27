import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import ChatFab from "./ChatBot/ChatFab";
import ChatPanel from "./ChatBot/ChatPanel";
import aiService from "@/services/ai.service"; 
import { useAuth } from "@/context/AuthContext"; 

const FloatingChatBot = () => {
  const { currentUser } = useAuth();
  const [open, setOpen] = useState(false);

  // ✅ 1. STATE ĐƯỢC CHUYỂN VỀ ĐÂY (Sẽ không bị mất khi đóng ChatPanel)
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Xin chào! Tôi là trợ lý ảo TravelMate. Tôi có thể giúp gì cho bạn hôm nay?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleChat = () => setOpen((prev) => !prev);

  // ✅ 2. LOGIC GỬI TIN CŨNG CHUYỂN VỀ ĐÂY
  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    // Check đăng nhập
    if (!currentUser) {
      setMessages((prev) => [
        ...prev, 
        {
            id: Date.now(),
            text: "Vui lòng đăng nhập để sử dụng tính năng Chatbot.",
            sender: "ai",
            timestamp: new Date(),
        }
      ]);
      return;
    }

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: text,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Gọi API
      const res = await aiService.sendMessage(text);
      const aiResponseText = res.data?.response || "Xin lỗi, tôi không hiểu câu hỏi.";

      // Add AI message
      setMessages((prev) => [
        ...prev, 
        {
            id: Date.now() + 1,
            text: aiResponseText,
            sender: "ai",
            timestamp: new Date(),
        }
      ]);
    } catch (error) {
      console.error("Chat AI Error:", error);
      setMessages((prev) => [
        ...prev, 
        {
            id: Date.now() + 1,
            text: "Đã có lỗi xảy ra. Vui lòng thử lại sau.",
            sender: "ai",
            timestamp: new Date(),
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ChatFab open={open} onClick={toggleChat} />

      <AnimatePresence>
        {open && (
          <ChatPanel 
            onClose={() => setOpen(false)} 
            // ✅ 3. TRUYỀN DỮ LIỆU XUỐNG CON
            messages={messages}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingChatBot;