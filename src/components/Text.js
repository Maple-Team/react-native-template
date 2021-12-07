import React from 'react'
import { Text, StyleSheet, Platform } from 'react-native'
import { Logger } from '../utils'
// Note @https://juejin.im/post/5ce66c26e51d4555fd20a2a0
const fonts = {
  ArialRoundedMTBold: {
    fontWeights: {
      300: 'Light',
      400: 'Regular',
      700: 'Bold',
      900: 'Black',
      normal: 'Regular',
      bold: 'Bold',
    },
    fontStyles: {
      normal: '',
      italic: 'Italic',
    },
  },
  Metropolis: {
    fontWeights: {
      300: 'Light',
      400: 'Regular',
      700: 'Bold',
      900: 'Black',
      normal: 'Regular',
      bold: 'Bold',
    },
    fontStyles: {
      normal: '',
      italic: 'Italic',
    },
  },
  ArialMT: {
    fontWeights: {
      300: 'Light',
      400: 'Regular',
      700: 'Bold',
      900: 'Black',
      normal: 'Regular',
      bold: 'Bold',
    },
    fontStyles: {
      normal: '',
      italic: 'Italic',
    },
  },
  Amble: {
    fontWeights: {
      300: 'Light',
      400: 'Regular',
      700: 'Bold',
      900: 'Black',
      normal: 'Regular',
      bold: 'Bold',
    },
    fontStyles: {
      normal: '',
      italic: 'Italic',
    },
  },
  Aller: {
    fontWeights: {
      300: 'Light',
      400: 'Regular',
      700: 'Bold',
      900: 'Black',
      normal: 'Light',
      bold: 'Bold',
      light: 'Light',
    },
    fontStyles: {
      normal: '',
      italic: 'Italic',
    },
  },
  HelveticaNeue: {
    fontWeights: {
      300: 'Light',
      400: 'Regular',
      700: 'Bold',
      900: 'Black',
      normal: 'Regular',
      bold: 'Bold',
    },
    fontStyles: {
      normal: '',
      italic: 'Italic',
    },
  },
  Barlow: {
    fontWeights: {
      300: 'Light',
      400: 'Regular',
      700: 'Bold',
      900: 'Black',
      normal: 'Regular',
      bold: 'ExtraBold',
    },
    fontStyles: {
      normal: '',
      italic: 'Italic',
    },
  },
}

const getFontFamily = (baseFontFamily, styles = {}) => {
  // fixme 字体不存在问题
  if (
    (baseFontFamily === 'ArialMT' ||
      baseFontFamily === 'Arial-BoldMT' ||
      baseFontFamily === 'ArialRoundedMTBold') &&
    Platform.OS === 'ios'
  ) {
    return baseFontFamily
  }
  if (baseFontFamily === 'Arial-BoldMT' && Platform.OS === 'android') {
    return baseFontFamily
  }
  const { fontWeight, fontStyle } = styles
  const font = fonts[baseFontFamily]
  const weight = fontWeight ? font.fontWeights[fontWeight] : font.fontWeights.normal
  const style = fontStyle ? font.fontStyles[fontStyle] : font.fontStyles.normal
  if (style === font.fontStyles.italic && weight === font.fontWeights.normal) {
    return `${baseFontFamily}-${style}`
  }
  return `${baseFontFamily}-${weight}${style}`
}

// 过滤 fontWeight fontStyle 属性, 生成新的 style 对象
const omit = (obj, keys) => {
  return Object.keys(obj).reduce((result, key) => {
    if (!keys.includes(key)) {
      result[key] = obj[key]
    }

    return result
  }, {})
}

const AppText = ({ style, ...props }) => {
  // Text style
  let resolvedStyle = StyleSheet.flatten(style) || {} // Note 处理未指定样式的Text组件
  // 通过对 Text style 的检测，拿到对应自定义字体
  if (!resolvedStyle.fontFamily) {
    resolvedStyle = { ...resolvedStyle, fontFamily: 'ArialMT' } // Note 默认字体
  }
  const fontFamily = getFontFamily(resolvedStyle.fontFamily, resolvedStyle)
  // 过滤掉 Text style 中的 fontWeight fontStyle 得到新的 style 对象
  const newStyle = omit({ ...resolvedStyle, fontFamily }, ['fontStyle', 'fontWeight'])

  return <Text {...props} style={newStyle} />
}

export default AppText
