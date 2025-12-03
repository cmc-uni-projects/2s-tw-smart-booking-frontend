// src/pages/Owner/Properties/AddPropertySteps/Step4_Details.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Type, Maximize, Sparkles, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import TextArea from "@/components/common/Input/TextArea";
import TextField from "@/components/common/Input/TextField";
import propertyService from "@/services/property.service";

const Step4_Details = ({ register, errors, watch, setError, clearErrors }) => {
  // Lấy giá trị tên đang nhập theo thời gian thực
  const propertyNameValue = watch("propertyName");
  
  // State quản lý trạng thái kiểm tra
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState(null); // null: chưa check, true: ok, false: trùng

  // Effect xử lý Debounce check tên
  useEffect(() => {
    // 1. Nếu tên rỗng, reset trạng thái và thoát
    if (!propertyNameValue || propertyNameValue.trim() === "") {
      setIsAvailable(null);
      setIsChecking(false);
      return;
    }

    // 2. Set trạng thái đang check
    setIsChecking(true);
    setIsAvailable(null);
    // Lưu ý: Không clearErrors("propertyName") ở đây để tránh nhấp nháy lỗi nếu đang gõ

    // 3. Tạo timer delay 600ms (Debounce)
    const timer = setTimeout(async () => {
      try {
        await propertyService.checkNameAvailability(propertyNameValue);
        // Nếu API trả về 200 OK -> Tên hợp lệ
        setIsAvailable(true);
        // Nếu trước đó có lỗi trùng tên thì xóa đi
        if (errors.propertyName?.type === "manual") {
            clearErrors("propertyName");
        }
      } catch (error) {
        // Nếu API trả về lỗi (409 Conflict) -> Tên trùng
        setIsAvailable(false);
        setError("propertyName", {
          type: "manual",
          message: "Tên chỗ nghỉ này đã được sử dụng. Vui lòng chọn tên khác."
        });
      } finally {
        setIsChecking(false);
      }
    }, 600);

    // 4. Cleanup function: Hủy timer nếu người dùng gõ tiếp trước khi hết 600ms
    return () => clearTimeout(timer);

  }, [propertyNameValue, setError, clearErrors, errors.propertyName?.type]);

  return (
    <motion.div
      className="max-w-5xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* 1. Header Section */}
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-[rgb(40,169,224)]/10 text-[rgb(40,169,224)] rounded-2xl">
          <FileText size={32} strokeWidth={2} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Thông tin chi tiết</h2>
          <p className="text-gray-500 text-sm mt-1">
            Hãy đặt một cái tên ấn tượng và mô tả thật hấp dẫn về chỗ nghỉ của bạn.
          </p>
        </div>
      </div>

      {/* 2. Info Banner */}
      <div className="bg-blue-50 border-l-4 border-[rgb(40,169,224)] p-5 rounded-r-xl mb-8 flex gap-4 items-start">
        <div className="bg-white p-2 rounded-full shadow-sm shrink-0">
            <Sparkles size={18} className="text-[rgb(40,169,224)]" />
        </div>
        <div className="text-sm text-gray-700 leading-relaxed">
          <h4 className="font-bold text-gray-900 mb-1">Mẹo nhỏ:</h4>
          <p>
            Một mô tả chi tiết (trên 100 ký tự) nêu bật được không gian, view và tiện ích độc đáo thường giúp tăng 
            <strong> 30% tỷ lệ đặt phòng</strong>. Hãy kể câu chuyện về ngôi nhà của bạn!
          </p>
        </div>
      </div>

      {/* 3. Main Form Card */}
      <div className="bg-white p-8 rounded-3xl shadow-lg shadow-gray-100 border border-gray-200 space-y-6">
        
        {/* --- Tên chỗ nghỉ (Có Auto Check) --- */}
        <div>
          <div className="relative">
            <TextField
              label="Tên chỗ nghỉ của bạn"
              placeholder="Ví dụ: Villa Hạnh Phúc - View Biển Đà Nẵng"
              required
              icon={<Type size={18} />}
              {...register("propertyName")}
              // ✅ Component tự hiển thị lỗi, không cần render thủ công nữa
              error={errors.propertyName?.message} 
            />
            
            {/* Icon trạng thái Check ở bên phải Input */}
            <div className="absolute right-4 top-[42px]">
              {isChecking && (
                <Loader2 size={20} className="animate-spin text-blue-500" />
              )}
              {!isChecking && isAvailable === true && !errors.propertyName && (
                <div className="flex items-center gap-1 text-green-500 bg-green-50 px-2 py-1 rounded-md text-xs font-medium animate-in fade-in zoom-in">
                  <CheckCircle size={14} /> Hợp lệ
                </div>
              )}
              {!isChecking && isAvailable === false && (
                <AlertCircle size={20} className="text-red-500 animate-in fade-in zoom-in" />
              )}
            </div>
          </div>

            {/* ✅ Đã xóa đoạn code <p> hiển thị lỗi thủ công ở đây để tránh trùng lặp */}

          {!errors.propertyName && !isChecking && (
             <p className="text-xs text-gray-400 mt-1 ml-1">
               Tên này sẽ hiển thị nổi bật nhất trên trang tìm kiếm.
             </p>
          )}
        </div>

        {/* --- Diện tích --- */}
        <div>
          <TextField
            label="Diện tích tổng thể (m²)"
            type="number"
            placeholder="VD: 120"
            required
            icon={<Maximize size={18} />}
            {...register("area")}
            // ✅ Component tự hiển thị lỗi
            error={errors.area?.message}
          />
        </div>

        {/* --- Mô tả chi tiết --- */}
        <div>
          <TextArea
            label="Mô tả chi tiết"
            placeholder="Mô tả những điểm nổi bật, không gian, tiện ích xung quanh, khoảng cách đến trung tâm..."
            rows={8}
            required
            {...register("description")}
            // ✅ Component tự hiển thị lỗi
            error={errors.description?.message}
          />
          <div className="flex justify-between items-center mt-1 ml-1">
             {/* Chỉ hiện gợi ý khi không có lỗi */}
             {!errors.description && (
                <p className="text-xs text-gray-400">
                  Tối thiểu 50 ký tự để đảm bảo chất lượng nội dung.
                </p>
             )}
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default Step4_Details;