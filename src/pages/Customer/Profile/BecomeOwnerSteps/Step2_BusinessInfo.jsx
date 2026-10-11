import React from "react";
import TextField from "@/components/common/Input/TextField";
import FileUpload from "@/components/common/Input/FileUpload";
import { Award } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Step2_BusinessInfo({
                                               errors,
                                               watch,
                                               setValue,
                                           }) {
    const { t } = useTranslation("profile");
    const err = (e) => (e?.message ? t(e.message) : undefined);
    return (
        <div className="space-y-6 animate-fadeIn">
            <h2 className="text-xl font-semibold text-gray-700">
                {t("owner.step2.title")}
            </h2>

            {/* Mã số đăng ký kinh doanh */}
            <TextField
                label={t("owner.fields.licenseNumber")}
                icon={<Award size={18} />}
                value={watch("businessLicenseNumber")}
                name="businessLicenseNumber"
                onChange={(e) =>
                    setValue("businessLicenseNumber", e.target.value, {
                        shouldValidate: true,
                        shouldDirty: true,
                    })
                }
                error={err(errors.businessLicenseNumber)}
            />

            {/* Upload file kinh doanh */}
            <FileUpload
                label={t("owner.fields.licenseUpload")}
                name="businessLicenseImage"       // ✅ SỬA TÊN FIELD CHUẨN THEO BE
                watch={watch}
                setValue={setValue}
                error={err(errors.businessLicenseImage)}
            />

            <p className="text-xs text-gray-500">
                {t("owner.step2.formats")}
            </p>
        </div>
    );
}
