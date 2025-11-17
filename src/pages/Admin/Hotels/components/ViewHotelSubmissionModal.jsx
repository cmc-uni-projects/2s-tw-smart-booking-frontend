import React, { useState, useEffect } from "react";
import Modal from "@/components/common/Modal/Modal";
import TabsComponent from "@/components/common/Tabs/TabsComponent";
import {
  User,
  MapPin,
  List,
  Info,
  Globe,
  Image as ImageIcon,
  CheckCircle2,
  Loader2
} from "lucide-react";
import Button from "@/components/common/Button/Button";
import api from "@/services/axios.config"; 

// ==========================================
// ✅ 1. KHAI BÁO CÁC HÀM HELPER Ở ĐÂY (BÊN NGOÀI COMPONENT)
// ==========================================

// Lấy URL gốc từ biến môi trường hoặc mặc định
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8386/api/v1")
  .replace("/api/v1", ""); 

// Hàm xử lý URL ảnh để hiển thị đúng
const getFullImageUrl = (url) => {
  if (!url) return "/assets/images/placeholder.png"; 
  if (url.startsWith("http")) return url; 
  let path = url.startsWith("/") ? url : `/${url}`;
  if (!path.startsWith("/uploads")) {
    path = `/uploads${path}`;
  }

  
  return `${API_BASE_URL}${path}`;
};

// ==========================================
// ✅ 2. COMPONENT CHÍNH
// ==========================================

const ViewHotelSubmissionModal = ({ open, onClose, application }) => {
  const [activeTab, setActiveTab] = useState("info");
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  // Reset state khi mở modal mới
  useEffect(() => {
    if (open && application?.id) {
      fetchPropertyDetails(application.id);
    } else {
      setDetails(null);
    }
  }, [open, application]);

  // Hàm gọi API lấy chi tiết (Amenities + Images + Rooms...)
  const fetchPropertyDetails = async (propertyId) => {
    setLoading(true);
    try {
      const res = await api.get(`/property-details/${propertyId}`);
      setDetails(res.data);
    } catch (error) {
      console.error("Failed to fetch property details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!application) return null;

  // Tabs hiển thị
  const tabs = [
    { id: "info", name: "Thông tin cơ sở" },
    { id: "owner", name: "Chủ sở hữu" },
    { id: "amenities", name: "Tiện nghi" }, // Tab Tiện nghi
    { id: "images", name: "Hình ảnh" },     // Tab Hình ảnh
    { id: "location", name: "Định vị" },
  ];

  const fullAddress = `${application.address}, ${application.city}, ${application.country}`;

  return (
    <Modal
      open={open}
      onClose={() => {
        setActiveTab("info");
        onClose();
      }}
      title={application.propertyName || application.hotelName || "Chi tiết cơ sở"}
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

      {/* Content Area */}
      <div className="min-h-[300px]">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="animate-spin text-[rgb(40,169,224)]" size={32} />
          </div>
        ) : (
          <>
            {/* TAB 1 – Thông tin cơ sở */}
            {activeTab === "info" && (
              <div className="space-y-6 animate-fadeIn">
                <Section title="Thông tin chung" icon={<Info />}>
                  <InfoRow label="Tên cơ sở" value={application.propertyName || application.hotelName} />
                  <InfoRow label="Loại hình" value={application.propertyType} />
                  <InfoRow label="Địa chỉ" value={fullAddress} />
                  <InfoRow label="Mã vùng" value={application.postalCode} />
                  <InfoRow
                    label="Ngày tạo"
                    value={application.createdAt || application.submittedDate}
                  />
                   {/* Hiển thị diện tích từ API chi tiết nếu có */}
                   {details?.property?.area && (
                      <InfoRow label="Diện tích" value={`${details.property.area} m²`} />
                  )}
                </Section>

                <Section title="Mô tả" icon={<List />}>
                  <p className="text-gray-700 whitespace-pre-line bg-gray-50 p-4 rounded-lg border border-gray-100">
                    {application.description || "Không có mô tả."}
                  </p>
                </Section>
              </div>
            )}

            {/* TAB 2 – Chủ sở hữu */}
            {activeTab === "owner" && (
              <div className="space-y-6 animate-fadeIn">
                <Section title="Thông tin Liên hệ" icon={<User />}>
                  <InfoRow label="Họ tên chủ" value={application.ownerFullName || application.ownerName} />
                  <InfoRow label="Email liên hệ" value={application.emailContact || application.email} />
                  <InfoRow label="Số điện thoại" value={application.phoneContact || "Chưa cập nhật"} />
                </Section>
              </div>
            )}

            {/* TAB 3 – Tiện nghi */}
            {activeTab === "amenities" && (
              <div className="animate-fadeIn">
                 <h4 className="flex items-center text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
                  <CheckCircle2 className="mr-3 text-blue-600" size={20} />
                  Danh sách Tiện nghi
                </h4>
                
                {details?.amenities && details.amenities.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {details.amenities.map((item) => (
                      <div 
                        key={item.propertyAmenityId} 
                        className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100"
                      >
                        <div className="w-2 h-2 rounded-full bg-[rgb(40,169,224)]"></div>
                        <span className="text-gray-700 font-medium">{item.amenityName}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic text-center py-8">Chưa có tiện nghi nào được đăng ký.</p>
                )}
              </div>
            )}

            {/* TAB 4 – Hình ảnh */}
            {activeTab === "images" && (
              <div className="animate-fadeIn">
                 <h4 className="flex items-center text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
                  <ImageIcon className="mr-3 text-blue-600" size={20} />
                  Hình ảnh Cơ sở
                </h4>

                {details?.images && details.images.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {details.images.map((img) => (
                      <div key={img.propertyImageId} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                        <img 
                          // ✅ SỬ DỤNG HÀM HELPER Ở ĐÂY
                          src={getFullImageUrl(img.imageUrl)} 
                          alt="Property" 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/300?text=No+Image"; // Fallback nếu lỗi
                          }}
                        />
                        {/* Badge ảnh bìa */}
                        {img.isCover && (
                           <div className="absolute top-2 left-2 bg-yellow-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                              Ảnh bìa
                           </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic text-center py-8">Chưa có hình ảnh nào.</p>
                )}
              </div>
            )}

            {/* TAB 5 – Định vị */}
            {activeTab === "location" && (
              <div className="space-y-6 animate-fadeIn">
                <Section title="Vị trí địa lý" icon={<Globe />}>
                  <InfoRow label="Tỉnh/Thành" value={application.province} />
                  <InfoRow label="Thành phố/Quận" value={application.city} />
                  <InfoRow label="Latitude" value={application.latitude} />
                  <InfoRow label="Longitude" value={application.longitude} />
                </Section>
              </div>
            )}
          </>
        )}
      </div>

      <div className="mt-8 flex justify-end pt-4 border-t border-gray-100">
        <Button variant="secondary" onClick={onClose}>
          Đóng
        </Button>
      </div>
    </Modal>
  );
};

/* ---------------- COMPONENTS CON ---------------- */
const Section = ({ title, icon, children }) => (
  <div>
    <h4 className="flex items-center text-lg font-semibold text-gray-800 mb-3 pb-2 border-b">
      {React.cloneElement(icon, {
        size: 20,
        className: "mr-3 text-blue-600",
      })}
      {title}
    </h4>
    <div className="text-sm text-gray-700 space-y-2">{children}</div>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="grid grid-cols-3 gap-4 py-1">
    <span className="font-medium text-gray-500 col-span-1">{label}:</span>
    <span className="text-gray-900 font-medium col-span-2 break-words">{value || "---"}</span>
  </div>
);

export default ViewHotelSubmissionModal;