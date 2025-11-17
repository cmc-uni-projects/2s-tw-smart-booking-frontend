// ✅ SỬA 1: Import thêm useEffect, useState
import React, { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import CustomerLayout from "@/layouts/CustomerLayout/CustomerLayout";
import Stepper from "./BecomeOwnerSteps/Stepper";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// ✅ SỬA 2: Import userService
import { ownerService } from "@/services/owner.service";
import { userService } from "@/services/user.service"; // <-- ĐÃ THÊM DÒNG NÀY

import Step1_PersonalInfo from "./BecomeOwnerSteps/Step1_PersonalInfo";
import Step2_BusinessInfo from "./BecomeOwnerSteps/Step2_BusinessInfo";
import Step3_Review from "./BecomeOwnerSteps/Step3_Review";
import Step4_Success from "./BecomeOwnerSteps/Step4_Success";

import Button from "@/components/common/Button/Button";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";
import LoadingOverlay from "@/components/common/Loading/LoadingOverlay";

// --- ✅ SỬA 3: Thêm Helper chuyển đổi ngày ---
/**
 * Chuyển 'yyyy-mm-dd' (từ API) sang Date object (cho Form/Yup)
 */
const parseApiDate = (isoDate) => {
  if (!isoDate || !isoDate.includes('-')) return null;
  try {
    const [y, m, d] = isoDate.split('-').map(Number);
    return new Date(y, m - 1, d); // Tháng trong JS là 0-11
  } catch (e) { return null; }
};
// --- Hết Helper ---

// (Validation schema giữ nguyên)
const fileValidation = yup
  .mixed()
  .test("required", "Vui lòng tải lên file", (value) => value && value.length > 0)
  .test("fileType", "Chỉ chấp nhận file JPG, PNG, WEBP", (value) => {
    if (!value || value.length === 0) return true;
    const file = value[0];
    return ["image/jpeg", "image/png", "image/webp"].includes(file.type);
  });

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
    businessLicenseNumber: yup.string().required("Mã số ĐKKD là bắt buộc").min(5, "Mã số ĐKKD phải có ít nhất 5 ký tự"),
    businessLicenseFile: yup
      .mixed()
      .test("required", "Vui lòng tải lên giấy phép", (value) => value && value.length > 0),
  }),
  yup.object().shape({}),
];

export default function BecomeOwnerPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false); // Dùng cho việc submit
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // State cho việc tải dữ liệu ban đầu
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);

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

  // useEffect để tải dữ liệu profile (Giữ nguyên)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsDataLoading(true);
        const data = await userService.getUserDetail();
        
        if (data.fullName) setValue("personalFullName", data.fullName, { shouldValidate: true });
        if (data.email) setValue("personalEmail", data.email, { shouldValidate: true });
        if (data.phoneNumber) setValue("personalPhone", data.phoneNumber, { shouldValidate: true });
        if (data.dateOfBirth) {
          setValue("personalDob", parseApiDate(data.dateOfBirth), { shouldValidate: true });
        }
        setProfileData(data); 

      } catch (err) {
        console.error("Không thể tải thông tin cá nhân:", err);
      } finally {
        setIsDataLoading(false);
      }
    };
    fetchProfile();
  }, [setValue]); 


  const steps = [
    { name: "Thông tin cá nhân" },
    { name: "Thông tin kinh doanh" },
    { name: "Kiểm tra" },
    { name: "Hoàn tất" },
  ];

  // (Các hàm handleNext, handleBack, handleRetry giữ nguyên)
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

  // ✅ SỬA 4: Sửa lại hàm onFinalSubmit
  const onFinalSubmit = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      // ❌ XÓA BỎ HÀM 'uploadFile' DÙNG 'fetch'
      
      // 🧩 1️⃣ Upload các file lên server DÙNG SERVICE
      // (userService.uploadFile đã dùng 'api' instance,
      // nó sẽ tự động thêm token VÀ 'Content-Type: multipart')
      const [idFrontUrl, idBackUrl, licenseUrl] = await Promise.all([
        userService.uploadFile(data.personalIdFront[0]),
        userService.uploadFile(data.personalIdBack[0]),
        userService.uploadFile(data.businessLicenseFile[0]),
      ]);

      // 🧩 2️⃣ Chuẩn hóa ngày sinh (Giữ nguyên)
      const dob = new Date(data.personalDob);
      const dobIso = dob.toISOString().split("T")[0];

      // 🧩 3️⃣ Gửi DTO JSON lên backend (Giữ nguyên)
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

      // Dùng service (đã sửa)
      await ownerService.submitApplication(payload);
    } catch (err) {
      console.error("❌ Lỗi gửi đơn:", err);
      // Lỗi "Internal server error: Current request is not a multipart request"
      // sẽ hiển thị ở đây nếu 'userService.uploadFile' thất bại
      const message = err.message || "Lỗi kết nối. Vui lòng thử lại.";
      setError(message);
    } finally {
      setIsLoading(false);
      setCurrentStep(3);
    }
  };

  // (stepComponents và JSX giữ nguyên)
  const stepComponents = [
    <Step1_PersonalInfo 
      register={register} 
      errors={errors} 
      watch={watch} 
      setValue={setValue} 
      profileData={profileData}
      isDataLoading={isDataLoading}
    />,
    <Step2_BusinessInfo register={register} errors={errors} setValue={setValue} watch={watch} />,
    <Step3_Review watch={watch} />,
    <Step4_Success error={error} onRetry={handleRetry} />,
  ];

  return (
    <CustomerLayout>
      {(isLoading || isDataLoading) && (
        <LoadingOverlay 
          message={isLoading ? "Đang gửi đơn đăng ký..." : "Đang tải thông tin..."} 
        />
      )}
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
                    disabled={isDataLoading} 
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