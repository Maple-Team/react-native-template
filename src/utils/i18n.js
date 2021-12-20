import lang from '@scoreonetech/lang'
import I18n from 'i18n-js'
import * as RNLocalize from 'react-native-localize'

const locales = RNLocalize.getLocales()
if (Array.isArray(locales)) {
  I18n.locale = locales[0].languageTag
}
if (!__DEV__) {
  I18n.locale = 'en'
}

I18n.defaultLocale = 'en'
I18n.fallbacks = true
I18n.translations = lang

export default I18n