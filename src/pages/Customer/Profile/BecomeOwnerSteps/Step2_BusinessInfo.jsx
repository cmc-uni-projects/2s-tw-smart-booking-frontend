import React from "react";
import TextField from "@/components/common/Input/TextField";
import FileUpload from "@/components/common/Input/FileUpload";
import { FileText, Award } from "lucide-react";

export default function Step2_BusinessInfo({
  errors,
  setValue,
  watch,
}) {
  const handleChange = (name, value) => {
    setValue(name, value, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-xl font-semibold text-gray-700">
        Thông tin pháp lý và kinh doanh
      </h2>
      
      <TextField
        label="Mã số đăng ký kinh doanh"
        icon={<Award size={18} />}
        name="businessLicenseNumber"
        value={watch("businessLicenseNumber")}
        onChange={(e) => handleChange(e.target.name, e.target.value)}
        error={errors.businessLicenseNumber?.message}
      />
      
      <FileUpload
        label="Tải lên Giấy phép kinh doanh"
        icon={<FileText size={20} />}
        multiple={false}
        accept=".pdf, image/png, image/jpeg" 
        value={watch("businessLicenseFile")}
        onChange={(e) =>
          setValue("businessLicenseFile", e.target.files, {
            shouldValidate: true,
          })
        }
        onClear={() => setValue("businessLicenseFile", null, { shouldValidate: true })}
        error={errors.businessLicenseFile?.message}
        helpText="Chấp nhận file PDF, PNG, JPG."
      />
    </div>
  );
}