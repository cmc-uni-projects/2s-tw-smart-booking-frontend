import React from "react";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const MapLoadingOverlay = ({ isLoading }) => {
  const { t } = useTranslation("search");
  if (!isLoading) return null;

  return (
    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center pointer-events-none">
      <div className="bg-white p-4 rounded-2xl shadow-2xl flex flex-col items-center">
        <Loader2 className="animate-spin text-blue-600 mb-2" size={32} />
        <span className="text-sm font-bold text-gray-700">{t("map.loading")}</span>
      </div>
    </div>
  );
};

export default MapLoadingOverlay;