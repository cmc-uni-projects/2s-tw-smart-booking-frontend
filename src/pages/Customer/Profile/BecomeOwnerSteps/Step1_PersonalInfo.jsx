import React from 'react';
import StyledTextField from '@/components/common/Input/StyledTextField';
import DatePickerInput from '@/components/common/Input/DatePickerInput';
import FileUpload from '@/components/common/Input/FileUpload';
import { User, Mail, Phone, Hash, Home, MapPin } from 'lucide-react';
import { useTranslation } from "react-i18next";

const Step1_PersonalInfo = ({
                                register,
                                errors,
                                watch,
                                setValue,
                                profileData,
                                isDataLoading
                            }) => {
    const { t } = useTranslation("profile");
    const err = (e) => (e?.message ? t(e.message) : undefined);

    const isFullNameDisabled = isDataLoading || !!profileData?.fullName;
    const isEmailDisabled = isDataLoading || !!profileData?.email;
    const isPhoneDisabled = isDataLoading || !!profileData?.phoneNumber;
    const isDobDisabled = isDataLoading || !!profileData?.birthDate;

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">{t("owner.step1.title")}</h2>

            <StyledTextField
                label={t("owner.fields.fullName")}
                icon={<User size={16} />}
                {...register("personalFullName")}
                error={err(errors.personalFullName)}
                disabled={isFullNameDisabled}
            />

            <StyledTextField
                label={t("owner.fields.email")}
                icon={<Mail size={16} />}
                {...register("personalEmail")}
                error={err(errors.personalEmail)}
                disabled={isEmailDisabled}
            />

            <StyledTextField
                label={t("owner.fields.phone")}
                icon={<Phone size={16} />}
                {...register("personalPhone")}
                error={err(errors.personalPhone)}
                disabled={isPhoneDisabled}
            />

            <StyledTextField
                label={t("owner.fields.idCard")}
                icon={<Hash size={16} />}
                {...register("personalIdCard")}
                error={err(errors.personalIdCard)}
                disabled={isDataLoading}
            />

            <DatePickerInput
                label={t("owner.fields.dob")}
                value={watch("personalDob")}
                onChange={(date) => setValue("personalDob", date, { shouldValidate: true })}
                error={err(errors.personalDob)}
                disabled={isDobDisabled}
            />

            <StyledTextField
                label={t("owner.fields.hometown")}
                icon={<Home size={16} />}
                {...register("personalHometown")}
                error={err(errors.personalHometown)}
                disabled={isDataLoading}
            />

            <StyledTextField
                label={t("owner.fields.address")}
                icon={<MapPin size={16} />}
                {...register("personalAddress")}
                error={err(errors.personalAddress)}
                disabled={isDataLoading}
            />

            {/* 🔥 SỬA QUAN TRỌNG: rename field để khớp BE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FileUpload
                    label={t("owner.fields.cardFront")}
                    name="cardFrontImage"           // 🔥 TRÙNG BE
                    watch={watch}
                    setValue={setValue}
                    error={err(errors.cardFrontImage)}
                />
                <FileUpload
                    label={t("owner.fields.cardBack")}
                    name="cardBackImage"            // 🔥 TRÙNG BE
                    watch={watch}
                    setValue={setValue}
                    error={err(errors.cardBackImage)}
                />
            </div>
        </div>
    );
};

export default Step1_PersonalInfo;
