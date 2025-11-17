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
import api from "@/services/axios.config"; // Để gọi API detail (nếu cần thêm logic)

import {
  Tv, Wind, Coffee, Wifi, Bath, Snowflake, 
  BedDouble, Users, DollarSign, Image as ImageIcon, Package, Trash2,
  Wine, Ban // Thêm icon cho Minibar và Non-smoking
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

// ✅ CẬP NHẬT DANH SÁCH TIỆN NGHI PHÒNG (Khớp với DataInitializer.java)
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

// Danh sách loại phòng (Khớp với Enum Backend)
const ROOM_CATEGORIES = [
    { value: "STANDARD", label: "Tiêu chuẩn (Standard)" },
    { value: "DELUXE", label: "Sang trọng (Deluxe)" },
    { value: "SUITE", label: "Cao cấp (Suite)" },
];

// Validation Schema
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
  const [currentImages, setCurrentImages] = useState([]);
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

  // Load Data khi mở Modal
  useEffect(() => {
    if (open) {
      if (room) {
        // --- EDIT MODE ---
        // Map amenities list -> object { tv: true, ac: true... }
        const amenityMap = {};
        // Lưu ý: Backend trả về List<String> amenities (tên/id của amenity)
        // Nếu room.amenities là List<String> (tên) hoặc List<Object> (chi tiết)
        if(room.amenities) {
             room.amenities.forEach(item => {
                 // item có thể là string tên ("tv") hoặc object ({amenityName: "tv"})
                 const name = typeof item === 'string' ? item : item.amenityName;
                 // Tìm ID tương ứng trong danh sách cứng của FE
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
        
        // Load ảnh hiện tại từ DTO
        // room.images là List<String> urls
        if (room.images && Array.isArray(room.images)) {
             // Map string url sang object để hiển thị
             const mappedImages = room.images.map((url, index) => ({
                 roomImageId: index, // Dùng index tạm làm ID vì DTO RoomResponseDTO hiện tại chỉ trả List<String> url
                 imageUrl: url
             }));
             setCurrentImages(mappedImages);
        } else {
            setCurrentImages([]);
        }

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

  // Xử lý Xóa ảnh 
  // Lưu ý: Vì RoomResponseDTO hiện tại chỉ trả List<String> URL ảnh, ta không có ID ảnh thực tế để gọi API xóa từng cái.
  // Cần cập nhật RoomResponseDTO ở Backend trả về List<RoomImageResponseDTO> để có ID thì mới xóa chính xác được.
  // Tạm thời disable nút xóa ở Edit Mode hoặc chỉ xóa trên UI.
  const handleDeleteImage = async (index) => {
     if(!window.confirm("Xóa ảnh này? (Lưu ý: Cần lưu lại để áp dụng)")) return;
     // Xóa khỏi state hiển thị
     setCurrentImages(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      
      // 1. Chuẩn bị dữ liệu JSON
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

      // 2. ✅ CHUẨN BỊ FORMDATA (Dùng chung cho cả Add và Update)
      const formData = new FormData();
      // Backend yêu cầu @RequestPart("roomData") là chuỗi JSON
      formData.append("roomData", JSON.stringify(roomDataObj));
      
      // Append ảnh mới nếu có
      if (newImages.length > 0) {
          Array.from(newImages).forEach(file => formData.append("images", file));
      }

      // 3. Gọi Service
      if (!isEditMode) {
          // --- ADD ROOM ---
          await roomService.addRoom(formData);
      } else {
          // --- UPDATE ROOM ---
          // Bây giờ gửi formData thay vì object thường
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
           
           {/* 1. THÔNG TIN CƠ BẢN */}
           <section className="mb-6">
               <h4 className="text-blue-600 font-semibold mb-3 flex items-center gap-2"><BedDouble size={20}/> Thông tin phòng</h4>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <FloatingTextField 
                        label="Tên phòng (Số phòng)" 
                        placeholder=" " 
                        {...register("roomName")} 
                        error={errors.roomName?.message} 
                   />
                   
                   <div className="relative">
                       <select 
                         {...register("roomCategory")}
                         className="w-full px-4 py-3.5 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-blue-100 outline-none appearance-none pt-5 pb-2"
                       >
                           {ROOM_CATEGORIES.map(cat => (
                               <option key={cat.value} value={cat.value}>{cat.label}</option>
                           ))}
                       </select>
                       <label className="absolute left-4 top-1 text-xs text-gray-500 font-medium pointer-events-none">Loại phòng</label>
                   </div>

                   <div className="relative">
                        <FloatingTextField 
                            label="Giá mỗi đêm (VNĐ)" 
                            type="number" 
                            placeholder=" " 
                            {...register("pricePerNight")} 
                            error={errors.pricePerNight?.message} 
                        />
                        <DollarSign className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" size={18}/>
                   </div>

                   <div className="relative">
                        <FloatingTextField 
                            label="Sức chứa (Người)" 
                            type="number" 
                            placeholder=" " 
                            {...register("capacity")} 
                            error={errors.capacity?.message} 
                        />
                        <Users className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" size={18}/>
                   </div>
               </div>
               <div className="mt-4">
                    <TextArea label="Mô tả phòng" rows={3} {...register("description")} placeholder="Mô tả chi tiết về phòng..." />
               </div>
           </section>

           {/* 2. TIỆN NGHI (Đã cập nhật list) */}
           <section className="mb-6">
               <h4 className="text-blue-600 font-semibold mb-3 flex items-center gap-2"><Package size={20}/> Tiện nghi phòng</h4>
               <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                   {ROOM_AMENITIES.map(item => (
                       <AmenityOption key={item.id} id={item.id} label={item.label} icon={item.icon} register={register} />
                   ))}
               </div>
           </section>

           {/* 3. HÌNH ẢNH */}
           <section>
               <h4 className="text-blue-600 font-semibold mb-3 flex items-center gap-2"><ImageIcon size={20}/> Hình ảnh</h4>
               
               {/* Ảnh hiện có (chỉ hiện khi Edit) */}
               {isEditMode && currentImages.length > 0 && (
                   <div className="grid grid-cols-4 gap-3 mb-4">
                       {currentImages.map((img, index) => (
                           <div key={index} className="relative aspect-video rounded-lg overflow-hidden group">
                               <img src={getFullImageUrl(img.imageUrl)} className="w-full h-full object-cover" alt="Room" />
                               <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center">
                                   {/* Tạm thời ẩn nút xóa vì thiếu ID ảnh trong DTO */}
                                   {/* <Button type="button" size="sm" className="bg-white text-red-600 hover:bg-red-50 border-none" onClick={() => handleDeleteImage(index)}>
                                       <Trash2 size={16}/>
                                   </Button> */}
                               </div>
                           </div>
                       ))}
                   </div>
               )}

               <ImageUploadGrid 
                  multiple={true} 
                  value={newImages} 
                  onChange={setNewImages} 
                  placeholder="Tải lên ảnh phòng (Tối đa 5 ảnh)"
               />
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