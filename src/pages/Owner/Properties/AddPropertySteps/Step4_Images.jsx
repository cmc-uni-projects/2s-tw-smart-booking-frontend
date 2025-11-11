// src/pages/Owner/Properties/AddPropertySteps/Step4_Images.jsx
import React from "react";
// 1. Thay thế FileUpload bằng ImageUploadGrid
import ImageUploadGrid from "@/components/common/Input/ImageUploadGrid";
import { Image, Layers, AlertCircle } from "lucide-react";
import Card from "@/components/common/Card/Card";

export default function Step4_Images({ register, errors, watch, setValue }) {
  const roomTypes = watch("roomTypes") || [];

  return (
    <div className="space-y-6 animate-fadeIn">
      <p className="text-gray-500 mb-2">
        Hình ảnh chất lượng cao sẽ thu hút khách hàng. Yêu cầu định dạng PNG, JPG, hoặc WEBP.
      </p>

      {/* 2. Khu vực upload ảnh chung */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Ảnh chung Cơ sở lưu trú</h3>
        <p className="text-sm text-gray-500 mb-4">
          Tải lên ít nhất 3 ảnh. Ảnh đầu tiên sẽ là ảnh đại diện (ảnh bìa).
        </p>
        
        {/* 3. Sử dụng component ImageUploadGrid mới */}
        <ImageUploadGrid
          multiple={true}
          accept="image/png, image/jpeg, image/webp"
          // 'value' là FileList từ react-hook-form
          value={watch("propertyImages")}
          // 'onChange' sẽ gọi 'setValue' của react-hook-form
          onChange={(files) => setValue("propertyImages", files, { shouldValidate: true })}
          error={errors.propertyImages?.message} 
        />
      </Card>

      {/* 4. Vòng lặp, tạo khu vực upload cho từng loại phòng */}
      {roomTypes.map((room, index) => (
        <Card key={index}>
          <h3 className="text-lg font-semibold mb-4">
            Ảnh cho loại phòng: {room.name || `Loại phòng ${index + 1}`}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Tải lên ít nhất 3 ảnh cho loại phòng này.
          </p>
          
          {/* 5. Sử dụng ImageUploadGrid cho từng phòng */}
          <ImageUploadGrid
            multiple={true}
            accept="image/png, image/jpeg, image/webp"
            value={watch(`roomTypes.${index}.images`)}
            onChange={(files) => setValue(`roomTypes.${index}.images`, files, { shouldValidate: true })}
            error={errors.roomTypes?.[index]?.images?.message}
          />
        </Card>
      ))}

      {roomTypes.length === 0 && (
        <div className="flex items-center gap-3 p-4 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-lg">
           <AlertCircle size={20} />
           <p>Bạn chưa thêm loại phòng nào ở bước 3. Hãy quay lại bước 3 để thêm phòng trước khi thêm ảnh.</p>
        </div>
      )}
    </div>
  );
}