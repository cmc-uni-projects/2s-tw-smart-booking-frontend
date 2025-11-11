import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Modal from "@/components/common/Modal/Modal";
import Button from "@/components/common/Button/Button";
import LoadingOverlay from "@/components/common/Loading/LoadingOverlay";
import FloatingTextField from "@/components/common/Input/FloatingTextField";
import TextArea from "@/components/common/Input/TextArea";
import AmenityOption from "../AddPropertySteps/components/AmenityOption";
import ImageUploadGrid from "@/components/common/Input/ImageUploadGrid";

// ✅ SỬA LỖI 1: Thêm 'XCircle' vào import
import {
  Wifi, ParkingCircle, Droplet, Waves, Sparkles, Ban, Plane, PawPrint,
  Dumbbell, Wind, ConciergeBell, Cigarette, Image as ImageIcon, MapPin,
  ClipboardList, Package, XCircle 
} from "lucide-react";

// --- VALIDATION (Giữ nguyên) ---
const fileListValidation = (min = 1) => yup
  .mixed() 
  .test("required", `Yêu cầu tải lên ít nhất ${min} ảnh`, (value) => value === null || (value && value.length >= min))
  .test("fileType", "Chỉ chấp nhận file JPG, PNG, WEBP", (value) => {
    if (!value || value.length === 0) return true; 
    return Array.from(value).every(file => 
      ["image/jpeg", "image/png", "image/webp"].includes(file.type)
    );
  });

const editSchema = yup.object({
  province: yup.string().required("Vui lòng nhập tỉnh/thành"),
  city: yup.string().required("Vui lòng nhập thành phố/quận"),
  address: yup.string().required("Vui lòng nhập địa chỉ chi tiết"),
  amenities: yup.object().nullable(), 
  propertyImages: fileListValidation(0), 
  propertyName: yup.string().required("Tên cơ sở là bắt buộc"),
  description: yup.string().min(50, "Mô tả phải có ít nhất 50 ký tự").required("Mô tả là bắt buộc"),
  area: yup.number().min(1, "Diện tích phải > 0").required("Bắt buộc").typeError("Phải là số"),
});
// ------------------------------------------

// --- AMENITIES (Giữ nguyên) ---
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
// ------------------------------------------

// ✅ SỬA LỖI 2: Component 'CurrentImage' (Sửa lại style nút)
const CurrentImage = ({ url }) => (
  <div className="relative aspect-square w-full overflow-hidden rounded-lg shadow-sm">
    <img src={url} alt="Ảnh cơ sở" className="h-full w-full object-cover" />
    <Button
      type="button" // Thêm type="button"
      size="sm"
      variant="outline" // Sửa từ "danger-outline" thành "outline"
      // Thêm class để custom màu đỏ
      className="absolute top-1 right-1 !p-1 !rounded-full h-auto bg-white/70 backdrop-blur-sm text-red-500 border-red-400 hover:bg-red-50 hover:border-red-500"
      onClick={() => alert("Logic xóa ảnh (gọi API) sẽ ở đây")}
    >
      <XCircle size={16} />
    </Button>
  </div>
);

export default function EditPropertyModal({ open, onClose, property, onSubmit }) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(editSchema),
    mode: "onChange",
  });

  // useEffect (Giữ nguyên)
  useEffect(() => {
    if (property) {
      reset({
        propertyName: property.details?.propertyName || "",
        description: property.details?.description || "",
        area: property.details?.area || "",
        province: property.locationDetails?.province || "",
        city: property.locationDetails?.city || "",
        address: property.locationDetails?.address || "",
        amenities: property.amenities || {},
        propertyImages: null,
      });
    }
  }, [property, open, reset]);

  // handleFinalSubmit (Giữ nguyên)
  const handleFinalSubmit = (data) => {
    setIsLoading(true);
    setTimeout(() => {
      onSubmit(data);
      setIsLoading(false);
    }, 1500);
  };

  if (!property) return null;

  return (
    <>
      {isLoading && <LoadingOverlay message="Đang cập nhật..." />}
      <Modal
        open={open}
        onClose={onClose}
        title={`Chỉnh sửa: ${property.name}`}
        maxWidth="max-w-4xl"
      >
        <form onSubmit={handleSubmit(handleFinalSubmit)}>
          {/* BODY CỦA MODAL (Giữ nguyên) */}
          <div className="max-h-[70vh] overflow-y-auto p-1 pr-4 space-y-8">
            
            {/* --- SECTION 1: CHI TIẾT CƠ SỞ --- */}
            <section>
              <h3 className="text-lg font-semibold text-[rgb(40,169,224)] flex items-center gap-2 mb-4">
                <ClipboardList size={20} /> Thông tin cơ bản
              </h3>
              <div className="space-y-2">
                <FloatingTextField
                  label="Tên cơ sở lưu trú"
                  {...register("propertyName")}
                  value={watch("propertyName")}
                  error={errors.propertyName?.message}
                />
                <TextArea
                  label="Mô tả"
                  rows={5}
                  {...register("description")}
                  value={watch("description")}
                  error={errors.description?.message}
                />
                <FloatingTextField
                  label="Diện tích (m²)"
                  type="number"
                  {...register("area")}
                  value={watch("area")}
                  error={errors.area?.message}
                />
              </div>
            </section>

            {/* --- SECTION 2: VỊ TRÍ --- */}
            <section>
              <h3 className="text-lg font-semibold text-[rgb(40,169,224)] flex items-center gap-2 mb-4">
                <MapPin size={20} /> Vị trí
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 space-y-2 md:space-y-0">
                <FloatingTextField
                  label="Tỉnh/Thành"
                  {...register("province")}
                  value={watch("province")}
                  error={errors.province?.message}
                />
                <FloatingTextField
                  label="Thành phố/Quận/Huyện"
                  {...register("city")}
                  value={watch("city")}
                  error={errors.city?.message}
                />
              </div>
              <div className="mt-2">
                <FloatingTextField
                  label="Địa chỉ chi tiết"
                  {...register("address")}
                  value={watch("address")}
                  error={errors.address?.message}
                />
              </div>
            </section>

            {/* --- SECTION 3: TIỆN NGHI --- */}
            <section>
              <h3 className="text-lg font-semibold text-[rgb(40,169,224)] flex items-center gap-2 mb-4">
                <Package size={20} /> Tiện nghi
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
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
            </section>

            {/* --- SECTION 4: HÌNH ẢNH --- */}
            <section>
              <h3 className="text-lg font-semibold text-[rgb(40,169,224)] flex items-center gap-2 mb-4">
                <ImageIcon size={20} /> Quản lý hình ảnh
              </h3>
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Ảnh hiện tại:</h4>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {property.existingImages?.map((url, index) => (
                    <CurrentImage key={index} url={url} />
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">Tải lên ảnh mới (để thêm vào album):</h4>
                <ImageUploadGrid
                  multiple={true}
                  accept="image/png, image/jpeg, image/webp"
                  value={watch("propertyImages")}
                  onChange={(files) => setValue("propertyImages", files, { shouldValidate: true })}
                  error={errors.propertyImages?.message} 
                />
              </div>
            </section>

          </div>
          
          {/* FOOTER CỦA MODAL (Giữ nguyên) */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <Button type="button" variant="ghost" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit">
              Lưu thay đổi
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}