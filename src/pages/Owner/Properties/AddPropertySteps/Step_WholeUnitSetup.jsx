import React from "react";
import {
    Home, Info, BedDouble, DollarSign, Users, Package, Image as ImageIcon,
    Tv, Snowflake, Wine, Coffee, Wifi, Bath, Wind, Ban, TrendingUp // ✅ [NEW] Import icon TrendingUp
} from "lucide-react";
import FloatingTextField from "@/components/common/Input/FloatingTextField";
import TextArea from "@/components/common/Input/TextArea";
import ImageUploadGrid from "@/components/common/Input/ImageUploadGrid";
import AmenityOption from "./components/AmenityOption";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

// ✅ 1. Sử dụng Icon chuẩn Lucide
const ROOM_AMENITIES = [
    { id: "tv", label: "TV", icon: <Tv size={20} /> },
    { id: "ac", get label() { return i18n.t("owner:Step_WholeUnitSetup.airConditioning"); }, icon: <Snowflake size={20} /> },
    { id: "minibar", label: "Minibar", icon: <Wine size={20} /> },
    { id: "tea_coffee", get label() { return i18n.t("owner:Step_WholeUnitSetup.teaCoffee"); }, icon: <Coffee size={20} /> },
    { id: "wifi", label: "Wifi", icon: <Wifi size={20} /> },
    { id: "bathtub", get label() { return i18n.t("owner:Step_WholeUnitSetup.bathtub"); }, icon: <Bath size={20} /> },
    { id: "balcony", get label() { return i18n.t("owner:Step_WholeUnitSetup.balcony"); }, icon: <Wind size={20} /> },
    { id: "non_smoking", get label() { return i18n.t("owner:Step_WholeUnitSetup.nonSmoking"); }, icon: <Ban size={20} /> },
];

const Step_WholeUnitSetup = ({ register, errors, watch, setValue }) => {
  const { t } = useTranslation();

    // Lấy danh sách ảnh hiện tại của unitData để hiển thị
    const currentImages = watch("unitData.images") || [];

    return (
        <div className="animate-fadeIn space-y-6 max-w-5xl mx-auto">

            {/* Info Banner */}
            <div className="bg-blue-50 border-l-4 border-[rgb(40,169,224)] p-4 rounded-r-lg mb-6 flex gap-3 items-start">
                <Info size={20} className="text-[rgb(40,169,224)] shrink-0 mt-0.5" />
                <div className="text-sm text-gray-700 leading-relaxed">
                    <h4 className="font-bold text-gray-900">{t("owner:Step_WholeUnitSetup.wholeUnitSetupVillaHomestay")}</h4>
                    <p>
                        {t("owner:Step_WholeUnitSetup.sinceYouChoseToRent")}
                        <strong> {t("owner:Step_WholeUnitSetup.theEntireHome")}</strong> {t("owner:Step_WholeUnitSetup.hereTheSystemWillCreate")}
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">

                {/* SECTION 1: THÔNG TIN CƠ BẢN */}
                <section className="mb-8 bg-blue-50/30 p-6 rounded-2xl border border-blue-100">
                    <h4 className="text-[rgb(40,169,224)] font-bold mb-4 flex items-center gap-2 text-lg">
                        <BedDouble size={24}/> {t("owner:Step_WholeUnitSetup.unitDetails")}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        {/* Tên Căn */}
                        <div className="md:col-span-2">
                            <FloatingTextField
                                label={t("owner:Step_WholeUnitSetup.displayNameOfTheUnit")}
                                placeholder=" "
                                {...register("unitData.name")}
                            />
                        </div>

                        {/* ✅ 2. Đã BỎ phần chọn Loại hình căn (roomCategory) */}

                        {/* Giá Ngày Thường */}
                        <div className="relative">
                            <FloatingTextField
                                label={t("owner:Step_WholeUnitSetup.weekdayPriceNightVnd")}
                                type="number"
                                placeholder="0"
                                {...register("unitData.price", { valueAsNumber: true })}
                                error={errors?.unitData?.price?.message}
                            />
                            <DollarSign className="absolute right-3 top-4 text-gray-400 pointer-events-none" size={18}/>
                        </div>

                        {/* ✅ [NEW] Giá Cuối Tuần */}
                        <div className="relative">
                            <FloatingTextField
                                label={t("owner:Step_WholeUnitSetup.weekendPriceNightVnd")}
                                type="number"
                                placeholder="0"
                                {...register("unitData.weekendPrice", { valueAsNumber: true })}
                                error={errors?.unitData?.weekendPrice?.message}
                            />
                            <TrendingUp className="absolute right-3 top-4 text-orange-400 pointer-events-none" size={18}/>
                            <p className="text-xs text-gray-500 mt-1 ml-1">{t("owner:Step_WholeUnitSetup.appliesToFridayAndSaturday")}</p>
                        </div>

                        {/* Sức chứa - Cho xuống dòng và full width để cân đối */}
                        <div className="relative md:col-span-2">
                            <FloatingTextField
                                label={t("owner:Step_WholeUnitSetup.standardCapacityGuests")}
                                type="number"
                                placeholder="2"
                                {...register("unitData.capacity", { valueAsNumber: true })}
                                error={errors?.unitData?.capacity?.message}
                            />
                            <Users className="absolute right-3 top-4 text-gray-400 pointer-events-none" size={18}/>
                        </div>

                        {/* ✅ 3. Thay Cấu hình giường thành Mô tả */}
                        <div className="md:col-span-2">
                            <TextArea
                                label={t("owner:Step_WholeUnitSetup.unitDescriptionAreaViewNumber")}
                                placeholder={t("owner:Step_WholeUnitSetup.describeTheSpaceNumberOf")}
                                rows={4}
                                {...register("unitData.description")}
                                error={errors?.unitData?.description?.message}
                            />
                        </div>
                    </div>
                </section>

                {/* SECTION 2: TIỆN NGHI */}
                <section className="mb-8">
                    <h4 className="text-[rgb(40,169,224)] font-bold mb-4 flex items-center gap-2 text-lg">
                        <Package size={24}/> {t("owner:Step_WholeUnitSetup.amenitiesInsideTheUnit")}
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {ROOM_AMENITIES.map(item => (
                            <AmenityOption
                                key={item.id}
                                id={item.id}
                                label={item.label}
                                icon={item.icon}
                                register={(name) => register(`unitData.amenities.${item.id}`)}
                                isSelected={!!watch(`unitData.amenities.${item.id}`)}
                            />
                        ))}
                    </div>
                </section>

                {/* SECTION 3: HÌNH ẢNH */}
                <section>
                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
                        <h4 className="text-[rgb(40,169,224)] font-bold flex items-center gap-2 text-lg">
                            <ImageIcon size={24}/> {t("owner:Step_WholeUnitSetup.unitPhotos")}
                        </h4>
                    </div>

                    <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200">
                        <p className="text-sm text-gray-500 mb-3">
                            {t("owner:Step_WholeUnitSetup.uploadDetailedInteriorPhotosBedrooms")}
                        </p>
                        <ImageUploadGrid
                            multiple={true}
                            value={currentImages}
                            onChange={(files) => setValue("unitData.images", files, { shouldValidate: true })}
                            placeholder={t("owner:Step_WholeUnitSetup.uploadUnitPhotos")}
                        />
                    </div>
                </section>

            </div>
        </div>
    );
};

export default Step_WholeUnitSetup;