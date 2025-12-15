import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye } from "lucide-react";

export default function AuditTable({ logs = [], onViewDetail }) {
  return (
      <div className="overflow-x-auto border border-gray-200 rounded-2xl shadow-sm bg-white">
        <table className="w-full text-left border-collapse">
          {/* ===== HEADER ===== */}
          <thead className="bg-[rgb(40,169,224,0.08)] text-[rgb(40,169,224)]">
          <tr>
            <th className="px-5 py-3 font-semibold text-sm uppercase">Log ID</th>
            <th className="px-5 py-3 font-semibold text-sm uppercase">Log Action</th>
            <th className="px-5 py-3 font-semibold text-sm uppercase">Entity Type</th>
            <th className="px-5 py-3 font-semibold text-sm uppercase">Description</th>
            <th className="px-5 py-3 font-semibold text-sm uppercase">Actor Email</th>
            <th className="px-5 py-3"></th>
          </tr>
          </thead>

          {/* ===== BODY ===== */}
          <tbody>
          <AnimatePresence>
            {logs.length > 0 ? (
                logs.map((log) => (
                    <motion.tr
                        key={log.logId}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="border-t border-gray-100 hover:bg-[rgb(40,169,224,0.05)] transition-all"
                    >
                      <td className="px-5 py-3 text-gray-700 font-medium">
                        {log.logId}
                      </td>

                      <td className="px-5 py-3">
                    <span className="px-2 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-600">
                      {log.action}
                    </span>
                      </td>

                      <td className="px-5 py-3">
                    <span className="px-2 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700">
                      {log.entityType}
                    </span>
                      </td>

                      <td className="px-5 py-3 text-sm text-gray-700 line-clamp-2 max-w-[300px]">
                        {log.description}
                      </td>

                      <td className="px-5 py-3 text-sm text-gray-600">
                        {log.actorEmail}
                      </td>

                      {/* ===== ACTION BUTTON (ĐÃ SỬA) ===== */}
                      <td className="px-5 py-3 text-right">
                        <button
                            onClick={() => onViewDetail(log.logId)}
                            className="
                        group
                        inline-flex items-center gap-2 px-3 py-2
                        rounded-lg text-sm font-medium
                        text-[rgb(40,169,224)] bg-[rgb(40,169,224)]/10
                        hover:bg-[rgb(40,169,224)] hover:text-white hover:shadow-md hover:-translate-y-0.5
                        transition-all duration-200 ease-in-out
                      "
                        >
                          <Eye
                              size={16}
                              className="transition-transform group-hover:scale-110"
                          />
                          <span>Xem chi tiết</span>
                        </button>
                      </td>
                    </motion.tr>
                ))
            ) : (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span>Không có dữ liệu để hiển thị</span>
                    </div>
                  </td>
                </tr>
            )}
          </AnimatePresence>
          </tbody>
        </table>
      </div>
  );
}