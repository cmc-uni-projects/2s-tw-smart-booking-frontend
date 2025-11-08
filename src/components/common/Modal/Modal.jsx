import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
// 1. Import ModalPortal để đảm bảo modal hiển thị đúng cấp
import ModalPortal from "./ModalPortal"; 

// 2. Nhận thêm props { title, children }
export default function Modal({
  open,
  onClose,
  title = "Thông báo", // Thêm title mặc định
  children, // Thêm children
}) {
  if (!open) return null;

  return (
    // 3. Bọc trong ModalPortal
    <ModalPortal>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            // Thêm sự kiện click nền để đóng
            onClick={onClose} 
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-2xl shadow-2xl w-[95%] max-w-md overflow-hidden"
              // Ngăn sự kiện click lan ra nền
              onClick={(e) => e.stopPropagation()} 
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                <h3 className="text-lg font-semibold text-[rgb(40,169,224)]">
                  {title} {/* 4. Sử dụng prop 'title' */}
                </h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-5 space-y-4 text-gray-700 max-h-[70vh] overflow-y-auto">
                {children} {/* 5. Sử dụng prop 'children' */}
              </div>

              {/* 6. Xóa phần Footer demo bị hard-code */}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ModalPortal>
  );
}