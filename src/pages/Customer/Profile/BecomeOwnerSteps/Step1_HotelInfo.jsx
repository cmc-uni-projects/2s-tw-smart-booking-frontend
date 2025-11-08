import React from "react";
import TextField from "../../../../components/common/Input/TextField";

// ✅ Nhận `errors` từ props
export default function Step1_HotelInfo({ formData, onChange, errors = {} }) {
    return (
        <div className="space-y-5">
            <TextField
                label="Tên khách sạn / cơ sở"
                name="hotelName"
                value={formData.hotelName}
                onChange={onChange}
                required
                error={errors.hotelName} // ✅ Truyền lỗi
            />
            <TextField
                label="Địa chỉ chi tiết"
                name="hotelAddress"
                value={formData.hotelAddress}
                onChange={onChange}
                required
                error={errors.hotelAddress} // ✅ Truyền lỗi
            />
            <TextField
                label="Số điện thoại liên hệ"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={onChange}
                required
                error={errors.contactPhone} // ✅ Truyền lỗi
            />
            <TextField
                label="Email liên hệ"
                name="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={onChange}
                required
                error={errors.contactEmail} // ✅ Truyền lỗi
            />
        </div>
    );
}