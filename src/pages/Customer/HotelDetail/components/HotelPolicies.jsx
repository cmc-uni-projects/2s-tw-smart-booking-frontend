import React from "react";
import { ShieldCheck, Clock, AlertCircle, Check, Ban, Baby } from "lucide-react";
import { useTranslation } from "react-i18next";

const formatTime = (time) => time ? time.slice(0, 5) : "---";

const HotelPolicies = ({ policies }) => {
    const { t } = useTranslation(["hotel", "common"]);
  return (
    <section id="policies" className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 scroll-mt-32">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <ShieldCheck className="text-[rgb(40,169,224)]" /> {t("policies.title")}
        </h3>
        
        {policies ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Thời gian */}
                <div>
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">{t("policies.time")}</h4>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2 text-gray-700 font-medium"><Clock size={16}/> {t("common:checkIn")}</div>
                            <span className="font-bold text-blue-600">{formatTime(policies.checkInTime)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2 text-gray-700 font-medium"><Clock size={16}/> {t("common:checkOut")}</div>
                            <span className="font-bold text-orange-600">{formatTime(policies.checkOutTime)}</span>
                        </div>
                    </div>
                </div>

                {/* Quy định khác */}
                <div>
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">{t("policies.other")}</h4>
                    <ul className="space-y-3 text-sm">
                        <li className="flex items-start gap-2">
                            <div className={`mt-0.5 ${policies.allowFreeCancellation ? 'text-green-500' : 'text-red-500'}`}><AlertCircle size={16}/></div>
                            <div>
                                <span className="font-bold text-gray-700">{t("policies.cancellation")}</span>
                                <span className="text-gray-600">
                                    {policies.allowFreeCancellation ? t("policies.freeBefore", { count: policies.freeCancellationDays }) : t("policies.nonRefundable")}
                                </span>
                            </div>
                        </li>
                        <li className="flex items-center gap-2">
                            {policies.smokingAllowed ? <Check size={16} className="text-green-500"/> : <Ban size={16} className="text-red-500"/>}
                            <span className="text-gray-700">{t("policies.smoking")} <strong>{policies.smokingAllowed ? t("policies.allowed") : t("policies.forbidden")}</strong></span>
                        </li>
                        <li className="flex items-center gap-2">
                            {policies.petsAllowed ? <Check size={16} className="text-green-500"/> : <Ban size={16} className="text-red-500"/>}
                            <span className="text-gray-700">{t("policies.pets")} <strong>{policies.petsAllowed ? t("policies.allowed") : t("policies.no")}</strong></span>
                        </li>
                        <li className="flex items-center gap-2">
                            <Baby size={16} className="text-blue-500"/>
                            <span className="text-gray-700">{t("policies.children")} <strong>{policies.childrenAllowed ? t("policies.suitable") : t("policies.notSuitable")}</strong></span>
                        </li>
                    </ul>
                </div>
                
                {/* Full width note */}
                {(policies.cancellationPolicyDescription || policies.securityDepositRequired) && (
                    <div className="md:col-span-2 bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-sm text-yellow-800 mt-2">
                        <strong>{t("policies.note")}</strong>
                        {policies.cancellationPolicyDescription}
                        {policies.securityDepositRequired && t("policies.deposit", { amount: new Intl.NumberFormat('vi-VN').format(policies.securityDepositAmount) })}
                    </div>
                )}
            </div>
        ) : (
            <p className="text-gray-500 italic">{t("policies.pending")}</p>
        )}
    </section>
  );
};

export default HotelPolicies;