import React, { useState } from "react";
import Modal from "@/components/common/Modal/Modal";
import Button from "@/components/common/Button/Button";
import { User, MapPin, Briefcase, Calendar, CreditCard, FileText } from "lucide-react";

const ViewApplicationModal = ({ open, onClose, application }) => {
  const [activeTab, setActiveTab] = useState("info"); // 'info' | 'images'

  if (!application) return null;

  // Helper render dòng thông tin
  const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
      <div className="mt-1 text-gray-400">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-gray-800 font-medium">{value || "N/A"}</p>
      </div>
    </div>
  );

  return (
    <Modal 
      isOpen={open} 
      onClose={onClose} 
      title={`Chi tiết đơn đăng ký #${application.id}`}
      maxWidth="max-w-3xl"
    >
      {/* TABS HEADER */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`px-6 py-3 font-medium text-sm focus:outline-none transition-colors ${
            activeTab === "info"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("info")}
        >
          Thông tin hồ sơ
        </button>
        <button
          className={`px-6 py-3 font-medium text-sm focus:outline-none transition-colors ${
            activeTab === "images"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("images")}
        >
          Hình ảnh minh chứng
        </button>
      </div>

      {/* TAB CONTENT: INFO */}
      {activeTab === "info" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
          {/* Cột Trái: Thông tin cá nhân */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b-2 border-gray-100">
              Thông tin Người nộp đơn
            </h4>
            <div className="space-y-1">
              <InfoRow 
                icon={User} 
                label="Họ và tên" 
                value={application.applicantFullName} 
              />
              <InfoRow 
                icon={User} 
                label="Email đăng nhập" 
                value={application.applicantEmail} 
              />
              <InfoRow 
                icon={Calendar} 
                label="Ngày nộp đơn" 
                value={new Date(application.createdAt).toLocaleString("vi-VN")} 
              />
            </div>
          </div>

          {/* Cột Phải: Thông tin bổ sung & Doanh nghiệp */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b-2 border-gray-100">
              Thông tin Pháp lý & Địa chỉ
            </h4>
            <div className="space-y-1">
              <InfoRow 
                icon={Briefcase} 
                label="Mã số ĐKKD" 
                value={application.businessLicenseNumber} 
              />
              <InfoRow 
                icon={MapPin} 
                label="Địa chỉ thường trú" 
                value={application.permanentAddress} 
              />
              <InfoRow 
                icon={MapPin} 
                label="Quê quán" 
                value={application.hometownAddress} 
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: IMAGES */}
      {activeTab === "images" && (
        <div className="space-y-6 animate-fadeIn">
          <div>
            <h4 className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
              <CreditCard size={18} className="text-blue-500"/> Căn cước công dân (CCCD)
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-2 bg-gray-50">
                <p className="text-xs text-center text-gray-500 mb-2">Mặt trước</p>
                <img 
                  src={application.cardFrontImage} 
                  alt="CCCD Mặt trước" 
                  className="w-full h-48 object-cover rounded border border-gray-200 cursor-pointer hover:opacity-90 transition"
                  onClick={() => window.open(application.cardFrontImage, '_blank')}
                />
              </div>
              <div className="border rounded-lg p-2 bg-gray-50">
                <p className="text-xs text-center text-gray-500 mb-2">Mặt sau</p>
                <img 
                  src={application.cardBackImage} 
                  alt="CCCD Mặt sau" 
                  className="w-full h-48 object-cover rounded border border-gray-200 cursor-pointer hover:opacity-90 transition"
                  onClick={() => window.open(application.cardBackImage, '_blank')}
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
              <FileText size={18} className="text-blue-500"/> Giấy phép kinh doanh
            </h4>
            <div className="border rounded-lg p-2 bg-gray-50">
              <img 
                src={application.businessLicenseImage} 
                alt="GPKD" 
                className="w-full h-64 object-contain rounded border border-gray-200 cursor-pointer hover:opacity-90 transition"
                onClick={() => window.open(application.businessLicenseImage, '_blank')}
              />
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div className="flex justify-end mt-8 pt-4 border-t border-gray-100">
        <Button variant="secondary" onClick={onClose}>
          Đóng
        </Button>
      </div>
    </Modal>
  );
};

export default ViewApplicationModal;