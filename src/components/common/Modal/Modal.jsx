import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle } from "lucide-react";
import Button from "../Button/Button";
import Badge from "../Badge/Badge";

export default function Modal({ open, onClose }) {
  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-2xl shadow-2xl w-[95%] max-w-md overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h3 className="text-lg font-semibold text-[rgb(40,169,224)]">
                Xác nhận đặt phòng
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-4 text-gray-700">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-500" size={22} />
                <p className="font-medium">
                  Phòng Deluxe Twin đã được chọn thành công!
                </p>
              </div>

              <div className="text-sm border border-gray-100 rounded-xl p-4 bg-gray-50">
                <p className="font-medium text-gray-800 mb-1">Thông tin đặt phòng:</p>
                <ul className="space-y-1 text-gray-600">
                  <li>🏨 Khách sạn: <span className="font-medium">Sunrise Resort</span></li>
                  <li>📅 Ngày nhận phòng: 12/12/2025</li>
                  <li>🕓 Thời gian: 14:00 - 12:00 (ngày trả phòng)</li>
                  <li>👤 Khách hàng: Nguyễn Văn A</li>
                </ul>
              </div>

              <div className="flex items-center justify-between">
                <Badge color="success">Đặt phòng thành công</Badge>
                <p className="text-gray-500 text-sm">Mã đơn: #BK245879</p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
              <Button variant="ghost" onClick={onClose}>
                Hủy
              </Button>
              <Button variant="primary">Xác nhận</Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
