// src/pages/Owner/TermsOfService/TermsOfService.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FileText, CheckCircle2 } from "lucide-react";
import Button from "@/components/common/Button/Button";
import Card from "@/components/common/Card/Card";
import { useTranslation } from "react-i18next";

const Section = ({ title, children }) => (
    <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <CheckCircle2 size={18} className="text-[rgb(40,169,224)]" />
            {title}
        </h3>
        <div className="text-gray-600 text-sm leading-relaxed space-y-2 text-justify">
            {children}
        </div>
    </div>
);

const TermsOfService = () => {
  const { t } = useTranslation();
    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="text-center mb-10">
                    <Link to="/" className="inline-block mb-4">
                        <img
                            src="/assets/logo/logo_travelmate_xoafont.png"
                            alt="TravelMate"
                            className="h-12 object-contain"
                        />
                    </Link>
                    <h1 className="text-3xl font-extrabold text-gray-900">{t("owner:TermsOfService.termsOfServiceForPartners")}</h1>
                    <p className="text-gray-500 mt-2">{t("owner:TermsOfService.lastUpdated18112025")}</p>
                </div>

                <Card className="p-8 md:p-12 shadow-lg">
                    {/* Giới thiệu */}
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl mb-8 flex gap-4">
                        <FileText className="text-[rgb(40,169,224)] flex-shrink-0 mt-1" size={24} />
                        <div>
                            <h4 className="font-semibold text-blue-900">{t("owner:TermsOfService.partnershipAgreement")}</h4>
                            <p className="text-sm text-blue-800 mt-1">
                                {t("owner:TermsOfService.byRegisteringAsAPartner")}
                            </p>
                        </div>
                    </div>

                    {/* Nội dung chính */}
                    <Section title={t("owner:TermsOfService.n1OwnerResponsibilities")}>
                        <p>
                            {t("owner:TermsOfService.ownersCommitToProvidingAccurate")}
                        </p>
                        <p>
                            {t("owner:TermsOfService.youAreResponsibleForEnsuring")}
                        </p>
                    </Section>

                    <Section title={t("owner:TermsOfService.n2BookingPaymentPolicy")}>
                        <p>
                            {t("owner:TermsOfService.travelmateActsAsAnIntermediary")}
                        </p>
                        <p>
                            {t("owner:TermsOfService.revenueFromRoomRentalsIs")}
                        </p>
                    </Section>

                    <Section title={t("owner:TermsOfService.n3ContentPhotoStandards")}>
                        <p>
                            {t("owner:TermsOfService.allPhotosUploadedToThe")}
                        </p>
                        <p>
                            {t("owner:TermsOfService.travelmateMayRemoveAnyContent")}
                        </p>
                    </Section>

                    <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col items-center">
                        <p className="text-gray-500 italic text-sm mb-6 text-center">
                            {t("owner:TermsOfService.forAnyQuestionsPleaseContact")} <strong>partners@travelmate.vn</strong>
                        </p>
                        <Button onClick={() => window.close()}>
                            {t("owner:TermsOfService.understoodCloseTab")}
                        </Button>
                    </div>

                </Card>
            </div>
        </div>
    );
};

export default TermsOfService;