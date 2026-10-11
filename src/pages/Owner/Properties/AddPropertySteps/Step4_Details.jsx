// src/pages/Owner/Properties/AddPropertySteps/Step4_Details.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Type, Maximize, Sparkles, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import TextArea from "@/components/common/Input/TextArea";
import TextField from "@/components/common/Input/TextField";
import propertyService from "@/services/property.service";
import { useTranslation } from "react-i18next";

const Step4_Details = ({ register, errors, watch, setError, clearErrors }) => {
  const { t } = useTranslation();
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
    clearErrors("propertyName"); // Xóa lỗi cũ (nếu có) để hiện loading

    // 3. Tạo timer delay 600ms (Debounce)
    const timer = setTimeout(async () => {
      try {
        await propertyService.checkNameAvailability(propertyNameValue);
        // Nếu API trả về 200 OK -> Tên hợp lệ
        setIsAvailable(true);
      } catch (error) {
        setIsAvailable(false);
        
        // ✅ FIX QUAN TRỌNG: Chỉ báo lỗi "Trùng tên" nếu status code là 409
        if (error.response && error.response.status === 409) {
            const serverMessage = error.response.data?.message || t("owner:Step4_Details.thisPropertyNameIsAlready");
            setError("propertyName", {
              type: "manual",
              message: serverMessage
            });
        } else {
            // Nếu lỗi khác (500, 404, Network Error...), log ra console để debug chứ không báo trùng
            console.error("Name check failed (Check Name API):", error);
        }
      } finally {
        setIsChecking(false);
      }
    }, 600);

    // 4. Cleanup function: Hủy timer nếu người dùng gõ tiếp trước khi hết 600ms
    return () => clearTimeout(timer);

    // ✅ FIX QUAN TRỌNG: Bỏ 'errors' ra khỏi dependency để tránh vòng lặp vô hạn
  }, [propertyNameValue, setError, clearErrors]);

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
          <h2 className="text-2xl font-bold text-gray-800">{t("owner:Step4_Details.details")}</h2>
          <p className="text-gray-500 text-sm mt-1">
            {t("owner:Step4_Details.giveYourPropertyAMemorable")}
          </p>
        </div>
      </div>

      {/* 2. Info Banner */}
      <div className="bg-blue-50 border-l-4 border-[rgb(40,169,224)] p-5 rounded-r-xl mb-8 flex gap-4 items-start">
        <div className="bg-white p-2 rounded-full shadow-sm shrink-0">
            <Sparkles size={18} className="text-[rgb(40,169,224)]" />
        </div>
        <div className="text-sm text-gray-700 leading-relaxed">
          <h4 className="font-bold text-gray-900 mb-1">{t("owner:Step4_Details.tip")}</h4>
          <p>
            {t("owner:Step4_Details.aDetailedDescriptionOver100")} 
            <strong> {t("owner:Step4_Details.bookingsBy30")}</strong>{t("owner:Step4_Details.tellTheStoryOfYour")}
          </p>
        </div>
      </div>

      {/* 3. Main Form Card */}
      <div className="bg-white p-8 rounded-3xl shadow-lg shadow-gray-100 border border-gray-200 space-y-6">
        
        {/* --- Tên chỗ nghỉ (Có Auto Check) --- */}
        <div>
          <div className="relative">
            <TextField
              label={t("owner:Step4_Details.yourPropertyName")}
              placeholder={t("owner:Step4_Details.exampleHappyVillaDaNang")}
              required
              icon={<Type size={18} />}
              {...register("propertyName")}
              // ✅ Component tự hiển thị lỗi
              error={errors.propertyName?.message} 
            />
            
            {/* Icon trạng thái Check ở bên phải Input */}
            <div className="absolute right-4 top-[42px]">
              {isChecking && (
                <Loader2 size={20} className="animate-spin text-blue-500" />
              )}
              {/* Chỉ hiện tích xanh nếu không check, có kết quả available và KHÔNG có lỗi form */}
              {!isChecking && isAvailable === true && !errors.propertyName && (
                <div className="flex items-center gap-1 text-green-500 bg-green-50 px-2 py-1 rounded-md text-xs font-medium animate-in fade-in zoom-in">
                  <CheckCircle size={14} /> {t("owner:Step4_Details.valid")}
                </div>
              )}
              {/* Hiện icon đỏ nếu server báo trùng (isAvailable = false) */}
              {!isChecking && isAvailable === false && (
                <AlertCircle size={20} className="text-red-500 animate-in fade-in zoom-in" />
              )}
            </div>
          </div>

          {!errors.propertyName && !isChecking && (
             <p className="text-xs text-gray-400 mt-1 ml-1">
               {t("owner:Step4_Details.thisNameIsShownMost")}
             </p>
          )}
        </div>

        {/* --- Diện tích --- */}
        <div>
          <TextField
            label={t("owner:Step4_Details.totalAreaM")}
            type="number"
            placeholder="VD: 120"
            required
            icon={<Maximize size={18} />}
            {...register("area")}
            error={errors.area?.message}
          />
        </div>

        {/* --- Mô tả chi tiết --- */}
        <div>
          <TextArea
            label={t("owner:Step4_Details.detailedDescription")}
            placeholder={t("owner:Step4_Details.describeTheHighlightsTheSpace")}
            rows={8}
            required
            {...register("description")}
            error={errors.description?.message}
          />
          <div className="flex justify-between items-center mt-1 ml-1">
             {!errors.description && (
                <p className="text-xs text-gray-400">
                  {t("owner:Step4_Details.atLeast50CharactersTo")}
                </p>
             )}
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default Step4_Details;