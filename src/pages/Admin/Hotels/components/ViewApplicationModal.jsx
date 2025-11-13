import React, { useState } from "react";
import Modal from "@/components/common/Modal/Modal";
import Button from "@/components/common/Button/Button";
import { User, Mail, Calendar, MapPin, Briefcase, Image, ExternalLink } from "lucide-react";

const ViewApplicationModal = ({ open, onClose, application }) => {
  const [activeTab, setActiveTab] = useState("info");

  if (!application) return null;

  const getImgUrl = (url) => {
    if (!url) return "";
    return url.replace("/files/", "/uploads/");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit"
    });
  };

  return (
    <Modal
      open={open} // ✅ Đã sửa từ isOpen thành open
      onClose={onClose}
      title={`Hồ sơ: ${application.applicantFullName || "Chi tiết"}`}
      maxWidth="max-w-4xl"
    >
      {/* ... (Giữ nguyên nội dung bên trong Modal như cũ) ... */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`px-6 py-3 font-medium text-sm flex items-center gap-2 transition-colors border-b-2 ${
            activeTab === "info" ? "text-blue-600 border-blue-600" : "text-gray-500 border-transparent"
          }`}
          onClick={() => setActiveTab("info")}
        >
          <User size={18} /> Thông tin hồ sơ
        </button>
        <button
          className={`px-6 py-3 font-medium text-sm flex items-center gap-2 transition-colors border-b-2 ${
            activeTab === "images" ? "text-blue-600 border-blue-600" : "text-gray-500 border-transparent"
          }`}
          onClick={() => setActiveTab("images")}
        >
          <Image size={18} /> Hình ảnh minh chứng
        </button>
      </div>

      {activeTab === "info" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b pb-2">Thông tin người nộp</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-3">
               <p className="text-sm"><span className="font-semibold">Họ tên:</span> {application.applicantFullName}</p>
               <p className="text-sm"><span className="font-semibold">Email:</span> {application.applicantEmail}</p>
               <p className="text-sm"><span className="font-semibold">Ngày nộp:</span> {formatDate(application.createdAt)}</p>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b pb-2">Thông tin pháp lý</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-3">
               <p className="text-sm"><span className="font-semibold">Số ĐKKD:</span> {application.businessLicenseNumber}</p>
               <p className="text-sm"><span className="font-semibold">Thường trú:</span> {application.permanentAddress}</p>
               <p className="text-sm"><span className="font-semibold">Quê quán:</span> {application.hometownAddress}</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "images" && (
        <div className="space-y-6 animate-fadeIn h-[60vh] overflow-y-auto pr-2">
          <div>
            <h4 className="text-sm font-bold text-gray-800 mb-3">CCCD / Passport</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded p-2"><img src={getImgUrl(application.cardFrontImage)} className="w-full h-40 object-contain" alt="Mặt trước"/></div>
              <div className="border rounded p-2"><img src={getImgUrl(application.cardBackImage)} className="w-full h-40 object-contain" alt="Mặt sau"/></div>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-800 mb-3">Giấy phép kinh doanh</h4>
            <div className="border rounded p-2 w-2/3"><img src={getImgUrl(application.businessLicenseImage)} className="w-full h-60 object-contain" alt="GPKD"/></div>
          </div>
        </div>
      )}

      <div className="flex justify-end mt-6 pt-4 border-t border-gray-100">
        <Button variant="secondary" onClick={onClose}>Đóng</Button>
      </div>
    </Modal>
  );
};

export default ViewApplicationModal;