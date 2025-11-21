import React, { useState } from "react";
import ModalPortal from "@/components/common/Modal/ModalPortal";
import { X, User, Mail, Phone, Calendar, Briefcase, MapPin, CreditCard, CheckCircle, XCircle, Image as ImageIcon } from "lucide-react";
import Button from "@/components/common/Button/Button";
import ImageViewerModal from "./ImageViewerModal";

const API_BASE_URL = (import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:8386/api/v1").replace("/api/v1", "");
const getImgUrl = (url) => {
  if (!url) return "/assets/images/placeholder.png";
  if (url.startsWith("http")) return url;
  return `${API_BASE_URL}${url}`;
};

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
    <div className="mt-1 text-gray-400 shrink-0">{icon}</div>
    <div className="flex-1">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-gray-900 text-sm mt-0.5 font-medium break-words">{value || "---"}</p>
    </div>
  </div>
);

export default function ViewApplicationModal({ isOpen, onClose, application, onApprove, onReject }) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  if (!isOpen || !application) return null;

  // Gom ảnh minh chứng vào 1 mảng
  const proofImages = [
    { url: getImgUrl(application.cardFrontImage), caption: "CCCD Mặt trước" },
    { url: getImgUrl(application.cardBackImage), caption: "CCCD Mặt sau" },
    { url: getImgUrl(application.businessLicenseImage), caption: "Giấy phép KD" }
  ].filter(img => img.url && !img.url.includes("placeholder"));

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" onClick={onClose} />

        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
          
          {/* HEADER */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-white">
            <div>
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                <span className="text-blue-600 bg-blue-50 p-2 rounded-lg"><Briefcase size={24}/></span>
                Hồ sơ đối tác #{application.id}
              </h2>
              <p className="text-sm text-gray-500 mt-1 ml-12">Ngày nộp: {application.submittedDate}</p>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"><X size={24} /></button>
          </div>

          {/* BODY */}
          <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50 custom-scrollbar">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* CỘT TRÁI: THÔNG TIN CÁ NHÂN (5 phần) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="bg-blue-600 px-6 py-5 text-white">
                        <h4 className="font-bold text-base mb-2 opacity-90">Thông tin cá nhân</h4>
                        <h3 className="text-2xl font-bold">{application.applicantFullName}</h3>
                    </div>
                    <div className="p-5">
                        <InfoRow icon={<Mail size={16}/>} label="Email" value={application.applicantEmail} />
                        <InfoRow icon={<Phone size={16}/>} label="SĐT" value={application.applicantPhoneNumber} />
                        <InfoRow icon={<Calendar size={16}/>} label="Ngày sinh" value={application.applicantDob} />
                        <InfoRow icon={<MapPin size={16}/>} label="Quê quán" value={application.hometownAddress} />
                        <InfoRow icon={<MapPin size={16}/>} label="Thường trú" value={application.permanentAddress} />
                        <InfoRow icon={<CreditCard size={16}/>} label="Số CCCD" value={application.personalIdCard} />
                    </div>
                </div>
              </div>

              {/* CỘT PHẢI: HÌNH ẢNH MINH CHỨNG (7 phần) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <ImageIcon size={18} className="text-blue-500"/> Ảnh minh chứng ({proofImages.length})
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                        {proofImages.map((img, idx) => (
                            <div key={idx} className={`relative group cursor-pointer overflow-hidden rounded-xl border border-gray-100 shadow-sm ${idx === 2 ? 'col-span-2 h-48' : 'h-40'}`}
                                onClick={() => { setViewerIndex(idx); setViewerOpen(true); }}>
                                <img src={img.url} alt={img.caption} className="w-full h-full object-contain bg-gray-100 transition-transform duration-500 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                                    {img.caption}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100 text-sm text-blue-800">
                        <strong>Số GPKD:</strong> {application.businessLicenseNumber}
                    </div>
                </div>
              </div>

            </div>
          </div>

          {/* FOOTER */}
          <div className="p-5 border-t border-gray-100 bg-white rounded-b-2xl flex justify-end gap-3 shrink-0 z-10">
            {application.status === "PENDING" && (
                <>
                    <Button variant="danger" leftIcon={<XCircle size={18} />} onClick={() => onReject(application)} className="bg-white text-red-600 border-red-200 hover:bg-red-50 px-6">
                        Từ chối hồ sơ
                    </Button>
                    <Button variant="primary" leftIcon={<CheckCircle size={18} />} className="bg-green-600 hover:bg-green-700 border-green-600 text-white px-8 shadow-lg shadow-green-200" onClick={() => onApprove(application)}>
                        Phê duyệt ngay
                    </Button>
                </>
            )}
             {application.status !== "PENDING" && (
                 <div className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 ${application.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                     {application.status === 'APPROVED' ? <CheckCircle size={16}/> : <XCircle size={16}/>}
                     {application.status === 'APPROVED' ? 'Đã phê duyệt' : 'Đã từ chối'}
                 </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Viewer */}
      {viewerOpen && (
        <ImageViewerModal 
            open={viewerOpen} 
            onClose={() => setViewerOpen(false)} 
            images={proofImages} // Truyền đúng mảng object {url, caption}
            startIndex={viewerIndex}
        />
      )}
    </ModalPortal>
  );
}