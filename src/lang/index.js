import Vue from "vue";
import VueI18n from "vue-i18n";

import enUS, { dateTimeFormats } from "./locales/en-US";

Vue.use(VueI18n);

export const i18n = new VueI18n({
  locale: "en-US",
  fallbackLocale: "en-US",
  messages: {
    "en-US": enUS
  },
  dateTimeFormats: {
    "en-US": dateTimeFormats
  },
  silentTranslationWarn: true
});

const loadedLanguages = ["en-US"];

/**
 * Change the language in the i18n plugin and set the HTML element's lang attribute
 * @param {string} lang The language to change to
 */
function setI18nLanguage(lang) {
  i18n.locale = lang;
  document.querySelector("html").setAttribute("lang", lang);
  return lang;
}

/**
 * Load a new language file (if it hasn't been loaded yet) and change the system language
 *   to this new language.
 * @async
 * @param {string} lang The language to change to
 * @returns {Promise<string>} The language that was passed
 */
export function loadLanguageAsync(lang) {
  if (typeof lang === "undefined") {
    return;
  }
  if (i18n.locale !== lang) {
    if (!loadedLanguages.includes(lang)) {
      // route level code-splitting
      // this generates a separate chunk (lang-[request].[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      return import(/* webpackChunkName: "lang-[request]" */ `@/lang/locales/${lang}`).then(
        msgs => {
          i18n.setLocaleMessage(lang, msgs.default);
          i18n.setDateTimeFormat(lang, msgs.dateTimeFormats);
          loadedLanguages.push(lang);
          return setI18nLanguage(lang);
        }
      );
    }
    return Promise.resolve(setI18nLanguage(lang));
  }
  return Promise.resolve(lang);
}

// Array of available languages in the system
export const availableLanguages = {
  "zh-CN": "Chinese (Simplified)",
  "cs-CZ": "Czech (Czech Republic)",
  "nl-NL": "Dutch (Netherlands)",
  "en-US": "English (United States)",
  "fr-FR": "French (France)",
  "de-DE": "German (Germany)",
  "it-IT": "Italian (Italy)",
  "pl-PL": "Polish (Poland)",
  "pt-BR": "Portuguese (Brazil)",
  "ru-RU": "Russian (Russia)",
  "ms-MY": "Malay (Malaysia)"
};

i18n.availableLanguages = availableLanguages;
