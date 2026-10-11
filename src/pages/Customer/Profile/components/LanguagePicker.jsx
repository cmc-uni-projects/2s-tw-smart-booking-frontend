import React from "react";
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from "@/i18n";
import { changeLanguage } from "@/i18n/language";

// One card per supported language; clicking switches the UI language immediately.
const LanguagePicker = () => {
    const { t, i18n } = useTranslation("profile");
    const current = i18n.resolvedLanguage;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" role="radiogroup" aria-label={t("language.title")}>
            {SUPPORTED_LANGUAGES.map((lang) => {
                const active = lang.code === current;
                return (
                    <button
                        key={lang.code}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => changeLanguage(lang.code)}
                        className={`p-4 border rounded-xl text-left transition-all hover:border-blue-500 ${
                            active ? "bg-blue-50/50 border-blue-200" : "border-gray-200 bg-white"
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <img src={`https://flagcdn.com/${lang.flag}.svg`} alt="" className="w-8 h-auto rounded-sm" />
                                <div>
                                    <p className="font-bold text-gray-800">{lang.label}</p>
                                    <p className="text-xs text-gray-500">
                                        {lang.code === DEFAULT_LANGUAGE ? t("language.default") : t("language.available")}
                                    </p>
                                </div>
                            </div>
                            {active && <Check size={18} className="text-blue-600" />}
                        </div>
                    </button>
                );
            })}
        </div>
    );
};

export default LanguagePicker;
