import React from 'react'
import { View, Image, TextStyle, RegisteredStyle } from 'react-native'
import { Text } from '@/components'
import { ViewStyle } from 'react-native'
import StyleSheet from 'react-native-adaptive-stylesheet'

interface Props {
  img: any
  hint: string
  hintColor: string
}

export const Hint = ({ img, hint, hintColor }: Props) => {
  return (
    <View style={styles.container}>
      <Image source={img} resizeMode="cover" />
      <View style={styles.hintWrap}>
        <Text styles={[styles.hint, { color: hintColor } as unknown as RegisteredStyle<TextStyle>]}>
          {hint}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create<{
  container: ViewStyle
  hintWrap: ViewStyle
  hint: TextStyle
}>({
  container: {
    paddingHorizontal: 22,
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingTop: 8,
    paddingBottom: 5,
    alignItems: 'center',
  },
  hintWrap: {
    marginLeft: 6.5,
    alignItems: 'center',
  },
  hint: {
    color: 'rgba(255, 50, 50, 1)',
    fontSize: 12,
    fontFamily: 'ArialMT',
    lineHeight: 18,
  },
})
