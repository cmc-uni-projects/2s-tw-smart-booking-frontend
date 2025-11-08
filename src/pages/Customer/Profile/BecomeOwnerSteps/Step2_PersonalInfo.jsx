import React from "react";
import TextField from "../../../../components/common/Input/TextField";
import DatePicker from "../../../../components/common/Input/DatePicker";
import Select from "../../../../components/common/Select/Select";
import FileUpload from "../../../../components/common/Input/FileUpload";

// 1. Thêm import cho icon
import { User, CreditCard } from "lucide-react";

export default function Step2_PersonalInfo({ formData, onChange, onFileChange, errors = {} }) {
    return (
        <div className="space-y-5">
            <TextField
                label="Họ và tên"
                name="fullName"
                value={formData.fullName}
                onChange={onChange}
                required
                error={errors.fullName}
                // 2. Thêm icon User vào đây
                leftIcon={<User size={18} className="text-gray-400" />}
            />
            <DatePicker
                label="Ngày sinh"
                value={formData.dob}
                onChange={(value) => onChange({ target: { name: "dob", value } })}
                error={errors.dob}
            />
            <Select
                label="Giới tính"
                value={formData.gender}
                onChange={(label) => onChange({ target: { name: "gender", value: label } })}
                options={[
                    { label: "Nam", value: "male" },
                    { label: "Nữ", value: "female" },
                    { label: "Khác", value: "other" },
                ]}
            />
            <TextField
                label="Số CCCD / CMT (12 số)"
                name="idNumber"
                value={formData.idNumber}
                onChange={onChange}
                required
                error={errors.idNumber}
                // 3. Thêm icon CreditCard vào đây
                leftIcon={<CreditCard size={18} className="text-gray-400" />}
            />
            <FileUpload
                label="Ảnh mặt trước CCCD/CMT"
                name="idFrontImage"
                onChange={onFileChange}
                required
                error={errors.idFrontImage}
            />
            <FileUpload
                label="Ảnh mặt sau CCCD/CMT"
                name="idBackImage"
                onChange={onFileChange}
                required
                error={errors.idBackImage}
            />
        </div>
    );
}