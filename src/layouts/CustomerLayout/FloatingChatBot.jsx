// src/components/FloatingChatBot.jsx
import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import ChatFab from "./ChatBot/ChatFab";
import ChatPanel from "./ChatBot/ChatPanel";
import aiService from "@/services/ai.service";
import { useAuth } from "@/context/AuthContext";

const FloatingChatBot = () => {
    const { currentUser } = useAuth();
    const [open, setOpen] = useState(false);

    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: "ai",
            text: "Xin chào! Tôi là trợ lý ảo TravelMate. Tôi có thể giúp gì cho bạn hôm nay?",
            timestamp: new Date(),
        },
    ]);

    const [isLoading, setIsLoading] = useState(false);

    const toggleChat = () => setOpen((prev) => !prev);

    const handleSendMessage = async (text) => {
        if (!text.trim()) return;

        if (!currentUser) {
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    sender: "ai",
                    text: "Vui lòng đăng nhập để sử dụng tính năng Chatbot.",
                    timestamp: new Date(),
                },
            ]);
            return;
        }

        const userMessage = {
            id: Date.now(),
            sender: "user",
            text,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMessage]);

        setIsLoading(true);

        try {
            const res = await aiService.sendMessage(text);

            const action = res.data?.action;
            const responseText = res.data?.response;
            const payload = res.data?.payload;

            // ===== CASE 1: AI hỏi tiếp =====
            if (action === "ASKING" || action === "NORMAL_CHAT") {
                setMessages((prev) => [
                    ...prev,
                    {
                        id: Date.now() + 1,
                        sender: "ai",
                        text: responseText,
                        timestamp: new Date(),
                    },
                ]);
            }

            // ===== CASE 2: Kết quả tìm phòng =====
            if (action === "SEARCH_ROOM_RESULT") {
                setMessages((prev) => [
                    ...prev,
                    {
                        id: Date.now() + 2,
                        sender: "ai",
                        type: "hotel_list",
                        payload,
                        timestamp: new Date(),
                    },
                ]);
            }
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    sender: "ai",
                    text: "Đã có lỗi xảy ra. Vui lòng thử lại sau.",
                    timestamp: new Date(),
                },
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