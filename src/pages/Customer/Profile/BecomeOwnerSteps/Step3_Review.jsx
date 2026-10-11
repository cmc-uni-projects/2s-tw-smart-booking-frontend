// ✅ SỬA 1: Import useState và useEffect
import React, { useState, useEffect } from 'react';
import Card from '@/components/common/Card/Card';
import Divider from '@/components/common/Divider/Divider';
import { format } from 'date-fns';
import { useTranslation } from "react-i18next";

// ===============================
// Component hiển thị ảnh preview
// ===============================
const ImagePreview = ({ fileList, title }) => {
    const { t } = useTranslation("profile");
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        const file = fileList && fileList[0] ? fileList[0] : null;

        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);

            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [fileList]);

    if (!preview) {
        return (
            <div className="text-gray-500 italic">
                {t("owner.step3.notUploaded", { title })}
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-600">{title}</h4>
            <img
                src={preview}
                alt={title}
                className="rounded-lg border border-gray-200 w-full max-w-xs"
            />
        </div>
    );
};

const Step3_Review = ({ watch }) => {
    const { t } = useTranslation("profile");
    const data = watch();

    // Format ngày sinh
    const dobFormatted = data.personalDob
        ? format(new Date(data.personalDob), 'dd/MM/yyyy')
        : t("owner.step3.notProvided");

    return (
        <div className="space-y-8">
            <h2 className="text-xl font-semibold text-gray-800">
                {t("owner.step3.title")}
            </h2>

            {/* Thông tin cá nhân */}
            <Card>
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                        {t("owner.steps.personal")}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                        <InfoItem label={t("owner.fields.fullName")} value={data.personalFullName} />
                        <InfoItem label="Email" value={data.personalEmail} />
                        <InfoItem label={t("owner.fields.phone")} value={data.personalPhone} />
                        <InfoItem label={t("owner.fields.idCard")} value={data.personalIdCard} />
                        <InfoItem label={t("owner.fields.dob")} value={dobFormatted} />
                        <InfoItem label={t("owner.fields.hometown")} value={data.personalHometown} />
                        <InfoItem
                            label={t("owner.fields.address")}
                            value={data.personalAddress}
                            className="md:col-span-2"
                        />
                    </div>
                </div>
            </Card>

            {/* Thông tin kinh doanh */}
            <Card>
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                        {t("owner.step3.business")}
                    </h3>
                    <InfoItem
                        label={t("owner.step3.licenseShort")}
                        value={data.businessLicenseNumber}
                    />
                </div>
            </Card>

            {/* =============================== */}
            {/* Ảnh upload — SỬA ĐÚNG FIELD NAME */}
            {/* =============================== */}
            <Card>
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                        {t("owner.step3.documents")}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <ImagePreview
                            fileList={data.cardFrontImage}  // 🔥 ĐÚNG FIELD Step1
                            title={t("owner.fields.cardFront")}
                        />

                        <ImagePreview
                            fileList={data.cardBackImage}   // 🔥 ĐÚNG FIELD Step1
                            title={t("owner.fields.cardBack")}
                        />

                        <ImagePreview
                            fileList={data.businessLicenseImage} // 🔥 ĐÚNG FIELD Step1
                            title={t("owner.step3.license")}
                        />
                    </div>
                </div>
            </Card>

            <p className="text-sm text-gray-600 italic mt-6">
                {t("owner.step3.agree")}
            </p>
        </div>
    );
};

// ===============================
const InfoItem = ({ label, value, className = "" }) => (
    <div className={`break-words ${className}`}>
        <span className="block text-xs font-medium text-gray-500">{label}</span>
        <span className="block text-gray-800 font-medium">
      {value || 'N/A'}
    </span>
    </div>
);

export default Step3_Review;