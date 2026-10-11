import React from "react";
import { 
  Clock, Ban, Baby, Dog, CreditCard, AlertTriangle, 
  ShieldCheck, DollarSign, Check, X 
} from "lucide-react";
import { useTranslation } from "react-i18next";

// Helper format tiền
const formatMoney = (amount) => {
  if (!amount) return "0";
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

// Helper format giờ
const formatTime = (time) => time ? time.slice(0, 5) : "---";

// Component hiển thị một mục chính sách (Card nhỏ)
const PolicyItem = ({ icon, label, status, children, isAllowed }) => (
  <div className={`p-4 rounded-xl border ${isAllowed ? 'bg-green-50/50 border-green-100' : 'bg-gray-50 border-gray-100'} h-full flex flex-col`}>
    <div className="flex items-center gap-3 mb-2">
      <div className={`p-2 rounded-full ${isAllowed ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">{label}</p>
        <div className="flex items-center gap-1.5">
          {isAllowed ? <Check size={14} className="text-green-600" /> : <X size={14} className="text-gray-400" />}
          <span className={`font-bold text-sm ${isAllowed ? 'text-green-700' : 'text-gray-600'}`}>
            {status}
          </span>
        </div>
      </div>
    </div>
    {/* Phần mô tả chi tiết */}
    {children && (
      <div className="mt-auto pt-3 border-t border-gray-200/50 text-xs text-gray-700 space-y-1 italic">
        {children}
      </div>
    )}
  </div>
);

const PropertyPoliciesView = ({ policies }) => {
  const { t } = useTranslation();
  if (!policies) return (
    <div className="p-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-400 italic">
      {t("admin:PropertyPoliciesView.noPolicyInformationYet")}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
        <ShieldCheck size={20} className="text-orange-500" />
        <h3 className="text-base font-bold text-gray-800">{t("admin:PropertyPoliciesView.detailedPoliciesRules")}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 1. Thời gian (Check-in/out) */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <h4 className="font-bold text-gray-700 flex items-center gap-2">
            <Clock size={18} className="text-blue-500" /> {t("admin:PropertyPoliciesView.checkInCheckOutTimes")}
          </h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
              <span className="text-xs text-gray-500 block mb-1 font-medium">{t("admin:PropertyPoliciesView.checkInFrom")}</span>
              <span className="text-xl font-extrabold text-gray-900">
                {formatTime(policies.checkInTime)}
              </span>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
              <span className="text-xs text-gray-500 block mb-1 font-medium">{t("admin:PropertyPoliciesView.checkOutBefore")}</span>
              <span className="text-xl font-extrabold text-gray-900">
                {formatTime(policies.checkOutTime)}
              </span>
            </div>
          </div>

          {policies.quietHours && policies.quietHours !== "không có" /* i18n-ignore: placeholder value stored in data */ && (
            <div className="flex gap-2 items-start bg-gray-50 p-3 rounded-lg text-sm text-gray-600 border border-gray-100">
               <span className="shrink-0">🤫</span>
               <span><strong>{t("admin:PropertyPoliciesView.quietHours")}</strong> {policies.quietHours}</span>
            </div>
          )}
        </div>

        {/* 2. Hủy phòng (Cancellation) */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <h4 className="font-bold text-gray-700 flex items-center gap-2">
            <AlertTriangle size={18} className="text-red-500" /> {t("admin:PropertyPoliciesView.cancellationPolicy")}
          </h4>
          
          <div className={`p-4 rounded-xl border ${policies.allowFreeCancellation ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
             <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">{t("admin:PropertyPoliciesView.freeCancellationAllowed")}</span>
                <span className={`px-2 py-1 rounded text-xs font-bold ${policies.allowFreeCancellation ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                  {policies.allowFreeCancellation ? t("admin:PropertyPoliciesView.yes") : t("admin:PropertyPoliciesView.no")}
                </span>
             </div>
             
             {policies.allowFreeCancellation ? (
                <p className="text-sm text-gray-800 mb-2">
                   {t("admin:PropertyPoliciesView.cancelAtLeast")} <strong className="text-green-700 text-lg">{t("admin:PropertyPoliciesView.days", { freeCancellationDays: policies.freeCancellationDays })}</strong> {t("admin:PropertyPoliciesView.inAdvanceForFree")}
                </p>
             ) : (
                <p className="text-sm text-red-600 font-medium">{t("admin:PropertyPoliciesView.guestsWillNotBeRefunded")}</p>
             )}

             {policies.cancellationPolicyDescription && (
                <div className="text-xs text-gray-600 italic border-t border-gray-200/50 pt-2 mt-2">
                   "{policies.cancellationPolicyDescription}"
                </div>
             )}
          </div>
        </div>
      </div>

      {/* 3. Các quy định chi tiết (Grid 3 cột) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Hút thuốc */}
        <PolicyItem 
          icon={<Ban size={18}/>} 
          label={t("admin:PropertyPoliciesView.smoking")} 
          status={policies.smokingAllowed ? t("admin:PropertyPoliciesView.allowed") : t("admin:PropertyPoliciesView.noSmoking")}
          isAllowed={policies.smokingAllowed}
        >
           {policies.smokingPolicyDescription && (
              <p>"{policies.smokingPolicyDescription}"</p>
           )}
        </PolicyItem>

        {/* Thú cưng */}
        <PolicyItem 
          icon={<Dog size={18}/>} 
          label={t("admin:PropertyPoliciesView.pets")} 
          status={policies.petsAllowed ? t("admin:PropertyPoliciesView.allowed") : t("admin:PropertyPoliciesView.notAllowed")}
          isAllowed={policies.petsAllowed}
        >
           {policies.petPolicyDescription && (
              <p>"{policies.petPolicyDescription}"</p>
           )}
        </PolicyItem>

        {/* Trẻ em */}
        <PolicyItem 
          icon={<Baby size={18}/>} 
          label={t("admin:PropertyPoliciesView.children")} 
          status={policies.childrenAllowed ? t("admin:PropertyPoliciesView.suitable") : t("admin:PropertyPoliciesView.restricted")}
          isAllowed={policies.childrenAllowed}
        >
           {policies.minimumAge > 0 && (
              <p className="font-bold text-gray-800 not-italic">{t("admin:PropertyPoliciesView.minimumAge", { minimumAge: policies.minimumAge })}</p>
           )}
           {policies.childrenPolicyDescription && (
              <p>"{policies.childrenPolicyDescription}"</p>
           )}
        </PolicyItem>

      </div>

      {/* 4. Thanh toán & Đặt cọc (Full Width) */}
      {(policies.requiresPrepayment || policies.securityDepositRequired) && (
        <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100">
          <h4 className="font-bold text-blue-800 flex items-center gap-2 mb-4">
             <CreditCard size={18} /> {t("admin:PropertyPoliciesView.paymentDeposit")}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Prepayment */}
             <div className="flex gap-3">
                 <div className={`w-1 h-full rounded-full ${policies.requiresPrepayment ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                 <div>
                    <p className="text-sm font-bold text-gray-700 mb-1">{t("admin:PropertyPoliciesView.prepayment")}</p>
                    <p className="text-sm text-gray-600">
                       {policies.requiresPrepayment ? (policies.prepaymentPolicy || t("admin:PropertyPoliciesView.accordingToGeneralRules")) : t("admin:PropertyPoliciesView.notRequired")}
                    </p>
                 </div>
             </div>

             {/* Deposit */}
             <div className="flex gap-3">
                 <div className={`w-1 h-full rounded-full ${policies.securityDepositRequired ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
                 <div>
                    <p className="text-sm font-bold text-gray-700 mb-1">{t("admin:PropertyPoliciesView.damageDeposit")}</p>
                    {policies.securityDepositRequired ? (
                       <div className="space-y-1">
                          <p className="text-lg font-bold text-green-600">
                             {formatMoney(policies.securityDepositAmount)}
                          </p>
                          <p className="text-xs text-gray-500 italic">
                             "{policies.securityDepositDescription || t("admin:PropertyPoliciesView.refundedAtCheckOut")}"
                          </p>
                       </div>
                    ) : (
                       <p className="text-sm text-gray-600">{t("admin:PropertyPoliciesView.notRequired")}</p>
                    )}
                 </div>
             </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PropertyPoliciesView;