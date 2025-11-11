import React from "react";
import TextField from "@/components/common/Input/TextField";
import DatePicker from "@/components/common/Input/DatePicker"; 
import FileUpload from "@/components/common/Input/FileUpload"; 
import { User, Mail, Phone, Info, Home, MapPin, Image } from "lucide-react"; 

export default function Step1_PersonalInfo({
  register,
  errors,
  watch,
  setValue,
}) {
  const handleChange = (name, value) => {
    setValue(name, value, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-xl font-semibold text-gray-700">
        Thông tin cá nhân của chủ sở hữu
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextField
          label="Họ và tên"
          icon={<User size={18} />}
          name="personalFullName"
          value={watch("personalFullName")}
          onChange={(e) => handleChange(e.target.name, e.target.value)}
          error={errors.personalFullName?.message}
        />
        <TextField
          label="Email cá nhân"
          type="email"
          icon={<Mail size={18} />}
          name="personalEmail"
          value={watch("personalEmail")}
          onChange={(e) => handleChange(e.target.name, e.target.value)}
          error={errors.personalEmail?.message}
        />
        <TextField
          label="Số điện thoại cá nhân"
          icon={<Phone size={18} />}
          name="personalPhone"
          value={watch("personalPhone")}
          onChange={(e) => handleChange(e.target.name, e.target.value)}
          error={errors.personalPhone?.message}
        />
        <TextField
          label="Số CCCD/Passport"
          icon={<Info size={18} />}
          name="personalIdCard"
          value={watch("personalIdCard")}
          onChange={(e) => handleChange(e.target.name, e.target.value)}
          error={errors.personalIdCard?.message}
        />
        <DatePicker
          label="Ngày sinh"
          value={watch("personalDob")}
          onChange={(val) => handleChange("personalDob", val)}
          error={errors.personalDob?.message}
        />
        <TextField
          label="Quê quán"
          icon={<Home size={18} />}
          name="personalHometown"
          value={watch("personalHometown")}
          onChange={(e) => handleChange(e.target.name, e.target.value)}
          error={errors.personalHometown?.message}
        />
        <TextField
          label="Địa chỉ thường trú"
          icon={<MapPin size={18} />}
          name="personalAddress"
          value={watch("personalAddress")}
          onChange={(e) => handleChange(e.target.name, e.target.value)}
          error={errors.personalAddress?.message}
          className="md:col-span-2" 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FileUpload
          label="Ảnh mặt trước CCCD"
          icon={<Image size={20} />}
          multiple={false}
          accept="image/png, image/jpeg, image/webp"
          value={watch("personalIdFront")}
          onChange={(e) =>
            setValue("personalIdFront", e.target.files, {
              shouldValidate: true,
            })
          }
          onClear={() => setValue("personalIdFront", null, { shouldValidate: true })}
          error={errors.personalIdFront?.message}
          helpText="Chỉ nhận file JPG, PNG, WEBP."
        />
        <FileUpload
          label="Ảnh mặt sau CCCD"
          icon={<Image size={20} />}
          multiple={false}
          accept="image/png, image/jpeg, image/webp"
          value={watch("personalIdBack")}
          onChange={(e) =>
            setValue("personalIdBack", e.target.files, {
              shouldValidate: true,
            })
          }
          onClear={() => setValue("personalIdBack", null, { shouldValidate: true })}
          error={errors.personalIdBack?.message}
          helpText="Chỉ nhận file JPG, PNG, WEBP."
        />
      </div>
    </div>
  );
}