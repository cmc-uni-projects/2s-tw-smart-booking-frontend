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

// Import các steps
import Step0_PropertyType from "./AddPropertySteps/Step0_PropertyType";
import Step1_Location from "./AddPropertySteps/Step1_Location"; 
import Step2_Amenities from "./AddPropertySteps/Step2_Amenities";
import Step3_RoomTypes from "./AddPropertySteps/Step3_RoomTypes";
import Step4_Images from "./AddPropertySteps/Step4_Images"; 
// ... (Các steps khác sẽ được import ở đây)

// --- Validation Schemas ---

// (Validation cho file không đổi)
const fileListValidation = (min = 3) => yup
  .mixed() 
  .test("required", `Yêu cầu tải lên ít nhất ${min} ảnh`, (value) => value && value.length >= min)
  .test("fileType", "Chỉ chấp nhận file JPG, PNG, WEBP", (value) => {
    if (!value || value.length === 0) return true; 
    return Array.from(value).every(file => 
      ["image/jpeg", "image/png", "image/webp"].includes(file.type)
    );
  });

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
  // Step 3: Room Types (index 3)
  yup.object({
    roomTypes: yup.array().of(
      yup.object({
        name: yup.string().required("Tên phòng là bắt buộc"),
        roomCount: yup.number().min(1, "Số phòng phải > 0").required("Bắt buộc").typeError("Phải là số nguyên"),
        maxGuests: yup.number().min(1, "Số khách phải > 0").required("Bắt buộc").typeError("Phải là số nguyên"),
        size: yup.number().min(1, "Kích thước phải > 0").required("Bắt buộc").typeError("Phải là số"),
        price: yup.number().min(1000, "Giá phải ít nhất 1,000 VNĐ").required("Bắt buộc").typeError("Phải là số"),
        allowPets: yup.boolean(),
      })
    ).min(1, "Bạn phải thêm ít nhất 1 loại phòng."),
  }),
  // Step 4: Images (index 4)
  yup.object({
    propertyImages: fileListValidation(3), // Ít nhất 3 ảnh chung
    roomTypes: yup.array().of(
      yup.object({
        // Validation cho ảnh của TỪNG loại phòng
        images: fileListValidation(3) // Ít nhất 3 ảnh phòng
      })
    ),
  }),
  // Step 5: Details (index 5)
  yup.object({
    // (Sẽ thêm ở giai đoạn sau)
  }),
];

// Tên các bước cho Stepper Dọc
const STEPPER_ITEMS = [
  { name: "Vị trí", description: "Cơ sở của bạn ở đâu?" }, 
  { name: "Tiện nghi", description: "Cơ sở của bạn có gì?" }, 
  { name: "Phòng", description: "Thiết lập các loại phòng" },
  { name: "Hình ảnh", description: "Tải lên ảnh cơ sở" },
  { name: "Chi tiết", description: "Tên và mô tả" },
  { name: "Kiểm tra", description: "Xác nhận & Gửi đơn" }, 
];

export default function AddPropertyPage() {
  const [currentStep, setCurrentStep] = useState(0); 
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
      country: "Việt Nam",
      roomTypes: [], 
      amenities: {},
      province: "", 
      city: "",     
      address: "",
      propertyImages: null,
    }
  });

  // Hàm render component cho bước hiện tại
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
        return <Step3_RoomTypes {...props} />;
      case 4:
        return <Step4_Images {...props} />;
      case 7: 
        return <div>Trang thái (sẽ làm sau)</div>
      default:
        return <div>Bước {currentStep} (Chưa được triển khai)</div>;
    }
  };

  // --- (Các hàm handleNext, handleBack, onFinalSubmit không đổi) ---
  const handleNext = async () => {
    const isValid = await trigger(); 
    if (isValid) {
      if (currentStep < 6) { 
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

  const onFinalSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    console.log("Dữ liệu cuối cùng:", data);
    
    // (Logic tạo FormData và gọi API sẽ ở đây)
    // ...

    setIsLoading(false);
    setCurrentStep(7); 
  };

  return (
    <>
      {isLoading && <LoadingOverlay message="Đang gửi đơn đăng ký..." />}
      
      {currentStep < 7 && (
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
          // --- GIAO DIỆN CHỌN LOẠI ---
          <form onSubmit={handleSubmit(handleNext)}>
            {renderStepComponent()}
            <div className="flex justify-end mt-8">
              <Button
                type="submit"
                rightIcon={<ArrowRight size={18} />}
                disabled={!watch("propertyType")}
              >
                Tiếp theo
              </Button>
            </div>
          </form>

        ) : currentStep < 7 ? (
          // --- GIAO DIỆN STEPPER DỌC ---
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            
            <div className="md:col-span-1">
              <VerticalStepper steps={STEPPER_ITEMS} currentStep={currentStep - 1} />
            </div>
            
            <div className="md:col-span-3">
              <form onSubmit={handleSubmit(currentStep === 6 ? onFinalSubmit : handleNext)}>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  {STEPPER_ITEMS[currentStep - 1].name}
                </h2>
                
                {renderStepComponent()}

                <div className="flex justify-end pt-8 mt-8 border-t border-gray-100">
                  {currentStep === 6 ? ( 
                    <Button
                      type="submit"
                      leftIcon={<Send size={18} />}
                      // disabled={!watch("terms")} 
                    >
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
           // --- GIAO DIỆN TRẠNG THÁI ---
           renderStepComponent()
        )}
      </div>
    </>
  );
}