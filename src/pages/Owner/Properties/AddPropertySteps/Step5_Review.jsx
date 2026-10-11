import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Info, MapPin, Sparkles, Image, ClipboardList, 
  Home, Banknote, Users, ShieldCheck // Thêm icon ShieldCheck
} from "lucide-react";
import ReviewImagePreview from "./components/ReviewImagePreview";
import { useTranslation } from "react-i18next";

// --- SUB-COMPONENTS ---

const ReviewItem = ({ label, value, highlight = false }) => {
  const { t } = useTranslation();
  return (
  <div className="py-3 border-b border-gray-50 last:border-b-0 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
    <span className="text-sm font-medium text-gray-500">{label}</span>
    <p className={`text-sm font-medium text-right max-w-[70%] ${highlight ? 'text-[rgb(40,169,224)] font-bold' : 'text-gray-900'}`}>
      {value || t("owner:Step5_Review.notEntered")}
    </p>
  </div>
);
};

const ReviewHeader = ({ icon, title }) => (
  <div className="flex items-center gap-3 p-4 bg-gray-50/80 border-b border-gray-100">
    <div className="p-2 bg-white rounded-lg shadow-sm text-[rgb(40,169,224)]">
      {icon}
    </div>
    <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">{title}</h3>
  </div>
);

const ImageGrid = ({ fileList }) => {
  const { t } = useTranslation();
  if (!fileList || fileList.length === 0) {
    return (
      <div className="p-6 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
        <p className="text-sm text-gray-400 italic">{t("owner:Step5_Review.noPhotosUploadedYet")}</p>
      </div>
    );
  }
  const files = Array.from(fileList);
  return (
    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
      {files.map((file, index) => (
        <ReviewImagePreview key={index} file={file} />
      ))}
    </div>
  );
};

// --- MAIN COMPONENT ---

