import React from "react";
import { Eye, Check, X, User, Mail, Phone, Calendar, FileText } from "lucide-react";
import Button from "@/components/common/Button/Button";
import Badge from "@/components/common/Badge/Badge";
import { motion } from "framer-motion";

// ✅ Helper xử lý URL ảnh
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8386/api/v1").replace("/api/v1", "");

const getFullImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  
  let path = url.startsWith("/") ? url : `/${url}`;
  if (!path.startsWith("/uploads")) {
    path = `/uploads${path}`;
  }
  return `${API_BASE_URL}${path}`;
};

const cardVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
};

const ApprovalCard = ({ application, onViewDetails, onApprove, onReject }) => {
  const isPending = application.status === "PENDING";
  
  // Lấy URL avatar
  const avatarUrl = getFullImageUrl(application.avatar);

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      className="group flex flex-col md:flex-row bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden 
                 transition-all duration-300 ease-in-out hover:shadow-md hover:border-blue-300 p-5 gap-5"
    >
      {/* Cột Avatar & Info Chính */}
      <div className="flex items-start gap-4 md:w-1/3">
        {/* ✅ Hiển thị Avatar nếu có */}
        {avatarUrl ? (
           <img 
             src={avatarUrl} 
             alt="Avatar" 
             className="w-12 h-12 rounded-full object-cover border border-gray-200 shadow-sm"
             onError={(e) => {
                e.target.onerror = null; 
                e.target.style.display = 'none'; // Ẩn nếu lỗi
                e.target.nextSibling.style.display = 'flex'; // Hiện fallback
             }}
           />
        ) : null}
        
        {/* Fallback Avatar (Chữ cái đầu) - Hiển thị khi không có ảnh hoặc ảnh lỗi */}
        <div 
          className={`w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xl flex-shrink-0 ${avatarUrl ? 'hidden' : 'flex'}`}
        >
          {application.fullName?.charAt(0).toUpperCase() || "U"}
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            {application.fullName}
          </h3>
          <p className="text-sm text-gray-500 flex items-center mt-1">
            <Mail size={14} className="mr-1.5" />
            {application.email}
          </p>
          <Badge variant={isPending ? "warning" : application.status === "APPROVED" ? "success" : "error"} className="mt-2 inline-flex">
            {isPending ? "Chờ duyệt" : application.status}
          </Badge>
        </div>
      </div>

      {/* Cột Chi tiết phụ */}
      <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600 border-t md:border-t-0 md:border-l border-gray-100 md:pl-5 pt-4 md:pt-0">
        <div className="flex items-center">
          <Phone size={14} className="mr-2 text-gray-400" />
          <span className="font-medium text-gray-800">{application.phoneNumber || "---"}</span>
        </div>
        <div className="flex items-center">
          <FileText size={14} className="mr-2 text-gray-400" />
          <span className="truncate max-w-[200px]" title={application.businessName}>
            {application.businessName || "Cá nhân"}
          </span>
        </div>
        <div className="flex items-center sm:col-span-2">
          <Calendar size={14} className="mr-2 text-gray-400" />
          <span>Ngày nộp: <span className="font-medium text-gray-800">{application.submittedDate}</span></span>
        </div>
      </div>

      {/* Cột Actions */}
      <div className="flex md:flex-col gap-2 justify-center border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-5 min-w-[140px]">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetails(application)}
          leftIcon={<Eye size={16} />}
          className="flex-1 w-full justify-center"
        >
          Chi tiết
        </Button>
        
        {isPending && (
          <div className="flex gap-2 md:contents">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onReject(application)}
              className="flex-1 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 w-full justify-center"
              iconOnly
              title="Từ chối"
            >
              <X size={18} />
            </Button>
            <Button
              size="sm"
              onClick={() => onApprove(application)}
              className="flex-1 bg-green-600 hover:bg-green-700 border-transparent text-white w-full justify-center"
              iconOnly
              title="Phê duyệt"
            >
              <Check size={18} />
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ApprovalCard;