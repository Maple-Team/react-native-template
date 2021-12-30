import React from 'react'
import { RegisteredStyle, Text, TextStyle } from 'react-native'
import StyleSheet from 'react-native-adaptive-stylesheet'
/**
 * Text组件
 * TODO 字体问题
 */
export default ({
  children,
  styles,
  onPress,
}: {
  children: any
  styles?: RegisteredStyle<TextStyle> | RegisteredStyle<TextStyle>[]
  onPress?: () => void
}) => (
  <Text style={[textStyle.text, styles]} onPress={onPress}>
    {children}
  </Text>
)

const textStyle = StyleSheet.create<{ text: TextStyle }>({
  text: {
    fontFamily: 'ArialMT',
  },
})
