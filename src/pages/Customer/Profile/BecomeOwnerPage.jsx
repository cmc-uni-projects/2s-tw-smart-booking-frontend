import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomerLayout from "@/layouts/CustomerLayout/CustomerLayout";
import Stepper from "./BecomeOwnerSteps/Stepper";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ownerService } from "@/services/owner.service"; 

// 1. Import đúng 4 component Step
import Step1_PersonalInfo from "./BecomeOwnerSteps/Step1_PersonalInfo";
import Step2_BusinessInfo from "./BecomeOwnerSteps/Step2_BusinessInfo";
import Step3_Review from "./BecomeOwnerSteps/Step3_Review"; 
import Step4_Success from "./BecomeOwnerSteps/Step4_Success";

import Button from "@/components/common/Button/Button";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";
import LoadingOverlay from "@/components/common/Loading/LoadingOverlay";

// Validation cho file ảnh (JPG, PNG, WEBP)
const fileValidation = yup
  .mixed()
  .test("required", "Vui lòng tải lên file", (value) => value && value.length > 0)
  .test("fileType", "Chỉ chấp nhận file JPG, PNG, WEBP", (value) => {
    if (!value || value.length === 0) return true;
    const file = value[0];
    return file && ["image/jpeg", "image/png", "image/webp"].includes(file.type);
  });

// 2. Định nghĩa 3 schemas cho 3 bước nhập liệu đầu tiên
const schemas = [
  // Schema cho Step 0 (Step1_PersonalInfo)
  yup.object().shape({
    personalFullName: yup.string().required("Họ tên là bắt buộc"),
    personalEmail: yup
      .string()
      .email("Email không hợp lệ")
      .required("Email là bắt buộc"),
    personalPhone: yup.string().required("Số điện thoại là bắt buộc"),
    personalIdCard: yup.string().required("Số CCCD/Passport là bắt buộc"),
    personalDob: yup.date().required("Ngày sinh là bắt buộc").typeError("Ngày sinh không hợp lệ"),
    personalHometown: yup.string().required("Quê quán là bắt buộc"),
    personalAddress: yup.string().required("Địa chỉ thường trú là bắt buộc"),
    personalIdFront: fileValidation,
    personalIdBack: fileValidation,
  }),
  // Schema cho Step 1 (Step2_BusinessInfo)
  yup.object().shape({
    businessLicenseNumber: yup.string().required("Mã số ĐKKD là bắt buộc"),
    businessLicenseFile: yup
      .mixed()
      .test("required", "Vui lòng tải lên giấy phép", (value) => value && value.length > 0),
  }),
  // Schema cho Step 2 (Step3_Review)
  yup.object().shape({}), // Không cần validation ở bước review
];

