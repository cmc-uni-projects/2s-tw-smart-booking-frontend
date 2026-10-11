// src/i18n/language.js
// Switching language from the UI. For a signed-in user the choice is also saved on the account
// (users.preferredLanguage) so emails and notifications from the backend use it too.
import i18n, { SUPPORTED_LANGUAGES } from "@/i18n";
import userService from "@/services/user.service";

const isSupported = (code) => SUPPORTED_LANGUAGES.some((l) => l.code === code);

export const changeLanguage = async (lng) => {
  await i18n.changeLanguage(lng);
  if (!localStorage.getItem("accessToken")) return;
  try {
    await userService.updateLanguage(lng);
  } catch (err) {
    // UI language already changed; only the account copy failed
    console.warn("Could not save language preference", err);
  }
};

/** After login: show the UI in the language saved on the account. */
export const applyUserLanguage = (user) => {
  const lng = user?.preferredLanguage;
  if (isSupported(lng) && lng !== i18n.language) i18n.changeLanguage(lng);
};
