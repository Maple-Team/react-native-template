import React from 'react'
import { RegisteredStyle, Text, Platform } from 'react-native'
import type { TextStyle } from 'react-native'
import StyleSheet from 'react-native-adaptive-stylesheet'
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
}

const getFontFamily = (baseFontFamily: string, styles = {}) => {
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
  const { fontWeight, fontStyle } = styles as TextStyle
  //@ts-ignore
  const font = fonts[baseFontFamily]
  const weight = fontWeight ? font.fontWeights[fontWeight] : font.fontWeights.normal
  const style = fontStyle ? font.fontStyles[fontStyle] : font.fontStyles.normal
  if (style === font.fontStyles.italic && weight === font.fontWeights.normal) {
    return `${baseFontFamily}-${style}`
  }
  return `${baseFontFamily}-${weight}${style}`
}

// 过滤 fontWeight fontStyle 属性, 生成新的 style 对象

const omit = (obj: { [x: string]: any }, keys: string | string[]) => {
  return Object.keys(obj).reduce((result, key) => {
    if (!keys.includes(key)) {
      //@ts-ignore
      result[key] = obj[key]
    }

    return result
  }, {})
}
//@ts-ignore
export const AppText = ({ style, ...props }) => {
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

/**
 * Text组件
 * TODO 字体问题
 */
export default ({
  children,
  styles,
  onPress,
  fontSize,
  fontWeight,
  fontFamily,
  color,
}: {
  children: any
  styles?: RegisteredStyle<TextStyle> | RegisteredStyle<TextStyle>[]
  onPress?: () => void
  fontSize: number
  fontWeight?: 'bold'
  color?: string
  fontFamily?: string
}) => (
  <Text
    style={[textStyle.text, styles, { fontSize, color, fontWeight, fontFamily }]}
    onPress={onPress}>
    {children}
  </Text>
)

const textStyle = StyleSheet.create<{ text: TextStyle }>({
  text: {
    fontFamily: 'ArialMT',
  },
})
