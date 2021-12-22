import i18n from 'i18next'
import * as RNLocalize from 'react-native-localize'
import { initReactI18next } from 'react-i18next'

import enTranslation from './languages/en'
import cnTranslation from './languages/cn'

export const resources = {
  en: {
    translation: enTranslation,
  },
  cn: {
    translation: cnTranslation,
  },
} as const

/**
 * console.log(RNLocalize.getLocales());
/* -> [
  { countryCode: "GB", languageTag: "en-GB", languageCode: "en", isRTL: false },
  { countryCode: "US", languageTag: "en-US", languageCode: "en", isRTL: false },
  { countryCode: "FR", languageTag: "fr-FR", languageCode: "fr", isRTL: false },
]
*/
const locales = RNLocalize.getLocales()
console.log({ locales })
const defaultLng = locales[0].languageTag

i18n.use(initReactI18next).init({
  lng: defaultLng,
  debug: __DEV__,
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },
  resources,
  fallbackLng: defaultLng,
  supportedLngs: ['en', 'cn'], // FIXME 需要的语言包
  nonExplicitSupportedLngs: true,
  // lowerCaseLng: true,  en-US ⇒ en-us
  // load locale与语言文案匹配策略：https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
})
