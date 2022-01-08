## i18n Translation Function

### interpolation 插值

Interpolation is one of the most used functionalities in I18N. It allows integrating dynamic values into your translations.

Per default, interpolation values get escaped to mitigate XSS attacks.

### Formatting 格式化

内置了`Number`, `Currency`, `DataTime`, `RelativeTime`, `List`等内置格式化处理方式

### Plurals 复数

## Misc

### Add or Load Translations

There are a few options to load translations to your application instrumented by i18next. The most common approach to this adding a so called [backend plugin](https://www.i18next.com/overview/plugins-and-utils#backends) to i18next. The range of backends is large from loading translations in the browser using xhr request to loading translations from databases or filesystem in nodejs.

### Extracting translations

- Adding new strings manually
- Using an extraction tool
  - http://i18next.github.io/i18next-scanner
  - https://github.com/i18next/i18next-parser
  - https://github.com/gilbsgilbs/babel-plugin-i18next-extract

## React-i18next

### usetranslation-hook

### withTranslation (HOC)

### Translation (render prop)

## Reference

- [interpolation](https://www.i18next.com/translation-function/interpolation)
- [Formatting](https://www.i18next.com/translation-function/formatting)
- [Plurals](https://www.i18next.com/translation-function/plurals)
- [usetranslation-hook](https://react.i18next.com/latest/usetranslation-hook)
- [withTranslation (HOC)](https://react.i18next.com/latest/withtranslation-hoc)
- [Translation (render prop)](https://react.i18next.com/latest/translation-render-prop)

## resources

- [react-native-localize](https://github.com/zoontek/react-native-localize), 提供获取系统语言的能力
- [i18n-js](https://github.com/fnando/i18n-js) 3.5k
- [react-i18next](https://github.com/i18next/react-i18next) 6.9k
- [formatjs](https://github.com/formatjs/formatjs), 12.9k
