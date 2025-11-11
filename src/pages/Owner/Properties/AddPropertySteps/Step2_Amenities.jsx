// src/pages/Owner/Properties/AddPropertySteps/Step2_Amenities.jsx
import React from "react";
import { 
  Wifi, 
  ParkingCircle, 
  Droplet, 
  Waves, 
  Sparkles, 
  Ban, 
  Plane, 
  PawPrint, 
  Dumbbell, 
  Wind, 
  ConciergeBell, 
  Cigarette 
} from "lucide-react";

// 1. Import component con
import AmenityOption from "./components/AmenityOption";

// Danh sách các tiện nghi (Giữ nguyên)
const AMENITIES_LIST = [
  { id: "pool", label: "Hồ bơi", icon: <Waves size={20} /> },
  { id: "parking", label: "Bãi đỗ xe", icon: <ParkingCircle size={20} /> },
  { id: "sauna", label: "Phòng xông hơi", icon: <Droplet size={20} /> },
  { id: "spa", label: "Spa", icon: <Sparkles size={20} /> },
  { id: "non_smoking", label: "Không hút thuốc", icon: <Ban size={20} /> },
  { id: "wifi", label: "Wi-Fi (miễn phí)", icon: <Wifi size={20} /> },
  { id: "airport_transfer", label: "Đưa đón sân bay", icon: <Plane size={20} /> },
  { id: "pets", label: "Cho phép thú cưng", icon: <PawPrint size={20} /> },
  { id: "gym", label: "Trung tâm thể dục", icon: <Dumbbell size={20} /> },
  { id: "smoking_area", label: "Khu vực hút thuốc", icon: <Cigarette size={20} /> },
  { id: "reception_24h", label: "Lễ tân [24 giờ]", icon: <ConciergeBell size={20} /> },
  { id: "ac", label: "Điều hòa không khí", icon: <Wind size={20} /> },
];

export default function Step2_Amenities({ register }) {
  return (
    <div className="animate-fadeIn">
      <p className="text-gray-500 mb-6">
        Chọn tất cả các tiện nghi mà cơ sở của bạn cung cấp. Điều này giúp
        khách hàng lọc và tìm thấy bạn dễ dàng hơn.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {/* 2. Sử dụng component con đã import */}
        {AMENITIES_LIST.map((item) => (
          <AmenityOption
            key={item.id}
            id={item.id}
            label={item.label}
            icon={item.icon}
            register={register}
          />
        ))}
      </div>
    </div>
  );
}