// src/pages/Customer/Profile/LanguageSettings.jsx
import React from "react";
import Card from "@/components/common/Card/Card";
import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguagePicker from "./components/LanguagePicker";

export default function LanguageSettings() {
    const { t } = useTranslation("profile");
    return (
        <Card>
            <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                    <Globe size={20} className="text-[rgb(40,169,224)]" />
                    <h3 className="font-semibold text-lg">{t("language.uiLanguage")}</h3>
                </div>
                <LanguagePicker />
            </div>
        </Card>
    );
}
