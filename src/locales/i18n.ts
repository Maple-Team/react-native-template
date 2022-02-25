import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import enTranslation from './languages/en'
import cnTranslation from './languages/cn'
import esTranslation from './languages/es'

export const resources = {
  'en-US': {
    translation: enTranslation,
  },
  'zh-CN': {
    translation: cnTranslation,
  },
  'zh-Hans': {
    translation: cnTranslation,
  },
  'es-MX': {
    translation: esTranslation,
  },
  'es-ES': {
    translation: esTranslation,
  },
} as const

i18n.use(initReactI18next)

export const getI18nConfig = (lng: string) => ({
  lng,
  debug: __DEV__,
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },
  resources,
  fallbackLng: 'en-US',
  supportedLngs: ['en-US', 'zh-CN', 'en', 'zh', 'zh-Hans', 'zh-Hans-CN', 'es-ES', 'es-MX'],
  // nonExplicitSupportedLngs: true,
  // lowerCaseLng: true,  en-US ⇒ en-us
  // load locale与语言文案匹配策略：https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
})
export default i18n
