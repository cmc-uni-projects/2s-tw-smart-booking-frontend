// date-fns locale matching the active UI language (calendars, month names)
import { useTranslation } from "react-i18next";
import { vi, enGB } from "date-fns/locale";

const LOCALES = { vi, en: enGB };

export const getDateFnsLocale = (lng) => LOCALES[lng] ?? vi;

export const useDateFnsLocale = () => {
  const { i18n } = useTranslation();
  return getDateFnsLocale(i18n.resolvedLanguage);
};
