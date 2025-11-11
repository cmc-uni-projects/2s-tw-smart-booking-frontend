import React from "react";
import { Info, User, Briefcase } from "lucide-react";

// Component con để hiển thị từng dòng thông tin
const ReviewItem = ({ label, value }) => (
  <div className="py-2">
    <span className="text-sm font-medium text-gray-500">{label}</span>
    <p className="text-md text-gray-900">{value || "(Chưa nhập)"}</p>
  </div>
);

// Nhận 'watch' để đọc toàn bộ form
export default function Step3_Review({ watch }) {
  // Lấy dữ liệu từ react-hook-form
  const personalData = {
    "Họ tên": watch("personalFullName"),
    "Email": watch("personalEmail"),
    "Số điện thoại": watch("personalPhone"),
    "Số CCCD": watch("personalIdCard"),
    "Ngày sinh": watch("personalDob"),
    "Quê quán": watch("personalHometown"),
    "Địa chỉ": watch("personalAddress"),
  };

  const businessData = {
    "Mã số ĐKKD": watch("businessLicenseNumber"),
  };

  const filesData = {
    "Ảnh CCCD mặt trước": watch("personalIdFront")?.[0]?.name,
    "Ảnh CCCD mặt sau": watch("personalIdBack")?.[0]?.name,
    "Giấy phép kinh doanh": watch("businessLicenseFile")?.[0]?.name,
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-xl font-semibold text-gray-700">
        Kiểm tra và xác nhận thông tin
      </h2>
      <p className="text-gray-600">
        Vui lòng kiểm tra kỹ các thông tin bạn đã cung cấp trước khi gửi đơn.
      </p>

      {/* Thông tin cá nhân */}
      <div className="space-y-2 rounded-lg border border-gray-200">
        <h3 className="flex items-center gap-2 p-4 font-semibold text-gray-800 border-b bg-gray-50 rounded-t-lg">
          <User size={18} className="text-[rgb(40,169,224)]" />
          Thông tin cá nhân
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 p-4">
          {Object.entries(personalData).map(([label, value]) => (
            <ReviewItem key={label} label={label} value={value} />
          ))}
        </div>
      </div>

      {/* Thông tin kinh doanh */}
      <div className="space-y-2 rounded-lg border border-gray-200">
        <h3 className="flex items-center gap-2 p-4 font-semibold text-gray-800 border-b bg-gray-50 rounded-t-lg">
          <Briefcase size={18} className="text-[rgb(40,169,224)]" />
          Thông tin kinh doanh & Pháp lý
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 p-4">
          {Object.entries(businessData).map(([label, value]) => (
            <ReviewItem key={label} label={label} value={value} />
          ))}
          {Object.entries(filesData).map(([label, value]) => (
            <ReviewItem key={label} label={label} value={value || "(Chưa tải lên)"} />
          ))}
        </div>
      </div>
      
      <div className="flex items-center gap-3 rounded-lg bg-yellow-50 p-4 text-sm text-yellow-800 border border-yellow-200">
        <Info size={20} className="flex-shrink-0" />
        <span>
          Bằng cách nhấn "Gửi đơn", bạn xác nhận các thông tin trên là chính xác.
        </span>
      </div>
    </div>
  );
}