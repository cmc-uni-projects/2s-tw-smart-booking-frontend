// src/pages/Owner/Properties/AddPropertySteps/Step6_Review.jsx
import React from "react";
import Card from "@/components/common/Card/Card";
import { Info, MapPin, Sparkles, BedDouble, Image, ClipboardList } from "lucide-react";
import ReviewImagePreview from "./components/ReviewImagePreview";

// (ReviewItem giữ nguyên)
const ReviewItem = ({ label, value }) => (
  <div className="py-2 border-b border-gray-100 last:border-b-0">
    <span className="text-sm font-medium text-gray-500">{label}</span>
    <p className="text-md text-gray-900">{value || "(Chưa nhập)"}</p>
  </div>
);

// ✅ SỬA LỖI: Đổi màu nền Header thành bg-gray-100
const ReviewHeader = ({ icon, title }) => (
  <h3 className="flex items-center gap-2 p-4 font-semibold text-gray-800 border-b border-gray-200 bg-gray-100 rounded-t-lg">
    {icon}
    {title}
  </h3>
);

// (ImageGrid giữ nguyên)
const ImageGrid = ({ fileList }) => {
  if (!fileList || fileList.length === 0) {
    return <p className="text-sm text-gray-500">(Không có ảnh)</p>;
  }
  const files = Array.from(fileList);
  
  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 mt-2">
      {files.map((file, index) => (
        <ReviewImagePreview key={index} file={file} />
      ))}
    </div>
  );
};

export default function Step6_Review({ watch, register, errors }) {
  const data = watch();

  const fullAddress = [data.address, data.city, data.province, data.country]
    .filter(Boolean)
    .join(", ");

  const amenities = data.amenities 
    ? Object.keys(data.amenities).filter(k => data.amenities[k]) 
    : [];
  
  const totalRooms = data.roomTypes?.reduce((acc, room) => acc + (parseInt(room.roomCount, 10) || 0), 0);
  const totalRoomTypes = data.roomTypes?.length || 0;

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-xl font-semibold text-gray-700">
        Kiểm tra và xác nhận thông tin
      </h2>
      <p className="text-gray-600">
        Vui lòng kiểm tra kỹ các thông tin bạn đã cung cấp trước khi gửi đơn.
      </p>

      {/* ✅ SỬA LỖI: Bỏ <Card> và thay bằng <div> với bg-gray-50 */}
      <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm bg-gray-50">
        <ReviewHeader icon={<MapPin size={18} className="text-[rgb(40,169,224)]" />} title="Vị trí & Loại hình" />
        <div className="p-4 space-y-2">
          <ReviewItem label="Loại hình cơ sở" value={data.propertyType} />
          <ReviewItem label="Địa chỉ đầy đủ" value={fullAddress} />
        </div>
      </div>

      {/* ✅ SỬA LỖI: Bỏ <Card> và thay bằng <div> với bg-gray-50 */}
      <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm bg-gray-50">
        <ReviewHeader icon={<Sparkles size={18} className="text-[rgb(40,169,224)]" />} title="Tiện nghi" />
        <div className="p-4">
          {amenities.length > 0 ? (
            <p className="text-gray-700">{amenities.join(", ")}</p>
          ) : (
            <p className="text-gray-500">(Không chọn tiện nghi nào)</p>
          )}
        </div>
      </div>

      {/* ✅ SỬA LỖI: Bỏ <Card> và thay bằng <div> với bg-gray-50 */}
      <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm bg-gray-50">
        <ReviewHeader icon={<BedDouble size={18} className="text-[rgb(40,169,224)]" />} title="Thông tin phòng" />
        <div className="p-4 space-y-2">
          <ReviewItem label="Tổng số loại phòng" value={totalRoomTypes} />
          <ReviewItem label="Tổng số phòng (tất cả loại)" value={totalRooms} />
          {data.roomTypes?.map((room, index) => (
            <ReviewItem 
              key={index} 
              label={`Loại phòng ${index+1}`} 
              value={`${room.name} (${room.roomCount} phòng, ${room.maxGuests} khách, ${room.price?.toLocaleString('vi-VN')} VNĐ)`} 
            />
          ))}
        </div>
      </div>

      {/* ✅ SỬA LỖI: Bỏ <Card> và thay bằng <div> với bg-gray-50 */}
      <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm bg-gray-50">
        <ReviewHeader icon={<ClipboardList size={18} className="text-[rgb(40,169,224)]" />} title="Chi tiết cơ sở" />
        <div className="p-4 space-y-2">
          <ReviewItem label="Tên cơ sở lưu trú" value={data.propertyName} />
          <ReviewItem label="Diện tích (m²)" value={data.area} />
          <ReviewItem label="Mô tả" value={data.description} />
        </div>
      </div>

      {/* ✅ SỬA LỖI: Bỏ <Card> và thay bằng <div> với bg-gray-50 */}
      <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm bg-gray-50">
        <ReviewHeader icon={<Image size={18} className="text-[rgb(40,169,224)]" />} title="Hình ảnh đã tải lên" />
        <div className="p-4 space-y-4">
          {/* Ảnh chung */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700">Ảnh chung cơ sở</h4>
            <ImageGrid fileList={data.propertyImages} />
          </div>
          
          {/* Ảnh từng phòng */}
          {data.roomTypes?.map((room, index) => (
            <div key={index} className="border-t border-gray-200 pt-4 mt-4">
              <h4 className="text-sm font-semibold text-gray-700">
                Ảnh phòng: "{room.name || `Loại phòng ${index+1}`}"
              </h4>
              <ImageGrid fileList={room.images} />
            </div>
          ))}
        </div>
      </div>
      
      {/* (Phần Checkbox và Thông báo giữ nguyên) */}
      <div className="flex items-start gap-3 pt-4">
        <input 
          type="checkbox" 
          id="terms"
          {...register("terms")}
          className="w-5 h-5 mt-1 accent-[rgb(40,169,224)] flex-shrink-0"
        />
        <label htmlFor="terms" className="text-sm text-gray-700">
          Bằng cách gửi đơn đăng ký này, tôi xác nhận rằng mọi thông tin cung cấp là
          chính xác và tôi đồng ý với các <a href="#" className="text-[rgb(40,169,224)] hover:underline">Điều khoản Dịch vụ</a> và 
          <a href="#" className="text-[rgb(40,169,224)] hover:underline"> Chính sách Đối tác</a> của TravelMate.
        </label>
      </div>
      {errors.terms && (
         <p className="text-xs text-red-500 -mt-4 ml-1 h-4">
            {errors.terms.message}
         </p>
      )}
      <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-4 text-sm text-blue-800 border border-blue-200">
        <Info size={20} className="flex-shrink-0" />
        <span>
          Bạn sắp hoàn tất! Nhấn "Gửi đơn đăng ký" để gửi thông tin đến TravelMate.
        </span>
      </div>
    </div>
  );
}