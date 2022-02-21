export interface ALL_LOCALES {
  [key: string]: string;
}

export const LOCALES: ALL_LOCALES = Object.freeze({
  en: 'English',
  cn: '中文',
  kr: '한국어',
  in: 'Indonesian',
  ru: 'Россия',
  tr: 'Türkiye',
  vn: 'Việt nam',
  es: 'Español',
});

export const SMARTLING_LOCALES: ALL_LOCALES = Object.freeze({
  en: 'en',
  cn: 'zh-CN',
  kr: 'ko-KR',
  in: 'id-ID',
  ru: 'ru-RU',
  tr: 'tr-TR',
  vn: 'vi-VN',
  es: 'es-LA',
});

const LOCALES_HTML: ALL_LOCALES = Object.freeze({
  // just different ones
  en: 'en',
  cn: 'zh-Hans',
  tw: 'zh-Hant',
  kr: 'ko',
  vn: 'vi',
});

const LOCALES_TRADINGVIEW: ALL_LOCALES = Object.freeze({
  // just different ones
  en: 'en',
  'zh-CN': 'zh',
  'zh-TW': 'zh_TW',
  'id-ID': 'en',
  'ko-KR': 'ko',
  'ru-RU': 'ru',
  'tr-TR': 'en',
  'vi-VN': 'vi',
  'es-LA': 'es',
});

const LOCALES_CALENDAR: ALL_LOCALES = Object.freeze({
  en: 'en',
  cn: 'zh-CN',
  tw: 'zh-TW',
  kr: 'ko',
  ru: 'ru',
  vn: 'vi',
  nl: 'nl-NL',
  pt: 'pt',
});

const LOCALES_SUPPORT: ALL_LOCALES = Object.freeze({
  en: 'en-us',
  cn: 'zh-cn',
  tw: 'zh-tw',
  kr: 'ko',
  ru: 'ru',
  vn: 'vi',
  it: 'it',
  es: 'es',
  de: 'de',
  fr: 'fr',
});

const LOCALES_MINI_TOKENS: ALL_LOCALES = Object.freeze({
  en: 'en',
  'zh-CN': 'cn',
  'zh-TW': 'tw',
  'id-ID': 'in',
  'ko-KR': 'kr',
  'ru-RU': 'ru',
  'tr-TR': 'tr',
  'vi-VN': 'vn',
  'es-LA': 'es',
});

export const getHtmlLang = (locale = 'en') => LOCALES_HTML[locale] || locale;

export const getTradingViewLocale = (locale = 'en') => LOCALES_TRADINGVIEW[locale] || locale;

export const getCalendarLocale = (locale = 'en') => LOCALES_CALENDAR[locale] || locale;

export const getSupportLocale = (locale = 'en') => LOCALES_SUPPORT[locale] || locale;

export const getMiniTokenLocale = (locale = 'en') => LOCALES_MINI_TOKENS[locale] || locale;
