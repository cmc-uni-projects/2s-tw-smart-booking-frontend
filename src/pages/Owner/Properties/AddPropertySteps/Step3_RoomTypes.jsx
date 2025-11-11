// src/pages/Owner/Properties/AddPropertySteps/Step3_RoomTypes.jsx
import React from "react";
import { useFieldArray } from "react-hook-form";
import { Plus } from "lucide-react";
import Button from "@/components/common/Button/Button";
import RoomTypeForm from "./components/RoomTypeForm"; // Import component con

export default function Step3_RoomTypes({ control, register, errors, watch }) {
  
  // 1. Sử dụng useFieldArray
  const { fields, append, remove } = useFieldArray({
    control, // Bắt buộc phải có 'control' từ useForm
    name: "roomTypes", // Tên của mảng trong data
  });

  // 2. Hàm thêm một phòng mới với giá trị mặc định
  const addNewRoom = () => {
    append({
      name: "",
      maxGuests: 2,
      price: 1000000, // Giá trị mặc định
      size: 20,
      roomCount: 1,
      allowPets: false,
    });
  };

  return (
    <div className="animate-fadeIn">
      <p className="text-gray-500 mb-6">
        Thêm ít nhất một loại phòng. Bạn có thể thêm nhiều loại phòng khác nhau 
        (ví dụ: Standard, Deluxe, Suite) cho cơ sở của bạn.
      </p>

      {/* 3. Vòng lặp render các form con */}
      <div className="space-y-6">
        {fields.map((field, index) => (
          <RoomTypeForm
            key={field.id} // key của useFieldArray
            register={register}
            errors={errors}
            watch={watch} // Truyền 'watch' xuống con
            index={index}
            onRemove={remove} // Truyền hàm 'remove' xuống
          />
        ))}
      </div>

      {/* 4. Nút để thêm phòng mới */}
      <Button
        type="button" // Quan trọng: 'type="button"'
        variant="outline"
        onClick={addNewRoom}
        leftIcon={<Plus size={18} />}
        className="mt-6"
      >
        Thêm loại phòng
      </Button>

      {/* Hiển thị lỗi nếu mảng rỗng (từ validation) */}
      {errors.roomTypes && !errors.roomTypes.length && (
         <p className="text-xs text-red-500 mt-2">{errors.roomTypes.message}</p>
      )}
    </div>
  );
}