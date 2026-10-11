import React from "react";
import { motion } from "framer-motion";
import { Building2, Home, Palmtree, Castle, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

const PROPERTY_TYPES = [
  {
    value: "HOTEL",
    get label() { return i18n.t("owner:Step0_PropertyType.hotel"); },
    subLabel: "(Hotel)",
    get description() { return i18n.t("owner:Step0_PropertyType.professionalAccommodationWithDailyHousekeeping"); },
    icon: <Building2 size={32} />,
  },
  {
    value: "HOMESTAY",
    label: "Homestay",
    get subLabel() { return i18n.t("owner:Step0_PropertyType.localHome"); },
    get description() { return i18n.t("owner:Step0_PropertyType.experienceLocalCultureInA"); },
    icon: <Home size={32} />,
  },
  {
    value: "VILLA",
    get label() { return i18n.t("owner:Step0_PropertyType.villa"); },
    subLabel: "(Villa)",
    get description() { return i18n.t("owner:Step0_PropertyType.aLuxuriousPrivateSpaceWith"); },
    icon: <Castle size={32} />,
  },
  {
    value: "RESORT",
    get label() { return i18n.t("owner:Step0_PropertyType.resort"); },
    subLabel: "(Resort)",
    get description() { return i18n.t("owner:Step0_PropertyType.aHighEndResortComplex"); },
    icon: <Palmtree size={32} />,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const Step0_PropertyType = ({ watch, setValue }) => {
  const { t } = useTranslation();
  // 1. Lấy giá trị từ form
  const currentValue = watch("propertyType");

  // 2. Hàm xử lý chọn
  const handleSelect = (typeValue) => {
    setValue("propertyType", typeValue, { 
      shouldValidate: true, 
      shouldDirty: true 
    });
  };

  // Màu chủ đạo
  const PRIMARY_COLOR = "rgb(40, 169, 224)";

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">{t("owner:Step0_PropertyType.whichTypeOfPropertyDo")}</h2>
        <p className="text-gray-500 mt-1">{t("owner:Step0_PropertyType.chooseTheModelThatBest")}</p>
      </div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {PROPERTY_TYPES.map((type) => {
          const isSelected = currentValue === type.value;
          
          return (
            <motion.button
              key={type.value}
              type="button"
              variants={itemVariants}
              whileHover={{ scale: 1.02, translateY: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(type.value)}
              className={`relative flex items-start p-6 rounded-2xl border-2 text-left transition-all duration-300 h-full w-full group
                ${isSelected 
                  ? "border-[rgb(40,169,224)] bg-[rgb(40,169,224)]/5 shadow-lg shadow-[rgb(40,169,224)]/20" 
                  : "border-gray-100 bg-white hover:border-[rgb(40,169,224)]/50 hover:shadow-md"
                }
              `}
            >
              {/* Icon Container */}
              <div className={`p-4 rounded-2xl mr-5 shrink-0 transition-colors duration-300
                ${isSelected 
                    ? "bg-[rgb(40,169,224)] text-white" 
                    : "bg-gray-100 text-gray-500 group-hover:bg-[rgb(40,169,224)]/10 group-hover:text-[rgb(40,169,224)]"
                }
              `}>
                {type.icon}
              </div>

              {/* Content */}
              <div className="flex-1 pr-6">
                <div className="flex items-center justify-between">
                  <h3 className={`font-bold text-lg transition-colors ${isSelected ? "text-[rgb(40,169,224)]" : "text-gray-800"}`}>
                    {type.label} <span className="text-sm font-normal opacity-70 ml-1 text-gray-500">{type.subLabel}</span>
                  </h3>
                </div>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                  {type.description}
                </p>
              </div>

              {/* Checkmark Badge */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 right-4 z-10"
                >
                  {/* Dùng div với màu custom và icon trắng */}
                  <div className="bg-[rgb(40,169,224)] text-white rounded-full p-1.5 shadow-md ring-2 ring-white">
                    <Check size={18} strokeWidth={3} />
                  </div>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
};

export default Step0_PropertyType;