import React from "react";
import TextField from "../../../../components/common/Input/TextField";
import FileUpload from "../../../../components/common/Input/FileUpload";

// ✅ Nhận `errors` từ props
export default function Step3_BusinessInfo({ formData, onChange, onFileChange, errors = {} }) {
    return (
        <div className="space-y-5">
            <TextField
                label="Mã số kinh doanh"
                name="businessLicenseNumber"
                value={formData.businessLicenseNumber}
                onChange={onChange}
                required
                error={errors.businessLicenseNumber} // ✅ Truyền lỗi
            />
            <FileUpload
                label="Ảnh chụp Giấy phép kinh doanh"
                name="businessLicenseImage"
                onChange={onFileChange}
                required
                error={errors.businessLicenseImage} // ✅ Truyền lỗi
            />
            <p className="text-sm text-gray-600">
                Bằng việc gửi đơn, bạn đồng ý với các Điều khoản & Dịch vụ của TravelMate.
            </p>
        </div>
    );
}