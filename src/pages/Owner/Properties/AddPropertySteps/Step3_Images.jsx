import React from "react";
import { motion } from "framer-motion";
import { Images, Info, UploadCloud, Sparkles } from "lucide-react";
import ImageUploadGrid from "@/components/common/Input/ImageUploadGrid";
import { useTranslation } from "react-i18next";

export default function Step3_Images({ errors, watch, setValue }) {
  const { t } = useTranslation();
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
          <Images size={32} strokeWidth={2} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{t("owner:Step3_Images.photoGallery")}</h2>
          <p className="text-gray-500 text-sm mt-1">
            {t("owner:Step3_Images.greatPhotosAreTheKey")}
          </p>
        </div>
      </div>

      {/* 2. Info Banner (Mẹo đăng ảnh) */}
      <div className="bg-blue-50 border-l-4 border-[rgb(40,169,224)] p-5 rounded-r-xl mb-8 flex gap-4 items-start">
        <div className="bg-white p-2 rounded-full shadow-sm shrink-0">
            <Sparkles size={18} className="text-[rgb(40,169,224)]" />
        </div>
        <div className="text-sm text-gray-700 leading-relaxed">
          <h4 className="font-bold text-gray-900 mb-1">{t("owner:Step3_Images.tipsForQualityPhotos")}</h4>
          <ul className="list-disc list-inside space-y-1 text-gray-600 marker:text-[rgb(40,169,224)]">
             <li>{t("owner:Step3_Images.uploadAtLeast")} <strong>{t("owner:Step3_Images.n3Photos")}</strong> {t("owner:Step3_Images.toShowTheWholeSpace")}</li>
             <li>{t("owner:Step3_Images.theFirstPhotoYouChoose")} <strong>{t("owner:Step3_Images.coverPhotoThumbnail")}</strong> {t("owner:Step3_Images.inSearchResults")}</li>
             <li>{t("owner:Step3_Images.landscapePhotosWithNaturalLight")} <strong>JPG/PNG/WEBP</strong>.</li>
          </ul>
        </div>
      </div>

      {/* 3. Upload Area */}
      <div className="bg-white p-8 rounded-3xl shadow-lg shadow-gray-100 border border-gray-200">
         <div className="mb-6 flex items-center justify-between pb-4 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
               <UploadCloud size={20} className="text-[rgb(40,169,224)]"/>
               {t("owner:Step3_Images.uploadPhotos")}
            </h3>
            <span className="text-xs font-bold px-3 py-1 bg-gray-100 rounded-full text-gray-500">
               {t("owner:Step3_Images.required")}
            </span>
         </div>

         <div className="min-h-[300px]">
            <ImageUploadGrid
              multiple={true}
              accept="image/png, image/jpeg, image/webp"
              value={watch("propertyImages")}
              onChange={(files) => setValue("propertyImages", files, { shouldValidate: true })}
              error={errors.propertyImages?.message}
            />
         </div>
      </div>
    </motion.div>
  );
}