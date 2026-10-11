// src/i18n/index.js
// i18next setup. Translations live in ./locales/<lang>/<namespace>.json and are
// loaded eagerly at build time, so switching language never waits on the network.
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

export const SUPPORTED_LANGUAGES = [
  { code: "vi", label: "Tiếng Việt", flag: "vn" },
  { code: "en", label: "English", flag: "gb" },
];
export const DEFAULT_LANGUAGE = "vi";
const STORAGE_KEY = "lang";

// { vi: { common: {...}, auth: {...} }, en: { ... } }
const resources = {};
const modules = import.meta.glob("./locales/*/*.json", { eager: true });
for (const [path, mod] of Object.entries(modules)) {
  const [, lang, ns] = path.match(/\.\/locales\/([^/]+)\/([^/]+)\.json$/);
  resources[lang] ??= {};
  resources[lang][ns] = mod.default;
}

const readStoredLanguage = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return SUPPORTED_LANGUAGES.some((l) => l.code === saved) ? saved : DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: readStoredLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  defaultNS: "common",
  ns: Object.keys(resources[DEFAULT_LANGUAGE] ?? {}),
  interpolation: { escapeValue: false }, // React already escapes
  returnNull: false,
});

const syncDocumentLanguage = (lng) => {
  document.documentElement.lang = lng;
  try {
    localStorage.setItem(STORAGE_KEY, lng);
  } catch {
    /* storage unavailable (private mode) — language still applies for this session */
  }
};
syncDocumentLanguage(i18n.language);
i18n.on("languageChanged", syncDocumentLanguage);

export default i18n;
