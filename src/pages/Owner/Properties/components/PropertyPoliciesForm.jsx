import React from "react"; // Bỏ useEffect thừa
import { 
  ShieldCheck, Ban, Dog, Baby, Check
} from "lucide-react";
import TextField from "@/components/common/Input/TextField";
import TextArea from "@/components/common/Input/TextArea";
import PolicyTimeSelector from "../AddPropertySteps/components/PolicyTimeSelector";
import { useTranslation } from "react-i18next"; 

// Component Toggle Switch
const ToggleSwitch = ({ label, checked, onChange, icon }) => (
  <div 
    onClick={() => onChange(!checked)}
    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all duration-200 select-none
      ${checked ? "border-[rgb(40,169,224)] bg-[rgb(40,169,224)]/5" : "border-gray-200 bg-white hover:border-gray-300"}
    `}
  >
    <div className="flex items-center gap-3">
      {icon && <div className={`p-2 rounded-full ${checked ? "bg-[rgb(40,169,224)] text-white" : "bg-gray-100 text-gray-500"}`}>{icon}</div>}
      <span className={`font-semibold text-sm ${checked ? "text-[rgb(40,169,224)]" : "text-gray-700"}`}>{label}</span>
    </div>
    <div className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${checked ? 'bg-[rgb(40,169,224)]' : 'bg-gray-300'}`}>
      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${checked ? 'translate-x-4' : ''}`} />
    </div>
  </div>
);

// ✅ COMPONENT GỌN GÀNG HƠN (Không cần xử lý initialData)
const PropertyPoliciesForm = ({ register, watch, setValue }) => {
  const { t } = useTranslation();
  const policies = watch("policies") || {};

  const handleToggle = (field) => {
    setValue(`policies.${field}`, !policies[field], { shouldDirty: true });
  };

  return (
    <div className="space-y-8 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
      <h3 className="text-lg font-bold text-[rgb(40,169,224)] flex items-center gap-2 mb-4">
        <ShieldCheck size={20} /> {t("owner:PropertyPoliciesForm.policySetup")}
      </h3>

      {/* 1. Thời gian */}
      <div className="space-y-4">
         <h4 className="text-sm font-bold text-gray-700 uppercase border-b border-gray-100 pb-2">{t("owner:PropertyPoliciesForm.checkInCheckOutTimes")}</h4>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PolicyTimeSelector 
                label={t("owner:PropertyPoliciesForm.checkInTime")} 
                // React Hook Form đã có value từ cha reset xuống, watch sẽ lấy được ngay
                value={policies.checkInTime} 
                onChange={(val) => setValue("policies.checkInTime", val, { shouldDirty: true })} 
            />
            <PolicyTimeSelector 
                label={t("owner:PropertyPoliciesForm.checkOutTime")} 
                value={policies.checkOutTime} 
                onChange={(val) => setValue("policies.checkOutTime", val, { shouldDirty: true })} 
            />
         </div>
         <TextField 
            label={t("owner:PropertyPoliciesForm.quietHours")} 
            placeholder="VD: 22:00 - 07:00" 
            {...register("policies.quietHours")} 
         />
      </div>

      {/* 2. Hủy phòng */}
      <div className="space-y-4">
         <h4 className="text-sm font-bold text-gray-700 uppercase border-b border-gray-100 pb-2">{t("owner:PropertyPoliciesForm.cancellationPolicy")}</h4>
         <ToggleSwitch 
            label={t("owner:PropertyPoliciesForm.allowFreeCancellation")} 
            checked={policies.allowFreeCancellation} 
            onChange={() => handleToggle("allowFreeCancellation")}
            icon={<Check size={16} />}
         />
         {policies.allowFreeCancellation && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
               <TextField 
                  label={t("owner:PropertyPoliciesForm.cancelBeforeDays")} 
                  type="number" 
                  {...register("policies.freeCancellationDays", { valueAsNumber: true })}
               />
               <div className="md:col-span-2">
                   <TextArea 
                      label={t("owner:PropertyPoliciesForm.cancellationPolicyDescription")} 
                      rows={2} 
                      {...register("policies.cancellationPolicyDescription")} 
                   />
               </div>
            </div>
         )}
      </div>

      {/* 3. Quy định khác */}
      <div className="space-y-4">
         <h4 className="text-sm font-bold text-gray-700 uppercase border-b border-gray-100 pb-2">{t("owner:PropertyPoliciesForm.otherRules")}</h4>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Hút thuốc */}
            <div className="space-y-2">
                <ToggleSwitch 
                    label={t("owner:PropertyPoliciesForm.smokingAllowed")} 
                    checked={policies.smokingAllowed} 
                    onChange={() => handleToggle("smokingAllowed")}
                    icon={<Ban size={16} />}
                />
                {policies.smokingAllowed && (
                    <TextField placeholder={t("owner:PropertyPoliciesForm.smokingArea")} {...register("policies.smokingPolicyDescription")} />
                )}
            </div>

            {/* Thú cưng */}
            <div className="space-y-2">
                <ToggleSwitch 
                    label={t("owner:PropertyPoliciesForm.petsAllowed")} 
                    checked={policies.petsAllowed} 
                    onChange={() => handleToggle("petsAllowed")}
                    icon={<Dog size={16} />}
                />
                {policies.petsAllowed && (
                    <TextField placeholder={t("owner:PropertyPoliciesForm.petRules")} {...register("policies.petPolicyDescription")} />
                )}
            </div>
            
            {/* Trẻ em (Bổ sung) */}
            <div className="space-y-2 md:col-span-2">
                <ToggleSwitch 
                    label={t("owner:PropertyPoliciesForm.suitableForChildren")} 
                    checked={policies.childrenAllowed} 
                    onChange={() => handleToggle("childrenAllowed")}
                    icon={<Baby size={16} />}
                />
                <div className="grid grid-cols-2 gap-4">
                    <TextField 
                        label={t("owner:PropertyPoliciesForm.minimumAge")} 
                        type="number" 
                        {...register("policies.minimumAge", { valueAsNumber: true })} 
                    />
                    {policies.childrenAllowed && (
                        <TextField 
                            label={t("owner:PropertyPoliciesForm.notesAboutChildren")} 
                            placeholder={t("owner:PropertyPoliciesForm.eGFreeForChildren")} 
                            {...register("policies.childrenPolicyDescription")} 
                        />
                    )}
                </div>
            </div>

         </div>
      </div>
    </div>
  );
};

export default PropertyPoliciesForm;