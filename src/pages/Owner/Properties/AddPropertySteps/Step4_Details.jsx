import React from "react";
import { motion } from "framer-motion";
import { FileText, Type, Maximize, Sparkles } from "lucide-react";
import TextArea from "@/components/common/Input/TextArea";
import TextField from "@/components/common/Input/TextField";

const Step4_Details = ({ register, errors }) => {
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

      {/* 2. Info Banner (Mẹo viết mô tả) */}
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
        
        {/* Tên chỗ nghỉ */}
        <div>
          <TextField
            label="Tên chỗ nghỉ của bạn"
            placeholder="Ví dụ: Villa Hạnh Phúc - View Biển Đà Nẵng"
            required
            icon={<Type size={18} />}
            {...register("propertyName")}
            error={errors.propertyName?.message}
          />
          <p className="text-xs text-gray-400 mt-1 ml-1">
            Tên này sẽ hiển thị nổi bật nhất trên trang tìm kiếm.
          </p>
        </div>

        {/* Diện tích (Đã thay input thường bằng TextField chuẩn) */}
        <div>
          <TextField
            label="Diện tích tổng thể (m²)"
            type="number"
            placeholder="VD: 120"
            required
            icon={<Maximize size={18} />}
            // Truyền valueAsNumber vào register để react-hook-form tự ép kiểu số
            {...register("area", { valueAsNumber: true })}
            error={errors.area?.message}
          />
        </div>

        {/* Mô tả chi tiết */}
        <div>
          <TextArea
            label="Mô tả chi tiết"
            placeholder="Mô tả những điểm nổi bật, không gian, tiện ích xung quanh, khoảng cách đến trung tâm..."
            rows={8}
            required
            {...register("description")}
            error={errors.description?.message}
          />
          <div className="flex justify-between items-center mt-1 ml-1">
             <p className="text-xs text-gray-400">
               Tối thiểu 50 ký tự để đảm bảo chất lượng nội dung.
             </p>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default Step4_Details;