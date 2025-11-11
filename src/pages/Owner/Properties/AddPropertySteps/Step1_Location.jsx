// src/pages/Owner/Properties/AddPropertySteps/Step1_Location.jsx
import React from "react";
import FloatingTextField from "@/components/common/Input/FloatingTextField";
import Card from "@/components/common/Card/Card";
import { MapPin } from "lucide-react";

export default function Step1_Location({ register, errors, watch }) {
  // 1. Lấy giá trị trực tiếp từ react-hook-form
  const { country, province, city, address } = watch();

  // 2. Tạo chuỗi tóm tắt địa chỉ
  const fullAddress = [address, city, province, country]
    .filter(Boolean) // Lọc bỏ các giá trị rỗng
    .join(", ");

  return (
    <div className="space-y-2 animate-fadeIn"> {/* Giảm space-y-6 thành y-2 vì lỗi đã có padding */}
      
      <FloatingTextField
        label="Quốc gia"
        {...register("country")}
        value={country} // ✅ THÊM DÒNG NÀY
        disabled 
      />
      
      <FloatingTextField
        label="Tỉnh/Thành"
        placeholder="Ví dụ: Thành phố Hồ Chí Minh"
        {...register("province")}
        value={province} // ✅ THÊM DÒNG NÀY
        error={errors.province?.message}
      />
      
      <FloatingTextField
        label="Thành phố/Quận/Huyện"
        placeholder="Ví dụ: Quận 1"
        {...register("city")}
        value={city} // ✅ THÊM DÒNG NÀY
        error={errors.city?.message}
      />
      
      <FloatingTextField
        label="Địa chỉ chi tiết (số nhà, tên đường...)"
        {...register("address")}
        value={address} // ✅ THÊM DÒNG NÀY
        error={errors.address?.message}
        placeholder="Ví dụ: 123 đường Nguyễn Huệ, Phường Bến Nghé"
      />
      
      <div className="pt-4"> {/* Thêm padding-top để tách biệt Card */}
        <Card>
          <div className="flex items-center gap-2 text-sm font-semibold mb-2">
            <MapPin size={16} className="text-[rgb(40,169,224)]" />
            Tóm tắt địa chỉ:
          </div>
          <p className="text-gray-600 text-base">
            {fullAddress || "(Vui lòng điền đầy đủ thông tin)"}
          </p>
        </Card>
      </div>
    </div>
  );
}