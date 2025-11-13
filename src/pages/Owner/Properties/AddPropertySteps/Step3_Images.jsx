// src/pages/Owner/Properties/AddPropertySteps/Step3_Images.jsx
import React from "react";
import ImageUploadGrid from "@/components/common/Input/ImageUploadGrid";
import { Image } from "lucide-react";
import Card from "@/components/common/Card/Card";

export default function Step3_Images({ errors, watch, setValue }) {
  // (Đã xóa logic watch('roomTypes'))

  return (
    <div className="space-y-6 animate-fadeIn">
      <p className="text-gray-500 mb-2">
        Hình ảnh chất lượng cao sẽ thu hút khách hàng. Yêu cầu định dạng PNG, JPG, hoặc WEBP.
      </p>

      {/* Khu vực upload ảnh chung */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Ảnh chung Cơ sở lưu trú</h3>
        <p className="text-sm text-gray-500 mb-4">
          Tải lên ít nhất 3 ảnh. Ảnh đầu tiên sẽ là ảnh đại diện (ảnh bìa).
        </p>
        
        <ImageUploadGrid
          multiple={true}
          accept="image/png, image/jpeg, image/webp"
          value={watch("propertyImages")}
          onChange={(files) => setValue("propertyImages", files, { shouldValidate: true })}
          error={errors.propertyImages?.message} 
        />
      </Card>

      {/* (Đã xóa vòng lặp 'roomTypes' và Card cho ảnh phòng) */}
    </div>
  );
}