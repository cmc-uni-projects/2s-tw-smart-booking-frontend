import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES } from "@/i18n";
import { changeLanguage } from "@/i18n/language";

const FlagIcon = ({ code, className = "w-5 h-auto rounded-sm" }) => (
  <img src={`https://flagcdn.com/${code}.svg`} alt="" className={className} />
);

const LanguageSwitcher = ({ className = "", menuAlign = "right" }) => {
  const { i18n, t } = useTranslation("layout");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current =
    SUPPORTED_LANGUAGES.find((l) => l.code === i18n.resolvedLanguage) ?? SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const handleSelect = (code) => {
    changeLanguage(code);
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={t("language.switch")}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex items-center gap-1.5 text-sm font-bold transition-colors ${className}`}
      >
        <FlagIcon code={current.flag} />
        <span className="uppercase">{current.code}</span>
        <ChevronDown size={14} strokeWidth={3} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <ul
          role="listbox"
          className={`absolute top-full mt-3 ${menuAlign === "right" ? "right-0" : "left-0"} w-44 bg-white border border-gray-100 shadow-xl rounded-xl p-1.5 z-50`}
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <li key={lang.code}>
              <button
                type="button"
                role="option"
                aria-selected={lang.code === current.code}
                onClick={() => handleSelect(lang.code)}
                className="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-lg hover:bg-blue-50/60 text-sm font-semibold text-slate-700"
              >
                <FlagIcon code={lang.flag} />
                <span className="flex-1">{lang.label}</span>
                {lang.code === current.code && <Check size={16} className="text-blue-600" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageSwitcher;
