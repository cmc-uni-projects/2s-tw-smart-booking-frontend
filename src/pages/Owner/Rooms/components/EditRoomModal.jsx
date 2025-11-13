import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Modal from "@/components/common/Modal/Modal";
import Button from "@/components/common/Button/Button";
import LoadingOverlay from "@/components/common/Loading/LoadingOverlay";
import FloatingTextField from "@/components/common/Input/FloatingTextField";
import TextArea from "@/components/common/Input/TextArea";
import FloatingSelect from "@/components/common/Select/FloatingSelect.jsx";
import ImageUploadGrid from "@/components/common/Input/ImageUploadGrid";
import Badge from "@/components/common/Badge/Badge";
import { ROOM_AMENITIES_LIST, ROOM_STATUS_OPTIONS } from "./roomData.jsx";
import AmenityOption from "@/pages/Owner/Properties/AddPropertySteps/components/AmenityOption";
import { Image as ImageIcon, Package, Check, XCircle } from "lucide-react";

const ROOM_CATEGORY_OPTIONS = [
  { label: "Standard", value: "Standard" },
  { label: "Deluxe", value: "Deluxe" },
  { label: "Suite", value: "Suite" },
];

// --- VALIDATION SCHEMA (Giữ nguyên) ---
const fileListValidation = (min = 1) => yup
  .mixed()
  .test("required", `Yêu cầu tải lên ít nhất ${min} ảnh`, (value) => value === null || (value && value.length >= min))
  .test("fileType", "Chỉ chấp nhận file JPG, PNG, WEBP", (value) => {
    if (!value || value.length === 0) return true;
    return Array.from(value).every(file =>
      ["image/jpeg", "image/png", "image/webp"].includes(file.type)
    );
  });

const roomSchema = yup.object({
  roomName: yup.string().required("Tên phòng là bắt buộc"),
  roomCategory: yup.string().required("Loại phòng là bắt buộc"),
  description: yup.string().nullable(),
  capacity: yup.number().min(1, "Sức chứa tối thiểu là 1").required("Bắt buộc").typeError("Phải là số"),
  pricePerNight: yup.number().min(0, "Giá không thể âm").required("Bắt buộc").typeError("Phải là số"),
  roomCount: yup.number().min(1, "Số lượng tối thiểu là 1").required("Bắt buộc").typeError("Phải là số"),
  roomStatus: yup.string().required("Vui lòng chọn trạng thái phòng"),
  roomAmenities: yup.object().nullable(),
  newImages: yup.mixed().nullable(),
});
// ------------------------------------------

// --- Component CurrentImage (Giữ nguyên) ---
const CurrentImage = ({ url, isCover, onSetCover, onRemove }) => (
  <div className="relative aspect-square w-full overflow-hidden rounded-lg shadow-sm group">
    <img src={url} alt="Ảnh phòng" className="h-full w-full object-cover" />
    <Button
      type="button"
      size="sm"
      variant="outline"
      className="absolute top-1 right-1 !p-1 !rounded-full h-auto bg-white/70 backdrop-blur-sm text-red-500 border-red-400 hover:bg-red-50"
      onClick={onRemove}
    >
      <XCircle size={16} />
    </Button>
    {isCover ? (
      <div className="absolute bottom-1 left-1 z-10">
        <Badge color="success" icon={<Check size={14}/>}>
          Ảnh bìa
        </Badge>
      </div>
    ) : (
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="absolute bottom-1 left-1 !p-1 !text-xs h-auto bg-white/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
        onClick={onSetCover}
      >
        Đặt làm bìa
      </Button>
    )}
  </div>
);
// ------------------------------------------

