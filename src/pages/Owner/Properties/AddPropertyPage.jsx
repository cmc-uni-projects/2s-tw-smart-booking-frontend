// src/pages/Owner/Properties/AddPropertyPage.jsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// Import Services & Components
import propertyService from "@/services/property.service";
// ✅ Đã xóa roomService vì backend tự xử lý tạo phòng cho Homestay/Villa
import VerticalStepper from "@/components/common/Stepper/VerticalStepper";
import Button from "@/components/common/Button/Button";
import LoadingOverlay from "@/components/common/Loading/LoadingOverlay";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";

// Import Steps
import Step0_PropertyType from "./AddPropertySteps/Step0_PropertyType";
import Step1_Location from "./AddPropertySteps/Step1_Location";
import Step2_Amenities from "./AddPropertySteps/Step2_Amenities";
import Step3_Images from "./AddPropertySteps/Step3_Images";
import Step4_Details from "./AddPropertySteps/Step4_Details";
import Step5_Review from "./AddPropertySteps/Step5_Review";
import Step6_Status from "./AddPropertySteps/Step6_Status";
import Step_WholeUnitSetup from "./AddPropertySteps/Step_WholeUnitSetup";
import Step_Policies from "./AddPropertySteps/Step_Policies";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

// --- 1. VALIDATION SCHEMAS ---
const fileListValidation = (min = 3) => yup
    .mixed()
    .test("required", i18n.t("owner:AddPropertyPage.atLeastPhotosAreRequired", { min }), (val) => val && val.length >= min);

const baseSchemas = {
  step0: yup.object({ propertyType: yup.string().required(() => i18n.t("owner:AddPropertyPage.chooseAPropertyType")) }),
  step1: yup.object({
    province: yup.string().required(() => i18n.t("owner:AddPropertyPage.chooseAProvinceCity")),
    city: yup.string().required(() => i18n.t("owner:AddPropertyPage.chooseADistrict")),
    address: yup.string().required(() => i18n.t("owner:AddPropertyPage.enterTheAddress")),
  }),
  step2: yup.object({ amenities: yup.object().nullable() }),
  step3: yup.object({ propertyImages: fileListValidation(3) }),
  step4: yup.object({
    propertyName: yup.string().required(() => i18n.t("owner:AddPropertyPage.pleaseEnterThePropertyName")),
    description: yup.string()
        .min(50, () => i18n.t("owner:AddPropertyPage.theDescriptionIsTooShort"))
        .required(() => i18n.t("owner:AddPropertyPage.pleaseEnterADetailedDescription")),
    area: yup.number()
        .transform((value, originalValue) => (String(originalValue).trim() === "" ? null : value))
        .nullable()
        .typeError(() => i18n.t("owner:AddPropertyPage.areaMustBeAValid"))
        .positive(() => i18n.t("owner:AddPropertyPage.areaMustBeGreaterThan"))
        .required(() => i18n.t("owner:AddPropertyPage.pleaseEnterTheArea")),
  }),
  stepPolicies: yup.object({
    policies: yup.object().shape({
      checkInFrom: yup.string().required(() => i18n.t("owner:AddPropertyPage.chooseTheCheckInTime")),
      checkInTo: yup.string().required(() => i18n.t("owner:AddPropertyPage.chooseTheCheckInTime")),
      checkOutFrom: yup.string().required(() => i18n.t("owner:AddPropertyPage.chooseTheCheckOutTime")),
      checkOutTo: yup.string().required(() => i18n.t("owner:AddPropertyPage.chooseTheCheckOutTime")),
    })
  }),
  // ✅ [UPDATE] Schema cho bước Setup Unit: Thêm weekendPrice
  stepUnit: yup.object({
    unitData: yup.object().shape({
      price: yup.number().min(10000, () => i18n.t("owner:AddPropertyPage.minimumPriceIs10000")).required(() => i18n.t("owner:AddPropertyPage.enterTheWeekdayPrice")),
      weekendPrice: yup.number()
          .transform((value, originalValue) => (String(originalValue).trim() === "" ? 0 : value))
          .min(0, () => i18n.t("owner:AddPropertyPage.invalidPrice")), // Cho phép 0 hoặc trống (sẽ lấy fallback giá thường)
      capacity: yup.number().min(1, () => i18n.t("owner:AddPropertyPage.minimumCapacityIs1")).required(() => i18n.t("owner:AddPropertyPage.enterTheCapacity")),
      description: yup.string().required(() => i18n.t("owner:AddPropertyPage.pleaseEnterADetailedDescription2")),
    })
  }),
  stepReview: yup.object({
    terms: yup.boolean().oneOf([true], () => i18n.t("owner:AddPropertyPage.youMustAgreeToThe")),
  }),
};

