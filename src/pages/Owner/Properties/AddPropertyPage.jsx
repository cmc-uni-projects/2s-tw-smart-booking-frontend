// src/pages/Owner/Properties/AddPropertyPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Import các components
import { propertyService } from "@/services/property.service";
import VerticalStepper from "@/components/common/Stepper/VerticalStepper";
import Button from "@/components/common/Button/Button";
import LoadingOverlay from "@/components/common/Loading/LoadingOverlay";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";

// Import các steps (ĐÃ CẬP NHẬT)
import Step0_PropertyType from "./AddPropertySteps/Step0_PropertyType";
import Step1_Location from "./AddPropertySteps/Step1_Location"; 
import Step2_Amenities from "./AddPropertySteps/Step2_Amenities";
// BỎ Step 3 (Phòng)
import Step3_Images from "./AddPropertySteps/Step3_Images"; // Đổi tên từ Step4
import Step4_Details from "./AddPropertySteps/Step4_Details"; // Đổi tên từ Step5
import Step5_Review from "./AddPropertySteps/Step5_Review"; // Đổi tên từ Step6
import Step6_Status from "./AddPropertySteps/Step6_Status"; // Đổi tên từ Step7

// --- Validation Schemas ---
const fileListValidation = (min = 3) => yup
  .mixed() 
  .test("required", `Yêu cầu tải lên ít nhất ${min} ảnh`, (value) => value && value.length >= min)
  .test("fileType", "Chỉ chấp nhận file JPG, PNG, WEBP", (value) => {
    if (!value || value.length === 0) return true; 
    return Array.from(value).every(file => 
      ["image/jpeg", "image/png", "image/webp"].includes(file.type)
    );
  });

// 2. CẬP NHẬT MẢNG SCHEMA (CÒN 5 BƯỚC VALIDATE)
const stepSchemas = [
  // Step 0: Type (index 0)
  yup.object({
    propertyType: yup.string().required("Vui lòng chọn loại hình cơ sở"),
  }),
  // Step 1: Location (index 1)
  yup.object({
    country: yup.string().required(),
    province: yup.string().required("Vui lòng nhập tỉnh/thành"),
    city: yup.string().required("Vui lòng nhập thành phố/quận"),
    address: yup.string().required("Vui lòng nhập địa chỉ chi tiết"),
  }),
  // Step 2: Amenities (index 2)
  yup.object({
    amenities: yup.object().nullable(), 
  }),
  // Step 3: Images (index 3) (Đơn giản hóa: Bỏ validation cho roomTypes.images)
  yup.object({
    propertyImages: fileListValidation(3),
  }),
  // Step 4: Details (index 4)
  yup.object({
    propertyName: yup.string().required("Tên cơ sở là bắt buộc"),
    description: yup.string().min(50, "Mô tả phải có ít nhất 50 ký tự").required("Mô tả là bắt buộc"),
    area: yup.number().min(1, "Diện tích phải > 0").required("Bắt buộc").typeError("Phải là số"),
  }),
  // Step 5: Review (index 5)
  yup.object({
    terms: yup.boolean().oneOf([true], "Bạn phải đồng ý với điều khoản dịch vụ"),
  }),
];

// 3. CẬP NHẬT MẢNG TÊN BƯỚC (CÒN 5 BƯỚC)
const STEPPER_ITEMS = [
  { name: "Vị trí", description: "Cơ sở của bạn ở đâu?" }, 
  { name: "Tiện nghi", description: "Cơ sở của bạn có gì?" }, 
  { name: "Hình ảnh", description: "Tải lên ảnh cơ sở" },
  { name: "Chi tiết", description: "Tên và mô tả" },
  { name: "Kiểm tra", description: "Xác nhận & Gửi đơn" }, 
];