export default function Step5_Review({ watch, register, errors }) {
  const { t } = useTranslation();
  const data = watch();
  const policies = data.policies || {}; // Lấy dữ liệu policies
  
  // 1. Logic kiểm tra loại hình
  const isWholeUnit = ["VILLA", "HOMESTAY"].includes(data.propertyType);
  const unitData = data.unitData || {};

  // 2. Helper format tiền
  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);

  // 3. Logic hiển thị địa chỉ thông minh
  const getDisplayAddress = () => {
    let addr = data.address || "";
    const province = data.province || "";
    const city = data.city || "";
    const ward = data.ward || "";

    const addrLower = addr.toLowerCase();
    const provinceLower = province.toLowerCase().replace(t("owner:Step5_Review.city"), "").replace(t("owner:Step5_Review.province"), "").trim();
    
    if (provinceLower && addrLower.includes(provinceLower)) return addr;

    const parts = [];
    if (ward && !addrLower.includes(ward.toLowerCase())) parts.push(ward);
    if (city && !addrLower.includes(city.toLowerCase())) parts.push(city);
    parts.push(province);
    parts.push(data.country || t("owner:Step5_Review.vietnam"));

    const suffix = parts.filter(p => p && p.trim() !== "").join(", ");
    return suffix ? `${addr}, ${suffix}` : addr;
  };

  const displayAddress = getDisplayAddress();
  
  // Lọc danh sách tiện nghi chung của Property
  const amenities = data.amenities ? Object.keys(data.amenities).filter(k => data.amenities[k]) : [];

  return (
    <motion.div 
      className="space-y-8 animate-fadeIn max-w-5xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <div className="p-4 bg-[rgb(40,169,224)]/10 text-[rgb(40,169,224)] rounded-2xl">
          <ClipboardList size={32} strokeWidth={2} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{t("owner:Step5_Review.reviewYourInformation")}</h2>
          <p className="text-gray-500 text-sm mt-1">
            {t("owner:Step5_Review.pleaseReviewCarefullyBeforeSubmitting")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* COLUMN 1 */}
        <div className="space-y-6">
          
          {/* BLOCK 1: THÔNG TIN CƠ BẢN */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <ReviewHeader icon={<MapPin size={18} />} title={t("owner:Step5_Review.generalInformationLocation")} />
            <div className="p-5 space-y-1">
              <ReviewItem label={t("owner:Step5_Review.propertyName")} value={data.propertyName} highlight />
              <ReviewItem label={t("owner:Step5_Review.type")} value={data.propertyType} />
              <ReviewItem label={t("owner:Step5_Review.area")} value={data.area ? `${data.area} m²` : ""} />
              <ReviewItem label={t("owner:Step5_Review.address")} value={displayAddress} />
              <div className="pt-3 mt-2 border-t border-gray-50">
                <span className="text-xs font-bold text-gray-400 uppercase mb-1 block">{t("owner:Step5_Review.description")}</span>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg italic line-clamp-4">
                  {data.description || t("owner:Step5_Review.noDescriptionEntered")}
                </p>
              </div>
            </div>
          </div>

          {/* BLOCK 2: THÔNG TIN CĂN (CHỈ HIỆN KHI LÀ VILLA/HOMESTAY) */}
          {isWholeUnit && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-white border border-[rgb(40,169,224)]/30 rounded-2xl shadow-sm overflow-hidden ring-1 ring-[rgb(40,169,224)]/10"
            >
              <ReviewHeader icon={<Home size={18} />} title={t("owner:Step5_Review.rentalDetailsWholeUnit")} />
              <div className="p-5 space-y-1 bg-[rgb(40,169,224)]/5">
                <ReviewItem label={t("owner:Step5_Review.priceNight")} value={formatCurrency(unitData.price)} highlight />
                <ReviewItem label={t("owner:Step5_Review.standardCapacity")} value={t("owner:Step5_Review.guests", { value: unitData.capacity || 0 })} />
                
                {/* Mô tả chi tiết về căn */}
                <div className="pt-3 mt-2 border-t border-[rgb(40,169,224)]/10">
                   <span className="text-xs font-bold text-[rgb(40,169,224)] uppercase mb-1 block">{t("owner:Step5_Review.unitDescriptionBeds")}</span>
                   <p className="text-sm text-gray-700 bg-white p-3 rounded-lg italic border border-[rgb(40,169,224)]/10">
                      {unitData.description || t("owner:Step5_Review.noDescriptionEntered")}
                   </p>
                </div>
              </div>
            </motion.div>
          )}

        </div>

        {/* COLUMN 2 */}
        <div className="space-y-6">
          
          {/* ✅ BLOCK MỚI: CHÍNH SÁCH & QUY ĐỊNH */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <ReviewHeader icon={<ShieldCheck size={18} />} title={t("owner:Step5_Review.policiesRules")} />
            <div className="p-5 space-y-1">
               {/* Thời gian */}
               <ReviewItem label={t("owner:Step5_Review.checkIn")} value={t("owner:Step5_Review.fromTo", { value: policies.checkInTime || '14:00', value2: policies.checkInTo || '23:00' })} />
               <ReviewItem label={t("owner:Step5_Review.checkOut")} value={t("owner:Step5_Review.fromTo", { value: policies.checkOutFrom || '06:00', value2: policies.checkOutTime || '12:00' })} />
               
               {/* Hủy phòng */}
               <ReviewItem 
                  label={t("owner:Step5_Review.freeCancellation")} 
                  value={policies.allowFreeCancellation 
                          ? t("owner:Step5_Review.yesDaysBefore", { freeCancellationDays: policies.freeCancellationDays }) 
                          : t("owner:Step5_Review.notAllowed")} 
                  highlight={policies.allowFreeCancellation}
               />

               {/* Quy định khác */}
               <ReviewItem label={t("owner:Step5_Review.smoking")} value={policies.smokingAllowed ? t("owner:Step5_Review.allowed") : t("owner:Step5_Review.noSmoking")} />
               <ReviewItem label={t("owner:Step5_Review.pets")} value={policies.petsAllowed ? t("owner:Step5_Review.allowed") : t("owner:Step5_Review.notAllowed")} />
               <ReviewItem label={t("owner:Step5_Review.children")} value={policies.childrenAllowed ? t("owner:Step5_Review.suitable") : t("owner:Step5_Review.notSuitable")} />
            </div>
          </div>

          {/* BLOCK 3: TIỆN NGHI */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <ReviewHeader icon={<Sparkles size={18} />} title={t("owner:Step5_Review.amenitiesServices")} />
            <div className="p-5">
              {amenities.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {amenities.map((amenity) => (
                    <span key={amenity} className="px-3 py-1.5 bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg border border-gray-200">
                      {amenity} 
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm italic text-center py-2">{t("owner:Step5_Review.noAmenitiesSelected")}</p>
              )}
            </div>
          </div>

          {/* BLOCK 4: HÌNH ẢNH */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <ReviewHeader icon={<Image size={18} />} title={t("owner:Step5_Review.photos", { value: data.propertyImages?.length || 0 })} />
            <div className="p-5">
              <ImageGrid fileList={data.propertyImages} />
            </div>
          </div>

        </div>
      </div>

      {/* Điều khoản */}
      <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex gap-4 items-start">
        <input
          type="checkbox"
          id="terms"
          {...register("terms")}
          className="w-5 h-5 mt-0.5 accent-[rgb(40,169,224)] cursor-pointer shrink-0"
        />
        <div>
          <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer select-none leading-relaxed">
            {t("owner:Step5_Review.iConfirmThatTheInformation")}{" "}
            <Link to="/owner/terms-of-service" target="_blank" className="text-[rgb(40,169,224)] font-bold hover:underline">
              {t("owner:Step5_Review.termsOfService")}
            </Link>{" "}
            {t("owner:Step5_Review.and")}{" "}
            <Link to="/owner/partner-policy" target="_blank" className="text-[rgb(40,169,224)] font-bold hover:underline">
              {t("owner:Step5_Review.partnerPolicy")}
            </Link>{" "}
            {t("owner:Step5_Review.text")}
          </label>
          {errors.terms && (
            <p className="text-xs text-red-500 mt-2 font-bold flex items-center gap-1 animate-pulse">
              <Info size={14}/> {errors.terms.message}
            </p>
          )}
        </div>
      </div>

      <div className="text-center text-xs text-gray-400 pb-4">
        {t("owner:Step5_Review.applicationsAreReviewedWithin24")}
      </div>
    </motion.div>
  );
}