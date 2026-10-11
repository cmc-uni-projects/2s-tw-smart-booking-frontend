// src/components/common/Loading/LoadingOverlay.jsx
import React from "react";
import Spinner from "./Spinner";
import { useTranslation } from "react-i18next";

export default function LoadingOverlay({ message }) {
  const { t } = useTranslation();
  if (message === undefined) message = t("loadingData");
  return (
    <div className="fixed inset-0 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center z-[9999]">
      <Spinner size={64} />
      <p className="text-gray-600 mt-3">{message}</p>
    </div>
  );
}
