import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Modal from "@/components/common/Modal/Modal";
import ConfirmModal from "@/components/common/Modal/ConfirmModal"; // ✅ Import ConfirmModal
import Button from "@/components/common/Button/Button";
import LoadingOverlay from "@/components/common/Loading/LoadingOverlay";
import FloatingTextField from "@/components/common/Input/FloatingTextField";
import TextArea from "@/components/common/Input/TextArea";
import AmenityOption from "../AddPropertySteps/components/AmenityOption";
import ImageUploadGrid from "@/components/common/Input/ImageUploadGrid";
import propertyService from "@/services/property.service";
import api from "@/services/axios.config"; 

import {
  Wifi, ParkingCircle, Droplet, Waves, Sparkles, Ban, Plane, PawPrint,
  Dumbbell, Wind, ConciergeBell, Cigarette, Image as ImageIcon, MapPin,
  ClipboardList, Package, XCircle, Star, RefreshCw, Trash2
} from "lucide-react";

// ... (Validation & Constants giữ nguyên) ...
const fileListValidation = (min = 0) => yup.mixed();
const editSchema = yup.object({
    province: yup.string().required("Vui lòng nhập tỉnh/thành"),
    city: yup.string().required("Vui lòng nhập thành phố/quận"),
    address: yup.string().required("Vui lòng nhập địa chỉ chi tiết"),
    amenities: yup.object().nullable(),
    propertyName: yup.string().required("Tên cơ sở là bắt buộc"),
    description: yup.string().min(50, "Mô tả phải có ít nhất 50 ký tự").required("Mô tả là bắt buộc"),
    area: yup.number().min(1, "Diện tích phải > 0").required("Bắt buộc").typeError("Phải là số"),
});
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
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8386/api/v1").replace("/api/v1", "");
const getFullImageUrl = (url) => {
  if (!url) return "/assets/images/placeholder.png";
  if (url.startsWith("http")) return url;
  let path = url.startsWith("/") ? url : `/${url}`;
  if (!path.startsWith("/uploads")) path = `/uploads${path}`;
  return `${API_BASE_URL}${path}`;
};

