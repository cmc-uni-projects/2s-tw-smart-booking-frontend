import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext"; //
import { ownerService } from "../../../services/owner.service";
import TextField from "../../../components/common/Input/TextField"; //
import TextArea from "../../../components/common/Input/TextArea"; //
import Button from "../../../components/common/Button/Button"; //
import Toast from "../../../components/common/Notification/Toast"; //
import ToastPortal from "../../../components/common/Notification/ToastPortal"; //
import { Send } from "lucide-react";

export default function BecomeOwnerForm() {
    const { currentUser } = useAuth(); // Lấy thông tin người dùng hiện tại
    const [formData, setFormData] = useState({
        hotelName: "",
        hotelAddress: "",
        contactPhone: "",
        businessLicense: "", // Mã số kinh doanh/giấy phép
        message: "",
    });
    const [loading, setLoading] = useState(false);

    // Toast state
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
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.hotelName || !formData.hotelAddress || !formData.contactPhone) {
            showToastOnce("Vui lòng điền các trường bắt buộc.", "warning");
            return;
        }

        setLoading(true);
        try {
            const applicationData = {
                ...formData,
                userId: currentUser.id, // Gắn ID người dùng vào đơn
                userEmail: currentUser.email // Gắn email người dùng
            };

            await ownerService.submitApplication(applicationData);

            showToastOnce("Đã gửi đơn đăng ký thành công!", "success");
            setFormData({
                hotelName: "",
                hotelAddress: "",
                contactPhone: "",
                businessLicense: "",
                message: "",
            }); // Reset form

        } catch (err) {
            console.error("Application error:", err);
            showToastOnce(err.response?.data?.message || "Gửi đơn thất bại, vui lòng thử lại.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-5">
                <TextField
                    label="Tên khách sạn / cơ sở"
                    name="hotelName"
                    value={formData.hotelName}
                    onChange={handleChange}
                    required
                />
                <TextField
                    label="Địa chỉ khách sạn"
                    name="hotelAddress"
                    value={formData.hotelAddress}
                    onChange={handleChange}
                    required
                />
                <TextField
                    label="Số điện thoại liên hệ"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    required
                />
                <TextField
                    label="Mã số kinh doanh / Giấy phép"
                    name="businessLicense"
                    value={formData.businessLicense}
                    onChange={handleChange}
                />
                <TextArea
                    label="Lời nhắn (giới thiệu về cơ sở của bạn...)"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                />

                {/* Tạm thời dùng input file, bạn có thể tạo component Upload sau */}
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                        Tài liệu đính kèm (nếu có)
                    </label>
                    <input
                        type="file"
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[rgb(40,169,224,0.1)] file:text-[rgb(40,169,224)] hover:file:bg-[rgb(40,169,224,0.2)]"
                    />
                    <p className="text-xs text-gray-500 mt-1">Hỗ trợ PDF, PNG, JPG.</p>
                </div>

                <Button
                    type="submit"
                    fullWidth
                    isLoading={loading}
                    leftIcon={<Send size={18} />}
                    disabled={loading}
                >
                    {loading ? "Đang gửi đơn..." : "Gửi đơn đăng ký"}
                </Button>
            </form>

            {/* Portal để hiển thị Toast */}
            <ToastPortal>
                {showToast && (
                    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999]">
                        <Toast message={toastMsg} type={toastType} />
                    </div>
                )}
            </ToastPortal>
        </>
    );
}