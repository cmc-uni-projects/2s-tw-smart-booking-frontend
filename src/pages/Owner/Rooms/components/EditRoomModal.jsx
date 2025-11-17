import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Modal from "@/components/common/Modal/Modal";
import Button from "@/components/common/Button/Button";
import LoadingOverlay from "@/components/common/Loading/LoadingOverlay";
import FloatingTextField from "@/components/common/Input/FloatingTextField";
import TextArea from "@/components/common/Input/TextArea";
import ImageUploadGrid from "@/components/common/Input/ImageUploadGrid";
import AmenityOption from "../../Properties/AddPropertySteps/components/AmenityOption";
import roomService from "@/services/room.service";
import api from "@/services/axios.config";

import {
  Tv, Wind, Coffee, Wifi, Bath, Snowflake, 
  BedDouble, Users, DollarSign, Image as ImageIcon, Package, Trash2,
  Wine, Ban, Star, RefreshCw // ✅ Đã import đủ icon
} from "lucide-react";

// --- CONFIG ---
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8386/api/v1").replace("/api/v1", "");

const getFullImageUrl = (url) => {
  if (!url) return "/assets/images/placeholder.png";
  if (url.startsWith("http")) return url;
  let path = url.startsWith("/") ? url : `/${url}`;
  if (!path.startsWith("/uploads")) path = `/uploads${path}`;
  return `${API_BASE_URL}${path}`;
};

// Amenities & Categories (Giữ nguyên)
const ROOM_AMENITIES = [
  { id: "tv", label: "TV", icon: <Tv size={20} /> },
  { id: "ac", label: "Điều hòa", icon: <Snowflake size={20} /> },
  { id: "minibar", label: "Minibar", icon: <Wine size={20} /> },
  { id: "tea_coffee", label: "Trà/Cà phê", icon: <Coffee size={20} /> },
  { id: "wifi", label: "Wifi", icon: <Wifi size={20} /> },
  { id: "bathtub", label: "Bồn tắm", icon: <Bath size={20} /> },
  { id: "balcony", label: "Ban công", icon: <Wind size={20} /> },
  { id: "non_smoking", label: "Không hút thuốc", icon: <Ban size={20} /> },
];

const ROOM_CATEGORIES = [
    { value: "STANDARD", label: "Tiêu chuẩn (Standard)" },
    { value: "DELUXE", label: "Sang trọng (Deluxe)" },
    { value: "SUITE", label: "Cao cấp (Suite)" },
];

const schema = yup.object({
  roomName: yup.string().required("Vui lòng nhập tên phòng"),
  roomCategory: yup.string().required("Chọn loại phòng"),
  pricePerNight: yup.number().min(0, "Giá không hợp lệ").required("Nhập giá phòng").typeError("Phải là số"),
  capacity: yup.number().min(1, "Tối thiểu 1 người").required("Nhập sức chứa").typeError("Phải là số"),
  description: yup.string().nullable(),
  amenities: yup.object().nullable(), 
});

