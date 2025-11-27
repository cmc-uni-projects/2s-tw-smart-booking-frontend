// src/pages/Owner/Properties/AddPropertyPage.jsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Import Services & Components
import propertyService from "@/services/property.service";
import roomService from "@/services/room.service";
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

// --- 1. VALIDATION SCHEMAS ---
const fileListValidation = (min = 3) => yup
  .mixed() 
  .test("required", `Cần ít nhất ${min} ảnh`, (val) => val && val.length >= min);

const baseSchemas = {
  step0: yup.object({ propertyType: yup.string().required("Chọn loại hình") }),
  step1: yup.object({
    province: yup.string().required("Chọn tỉnh/thành"),
    city: yup.string().required("Chọn quận/huyện"),
    address: yup.string().required("Nhập địa chỉ"),
  }),
  step2: yup.object({ amenities: yup.object().nullable() }),
  step3: yup.object({ propertyImages: fileListValidation(3) }),
  step4: yup.object({
    propertyName: yup.string().required("Nhập tên chỗ nghỉ"),
    description: yup.string().min(50, "Mô tả tối thiểu 50 ký tự").required(),
    area: yup.number().min(1, "Diện tích phải > 0").required("Bắt buộc nhập"),
  }),
  // ✅ Schema cho bước Setup Unit (Villa/Homestay)
  stepUnit: yup.object({
    unitData: yup.object().shape({
      price: yup.number().min(10000, "Giá tối thiểu 10,000đ").required("Nhập giá"),
      capacity: yup.number().min(1, "Sức chứa tối thiểu 1").required("Nhập sức chứa"),
      // Thay thế bedConfig bằng description
      description: yup.string().required("Vui lòng nhập mô tả chi tiết về căn"), 
    })
  }),
  stepReview: yup.object({
    terms: yup.boolean().oneOf([true], "Bạn phải đồng ý điều khoản"),
  }),
};