export default function BecomeOwnerPage() {
  const [currentStep, setCurrentStep] = useState(0); // Bắt đầu từ index 0
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); 
  const navigate = useNavigate();

  // 'currentStep' là 0, 1, hoặc 2 (tương ứng với 3 schemas)
  const currentSchema = schemas[currentStep];

  const {
    register,
    handleSubmit,
    trigger,
    watch, 
    setValue,
    getValues, 
    formState: { errors },
  } = useForm({
    resolver: yupResolver(currentSchema), 
    mode: "onChange",
  });

  // 3. Định nghĩa 4 bước (steps) cho Stepper
  const steps = [
    { name: "Thông tin cá nhân" }, // index 0
    { name: "Thông tin kinh doanh" }, // index 1
    { name: "Kiểm tra" }, // index 2
    { name: "Hoàn tất" }, // index 3
  ];

  // Hàm "Tiếp theo"
  const handleNext = async () => {
    const isValid = await trigger(); // Kiểm tra validation của bước hiện tại
    
    // 4. CHỈ CHUYỂN KHI HỢP LỆ VÀ CHƯA PHẢI BƯỚC CUỐI (Step3_Review)
    //    (currentStep < 2 nghĩa là 0 hoặc 1)
    if (isValid && currentStep < 2) { 
      setCurrentStep((prev) => prev + 1);
    }
  };

  // Hàm "Thử lại" (khi submit lỗi)
  const handleRetry = () => {
    setError(null);
    setCurrentStep(2); // Quay lại bước Review (index 2)
  };

  // Hàm "Quay lại"
  const handleBack = () => {
    if (currentStep === 0) {
      navigate("/"); // Về trang chủ nếu ở bước 1
    } else {
      setCurrentStep((prev) => prev - 1); // Quay lại bước trước
    }
  };

  // Hàm "Gửi đơn" (chỉ chạy khi ở bước Review và nhấn Submit)
  const onFinalSubmit = async (data) => {
    setIsLoading(true);
    setError(null); 

    const formData = new FormData();

    // Dữ liệu cá nhân (từ Step 1)
    formData.append("personalFullName", data.personalFullName);
    formData.append("personalEmail", data.personalEmail);
    formData.append("personalPhone", data.personalPhone);
    formData.append("personalIdCard", data.personalIdCard);
    formData.append("personalDob", data.personalDob.toISOString()); // Gửi dạng ISO
    formData.append("personalHometown", data.personalHometown);
    formData.append("personalAddress", data.personalAddress);

    // Dữ liệu kinh doanh (từ Step 2)
    formData.append("businessLicenseNumber", data.businessLicenseNumber);
    
    // Files (từ Step 1 và 2)
    if (data.businessLicenseFile && data.businessLicenseFile.length > 0) {
      formData.append("businessLicenseFile", data.businessLicenseFile[0]);
    }
    if (data.personalIdFront && data.personalIdFront.length > 0) {
      formData.append("personalIdFront", data.personalIdFront[0]);
    }
    if (data.personalIdBack && data.personalIdBack.length > 0) {
      formData.append("personalIdBack", data.personalIdBack[0]);
    }

    try {
      // Gửi FormData lên backend
      // ✅ SỬA LỖI TÊN HÀM
      await ownerService.submitApplication(formData); 
    } catch (err) {
      console.error("Lỗi đăng ký:", err);
      const message = err.response?.data?.message || "Lỗi kết nối. Vui lòng thử lại.";
      setError(message); // Lưu lỗi để hiển thị ở Step 4
    } finally {
      setIsLoading(false);
      setCurrentStep(3); // 5. Luôn chuyển sang bước 3 (Hoàn tất/Success)
    }
  };
  
  // 6. Mảng 4 component tương ứng với 4 bước
  const stepComponents = [
    <Step1_PersonalInfo
      register={register}
      errors={errors}
      watch={watch}
      setValue={setValue}
    />,
    <Step2_BusinessInfo
      register={register}
      errors={errors}
      setValue={setValue}
      watch={watch}
    />,
    <Step3_Review watch={watch} />,
    <Step4_Success error={error} onRetry={handleRetry} />,
  ];

  return (
    <CustomerLayout>
      {isLoading && <LoadingOverlay message="Đang gửi đơn đăng ký..." />}
      <div className="max-w-4xl mx-auto py-12 px-6">
        
        {/* Stepper sẽ nhận mảng 4 bước */}
        <Stepper steps={steps} currentStep={currentStep} />

        <div className="bg-white p-8 rounded-2xl shadow-lg mt-8 border border-gray-100">
          
          {/* ✅ SỬA LỖI 1: XÓA onSubmit ra khỏi thẻ form */}
          <form>
            {/* Hiển thị component của bước hiện tại */}
            {stepComponents[currentStep]}

            {/* 8. Chỉ hiển thị nút khi CHƯA ở bước cuối (step < 3) */}
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
                  // ✅ SỬA LỖI 2: Đổi type="submit" thành type="button"
                  // và thêm onClick={handleSubmit(onFinalSubmit)}
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