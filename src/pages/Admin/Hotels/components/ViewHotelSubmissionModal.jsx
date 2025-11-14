import React, { useState } from "react";
import Modal from "@/components/common/Modal/Modal";
import Button from "@/components/common/Button/Button";
import Badge from "@/components/common/Badge/Badge";
import { User, MapPin, AlignLeft, Image, Sparkles, BedDouble, Info, DollarSign, Users } from "lucide-react";
import ImageViewerModal from "./ImageViewerModal"; // Đảm bảo bạn đã có file này

// Helper định dạng tiền
const formatCurrency = (amount) => {
  if (!amount) return "Chưa cập nhật";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// =================================================================
// LẤY URL GỐC CỦA BACKEND (ví dụ: http://localhost:8386)
const API_BASE_URL = (import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:8386/api/v1").replace("/api/v1", "");

/**
 * HÀM LẤY ẢNH ĐÚNG (ĐÃ SỬA)
 * Hàm này lấy tên file từ chuỗi (ví dụ: /files/abc.png -> abc.png)
 * và gắn nó vào đường dẫn /uploads/properties/
 */
const getImgUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return "/assets/images/placeholder.png"; // Ảnh placeholder
  }
  
  // Lấy tên file (ví dụ: 'abc.png' từ '.../abc.png')
  const fileName = url.split('/').pop();
  
  // Trả về đường dẫn ĐÚNG mà bạn đã chỉ định
  return `${API_BASE_URL}/uploads/properties/${fileName}`;
};
// =================================================================


const ViewHotelSubmissionModal = ({ open, onClose, submission }) => {
  const [activeTab, setActiveTab] = useState("info");
  const [viewingImage, setViewingImage] = useState(null);

  if (!submission) return null;

  const { name, ownerName, address, city, description, images, amenities, rooms } = submission;

  const tabs = [
    { id: "info", label: "Thông tin chung", icon: <Info size={18} /> },
    { id: "images", label: "Hình ảnh", icon: <Image size={18} /> },
    { id: "amenities", label: "Tiện nghi", icon: <Sparkles size={18} /> },
    { id: "rooms", label: "Các loại phòng", icon: <BedDouble size={18} /> },
  ];

  // Hàm xử lý đóng modal và reset tab
  const handleClose = () => {
    onClose();
    // Reset về tab info khi đóng
    setTimeout(() => setActiveTab("info"), 200);
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        title={`Chi tiết Khách sạn: ${name}`}
        maxWidth="max-w-5xl" // Tăng kích thước modal
      >
        <div className="flex border-b border-gray-200 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`px-5 py-3 font-medium text-sm flex items-center gap-2 transition-colors border-b-2 ${
                activeTab === tab.id 
                  ? "text-blue-600 border-blue-600" 
                  : "text-gray-500 border-transparent hover:text-blue-500"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* --- NỘI DUNG CÁC TAB --- */}
        <div className="min-h-[50vh]">
          {/* Tab Thông tin chung */}
          {activeTab === "info" && (
            <div className="animate-fadeIn space-y-6">
              <InfoRow icon={<User size={16} />} label="Chủ sở hữu" value={ownerName || "Chưa cập nhật"} />
              <InfoRow icon={<MapPin size={16} />} label="Địa chỉ" value={`${address}, ${city}`} />
              <InfoRow icon={<AlignLeft size={16} />} label="Mô tả" value={description || "Không có mô tả."} isParagraph />
            </div>
          )}

          {/* Tab Hình ảnh */}
          {activeTab === "images" && (
            <div className="animate-fadeIn">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(images && images.length > 0) ? (
                  images.map((img, index) => (
                    <img
                      key={index}
                      src={getImgUrl(img)} // <-- Đã dùng hàm getImgUrl mới
                      alt={`Hotel image ${index + 1}`}
                      className="w-full h-40 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => setViewingImage(getImgUrl(img))}
                    />
                  ))
                ) : (
                  <p className="text-gray-500 col-span-full">Chủ sở hữu chưa cung cấp hình ảnh.</p>
                )}
              </div>
            </div>
          )}

          {/* Tab Tiện nghi */}
          {activeTab === "amenities" && (
            <div className="animate-fadeIn">
              <div className="flex flex-wrap gap-3">
                {(amenities && amenities.length > 0) ? (
                  amenities.map((amenity, index) => (
                    <Badge key={index} color="primary" icon={false}>
                      {amenity}
                    </Badge>
                  ))
                ) : (
                  <p className="text-gray-500">Không có thông tin tiện nghi.</p>
                )}
              </div>
            </div>
          )}

          {/* Tab Các loại phòng */}
          {activeTab === "rooms" && (
            <div className="animate-fadeIn space-y-4">
              {(rooms && rooms.length > 0) ? (
                rooms.map((room) => (
                  <div key={room.roomId} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h5 className="font-semibold text-md text-blue-600">{room.roomName || "Tên phòng"}</h5>
                    <div className="grid grid-cols-3 gap-x-4 gap-y-2 mt-2 text-sm">
                      <InfoRow icon={<DollarSign size={14} />} label="Giá" value={formatCurrency(room.price)} />
                      <InfoRow icon={<Users size={14} />} label="Sức chứa" value={`${room.capacity} người`} />
                      <InfoRow icon={<BedDouble size={14} />} label="Loại phòng" value={room.category} />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Chủ sở hữu chưa thêm thông tin phòng.</p>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end mt-8 pt-4 border-t border-gray-100">
          <Button variant="secondary" onClick={handleClose}>Đóng</Button>
        </div>
      </Modal>

      {/* Modal xem ảnh phóng to */}
      <ImageViewerModal
        open={!!viewingImage}
        onClose={() => setViewingImage(null)}
        imageUrl={viewingImage}
      />
    </>
  );
};

// Component phụ để hiển thị thông tin
const InfoRow = ({ icon, label, value, isParagraph = false }) => (
  <div>
    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2 mb-2">
      {icon} {label}
    </h4>
    {isParagraph ? (
      <p className="text-sm text-gray-600 whitespace-pre-wrap">{value}</p>
    ) : (
      <p className="text-sm text-gray-700 font-medium">{value}</p>
    )}
  </div>
);

export default ViewHotelSubmissionModal;