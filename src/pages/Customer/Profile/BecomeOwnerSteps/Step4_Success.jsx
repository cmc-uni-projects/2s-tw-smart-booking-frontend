import React from "react";
import { CheckCircle2, XCircle, RotateCcw } from "lucide-react"; 
import Button from "@/components/common/Button/Button";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Nhận props error và onRetry
export default function Step4_Success({ error, onRetry }) {
    const { t } = useTranslation("profile");
  return (
    <div className="flex flex-col items-center text-center py-8 animate-fadeIn">
      {error ? (
        // Giao diện khi THẤT BẠI
        <>
          <XCircle size={72} className="text-red-500 mb-6" />
          <h2 className="text-2xl font-bold text-red-600 mb-3">
            {t("owner.step4.failTitle")}
          </h2>
          <p className="text-gray-600 max-w-md mb-6">
            {t("owner.step4.failText")}
          </p>
          <p className="text-sm text-gray-500 bg-gray-100 p-2 rounded-md">
            {t("owner.step4.error", { error })}
          </p>
          <Button
            onClick={onRetry}
            leftIcon={<RotateCcw size={18} />}
            className="mt-8"
          >
            {t("retry")}
          </Button>
        </>
      ) : (
        // Giao diện khi THÀNH CÔNG
        <>
          <CheckCircle2 size={72} className="text-green-500 mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            {t("owner.step4.successTitle")}
          </h2>
          <p className="text-gray-600 max-w-md mb-8">
            {t("owner.step4.successText")}
          </p>
          <Link to="/">
            <Button>{t("owner.backHome")}</Button>
          </Link>
        </>
      )}
    </div>
  );
}