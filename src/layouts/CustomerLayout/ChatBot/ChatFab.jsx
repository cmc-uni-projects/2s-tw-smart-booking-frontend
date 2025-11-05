// src/layouts/CustomerLayout/ChatBot/ChatFab.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";

const ChatFab = ({ open, onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      className={`fixed bottom-6 right-6 rounded-full p-4 shadow-lg z-50 transition-colors duration-300
        ${open ? "bg-red-500 text-white hover:bg-red-600" : "bg-[rgb(40,169,224)] text-white hover:bg-[#1b98d6]"
      }`}
      aria-label={open ? "Đóng chat" : "Mở chat"}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
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
  );
};

export default ChatFab;