// src/pages/Owner/Properties/AddPropertySteps/Step5_Details.jsx
import React from "react";
import FloatingTextField from "@/components/common/Input/FloatingTextField";
import TextArea from "@/components/common/Input/TextArea"; // Import TextArea đã sửa lỗi

export default function Step5_Details({ register, errors, watch }) {
  return (
    <div className="space-y-2 animate-fadeIn"> {/* Giảm space-y */}
      <p className="text-gray-500 mb-4"> {/* Thêm mb-4 */}
        Cung cấp các thông tin cơ bản để khách hàng nhận diện cơ sở lưu trú của bạn.
      </p>

      <FloatingTextField
        label="Tên cơ sở lưu trú"
        placeholder="Ví dụ: Khách sạn The Grand Plaza"
        {...register("propertyName")}
        value={watch("propertyName")}
        error={errors.propertyName?.message}
      />
      
      {/* Bây giờ TextArea hoạt động y hệt FloatingTextField.
        Chúng ta truyền ...register, value, và error
      */}
      <TextArea
        label="Mô tả"
        rows={6}
        {...register("description")}
        value={watch("description")}
        error={errors.description?.message}
      />

      <FloatingTextField
        label="Diện tích (m²)"
        type="number"
        placeholder="Ví dụ: 1500"
        {...register("area")}
        value={watch("area")}
        error={errors.area?.message}
      />
    </div>
  );
}