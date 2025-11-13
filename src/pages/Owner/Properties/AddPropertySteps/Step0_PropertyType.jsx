// src/pages/Owner/Properties/AddPropertySteps/Step0_PropertyType.jsx
import React from "react";
import { Hotel, Home, Building } from "lucide-react";
import Card from "@/components/common/Card/Card";

// Component con cho các thẻ lựa chọn
const TypeCard = ({ icon, title, description, selected, onClick }) => (
  <div
    onClick={onClick}
    className={`p-6 border-2 rounded-2xl cursor-pointer transition-all ${
      selected
        ? "border-[rgb(40,169,224)] bg-[rgb(40,169,224,0.05)] shadow-md"
        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
    }`}
  >
    <div className="flex items-center gap-4">
      <div className="p-3 bg-[rgb(40,169,224)] text-white rounded-full">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  </div>
);

export default function Step0_PropertyType({ setValue, watch }) {
  // Lấy giá trị hiện tại từ react-hook-form
  const currentType = watch("propertyType");

  const types = [
    { id: "HOTEL", icon: <Hotel />, title: "Khách sạn (Hotel)", desc: "Dành cho các cơ sở có nhiều phòng, lễ tân, dịch vụ..." },
    { id: "VILLA", icon: <Home />, title: "Biệt thự (Villa)", desc: "Dành cho các biệt thự nghỉ dưỡng, nhà nguyên căn..." },
    { id: "HOMESTAY", icon: <Building />, title: "Homestay", desc: "Dành cho các hộ gia đình chia sẻ phòng..." },
  ];

  return (
    <div className="animate-fadeIn">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Bạn muốn đăng ký kiểu cơ sở lưu trú nào?
      </h2>
      <p className="text-gray-500 mb-6">Chọn một loại hình phù hợp nhất với cơ sở của bạn.</p>
      <div className="space-y-4">
        {types.map((type) => (
          <TypeCard
            key={type.id}
            icon={type.icon}
            title={type.title}
            description={type.desc}
            selected={currentType === type.id}
            // Khi click, cập nhật giá trị vào form
            onClick={() => setValue("propertyType", type.id, { shouldValidate: true })}
          />
        ))}
      </div>
    </div>
  );
}