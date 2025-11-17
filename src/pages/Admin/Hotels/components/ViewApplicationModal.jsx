import React, { useState } from "react";
import Modal from "@/components/common/Modal/Modal";
import Button from "@/components/common/Button/Button";
import TabsComponent from "@/components/common/Tabs/TabsComponent";
import ImageViewerModal from "@/components/common/Modal/ImageViewerModal";

import { User, Mail, Calendar, MapPin, Briefcase } from "lucide-react";

// Lấy URL gốc backend 
const API_BASE_URL = (import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:8386/api/v1")
  .replace("/api/v1", "");

// Convert ảnh
const getImgUrl = (url) => {
  if (!url || typeof url !== "string") return "/assets/images/placeholder.png";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${API_BASE_URL}${url}`;
};

const ViewApplicationModal = ({ open, onClose, application }) => {
  const [activeTab, setActiveTab] = useState("info");

  const [viewerImages, setViewerImages] = useState([]);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerStartIndex, setViewerStartIndex] = useState(0);

  if (!application) return null;

  const tabs = [
    { id: "info", name: "Thông tin hồ sơ" },
    { id: "images", name: "Hình ảnh minh chứng" },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit"
    });
  };

  const openViewer = (images, start) => {
    setViewerImages(images);
    setViewerStartIndex(start);
    setViewerOpen(true);
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
        {/* Tabs */}
        <div className="mb-6">
          <TabsComponent
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        {/* TAB 1 — THÔNG TIN HỒ SƠ */}
        {activeTab === "info" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
            {/* Left */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
                <User /> Thông tin người nộp
              </h4>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-3">
                <InfoRow icon={<User size={14} />} label="Họ tên" value={application.applicantFullName} />
                <InfoRow icon={<Mail size={14} />} label="Email" value={application.applicantEmail} />
                <InfoRow icon={<Calendar size={14} />} label="Ngày nộp" value={formatDate(application.createdAt)} />
              </div>
            </div>

            {/* Right */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
                <Briefcase /> Thông tin pháp lý
              </h4>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-3">
                <InfoRow icon={<Briefcase size={14} />} label="Số ĐKKD" value={application.businessLicenseNumber} />
                <InfoRow icon={<MapPin size={14} />} label="Thường trú" value={application.permanentAddress} />
                <InfoRow icon={<MapPin size={14} />} label="Quê quán" value={application.hometownAddress} />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2 — HÌNH ẢNH */}
        {activeTab === "images" && (
          <div className="space-y-6 animate-fadeIn h-[60vh] overflow-y-auto pr-2">

            {/* CCCD */}
            <div>
              <h4 className="text-sm font-bold text-gray-800 mb-3">CCCD / Passport</h4>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { url: application.cardFrontImage, caption: "Mặt trước" },
                  { url: application.cardBackImage, caption: "Mặt sau" },
                ].map((img, i) => (
                  <ImagePreviewCard
                    key={i}
                    imageUrl={getImgUrl(img.url)}
                    alt={img.caption}
                    onClick={() =>
                      openViewer(
                        [
                          { url: getImgUrl(application.cardFrontImage), caption: "Mặt trước" },
                          { url: getImgUrl(application.cardBackImage), caption: "Mặt sau" },
                        ],
                        i
                      )
                    }
                  />
                ))}
              </div>
            </div>

            {/* GPKD */}
            <div>
              <h4 className="text-sm font-bold text-gray-800 mb-3">Giấy phép kinh doanh</h4>
              <div className="w-full md:w-2/3">
                <ImagePreviewCard
                  imageUrl={getImgUrl(application.businessLicenseImage)}
                  alt="Giấy phép"
                  onClick={() =>
                    openViewer(
                      [{ url: getImgUrl(application.businessLicenseImage), caption: "Giấy phép kinh doanh" }],
                      0
                    )
                  }
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end mt-6 pt-4 border-t border-gray-100">
          <Button variant="secondary" onClick={handleClose}>Đóng</Button>
        </div>
      </Modal>

      {/* Image Viewer (zoom/pan/slide) */}
      <ImageViewerModal
        open={viewerOpen}
        onClose={() => setViewerOpen(false)}
        images={viewerImages}
        startIndex={viewerStartIndex}
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