export default function AddPropertyPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); 
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
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      propertyType: "HOTEL", // Mặc định
      country: "Việt Nam",
      amenities: {},
      province: "", city: "", address: "",
      propertyImages: null,
      propertyName: "", description: "", area: "",
      terms: false,
      // Dữ liệu cho Unit (Villa/Homestay)
      unitData: {
        price: 0, 
        capacity: 2, 
        description: "", // Thay bedConfig bằng description
        amenities: {}, 
        images: []
      }
    }
  });

  const propertyType = watch("propertyType");
  // ✅ Logic: Chỉ Villa và Homestay mới cần bước Setup Unit
  const isWholeUnit = ["VILLA", "HOMESTAY"].includes(propertyType); 

  // --- 3. CẤU HÌNH STEPS ĐỘNG ---
  const stepsConfig = useMemo(() => {
    const steps = [
      { id: 0, title: "Loại hình", component: Step0_PropertyType, schema: baseSchemas.step0 },
      { id: 1, title: "Vị trí", component: Step1_Location, schema: baseSchemas.step1 },
      { id: 2, title: "Tiện nghi", component: Step2_Amenities, schema: baseSchemas.step2 },
      { id: 3, title: "Hình ảnh", component: Step3_Images, schema: baseSchemas.step3 },
      { id: 4, title: "Chi tiết", component: Step4_Details, schema: baseSchemas.step4 },
    ];

    // Nếu là Villa/Homestay -> Chèn thêm bước "Thiết lập căn"
    if (isWholeUnit) {
      steps.push({ 
        id: 5, 
        title: "Thiết lập căn", 
        component: Step_WholeUnitSetup, 
        schema: baseSchemas.stepUnit 
      });
    }

    // Bước Review luôn ở cuối
    steps.push({ 
      id: isWholeUnit ? 6 : 5, 
      title: "Kiểm tra", 
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
    let isValid = true;

    if (currentSchema) {
      try {
        await currentSchema.validate(getValues(), { abortEarly: false });
      } catch (err) {
        isValid = false;
        err.inner.forEach(error => {
          setValue(error.path, getValues(error.path), { shouldValidate: true }); 
        });
        await trigger(); 
      }
    }

    if (isValid) {
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
    setError(null);

    try {
      // =======================================================
      // BƯỚC 1: TẠO PROPERTY (FormData)
      // =======================================================
      const propertyPayload = { ...data };
      
      // Xóa các trường thừa không thuộc Property DTO
      delete propertyPayload.propertyImages;
      delete propertyPayload.unitData; 
      delete propertyPayload.terms;

      const propertyFormData = new FormData();
      propertyFormData.append("propertyData", new Blob([JSON.stringify(propertyPayload)], { type: "application/json" }));
      
      if (data.propertyImages) {
        Array.from(data.propertyImages).forEach(file => propertyFormData.append("propertyImages", file));
      }

      console.log("📦 Đang tạo Property...");
      const res = await propertyService.submitPropertyApplication(propertyFormData);
      
      // Lấy ID trả về
      const newPropertyId = res.data?.propertyId || res.data?.id;

      if (!newPropertyId) {
        throw new Error("Không lấy được ID của cơ sở mới tạo.");
      }
      console.log("✅ Property ID:", newPropertyId);

      // =======================================================
      // BƯỚC 2: TẠO ROOM CHO VILLA/HOMESTAY (FormData)
      // =======================================================
      if (isWholeUnit) {
        const unitData = data.unitData;

        // 1. Convert Amenities từ Map -> List ["wifi", "tv"]
        const roomAmenitiesList = unitData.amenities 
          ? Object.keys(unitData.amenities).filter(key => unitData.amenities[key] === true)
          : [];

        // 2. Chuẩn bị JSON roomData
        const roomDataObj = {
          propertyId: newPropertyId,
          roomName: unitData.name || data.propertyName, // Tên căn
          roomCategory: "WHOLE", // ✅ Set mặc định là WHOLE
          pricePerNight: unitData.price,
          capacity: unitData.capacity,
          area: data.area, // Diện tích lấy từ property (Step 4)
          description: unitData.description, // ✅ Lấy từ description của unit (Step_WholeUnitSetup)
          amenities: roomAmenitiesList
        };

        // 3. Tạo FormData cho Room
        const roomFormData = new FormData();
        roomFormData.append("roomData", new Blob([JSON.stringify(roomDataObj)], { type: "application/json" }));

        // 4. Đính kèm ảnh phòng (Nếu có upload ảnh riêng)
        if (unitData.images && unitData.images.length > 0) {
           Array.from(unitData.images).forEach(file => {
              roomFormData.append("images", file);
           });
        } 

        console.log("📦 Đang tạo Room cho Villa (FormData)...", roomDataObj);
        
        // Gọi hàm addRoom (hỗ trợ FormData)
        await roomService.addRoom(roomFormData); 
        
        console.log("✅ Tạo Room thành công!");
      }

      // Thành công -> Chuyển sang trang Status
      setCurrentStep(stepsConfig.length); 

    } catch (err) {
      console.error("Lỗi Submit:", err);
      const serverMessage = err.response?.data?.message || err.message;
      setError(`Lỗi: ${serverMessage}`);
      setCurrentStep(stepsConfig.length); 
    } finally {
      setIsLoading(false);
    }
  };

  // --- 6. RENDER ---
  
  // Render component Status (Bước cuối cùng ngoài luồng stepper)
  if (currentStep === stepsConfig.length) {
    return <Step6_Status error={error} onRetry={() => { setError(null); setCurrentStep(stepsConfig.length - 2); }} />;
  }

  const StepComponent = CurrentStepConfig?.component;

  return (
    <>
      {isLoading && <LoadingOverlay message="Đang xử lý dữ liệu..." />}

      {/* Nút Quay lại */}
      {currentStep < stepsConfig.length && (
         <Button variant="ghost" onClick={handleBack} leftIcon={<ArrowLeft size={18} />} className="mb-4">
           Quay lại
         </Button>
      )}

      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        
        {/* Giao diện Bước 0 (Chọn loại hình) - Full width */}
        {currentStep === 0 ? (
          <form>
            <StepComponent watch={watch} setValue={setValue} />
            <div className="flex justify-end mt-8">
              <Button type="button" onClick={handleNext} rightIcon={<ArrowRight size={18} />} disabled={!propertyType}>
                Tiếp theo
              </Button>
            </div>
          </form>
        ) : (
          // Giao diện các bước tiếp theo (Có cột Stepper bên trái)
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-1">
              <VerticalStepper steps={stepperItems} currentStep={currentStep - 1} />
            </div>
            
            <div className="md:col-span-3">
              <form onSubmit={handleSubmit(() => {})}> {/* Prevent default submit */}
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  {CurrentStepConfig.title}
                </h2>
                
                {/* Render Step Content */}
                {StepComponent && (
                  <StepComponent 
                    register={register} 
                    errors={errors} 
                    watch={watch} 
                    setValue={setValue} 
                    control={control}
                    trigger={trigger}
                  />
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-end pt-8 mt-8 border-t border-gray-100">
                  {currentStep === stepsConfig.length - 1 ? (
                    <Button 
                      type="button" 
                      onClick={handleSubmit(onFinalSubmit)} // Submit cuối cùng
                      leftIcon={<Send size={18} />} 
                      disabled={!watch("terms")}
                    >
                      Gửi đơn đăng ký
                    </Button>
                  ) : (
                    <Button type="button" onClick={handleNext} rightIcon={<ArrowRight size={18} />}>
                      Tiếp theo
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