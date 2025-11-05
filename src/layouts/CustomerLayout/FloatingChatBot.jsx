// src/layouts/CustomerLayout/FloatingChatBot.jsx
import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";

// ✅ Import các component con mới
import ChatFab from "./ChatBot/ChatFab";
import ChatPanel from "./ChatBot/ChatPanel";

const FloatingChatBot = () => {
  const [open, setOpen] = useState(false);
  const toggleChat = () => setOpen((prev) => !prev);

  return (
    <>
      {/* Nút bấm nổi */}
      <ChatFab open={open} onClick={toggleChat} />

      {/* Cửa sổ Chat (chỉ render khi open=true) */}
      <AnimatePresence>
        {open && <ChatPanel onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
};

export default FloatingChatBot;