export default function AddPropertyPage() {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setErrorState] = useState(null);
  const navigate = useNavigate();

  // --- 2. KHỞI TẠO FORM ---
  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    control,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      propertyType: "HOTEL",
      country: t("owner:AddPropertyPage.vietnam"),
      amenities: {},
      province: "", city: "", address: "",
      propertyImages: null,
      propertyName: "", description: "", area: "",
      terms: false,

      // ✅ [UPDATE] Default values cho Unit
      unitData: {
        price: 0,
        weekendPrice: 0, // Mặc định 0
        capacity: 2,
        description: "",
        amenities: {},
        images: []
      },

      policies: {
        checkInFrom: "14:00",
        checkInTo: "23:00",
        checkOutFrom: "06:00",
        checkOutTo: "12:00",
        petsAllowed: false,
        smokingAllowed: false,
        childrenAllowed: true,
        allowFreeCancellation: true,
        freeCancellationDays: 3,
        requiresPrepayment: false,
        securityDepositRequired: false,
        minimumAge: 18,
      }
    }
  });

  const propertyType = watch("propertyType");
  const isWholeUnit = ["VILLA", "HOMESTAY"].includes(propertyType);

  // --- 3. CẤU HÌNH STEPS ĐỘNG ---
  const stepsConfig = useMemo(() => {
    const steps = [
      { id: 0, title: t("owner:AddPropertyPage.type"), component: Step0_PropertyType, schema: baseSchemas.step0 },
      { id: 1, title: t("owner:AddPropertyPage.location"), component: Step1_Location, schema: baseSchemas.step1 },
      { id: 2, title: t("owner:AddPropertyPage.amenities"), component: Step2_Amenities, schema: baseSchemas.step2 },
      { id: 3, title: t("owner:AddPropertyPage.photos"), component: Step3_Images, schema: baseSchemas.step3 },
      { id: 4, title: t("owner:AddPropertyPage.details"), component: Step4_Details, schema: baseSchemas.step4 },
      { id: 5, title: t("owner:AddPropertyPage.policies"), component: Step_Policies, schema: baseSchemas.stepPolicies },
    ];

    if (isWholeUnit) {
      steps.push({
        id: 6,
        title: t("owner:AddPropertyPage.unitSetup"),
        component: Step_WholeUnitSetup,
        schema: baseSchemas.stepUnit
      });
    }

    steps.push({
      id: isWholeUnit ? 7 : 6,
      title: t("owner:AddPropertyPage.review"),
      component: Step5_Review,
      schema: baseSchemas.stepReview
    });

    return steps;
  }, [isWholeUnit]);

  const CurrentStepConfig = stepsConfig[currentStep];
  const stepperItems = stepsConfig.slice(1).map(s => ({ name: s.title }));

  // --- 4. XỬ LÝ CHUYỂN BƯỚC ---
  const handleNext = async () => {
    const currentSchema = CurrentStepConfig.schema;
    clearErrors();

    if (currentSchema) {
      try {
        await currentSchema.validate(getValues(), { abortEarly: false });
        setCurrentStep(prev => prev + 1);
      } catch (err) {
        if (err.inner) {
          err.inner.forEach(validationError => {
            setError(validationError.path, {
              type: "manual",
              message: validationError.message,
            });
          });
        }
      }
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
    else navigate('/owner/properties');
  };

  // --- 5. XỬ LÝ SUBMIT (GỌI API) ---
  const onFinalSubmit = async (data) => {
    setIsLoading(true);
    setErrorState(null);

    try {
      // =======================================================
      // BƯỚC 1: CHUẨN BỊ PAYLOAD TẠO PROPERTY
      // =======================================================
      const propertyPayload = { ...data };

      // ✅ [QUAN TRỌNG] MAP DỮ LIỆU TỪ UNIT DATA RA ROOT ĐỂ BACKEND HỨNG
      if (isWholeUnit && data.unitData) {
        propertyPayload.price = data.unitData.price;
        propertyPayload.weekendPrice = data.unitData.weekendPrice; // Gửi giá cuối tuần
        propertyPayload.capacity = data.unitData.capacity;
        propertyPayload.unitName = data.unitData.name;

        // Lưu ý: Backend sẽ dùng description của Property gán cho Room luôn
        // Nếu cần description riêng, cần Backend hỗ trợ thêm trường unitDescription
      }

      // Clean các trường thừa
      delete propertyPayload.propertyImages;
      delete propertyPayload.unitData;
      delete propertyPayload.terms;
      delete propertyPayload.policies;

      const propertyFormData = new FormData();
      propertyFormData.append("propertyData", new Blob([JSON.stringify(propertyPayload)], { type: "application/json" }));

      if (data.propertyImages) {
        Array.from(data.propertyImages).forEach(file => propertyFormData.append("propertyImages", file));
      }

      console.log("📦 Creating property (with room info for Villa/Homestay)...");
      const res = await propertyService.submitPropertyApplication(propertyFormData);

      const newPropertyId = res.data?.propertyId || res.data?.id;
      if (!newPropertyId) throw new Error(t("owner:AddPropertyPage.couldNotGetTheId"));

      console.log("✅ Property ID:", newPropertyId);

      // =======================================================
      // BƯỚC 2: TẠO CHÍNH SÁCH
      // =======================================================
      if (data.policies) {
        console.log("📝 Setting up policies...");
        await propertyService.addPropertyPolicies(newPropertyId, data.policies);
        console.log("✅ Policies set up successfully!");
      }

      // =======================================================
      // ❌ [ĐÃ XÓA] BƯỚC TẠO ROOM THỦ CÔNG
      // =======================================================
      // Backend mới đã tự động tạo Room và copy ảnh từ Property sang Room
      // khi type là VILLA/HOMESTAY. Không cần gọi API addRoom nữa.

      // Thành công -> Chuyển sang trang Status
      setCurrentStep(stepsConfig.length);

    } catch (err) {
      console.error("Submit error:", err);
      const serverMessage = err.response?.data?.message || err.message;
      setErrorState(t("owner:AddPropertyPage.error", { serverMessage }));
      setCurrentStep(stepsConfig.length);
    } finally {
      setIsLoading(false);
    }
  };

  // --- 6. RENDER ---
  if (currentStep === stepsConfig.length) {
    return <Step6_Status error={error} onRetry={() => { setErrorState(null); setCurrentStep(stepsConfig.length - 2); }} />;
  }

  const StepComponent = CurrentStepConfig?.component;

  return (
      <>
        {isLoading && <LoadingOverlay message={t("owner:AddPropertyPage.processingData")} />}

        {currentStep < stepsConfig.length && (
            <Button variant="ghost" onClick={handleBack} leftIcon={<ArrowLeft size={18} />} className="mb-4">
              {t("owner:AddPropertyPage.back")}
            </Button>
        )}

        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">

          {currentStep === 0 ? (
              <form>
                <StepComponent watch={watch} setValue={setValue} />
                <div className="flex justify-end mt-8">
                  <Button type="button" onClick={handleNext} rightIcon={<ArrowRight size={18} />} disabled={!propertyType}>
                    {t("owner:AddPropertyPage.next")}
                  </Button>
                </div>
              </form>
          ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="md:col-span-1">
                  <VerticalStepper steps={stepperItems} currentStep={currentStep - 1} />
                </div>

                <div className="md:col-span-3">
                  <form onSubmit={handleSubmit(() => {})}>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                      {CurrentStepConfig.title}
                    </h2>

                    {StepComponent && (
                        <StepComponent
                            register={register}
                            errors={errors}
                            watch={watch}
                            setValue={setValue}
                            control={control}
                            trigger={trigger}
                            setError={setError}
                            clearErrors={clearErrors}
                        />
                    )}

                    <div className="flex justify-end pt-8 mt-8 border-t border-gray-100">
                      {currentStep === stepsConfig.length - 1 ? (
                          <Button
                              type="button"
                              onClick={handleSubmit(onFinalSubmit)}
                              leftIcon={<Send size={18} />}
                              disabled={!watch("terms")}
                          >
                            {t("owner:AddPropertyPage.submitApplication")}
                          </Button>
                      ) : (
                          <Button type="button" onClick={handleNext} rightIcon={<ArrowRight size={18} />}>
                            {t("owner:AddPropertyPage.next")}
                          </Button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
          )}
        </div>
      </>
  );
}