// src/layouts/CustomerLayout/FloatingChatBot.jsx
import React, { useState } from "react";
// ✅ Import motion for animations
import { motion, AnimatePresence } from "framer-motion";
// ✅ Import Send icon
import { MessageCircle, X, Send } from "lucide-react";
// (Không cần import Button nữa)

const FloatingChatBot = () => {
  const [open, setOpen] = useState(false);

  // ✅ Định nghĩa variants cho panel
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

  return (
    <>
      {/* === Floating button === */}
      <motion.button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-6 right-6 rounded-full p-4 shadow-lg z-50 transition-colors duration-300
          ${open ? "bg-red-500 text-white hover:bg-red-600" : "bg-[rgb(40,169,224)] text-white hover:bg-[#1b98d6]"
        }`}
        aria-label={open ? "Đóng chat" : "Mở chat"}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* ✅ Thêm hiệu ứng chuyển icon mượt mà */}
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* === Chat panel === */}
      <AnimatePresence>
        {open && (
          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            style={{ transformOrigin: "bottom right" }} // ✅ Đặt tâm animation
            className="fixed bottom-24 right-6 bg-white w-80 max-w-[90vw] h-[450px] max-h-[80vh] 
                       rounded-2xl shadow-2xl overflow-hidden z-50 
                       flex flex-col border border-gray-200/50"
          >
            {/* Header */}
            <div className="bg-[rgb(40,169,224)] text-white p-4 font-semibold flex justify-between items-center shadow-sm flex-shrink-0">
              <span>AI Travel Assistant</span>
              <button
                onClick={() => setOpen(false)}
                className="opacity-70 hover:opacity-100"
                aria-label="Đóng chat"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body (Phần tin nhắn) */}
            <div className="flex-1 p-4 overflow-y-auto text-sm space-y-3">
              {/* Bot message */}
              <div className="flex justify-start">
                <span className="p-3 rounded-lg rounded-bl-none bg-gray-100 text-gray-800 max-w-xs break-words shadow-sm">
                  Xin chào 👋 Tôi có thể giúp bạn tìm khách sạn hoặc gợi ý điểm
                  đến!
                </span>
              </div>
            </div>

            {/* Input Footer */}
            <form
              onSubmit={(e) => e.preventDefault()} // (Chặn submit, sẽ thêm logic sau)
              className="p-3 border-t border-gray-100 flex gap-2 items-center bg-white"
            >
              <input
                type="text"
                placeholder="Nhập tin nhắn..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm
                           focus:ring-2 focus:ring-[rgb(40,169,224,0.5)] focus:border-[rgb(40,169,224)] 
                           transition-all outline-none"
              />
              {/* ✅ Nút gửi bằng Icon */}
              <button
                type="submit"
                aria-label="Gửi tin nhắn"
                className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-[rgb(40,169,224)] text-white hover:bg-[#1b98d6] transition-colors"
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingChatBot;