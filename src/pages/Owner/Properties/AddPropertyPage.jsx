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
import Step5_Details from "./AddPropertySteps/Step5_Details";
import Step6_Review from "./AddPropertySteps/Step6_Review";
import Step7_Status from "./AddPropertySteps/Step7_Status"; // --- 1. IMPORT STEP 7 ---

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

// 2. TẬP HỢP TẤT CẢ SCHEMA
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
    propertyImages: fileListValidation(3),
    roomTypes: yup.array().of(
      yup.object({
        images: fileListValidation(3) 
      })
    ),
  }),
  // Step 5: Details (index 5)
  yup.object({
    propertyName: yup.string().required("Tên cơ sở là bắt buộc"),
    description: yup.string().min(50, "Mô tả phải có ít nhất 50 ký tự").required("Mô tả là bắt buộc"),
    area: yup.number().min(1, "Diện tích phải > 0").required("Bắt buộc").typeError("Phải là số"),
  }),
  // Step 6: Review (index 6)
  yup.object({
    terms: yup.boolean().oneOf([true], "Bạn phải đồng ý với điều khoản dịch vụ"),
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
  const [error, setError] = useState(null); // Lưu lỗi submit
  const navigate = useNavigate();

  // 3. HỢP NHẤT TẤT CẢ SCHEMA
  // Chúng ta cần validation của TẤT CẢ các bước khi ở bước cuối
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
      propertyName: "",
      description: "",
      area: "",
      terms: false,
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
      case 5:
        return <Step5_Details {...props} />;
      case 6:
        return <Step6_Review {...props} />;
      // --- 4. THÊM CASE CHO STEP 7 ---
      case 7: 
        return <Step7_Status 
                  error={error} 
                  onRetry={() => { setError(null); setCurrentStep(6); }} // Quay lại bước 6 (Review)
                />;
      default:
        return <div>Lỗi: Bước không xác định</div>;
    }
  };

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

  // --- 5. HOÀN THIỆN LOGIC SUBMIT (Luồng 11) ---
  const onFinalSubmit = async (data) => {
    setIsLoading(true);
    setError(null);

    // 1. Tách dữ liệu JSON và File
    const jsonData = { ...data };
    // Xóa key ảnh khỏi bản sao JSON
    delete jsonData.propertyImages; 
    // Tạo mảng roomTypes mới không chứa key "images"
    jsonData.roomTypes = data.roomTypes.map(room => {
      const roomCopy = { ...room };
      delete roomCopy.images;
      return roomCopy;
    });

    // 2. Tạo FormData
    const formData = new FormData();
    
    // Thêm JSON data (backend sẽ parse chuỗi này)
    formData.append("propertyData", new Blob([JSON.stringify(jsonData)], { 
      type: "application/json"
    }));

    // 3. Thêm ảnh chung (dùng chung 1 key "propertyImages")
    if (data.propertyImages) {
      Array.from(data.propertyImages).forEach(file => {
        formData.append("propertyImages", file);
      });
    }

    // 4. Thêm ảnh phòng (dùng key động "room_INDEX_images")
    data.roomTypes.forEach((room, roomIndex) => {
      if (room.images) {
        Array.from(room.images).forEach(file => {
          formData.append(`room_${roomIndex}_images`, file);
        });
      }
    });

    // 5. Gọi API
    try {
      await propertyService.submitPropertyApplication(formData);
    } catch (err) {
      setError(err.message || "Một lỗi không xác định đã xảy ra.");
    } finally {
      setIsLoading(false);
      setCurrentStep(7); // Luôn chuyển đến trang Status
    }
  };

  return (
    <>
      {isLoading && <LoadingOverlay message="Đang gửi đơn đăng ký..." />}
      
      {/* 6. ẨN NÚT "QUAY LẠI" KHI Ở TRANG STATUS */}
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
              {/* 7. SỬ DỤNG onFinalSubmit KHI Ở BƯỚC 6 */}
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
                      disabled={!watch("terms")} // Vô hiệu hóa nếu chưa tick
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
           // --- GIAO DIỆN TRẠNG THÁI (STEP 7) ---
           renderStepComponent()
        )}
      </div>
    </>
  );
}