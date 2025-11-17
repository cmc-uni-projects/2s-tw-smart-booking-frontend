import React from 'react';
// Import các component input đẹp
import StyledTextField from '@/components/common/Input/StyledTextField'; 
import DatePickerInput from '@/components/common/Input/DatePickerInput';
import FileUpload from '@/components/common/Input/FileUpload';
// Import icon
import { User, Mail, Phone, Hash, Home, MapPin } from 'lucide-react';

const Step1_PersonalInfo = ({ 
  register, 
  errors, 
  watch, // ✅ Prop 'watch' này đã có sẵn
  setValue, 
  profileData, 
  isDataLoading 
}) => {

  // Logic 'disabled' (giữ nguyên)
  const isFullNameDisabled = isDataLoading || !!profileData?.fullName;
  const isEmailDisabled = isDataLoading || !!profileData?.email;
  const isPhoneDisabled = isDataLoading || !!profileData?.phoneNumber;
  const isDobDisabled = isDataLoading || !!profileData?.birthDate; 

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">1. Thông tin cá nhân</h2>
      
      {/* (Họ tên, Email, SĐT, CCCD, Ngày sinh, Quê quán, Địa chỉ - giữ nguyên) */}
      <StyledTextField
        label="Họ và tên"
        icon={<User size={16} />}
        {...register("personalFullName")}
        error={errors.personalFullName?.message}
        disabled={isFullNameDisabled} 
      />
      
      <StyledTextField
        label="Email liên hệ"
        icon={<Mail size={16} />}
        {...register("personalEmail")}
        error={errors.personalEmail?.message}
        disabled={isEmailDisabled} 
      />
      
      <StyledTextField
        label="Số điện thoại"
        icon={<Phone size={16} />}
        {...register("personalPhone")}
        error={errors.personalPhone?.message}
        disabled={isPhoneDisabled} 
      />
      
      <StyledTextField
        label="Số CCCD/Passport"
        icon={<Hash size={16} />}
        {...register("personalIdCard")}
        error={errors.personalIdCard?.message}
        disabled={isDataLoading} 
      />

      <DatePickerInput
        label="Ngày sinh"
        value={watch("personalDob")} 
        onChange={(date) => setValue("personalDob", date, { shouldValidate: true })}
        error={errors.personalDob?.message}
        disabled={isDobDisabled} 
      />

      <StyledTextField
        label="Quê quán"
        icon={<Home size={16} />}
        {...register("personalHometown")}
        error={errors.personalHometown?.message}
        disabled={isDataLoading}
      />
      <StyledTextField
        label="Địa chỉ thường trú"
        icon={<MapPin size={16} />}
        {...register("personalAddress")}
        error={errors.personalAddress?.message}
        disabled={isDataLoading}
      />
      
      {/* Upload ảnh (SỬA LỖI Ở ĐÂY) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FileUpload
          label="Ảnh mặt trước CCCD"
          name="personalIdFront"
          watch={watch} // ✅ SỬA: Thêm prop 'watch'
          setValue={setValue}
          error={errors.personalIdFront?.message}
        />
        <FileUpload
          label="Ảnh mặt sau CCCD"
          name="personalIdBack"
          watch={watch} // ✅ SỬA: Thêm prop 'watch'
          setValue={setValue}
          error={errors.personalIdBack?.message}
        />
      </div>
    </div>
  );
};

export default Step1_PersonalInfo;
