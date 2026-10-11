// src/pages/Owner/Properties/AddPropertySteps/Step7_Status.jsx
import React from "react";
import { CheckCircle2, XCircle, RotateCcw } from "lucide-react"; 
import Button from "@/components/common/Button/Button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Nhận props error (lỗi) và onRetry (hàm thử lại)
export default function Step7_Status({ error, onRetry }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center text-center py-8 animate-fadeIn">
      {error ? (
        // Giao diện khi THẤT BẠI
        <>
          <XCircle size={72} className="text-red-500 mb-6" />
          <h2 className="text-2xl font-bold text-red-600 mb-3">
            {t("owner:Step6_Status.submissionFailed")}
          </h2>
          <p className="text-gray-600 max-w-md mb-6">
            {t("owner:Step6_Status.somethingWentWrongWhileSubmitting")}
          </p>
          <p className="text-sm text-gray-500 bg-gray-100 p-2 rounded-md">
            {t("owner:Step6_Status.error", { error })}
          </p>
          <Button
            onClick={onRetry} // Quay lại bước 6 (Review)
            leftIcon={<RotateCcw size={18} />}
            className="mt-8"
          >
            {t("owner:Step6_Status.tryAgain")}
          </Button>
        </>
      ) : (
        // Giao diện khi THÀNH CÔNG
        <>
          <CheckCircle2 size={72} className="text-green-500 mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            {t("owner:Step6_Status.applicationSubmittedSuccessfully")}
          </h2>
          <p className="text-gray-600 max-w-md mb-8">
            {t("owner:Step6_Status.thankYouForRegisteringYour")}
          </p>
          <Button onClick={() => navigate("/owner/properties")}>
            {t("owner:Step6_Status.backToManagement")}
          </Button>
        </>
      )}
    </div>
  );
}