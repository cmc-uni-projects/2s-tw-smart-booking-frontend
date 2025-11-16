import React, { useState } from "react";
import Modal from "@/components/common/Modal/Modal";
import Button from "@/components/common/Button/Button";
import { User, Mail, Calendar, MapPin, Briefcase, Image } from "lucide-react";
import ImageViewerModal from "./ImageViewerModal";

// ▼▼▼ BẮT ĐẦU THAY ĐỔI ▼▼▼
// 1. Lấy URL gốc của backend (ví dụ: http://localhost:8386)
const API_BASE_URL = (import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:8386/api/v1").replace("/api/v1", "");

// 2. Cập nhật hàm getImgUrl
const getImgUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return "/assets/images/placeholder.png"; // Ảnh placeholder
  }
  // Chuyển đổi /files/abc.png -> http://localhost:8386/uploads/abc.png
  const imageUrl = url.replace("/files/", "/uploads/");
  return `${API_BASE_URL}${imageUrl}`;
};
// ▲▲▲ KẾT THÚC THAY ĐỔI ▲▲▲

const ViewApplicationModal = ({ open, onClose, application }) => {
  const [activeTab, setActiveTab] = useState("info");
  const [viewingImage, setViewingImage] = useState(null);

  if (!application) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit"
    });
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => setActiveTab("info"), 200);
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        title={`Hồ sơ: ${application.applicantFullName || "Chi tiết"}`}
        maxWidth="max-w-4xl"
      >
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`px-6 py-3 font-medium text-sm flex items-center gap-2 transition-colors border-b-2 ${
              activeTab === "info" ? "text-blue-600 border-blue-600" : "text-gray-500 border-transparent hover:text-blue-500"
            }`}
            onClick={() => setActiveTab("info")}
          >
            <User size={18} /> Thông tin hồ sơ
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm flex items-center gap-2 transition-colors border-b-2 ${
              activeTab === "images" ? "text-blue-600 border-blue-600" : "text-gray-500 border-transparent hover:text-blue-500"
            }`}
            onClick={() => setActiveTab("images")}
          >
            <Image size={18} /> Hình ảnh minh chứng
          </button>
        </div>

        {activeTab === "info" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b pb-2 flex items-center gap-2"><User /> Thông tin người nộp</h4>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-3">
                <InfoRow icon={<User size={14} />} label="Họ tên" value={application.applicantFullName} />
                <InfoRow icon={<Mail size={14} />} label="Email" value={application.applicantEmail} />
                <InfoRow icon={<Calendar size={14} />} label="Ngày nộp" value={formatDate(application.createdAt)} />
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b pb-2 flex items-center gap-2"><Briefcase /> Thông tin pháp lý</h4>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-3">
                <InfoRow icon={<Briefcase size={14} />} label="Số ĐKKD" value={application.businessLicenseNumber} />
                <InfoRow icon={<MapPin size={14} />} label="Thường trú" value={application.permanentAddress} />
                <InfoRow icon={<MapPin size={14} />} label="Quê quán" value={application.hometownAddress} />
              </div>
            </div>
          </div>
        )}

        {activeTab === "images" && (
          <div className="space-y-6 animate-fadeIn h-[60vh] overflow-y-auto pr-2">
            <div>
              <h4 className="text-sm font-bold text-gray-800 mb-3">CCCD / Passport</h4>
              <div className="grid grid-cols-2 gap-4">
                <ImagePreviewCard 
                  imageUrl={getImgUrl(application.cardFrontImage)} 
                  alt="Mặt trước"
                  onClick={() => setViewingImage(getImgUrl(application.cardFrontImage))} 
                />
                <ImagePreviewCard 
                  imageUrl={getImgUrl(application.cardBackImage)} 
                  alt="Mặt sau"
                  onClick={() => setViewingImage(getImgUrl(application.cardBackImage))} 
                />
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-800 mb-3">Giấy phép kinh doanh</h4>
              <div className="w-full md:w-2/3">
                <ImagePreviewCard 
                  imageUrl={getImgUrl(application.businessLicenseImage)} 
                  alt="GPKD"
                  onClick={() => setViewingImage(getImgUrl(application.businessLicenseImage))} 
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end mt-6 pt-4 border-t border-gray-100">
          <Button variant="secondary" onClick={handleClose}>Đóng</Button>
        </div>
      </Modal>

      <ImageViewerModal
        open={!!viewingImage}
        onClose={() => setViewingImage(null)}
        imageUrl={viewingImage}
      />
    </>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-start text-sm">
    <span className="text-gray-500 flex items-center gap-1.5 w-24 flex-shrink-0">
      {icon} {label}:
    </span>
    <span className="text-gray-800 font-medium">{value || "Chưa cập nhật"}</span>
  </div>
);

const ImagePreviewCard = ({ imageUrl, alt, onClick }) => (
  <div 
    className="border border-gray-200 rounded-lg p-2 bg-gray-50 cursor-pointer hover:border-blue-400 transition-colors"
    onClick={onClick}
  >
    <img 
      src={imageUrl} 
      className="w-full h-auto md:h-48 object-contain" 
      alt={alt}
    />
    <p className="text-center text-sm text-gray-500 mt-1">{alt}</p>
  </div>
);


export default ViewApplicationModal;