// --- COMPONENT CHÍNH ---
// ✅ 1. Đổi tên `room` prop thành `initialData` (cho rõ ràng)
export default function EditRoomModal({ open, onClose, initialData, onSubmit }) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);

  // ✅ 2. Xác định chế độ "Thêm" (isAddMode)
  const isAddMode = !initialData;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(roomSchema),
    mode: "onChange",
  });

  // ✅ 3. Cập nhật useEffect
  useEffect(() => {
    if (open) {
      if (isAddMode) {
        // Chế độ THÊM: Reset về giá trị rỗng
        reset({
          roomName: "",
          roomCategory: "Standard",
          description: "",
          capacity: 1,
          pricePerNight: 0,
          roomCount: 1,
          roomStatus: "AVAILABLE",
          roomAmenities: {},
          newImages: null,
        });
        setCurrentImages([]); // Không có ảnh hiện tại
      } else {
        // Chế độ SỬA: Điền dữ liệu
        reset({
          roomName: initialData.roomName || "",
          roomCategory: initialData.roomCategory || "Standard",
          description: initialData.description || "",
          capacity: initialData.capacity || 1,
          pricePerNight: initialData.pricePerNight || 0,
          roomCount: initialData.roomCount || 1,
          roomStatus: initialData.roomStatus || "AVAILABLE",
          roomAmenities: initialData.amenities || {},
          newImages: null,
        });
        setCurrentImages(initialData.images || []);
      }
    }
  }, [initialData, open, reset, isAddMode]); // Thêm isAddMode vào dependency

  const handleFinalSubmit = (data) => {
    setIsLoading(true);
    const finalData = { ...data, images: currentImages };
    
    setTimeout(() => {
      // ✅ 4. Cập nhật thông báo
      onSubmit(finalData, isAddMode); // Báo cho cha biết đây là "thêm" hay "sửa"
      setIsLoading(false);
    }, 1500);
  };

  // (Các hàm handleSetCover, handleRemoveImage giữ nguyên)
  const handleSetCover = (imageId) => {
    setCurrentImages(currentImages.map(img => ({ ...img, isCover: img.id === imageId })));
  };
  const handleRemoveImage = (imageId) => {
    alert(`(Mock) Đã gọi API xóa ảnh ID: ${imageId}`);
    setCurrentImages(currentImages.filter(img => img.id !== imageId));
  };
  // -------------------------

  // (Không cần `if (!room) return null;` nữa)
  
  return (
    <>
      {/* ✅ 5. Cập nhật thông báo loading */}
      {isLoading && (
        <LoadingOverlay
          message={isAddMode ? "Đang thêm phòng..." : "Đang cập nhật phòng..."}
        />
      )}

      <Modal
        open={open}
        onClose={onClose}
        // ✅ 6. Đổi tiêu đề dựa trên chế độ
        title={isAddMode ? "Thêm phòng mới" : `Chỉnh sửa: ${watch("roomName") || initialData?.roomName}`}
        maxWidth="max-w-4xl"
      >
        <form onSubmit={handleSubmit(handleFinalSubmit)}>
          <div className="max-h-[70vh] overflow-y-auto p-1 pr-4 space-y-8">
            
            {/* --- SECTION 1: THÔNG TIN CHÍNH (Giữ nguyên) --- */}
            <section>
              <h3 className="text-lg font-semibold text-[rgb(40,169,224)] mb-4">
                Thông tin cơ bản
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                <FloatingTextField
                  label="Tên phòng"
                  placeholder="Ví dụ: Phòng Hướng Biển"
                  {...register("roomName")}
                  value={watch("roomName")}
                  error={errors.roomName?.message}
                />
                <FloatingSelect
                  label="Loại phòng"
                  control={control}
                  name="roomCategory"
                  options={ROOM_CATEGORY_OPTIONS}
                  error={errors.roomCategory?.message}
                />
              </div>
              <div className="mt-2">
                <TextArea
                  label="Mô tả phòng"
                  rows={4}
                  {...register("description")}
                  value={watch("description")}
                  error={errors.description?.message}
                />
              </div>
            </section>

            {/* --- SECTION 2: THUỘC TÍNH (Giữ nguyên) --- */}
            <section>
              <h3 className="text-lg font-semibold text-[rgb(40,169,224)] mb-4">
                Thuộc tính & Trạng thái
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <FloatingTextField
                  label="Sức chứa (người)"
                  type="number"
                  {...register("capacity")}
                  value={watch("capacity")}
                  error={errors.capacity?.message}
                />
                <FloatingTextField
                  label="Giá (VNĐ/đêm)"
                  type="number"
                  {...register("pricePerNight")}
                  value={watch("pricePerNight")}
                  error={errors.pricePerNight?.message}
                />
                <FloatingTextField
                  label="Số lượng phòng"
                  type="number"
                  {...register("roomCount")}
                  value={watch("roomCount")}
                  error={errors.roomCount?.message}
                />
                <FloatingSelect
                  label="Trạng thái phòng"
                  control={control}
                  name="roomStatus"
                  options={ROOM_STATUS_OPTIONS}
                  error={errors.roomStatus?.message}
                />
              </div>
            </section>

            {/* --- SECTION 3: TIỆN NGHI PHÒNG (Giữ nguyên) --- */}
            <section>
              <h3 className="text-lg font-semibold text-[rgb(40,169,224)] flex items-center gap-2 mb-4">
                <Package size={20} /> Tiện nghi phòng
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {ROOM_AMENITIES_LIST.map((item) => (
                  <AmenityOption
                    key={item.id}
                    id={item.id}
                    label={item.label}
                    icon={item.icon}
                    register={register}
                    {...register(`roomAmenities.${item.id}`)}
                  />
                ))}
              </div>
            </section>

            {/* --- SECTION 4: HÌNH ẢNH PHÒNG --- */}
            <section>
              <h3 className="text-lg font-semibold text-[rgb(40,169,224)] flex items-center gap-2 mb-4">
                <ImageIcon size={20} /> Hình ảnh phòng
              </h3>
              
              {/* ✅ 7. Chỉ hiển thị mục này ở chế độ Sửa */}
              {!isAddMode && currentImages.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Ảnh hiện tại:</h4>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {currentImages.map((img) => (
                      <CurrentImage
                        key={img.id}
                        url={img.url}
                        isCover={img.isCover}
                        onSetCover={() => handleSetCover(img.id)}
                        onRemove={() => handleRemoveImage(img.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Tải ảnh (Hiển thị ở cả 2 chế độ) */}
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">
                  {isAddMode ? "Tải lên ảnh phòng:" : "Tải lên ảnh mới (để thêm vào album):"}
                </h4>
                <ImageUploadGrid
                  multiple={true}
                  accept="image/png, image/jpeg, image/webp"
                  value={watch("newImages")}
                  onChange={(files) => setValue("newImages", files, { shouldValidate: true })}
                  error={errors.newImages?.message} 
                />
              </div>
            </section>

          </div>
          
          {/* FOOTER CỦA MODAL */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <Button type="button" variant="ghost" onClick={onClose}>
              Hủy
            </Button>
            {/* ✅ 8. Đổi text nút Submit */}
            <Button type="submit">
              {isAddMode ? "Thêm phòng" : "Lưu thay đổi"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}