export default function AddPropertyPage() {
  const [currentStep, setCurrentStep] = useState(0); // 0 = Type, 1-5 = Stepper, 6 = Status
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); 
  const navigate = useNavigate();

  const currentSchema = stepSchemas
    .slice(0, currentStep + 1) 
    .reduce((acc, schema) => acc.concat(schema), yup.object()); 

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(currentSchema), 
    mode: "onChange",
    defaultValues: {
      // 4. BỎ roomTypes KHỎI DEFAULT VALUES
      country: "Việt Nam",
      amenities: {},
      province: "", 
      city: "",     
      address: "",
      propertyImages: null,
      propertyName: "",
      description: "",
      area: "",
      terms: false,
    }
  });

  // 5. CẬP NHẬT HÀM RENDER
  const renderStepComponent = () => {
    const props = { register, errors, watch, setValue, control }; 
    switch (currentStep) {
      case 0:
        return <Step0_PropertyType {...props} />;
      case 1: 
        return <Step1_Location {...props} />;
      case 2:
        return <Step2_Amenities {...props} />;
      case 3:
        return <Step3_Images {...props} />; // Đổi từ Step4
      case 4:
        return <Step4_Details {...props} />; // Đổi từ Step5
      case 5:
        return <Step5_Review {...props} />; // Đổi từ Step6
      case 6: // Step 6 bây giờ là Status
        return <Step6_Status 
                  error={error} 
                  onRetry={() => { setError(null); setCurrentStep(5); }} // Quay lại bước 5 (Review)
                />;
      default:
        return <div>Lỗi: Bước không xác định</div>;
    }
  };

  // 6. CẬP NHẬT LOGIC NÚT "TIẾP THEO"
  const handleNext = async () => {
    const isValid = await trigger(); 
    if (isValid) {
      if (currentStep < 5) { // Review bây giờ là bước 5
        setCurrentStep((prev) => prev + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      navigate('/owner/properties'); 
    }
  };

  // 7. CẬP NHẬT LOGIC SUBMIT (Đơn giản hóa FormData)
  const onFinalSubmit = async (data) => {
    setIsLoading(true);
    setError(null);

    // 1. Tách JSON (không cần xóa roomTypes nữa)
    const jsonData = { ...data };
    delete jsonData.propertyImages; 

    // 2. Tạo FormData
    const formData = new FormData();
    formData.append("propertyData", new Blob([JSON.stringify(jsonData)], { 
      type: "application/json"
    }));

    // 3. Thêm ảnh chung
    if (data.propertyImages) {
      Array.from(data.propertyImages).forEach(file => {
        formData.append("propertyImages", file);
      });
    }

    // (KHÔNG CẦN LOGIC THÊM ẢNH PHÒNG NỮA)

    // 4. Gọi API
    try {
      await propertyService.submitPropertyApplication(formData);
    } catch (err) {
      setError(err.message || "Một lỗi không xác định đã xảy ra.");
    } finally {
      setIsLoading(false);
      setCurrentStep(6); // Chuyển đến trang Status (bước 6)
    }
  };

  return (
    <>
      {isLoading && <LoadingOverlay message="Đang gửi đơn đăng ký..." />}
      
      {/* 8. CẬP NHẬT ĐIỀU KIỆN ẨN NÚT QUAY LẠI */}
      {currentStep < 6 && (
         <Button
            type="button"
            variant="ghost"
            onClick={handleBack}
            leftIcon={<ArrowLeft size={18} />}
            className="mb-4"
         >
           Quay lại
         </Button>
      )}

      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        
        {currentStep === 0 ? (
          <form onSubmit={handleSubmit(handleNext)}>
            {renderStepComponent()}
            <div className="flex justify-end mt-8">
              <Button type="submit" rightIcon={<ArrowRight size={18} />} disabled={!watch("propertyType")}>
                Tiếp theo
              </Button>
            </div>
          </form>

        // 9. CẬP NHẬT ĐIỀU KIỆN RENDER
        ) : currentStep < 6 ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-1">
              {/* Stepper bây giờ là 0-4 (tương ứng step 1-5) */}
              <VerticalStepper steps={STEPPER_ITEMS} currentStep={currentStep - 1} />
            </div>
            
            <div className="md:col-span-3">
              {/* 10. CẬP NHẬT LOGIC SUBMIT (step 5 là cuối) */}
              <form onSubmit={handleSubmit(currentStep === 5 ? onFinalSubmit : handleNext)}>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  {STEPPER_ITEMS[currentStep - 1].name}
                </h2>
                
                {renderStepComponent()}

                <div className="flex justify-end pt-8 mt-8 border-t border-gray-100">
                  {currentStep === 5 ? ( 
                    <Button type="submit" leftIcon={<Send size={18} />} disabled={!watch("terms")}>
                      Gửi đơn đăng ký
                    </Button>
                  ) : (
                    <Button type="submit" rightIcon={<ArrowRight size={18} />}>
                      Tiếp theo
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </div>

        ) : (
           // Giao diện Status (step 6)
           renderStepComponent()
        )}
      </div>
    </>
  );
}