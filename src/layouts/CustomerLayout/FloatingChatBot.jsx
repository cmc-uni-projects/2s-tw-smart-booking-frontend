import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import Button from "../../components/common/Button/Button";

const FloatingChatBot = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-[rgb(40,169,224)] text-white rounded-full p-4 shadow-lg hover:scale-105 transition-transform z-50"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-20 right-6 bg-white w-80 h-96 rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col">
          <div className="bg-[rgb(40,169,224)] text-white p-3 font-semibold flex justify-between items-center">
            <span>AI Travel Assistant</span>
            <button onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 p-3 overflow-y-auto text-sm text-gray-700">
            <p className="text-gray-500 italic">
              Xin chào 👋 Tôi có thể giúp bạn tìm khách sạn hoặc gợi ý điểm đến!
            </p>
          </div>

          <div className="p-3 border-t border-gray-200 flex gap-2">
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-[rgb(40,169,224)]"
            />
            <Button size="sm">Gửi</Button>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingChatBot;
