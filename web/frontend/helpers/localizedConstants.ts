const locale: string = new URL(location.href).searchParams.get("locale") || "en";

type LocaleKey =
  | "en"
  | "es"
  | "da"
  | "de"
  | "fi"
  | "fr"
  | "it"
  | "nl"
  | "no"
  | "pl"
  | "pt-BR"
  | "pt-PT"
  | "sv"
  | "tr";

type LocalizedTexts = Record<LocaleKey, Record<string, any>>;

const localizedTexts: LocalizedTexts = {
  en: {},
  es: {},
  da: {},
  de: {},
  fi: {},
  fr: {},
  it: {},
  nl: {},
  no: {},
  pl: {},
  "pt-BR": {},
  "pt-PT": {},
  sv: {},
  tr: {},
};

const localizedDynamicTexts: LocalizedTexts = {
  en: {},
  es: {},
  da: {},
  de: {},
  fi: {},
  fr: {},
  it: {},
  nl: {},
  no: {},
  pl: {},
  "pt-BR": {},
  "pt-PT": {},
  sv: {},
  tr: {},
};

// Export the localized texts for the current locale, fallback to English if not found
export const localizedDefaults: Record<string, any> =
  localizedTexts[locale as LocaleKey] || localizedTexts.en;
// Export the localized dynamic texts for the current locale, fallback to English if not found
export const localizedDynamicDefaults: Record<string, any> =
  localizedDynamicTexts[locale as LocaleKey] || localizedDynamicTexts.en;
