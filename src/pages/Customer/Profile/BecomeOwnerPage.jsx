import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomerLayout from "@/layouts/CustomerLayout/CustomerLayout";
import Stepper from "./BecomeOwnerSteps/Stepper";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ownerService } from "@/services/owner.service";

import Step1_PersonalInfo from "./BecomeOwnerSteps/Step1_PersonalInfo";
import Step2_BusinessInfo from "./BecomeOwnerSteps/Step2_BusinessInfo";
import Step3_Review from "./BecomeOwnerSteps/Step3_Review";
import Step4_Success from "./BecomeOwnerSteps/Step4_Success";

import Button from "@/components/common/Button/Button";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";
import LoadingOverlay from "@/components/common/Loading/LoadingOverlay";

// ✅ Validation cho file ảnh (JPG, PNG, WEBP)
const fileValidation = yup
  .mixed()
  .test("required", "Vui lòng tải lên file", (value) => value && value.length > 0)
  .test("fileType", "Chỉ chấp nhận file JPG, PNG, WEBP", (value) => {
    if (!value || value.length === 0) return true;
    const file = value[0];
    return ["image/jpeg", "image/png", "image/webp"].includes(file.type);
  });

// ✅ Schema validation cho 3 bước đầu
const schemas = [
  yup.object().shape({
    personalFullName: yup.string().required("Họ tên là bắt buộc"),
    personalEmail: yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
    personalPhone: yup.string().required("Số điện thoại là bắt buộc"),
    personalIdCard: yup.string().required("Số CCCD/Passport là bắt buộc"),
    personalDob: yup.date().required("Ngày sinh là bắt buộc").typeError("Ngày sinh không hợp lệ"),
    personalHometown: yup.string().required("Quê quán là bắt buộc"),
    personalAddress: yup.string().required("Địa chỉ thường trú là bắt buộc"),
    personalIdFront: fileValidation,
    personalIdBack: fileValidation,
  }),
  yup.object().shape({
    businessLicenseNumber: yup.string().required("Mã số ĐKKD là bắt buộc"),
    businessLicenseFile: yup
      .mixed()
      .test("required", "Vui lòng tải lên giấy phép", (value) => value && value.length > 0),
  }),
  yup.object().shape({}),
];

export default function BecomeOwnerPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const currentSchema = schemas[currentStep];
  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(currentSchema),
    mode: "onChange",
  });

  const steps = [
    { name: "Thông tin cá nhân" },
    { name: "Thông tin kinh doanh" },
    { name: "Kiểm tra" },
    { name: "Hoàn tất" },
  ];

  // ✅ Chuyển bước
  const handleNext = async () => {
    const isValid = await trigger();
    if (isValid && currentStep < 2) setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (currentStep === 0) navigate("/");
    else setCurrentStep((prev) => prev - 1);
  };

  const handleRetry = () => {
    setError(null);
    setCurrentStep(2);
  };

  // ✅ Gửi đơn đăng ký
  const onFinalSubmit = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      // 🧩 1️⃣ Upload các file lên server
      const uploadFile = async (file) => {
        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("http://localhost:8386/api/v1/files/upload", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        if (!res.ok) throw new Error("Upload failed");
        const json = await res.json();
        return json.fileDownloadUri; // Backend trả về URL công khai
      };

      const [idFrontUrl, idBackUrl, licenseUrl] = await Promise.all([
        uploadFile(data.personalIdFront[0]),
        uploadFile(data.personalIdBack[0]),
        uploadFile(data.businessLicenseFile[0]),
      ]);

      // 🧩 2️⃣ Chuẩn hóa ngày sinh
      const dob = new Date(data.personalDob);
      const dobIso = dob.toISOString().split("T")[0];

      // 🧩 3️⃣ Gửi DTO JSON lên backend
      const payload = {
        personalFullName: data.personalFullName,
        personalEmail: data.personalEmail,
        personalPhone: data.personalPhone,
        personalIdCard: data.personalIdCard,
        personalDob: dobIso,
        permanentAddress: data.personalAddress,
        hometownAddress: data.personalHometown,
        cardFrontImage: idFrontUrl,
        cardBackImage: idBackUrl,
        businessLicenseImage: licenseUrl,
        businessLicenseNumber: data.businessLicenseNumber,
      };

      await ownerService.submitApplication(payload);
    } catch (err) {
      console.error("❌ Lỗi gửi đơn:", err);
      const message = err.message || "Lỗi kết nối. Vui lòng thử lại.";
      setError(message);
    } finally {
      setIsLoading(false);
      setCurrentStep(3);
    }
  };

  const stepComponents = [
    <Step1_PersonalInfo register={register} errors={errors} watch={watch} setValue={setValue} />,
    <Step2_BusinessInfo register={register} errors={errors} setValue={setValue} watch={watch} />,
    <Step3_Review watch={watch} />,
    <Step4_Success error={error} onRetry={handleRetry} />,
  ];

  return (
    <CustomerLayout>
      {isLoading && <LoadingOverlay message="Đang gửi đơn đăng ký..." />}
      <div className="max-w-4xl mx-auto py-12 px-6">
        <Stepper steps={steps} currentStep={currentStep} />
        <div className="bg-white p-8 rounded-2xl shadow-lg mt-8 border border-gray-100">
          <form>
            {stepComponents[currentStep]}

            {currentStep < 3 && (
              <div className="flex justify-between items-center pt-8 mt-8 border-t border-gray-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  leftIcon={<ArrowLeft size={18} />}
                >
                  {currentStep === 0 ? "Quay về trang chủ" : "Quay lại"}
                </Button>

                {currentStep < 2 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    rightIcon={<ArrowRight size={18} />}
                  >
                    Tiếp theo
                  </Button>
                ) : (
                  <Button
                    type="button"
                    leftIcon={<Send size={18} />}
                    onClick={handleSubmit(onFinalSubmit)}
                  >
                    Gửi đơn đăng ký
                  </Button>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    </CustomerLayout>
  );
}
