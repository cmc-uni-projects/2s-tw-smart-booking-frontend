// src/pages/Owner/Properties/AddPropertySteps/components/RoomTypeForm.jsx
import React from "react";
import Card from "@/components/common/Card/Card";
import Button from "@/components/common/Button/Button";
import FloatingTextField from "@/components/common/Input/FloatingTextField";
import { Trash, Users, ArrowUpRight, PawPrint, Tag, BedDouble } from "lucide-react";

/**
 * Component này là một Card chứa form cho 1 loại phòng
 * @param {Function} register - Từ react-hook-form
 * @param {Object} errors - Từ react-hook-form
 * @param {Function} watch - Từ react-hook-form
 * @param {number} index - Vị trí của phòng này trong mảng
 * @param {Function} onRemove - Hàm (từ useFieldArray) để xóa phòng này
 */
export default function RoomTypeForm({ register, errors, watch, index, onRemove }) {
  
  // Lấy lỗi của đúng phòng này
  const roomErrors = errors.roomTypes?.[index] || {};

  return (
    // Sử dụng Card làm khung
    <Card className="p-5 border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-[rgb(40,169,224)] flex items-center gap-2">
          <BedDouble size={20} />
          {/* Tên phòng sẽ cập nhật động nếu người dùng nhập */}
          {watch(`roomTypes.${index}.name`) || `Loại phòng ${index + 1}`}
        </h3>
        <Button
          type="button" // Quan trọng: phải là "button" để không submit form cha
          variant="ghost"
          size="sm"
          onClick={() => onRemove(index)}
          className="text-red-500 hover:bg-red-50"
          leftIcon={<Trash size={16} />}
        >
          Xóa
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
        <FloatingTextField
          label="Tên loại phòng"
          placeholder="Ví dụ: Deluxe King"
          {...register(`roomTypes.${index}.name`)}
          value={watch(`roomTypes.${index}.name`)} // Thêm value={watch(...)}
          error={roomErrors.name?.message}
        />
        <FloatingTextField
          label="Số phòng (thuộc loại này)"
          type="number"
          placeholder="Ví dụ: 10"
          {...register(`roomTypes.${index}.roomCount`)}
          value={watch(`roomTypes.${index}.roomCount`)} // Thêm value={watch(...)}
          error={roomErrors.roomCount?.message}
        />
        <FloatingTextField
          label="Số khách tối đa"
          type="number"
          icon={<Users size={18} />}
          {...register(`roomTypes.${index}.maxGuests`)}
          value={watch(`roomTypes.${index}.maxGuests`)} // Thêm value={watch(...)}
          error={roomErrors.maxGuests?.message}
        />
        <FloatingTextField
          label="Kích thước (m²)"
          type="number"
          icon={<ArrowUpRight size={18} />}
          {...register(`roomTypes.${index}.size`)}
          value={watch(`roomTypes.${index}.size`)} // Thêm value={watch(...)}
          error={roomErrors.size?.message}
        />
        <FloatingTextField
          label="Giá (VNĐ/đêm)"
          type="number"
          icon={<Tag size={18} />}
          {...register(`roomTypes.${index}.price`)}
          value={watch(`roomTypes.${index}.price`)} // Thêm value={watch(...)}
          error={roomErrors.price?.message}
        />
        
        {/* Tùy chọn Thú cưng (dạng checkbox) */}
        <div className="flex items-center justify-start pt-5">
            <label className="flex items-center gap-3 cursor-pointer">
                <input 
                    type="checkbox" 
                    {...register(`roomTypes.${index}.allowPets`)}
                    className="w-5 h-5 accent-[rgb(40,169,224)] rounded-md"
                />
                <PawPrint size={18} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Cho phép mang theo thú cưng</span>
            </label>
        </div>
      </div>
    </Card>
  );
}