// ✅ Nhận prop showToast
export default function EditPropertyModal({ open, onClose, property, onSuccess, showToast }) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentImages, setCurrentImages] = useState([]); 
  const [uploadedFiles, setUploadedFiles] = useState([]); 

  // ✅ State cho ConfirmModal
  const [confirmData, setConfirmData] = useState({
      open: false,
      title: "",
      message: "",
      onConfirm: null
  });

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(editSchema),
    mode: "onChange",
  });

  // 1. Fetch Data (Giữ nguyên)
  useEffect(() => {
    const fetchData = async () => {
      if (open && property?.propertyId) {
        try {
          setIsLoading(true);
          const detailRes = await api.get(`/property-details/${property.propertyId}`);
          const data = detailRes.data;
          
          const imagesRes = await propertyService.getPropertyImages(property.propertyId);
          setCurrentImages(imagesRes || []);

          const amenitiesMap = {};
          data.amenities.forEach(a => {
             const key = AMENITIES_LIST.find(item => item.label === a.amenityName || item.id === a.amenityName.toLowerCase())?.id;
             if(key) amenitiesMap[key] = true;
          });

          reset({
            propertyName: data.property.propertyName,
            description: data.property.description,
            area: data.property.area || 0,
            province: data.property.province || "",
            city: data.property.city,
            address: data.property.address,
            amenities: amenitiesMap,
          });
          setUploadedFiles([]); 
        } catch (error) {
          console.error("Failed to load data", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchData();
  }, [open, property, reset]);

  // 2. Xử lý Set Cover Image
  const handleSetCover = async (imageId) => {
      try {
          setIsLoading(true);
          await propertyService.setCoverImage(property.propertyId, imageId);
          
          const updated = currentImages.map(img => ({
              ...img,
              isCover: img.propertyImageId === imageId
          }));
          setCurrentImages(updated);
          if (showToast) showToast("Đã đặt ảnh bìa thành công", "success"); // ✅ Toast
      } catch (error) {
          if (showToast) showToast("Đặt ảnh bìa thất bại", "error"); // ✅ Toast
      } finally {
          setIsLoading(false);
      }
  };

  // 3. Chuẩn bị xóa ảnh (Mở ConfirmModal)
  const handleRequestDelete = (imageId) => {
      setConfirmData({
          open: true,
          title: "Xác nhận xóa ảnh",
          message: "Bạn có chắc chắn muốn xóa ảnh này không? Hành động này không thể hoàn tác.",
          onConfirm: () => processDeleteImage(imageId)
      });
  };

  // 4. Thực hiện xóa ảnh (Sau khi confirm)
  const processDeleteImage = async (imageId) => {
      try {
          setIsLoading(true);
          setConfirmData({ ...confirmData, open: false }); // Đóng modal confirm
          
          await propertyService.deletePropertyImage(property.propertyId, imageId);
          setCurrentImages(prev => prev.filter(img => img.propertyImageId !== imageId));
          
          if (showToast) showToast("Đã xóa ảnh", "success"); // ✅ Toast
      } catch (e) {
          if (showToast) showToast("Xóa ảnh thất bại", "error"); // ✅ Toast
      } finally {
          setIsLoading(false);
      }
  };

  const handleFinalSubmit = async (data) => {
    try {
      setIsLoading(true);
      const updateData = {
          propertyName: data.propertyName,
          description: data.description,
          area: data.area,
          province: data.province,
          city: data.city,
          address: data.address,
      };
      await propertyService.updateProperty(property.propertyId, updateData);

      if (uploadedFiles && uploadedFiles.length > 0) {
          const formData = new FormData();
          Array.from(uploadedFiles).forEach((file) => {
              formData.append("file", file); 
          });
          await propertyService.uploadPropertyImages(property.propertyId, formData);
      }

      if (onSuccess) onSuccess();
      // Toast success đã được gọi ở PropertyListPage thông qua handleEditSuccess
      onClose();
    } catch (error) {
      if (showToast) showToast(error.message || "Cập nhật thất bại", "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (!property) return null;

  return (
    <>
      {isLoading && <LoadingOverlay message="Đang xử lý..." />}
      
      {/* ✅ Confirm Modal cho xóa ảnh */}
      <ConfirmModal
          open={confirmData.open}
          onClose={() => setConfirmData({ ...confirmData, open: false })}
          onConfirm={confirmData.onConfirm}
          title={confirmData.title}
          description={confirmData.message} // ConfirmModal của bạn dùng prop 'description' hoặc 'content'
          confirmText="Xóa ảnh"
          cancelText="Hủy"
          isDanger={true}
      />

      <Modal open={open} onClose={onClose} title={`Chỉnh sửa: ${property.propertyName}`} maxWidth="max-w-4xl">
        <form onSubmit={handleSubmit(handleFinalSubmit)}>
          <div className="max-h-[70vh] overflow-y-auto p-1 pr-4 space-y-8">
            
            {/* ... (SECTION 1, 2, 3 GIỮ NGUYÊN) ... */}
            <section>
              <h3 className="text-lg font-semibold text-[rgb(40,169,224)] flex items-center gap-2 mb-4">
                <ClipboardList size={20} /> Thông tin cơ bản
              </h3>
              <div className="space-y-3">
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

            <section>
              <h3 className="text-lg font-semibold text-[rgb(40,169,224)] flex items-center gap-2 mb-4">
                <MapPin size={20} /> Vị trí
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="md:col-span-2">
                    <FloatingTextField
                    label="Địa chỉ chi tiết"
                    {...register("address")}
                    value={watch("address")}
                    error={errors.address?.message}
                    />
                </div>
              </div>
            </section>

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

            {/* SECTION 4: IMAGES */}
            <section>
              <div className="flex justify-between items-center mb-4">
                 <h3 className="text-lg font-semibold text-[rgb(40,169,224)] flex items-center gap-2">
                    <ImageIcon size={20} /> Quản lý hình ảnh
                 </h3>
                 <Button 
                    type="button" 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => {
                        propertyService.getPropertyImages(property.propertyId).then(setCurrentImages);
                    }}
                 >
                    <RefreshCw size={16} />
                 </Button>
              </div>
              
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-600 mb-3">
                    Album hiện tại ({currentImages.length} ảnh):
                </h4>
                
                {currentImages.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                    {currentImages.map((img) => (
                        <div key={img.propertyImageId} 
                             className={`relative aspect-square w-full overflow-hidden rounded-xl shadow-sm group border-2 transition-all duration-200
                             ${img.isCover ? 'border-yellow-400 ring-2 ring-yellow-100' : 'border-gray-200 hover:border-blue-300'}`}>
                             
                            <img src={getFullImageUrl(img.imageUrl)} alt="Property" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            
                            {img.isCover && (
                                <div className="absolute top-2 left-2 bg-yellow-400 text-white p-1.5 rounded-full shadow-md z-10">
                                    <Star size={14} fill="currentColor" />
                                </div>
                            )}

                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-3 backdrop-blur-[1px]">
                                {!img.isCover && (
                                    <Button
                                        type="button"
                                        size="sm"
                                        className="bg-white text-yellow-500 hover:bg-yellow-400 hover:text-white border-none p-2 h-auto rounded-full shadow-lg transform hover:scale-110 transition-all"
                                        onClick={() => handleSetCover(img.propertyImageId)}
                                        title="Đặt làm ảnh bìa"
                                    >
                                        <Star size={20} />
                                    </Button>
                                )}
                                
                                {/* ✅ Nút Xóa gọi handleRequestDelete thay vì xóa trực tiếp */}
                                <Button
                                    type="button"
                                    size="sm"
                                    className="bg-white text-red-500 hover:bg-red-500 hover:text-white border-none p-2 h-auto rounded-full shadow-lg transform hover:scale-110 transition-all"
                                    onClick={() => handleRequestDelete(img.propertyImageId)}
                                    title="Xóa ảnh"
                                >
                                    <Trash2 size={20} />
                                </Button>
                            </div>
                        </div>
                    ))}
                    </div>
                ) : (
                    <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                        <ImageIcon className="mx-auto text-gray-300 mb-2" size={40} />
                        <p className="text-gray-400 italic text-sm">Chưa có ảnh nào trong album.</p>
                    </div>
                )}
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">Tải lên ảnh mới:</h4>
                <ImageUploadGrid
                  multiple={true}
                  accept="image/png, image/jpeg, image/webp"
                  value={uploadedFiles}
                  onChange={(files) => setUploadedFiles(files)}
                />
              </div>
            </section>

          </div>
          
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-4">
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
