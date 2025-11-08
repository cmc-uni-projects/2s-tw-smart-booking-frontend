import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { ownerService } from "../../../services/owner.service";
import Card from "../../../components/common/Card/Card";
import Button from "../../../components/common/Button/Button";
import Toast from "../../../components/common/Notification/Toast";
import ToastPortal from "../../../components/common/Notification/ToastPortal";
import Stepper from "./BecomeOwnerSteps/Stepper";
// ❌ Xóa import Step1_HotelInfo
import Step2_PersonalInfo from "./BecomeOwnerSteps/Step2_PersonalInfo";
import Step3_BusinessInfo from "./BecomeOwnerSteps/Step3_BusinessInfo";
import Step4_Success from "./BecomeOwnerSteps/Step4_Success";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";
import { isAfter, subYears } from "date-fns";

// ✅ THAY ĐỔI TẠI ĐÂY: Xóa các trường của Step 1
const INITIAL_STATE = {
    // Step 1 (trước là Step 2)
    fullName: "",
    dob: "",
    gender: "",
    idNumber: "",
    idFrontImage: null,
    idBackImage: null,
    // Step 2 (trước là Step 3)
    businessLicenseNumber: "",
    businessLicenseImage: null,
};

export default function BecomeOwnerPage() {
    const { currentUser } = useAuth();
    const [currentStep, setCurrentStep] = useState(1); // Vẫn bắt đầu = 1
    const [formData, setFormData] = useState(INITIAL_STATE);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const [toastMsg, setToastMsg] = useState("");
    const [toastType, setToastType] = useState("info");
    const [showToast, setShowToast] = useState(false);

    const showToastOnce = (msg, type = "error") => {
        setToastMsg(msg);
        setToastType(type);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const handleFileChange = (name, file) => {
        setFormData((prev) => ({ ...prev, [name]: file }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    // ❌ Xóa hàm validateStep1 (Hotel Info)

    // ✅ THAY ĐỔI TẠI ĐÂY: Đổi tên validateStep2 -> validateStep1_Personal
    const validateStep1_Personal = () => {
        const newErrors = {};
        if (!formData.fullName) newErrors.fullName = "Vui lòng nhập họ và tên.";

        if (!formData.idNumber) {
            newErrors.idNumber = "Vui lòng nhập số CCCD / CMT.";
        } else if (!/^\d{12}$/.test(formData.idNumber)) {
            newErrors.idNumber = "Số CCCD/CMT phải có đúng 12 chữ số.";
        }

        if (!formData.dob) {
            newErrors.dob = "Vui lòng chọn ngày sinh.";
        } else {
            const dobDate = new Date(formData.dob);
            const today = new Date();
            const eighteenYearsAgo = subYears(today, 18);

            if (isAfter(dobDate, today)) {
                newErrors.dob = "Ngày sinh không được ở tương lai.";
            } else if (isAfter(dobDate, eighteenYearsAgo)) {
                newErrors.dob = "Bạn phải đủ 18 tuổi để đăng ký.";
            }
        }

        if (!formData.idFrontImage) newErrors.idFrontImage = "Vui lòng tải ảnh mặt trước CCCD.";
        if (!formData.idBackImage) newErrors.idBackImage = "Vui lòng tải ảnh mặt sau CCCD.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ✅ THAY ĐỔI TẠI ĐÂY: Đổi tên validateStep3 -> validateStep2_Business
    const validateStep2_Business = () => {
        const newErrors = {};
        if (!formData.businessLicenseNumber) newErrors.businessLicenseNumber = "Vui lòng nhập mã số kinh doanh.";
        if (!formData.businessLicenseImage) newErrors.businessLicenseImage = "Vui lòng tải ảnh giấy phép kinh doanh.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ✅ THAY ĐỔI TẠI ĐÂY: Cập nhật logic
    const handleNextStep = () => {
        let isValid = false;

        if (currentStep === 1) {
            isValid = validateStep1_Personal(); // Chỉ validate bước 1 (cá nhân)
        }

        if (isValid) {
            setCurrentStep((prev) => prev + 1);
        } else {
            showToastOnce("Vui lòng điền đầy đủ thông tin bắt buộc.", "warning");
        }
    };

    const handlePrevStep = () => {
        setCurrentStep((prev) => prev - 1);
    };

    // ✅ THAY ĐỔI TẠI ĐÂY: Cập nhật logic
    const handleSubmit = async () => {
        // Validate bước cuối (step 2)
        if (!validateStep2_Business()) {
            showToastOnce("Vui lòng kiểm tra lại thông tin.", "warning");
            return;
        }

        setLoading(true);
        const data = new FormData();

        if (currentUser) {
            data.append("userId", currentUser.id);
        }

        Object.entries(formData).forEach(([key, value]) => {
            if (typeof value === "string") {
                data.append(key, value);
            }
        });

        if (formData.idFrontImage) data.append("idFrontImage", formData.idFrontImage);
        if (formData.idBackImage) data.append("idBackImage", formData.idBackImage);
        if (formData.businessLicenseImage) data.append("businessLicenseImage", formData.businessLicenseImage);

        try {
            await ownerService.submitApplication(data);
            setCurrentStep(3); // Chuyển sang trang thành công (bước 3 mới)
        } catch (err) {
            console.error("Submit error:", err);
            showToastOnce(err.response?.data?.message || "Gửi đơn thất bại, vui lòng thử lại.", "error");
        } finally {
            setLoading(false);
        }
    };

    // ✅ THAY ĐỔI TẠI ĐÂY: Cập nhật logic
    const renderButtons = () => {
        if (currentStep === 3) return null; // Bước 3 mới là trang Success

        return (
            <div className="flex justify-between items-center pt-6 border-t border-gray-200 mt-8">
                <Button
                    variant="ghost"
                    onClick={handlePrevStep}
                    disabled={currentStep === 1 || loading}
                    leftIcon={<ArrowLeft size={16} />}
                >
                    Quay lại
                </Button>

                {currentStep === 2 ? ( // Gửi đơn ở bước 2
                    <Button
                        onClick={handleSubmit}
                        isLoading={loading}
                        disabled={loading}
                        leftIcon={<Send size={16} />}
                    >
                        Gửi đơn đăng ký
                    </Button>
                ) : ( // Nút "Tiếp theo" ở bước 1
                    <Button
                        onClick={handleNextStep}
                        rightIcon={<ArrowRight size={16} />}
                    >
                        Tiếp theo
                    </Button>
                )}
            </div>
        );
    };

    // ✅ THAY ĐỔI TẠI ĐÂY: Cập nhật logic
    const renderCurrentStep = () => {
        switch (currentStep) {
            case 1:
                return <Step2_PersonalInfo formData={formData} onChange={handleChange} onFileChange={handleFileChange} errors={errors} />;
            case 2:
                return <Step3_BusinessInfo formData={formData} onChange={handleChange} onFileChange={handleFileChange} errors={errors} />;
            case 3:
                return <Step4_Success />;
            default:
                return <Step2_PersonalInfo formData={formData} onChange={handleChange} onFileChange={handleFileChange} errors={errors} />;
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="max-w-3xl mx-auto">
                <Card>
                    <div className="p-4 md:p-6">
                        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
                            Đăng ký trở thành đối tác
                        </h1>

                        <div className="mb-10">
                            <Stepper currentStep={currentStep} />
                        </div>

                        {renderCurrentStep()}
                        {renderButtons()}
                    </div>
                </Card>
            </div>

            <ToastPortal>
                {showToast && (
                    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999]">
                        <Toast message={toastMsg} type={toastType} />
                    </div>
                )}
            </ToastPortal>
        </div>
    );
}