export default function EditRoomModal({ open, onClose, room, propertyId, onSuccess, showToast }) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentImages, setCurrentImages] = useState([]); // Danh sách ảnh (có ID & isCover)
  const [newImages, setNewImages] = useState([]);

  const isEditMode = !!room;

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
        roomCategory: "STANDARD",
        capacity: 2,
        pricePerNight: 0
    }
  });

  // 1. Load Data & Fetch Real Images
  useEffect(() => {
    if (open) {
      if (room) {
        // --- EDIT MODE ---
        // Map amenities
        const amenityMap = {};
        if(room.amenities) {
             room.amenities.forEach(item => {
                 const name = typeof item === 'string' ? item : item.amenityName;
                 const key = ROOM_AMENITIES.find(a => a.label === name || a.id === name.toLowerCase())?.id;
                 if(key) amenityMap[key] = true;
             });
        }

        reset({
          roomName: room.roomName,
          roomCategory: room.roomCategory,
          pricePerNight: room.pricePerNight,
          capacity: room.capacity,
          description: room.description,
          amenities: amenityMap,
        });
        
        // ✅ QUAN TRỌNG: Gọi API lấy danh sách ảnh chi tiết (để có ID và isCover)
        // Vì object 'room' từ list bên ngoài chỉ chứa List<String> url
        const fetchImages = async () => {
            try {
                // Gọi service lấy ảnh phòng (Bạn cần đảm bảo đã thêm hàm này vào room.service.js)
                const images = await roomService.getRoomImages(room.roomId);
                setCurrentImages(images || []);
            } catch (error) {
                console.error("Failed to load room images", error);
                setCurrentImages([]);
            }
        };
        fetchImages();

      } else {
        // --- ADD MODE ---
        reset({
            roomName: "",
            roomCategory: "STANDARD",
            pricePerNight: 0,
            capacity: 2,
            description: "",
            amenities: {},
        });
        setCurrentImages([]);
      }
      setNewImages([]);
    }
  }, [open, room, reset]);

  // 2. Xử lý Đặt ảnh bìa (Giống EditPropertyModal)
  const handleSetCover = async (imageId) => {
      if (!room?.roomId) return;
      try {
          setIsLoading(true);
          await roomService.setRoomCoverImage(room.roomId, imageId);
          
          // Update UI local
          const updated = currentImages.map(img => ({
              ...img,
              isCover: img.roomImageId === imageId
          }));
          setCurrentImages(updated);
          if(showToast) showToast("Đã đặt ảnh bìa", "success");
      } catch (e) {
          if(showToast) showToast("Lỗi đặt ảnh bìa", "error");
      } finally {
          setIsLoading(false);
      }
  };

  // 3. Xử lý Xóa ảnh (Giống EditPropertyModal)
  const handleDeleteImage = async (imageId) => {
     if (!room?.roomId) return;
     if(!window.confirm("Bạn có chắc muốn xóa ảnh này?")) return;
     
     try {
         setIsLoading(true);
         await roomService.deleteRoomImage(room.roomId, imageId);
         
         // Update UI local
         setCurrentImages(prev => prev.filter(img => img.roomImageId !== imageId));
         if(showToast) showToast("Đã xóa ảnh", "success");
     } catch (e) {
         if(showToast) showToast("Lỗi xóa ảnh", "error");
     } finally {
         setIsLoading(false);
     }
  };

  // 4. Submit Form
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      
      const selectedAmenities = Object.keys(data.amenities || {}).filter(key => data.amenities[key]);
      
      const roomDataObj = {
          propertyId: propertyId,
          roomName: data.roomName,
          roomCategory: data.roomCategory,
          pricePerNight: data.pricePerNight,
          capacity: data.capacity,
          description: data.description,
          amenities: selectedAmenities 
      };

      const formData = new FormData();
      formData.append("roomData", JSON.stringify(roomDataObj));
      
      if (newImages.length > 0) {
          Array.from(newImages).forEach(file => formData.append("images", file));
      }

      if (!isEditMode) {
          await roomService.addRoom(formData);
      } else {
          await roomService.updateRoom(room.roomId, formData);
      }

      if (onSuccess) onSuccess();
      onClose();

    } catch (error) {
      console.error(error);
      if(showToast) showToast(error.message || "Có lỗi xảy ra", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <LoadingOverlay message="Đang xử lý..." />}
      <Modal
        open={open}
        onClose={onClose}
        title={isEditMode ? `Cập nhật: ${room.roomName}` : "Thêm phòng mới"}
        maxWidth="max-w-4xl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="p-1 max-h-[75vh] overflow-y-auto pr-2">
           
           {/* SECTION 1 & 2: INFO & AMENITIES (Giữ nguyên như cũ) */}
           <section className="mb-6">
               <h4 className="text-blue-600 font-semibold mb-3 flex items-center gap-2"><BedDouble size={20}/> Thông tin phòng</h4>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <FloatingTextField label="Tên phòng (Số phòng)" placeholder=" " {...register("roomName")} error={errors.roomName?.message} />
                   
                   <div className="relative">
                       <select {...register("roomCategory")} className="w-full px-4 py-3.5 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-blue-100 outline-none appearance-none pt-5 pb-2">
                           {ROOM_CATEGORIES.map(cat => (<option key={cat.value} value={cat.value}>{cat.label}</option>))}
                       </select>
                       <label className="absolute left-4 top-1 text-xs text-gray-500 font-medium pointer-events-none">Loại phòng</label>
                   </div>

                   <div className="relative">
                        <FloatingTextField label="Giá mỗi đêm (VNĐ)" type="number" placeholder=" " {...register("pricePerNight")} error={errors.pricePerNight?.message} />
                        <DollarSign className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" size={18}/>
                   </div>

                   <div className="relative">
                        <FloatingTextField label="Sức chứa (Người)" type="number" placeholder=" " {...register("capacity")} error={errors.capacity?.message} />
                        <Users className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" size={18}/>
                   </div>
               </div>
               <div className="mt-4">
                    <TextArea label="Mô tả phòng" rows={3} placeholder=" " {...register("description")} />
               </div>
           </section>

           <section className="mb-6">
               <h4 className="text-blue-600 font-semibold mb-3 flex items-center gap-2"><Package size={20}/> Tiện nghi phòng</h4>
               <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                   {ROOM_AMENITIES.map(item => (
                       <AmenityOption key={item.id} id={item.id} label={item.label} icon={item.icon} register={register} />
                   ))}
               </div>
           </section>

           {/* ✅ SECTION 3: HÌNH ẢNH (GIAO DIỆN MỚI GIỐNG PROPERTY) */}
           <section>
               <div className="flex justify-between items-center mb-4">
                 <h4 className="text-blue-600 font-semibold flex items-center gap-2">
                    <ImageIcon size={20}/> Quản lý hình ảnh
                 </h4>
                 {/* Nút Refresh */}
                 <Button 
                    type="button" 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => {
                        if(room?.roomId) roomService.getRoomImages(room.roomId).then(setCurrentImages);
                    }}
                 >
                    <RefreshCw size={16} />
                 </Button>
               </div>
               
               {/* Danh sách ảnh hiện tại */}
               <div className="mb-6">
                   {currentImages.length > 0 ? (
                       <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                           {currentImages.map((img) => (
                               <div key={img.roomImageId} 
                                    className={`relative aspect-video w-full overflow-hidden rounded-xl shadow-sm group border-2 transition-all duration-200
                                    ${img.isCover ? 'border-yellow-400 ring-2 ring-yellow-100' : 'border-gray-200 hover:border-blue-300'}`}>
                                    
                                   <img src={getFullImageUrl(img.imageUrl)} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Room" />
                                   
                                   {/* Badge Ảnh bìa */}
                                   {img.isCover && (
                                       <div className="absolute top-2 left-2 bg-yellow-400 text-white p-1 rounded-full shadow-md z-10">
                                           <Star size={12} fill="currentColor" />
                                       </div>
                                   )}

                                   {/* Actions Overlay */}
                                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-2 backdrop-blur-[1px]">
                                       {/* Nút Set Cover */}
                                       {!img.isCover && (
                                           <Button
                                               type="button"
                                               size="sm"
                                               className="bg-white text-yellow-500 hover:bg-yellow-400 hover:text-white border-none p-2 h-auto rounded-full shadow-lg transform hover:scale-110 transition-all"
                                               onClick={() => handleSetCover(img.roomImageId)}
                                               title="Đặt làm ảnh bìa"
                                           >
                                               <Star size={18} />
                                           </Button>
                                       )}
                                       
                                       {/* Nút Xóa */}
                                       <Button
                                           type="button"
                                           size="sm"
                                           className="bg-white text-red-500 hover:bg-red-500 hover:text-white border-none p-2 h-auto rounded-full shadow-lg transform hover:scale-110 transition-all"
                                           onClick={() => handleDeleteImage(img.roomImageId)}
                                           title="Xóa ảnh"
                                       >
                                           <Trash2 size={18} />
                                       </Button>
                                   </div>
                               </div>
                           ))}
                       </div>
                   ) : (
                       <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                           <ImageIcon className="mx-auto text-gray-300 mb-2" size={40} />
                           <p className="text-gray-400 italic text-sm">
                               {isEditMode ? "Chưa có ảnh nào trong album." : "Lưu phòng trước để quản lý ảnh chi tiết."}
                           </p>
                       </div>
                   )}
               </div>

               {/* Upload mới */}
               <div>
                   <h4 className="text-sm font-medium text-gray-600 mb-2">Tải lên ảnh mới:</h4>
                   <ImageUploadGrid 
                     multiple={true} 
                     value={newImages} 
                     onChange={setNewImages} 
                     placeholder="Tải lên ảnh phòng (Tối đa 5 ảnh)"
                   />
               </div>
           </section>

           {/* FOOTER */}
           <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
               <Button type="button" variant="ghost" onClick={onClose}>Hủy bỏ</Button>
               <Button type="submit">{isEditMode ? "Lưu thay đổi" : "Tạo phòng ngay"}</Button>
           </div>
        </form>
      </Modal>
    </>
  );
}
