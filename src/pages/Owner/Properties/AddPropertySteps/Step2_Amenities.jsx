import React from "react";
import { motion } from "framer-motion";
import { 
  Wifi, ParkingCircle, Droplet, Waves, Sparkles, Ban, 
  Plane, PawPrint, Dumbbell, Wind, ConciergeBell, Cigarette, 
  Sparkle // Icon trang trí cho header
} from "lucide-react";

// Import component con
import AmenityOption from "./components/AmenityOption";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

const AMENITIES_LIST = [
  { id: "pool", get label() { return i18n.t("owner:Step2_Amenities.swimmingPool"); }, icon: <Waves size={24} /> },
  { id: "parking", get label() { return i18n.t("owner:Step2_Amenities.parking"); }, icon: <ParkingCircle size={24} /> },
  { id: "sauna", get label() { return i18n.t("owner:Step2_Amenities.sauna"); }, icon: <Droplet size={24} /> },
  { id: "spa", label: "Spa & Massage", icon: <Sparkles size={24} /> },
  { id: "non_smoking", get label() { return i18n.t("owner:Step2_Amenities.nonSmoking"); }, icon: <Ban size={24} /> },
  { id: "wifi", get label() { return i18n.t("owner:Step2_Amenities.freeWiFi"); }, icon: <Wifi size={24} /> },
  { id: "airport_transfer", get label() { return i18n.t("owner:Step2_Amenities.airportTransfer"); }, icon: <Plane size={24} /> },
  { id: "pets", get label() { return i18n.t("owner:Step2_Amenities.petsAllowed"); }, icon: <PawPrint size={24} /> },
  { id: "gym", get label() { return i18n.t("owner:Step2_Amenities.gym"); }, icon: <Dumbbell size={24} /> },
  { id: "smoking_area", get label() { return i18n.t("owner:Step2_Amenities.smokingArea"); }, icon: <Cigarette size={24} /> },
  { id: "reception_24h", get label() { return i18n.t("owner:Step2_Amenities.n247Reception"); }, icon: <ConciergeBell size={24} /> },
  { id: "ac", get label() { return i18n.t("owner:Step2_Amenities.airConditioning"); }, icon: <Wind size={24} /> },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function Step2_Amenities({ register, watch }) {
  const { t } = useTranslation();
  // Theo dõi toàn bộ object amenities để biết cái nào đang được chọn (true)
  const selectedAmenities = watch("amenities") || {};

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
          <Sparkle size={32} strokeWidth={2} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{t("owner:Step2_Amenities.amenitiesServices")}</h2>
          <p className="text-gray-500 text-sm mt-1">
            {t("owner:Step2_Amenities.chooseYourMostOutstandingAmenities")}
          </p>
        </div>
      </div>

      {/* 2. Grid Tiện nghi */}
      <motion.div 
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {AMENITIES_LIST.map((item) => (
          <motion.div key={item.id} variants={itemVariants}>
            <AmenityOption
              id={item.id}
              label={item.label}
              icon={item.icon}
              register={register}
              // Kiểm tra xem checkbox này có đang được chọn không
              isSelected={!!selectedAmenities[item.id]} 
            />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}