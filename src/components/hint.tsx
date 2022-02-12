import React from 'react'
import { View, Image } from 'react-native'
import { Text } from '@/components'
import type { ViewStyle, TextStyle, RegisteredStyle, ImageSourcePropType } from 'react-native'
import StyleSheet from 'react-native-adaptive-stylesheet'

interface Props {
  img: ImageSourcePropType
  hint: string
  hintColor: string
}

export const Hint = ({ img, hint, hintColor }: Props) => (
  <View style={styles.container}>
    <Image source={img} resizeMode="cover" />
    <View style={styles.hintWrap}>
      <Text styles={[styles.hint, { color: hintColor } as unknown as RegisteredStyle<TextStyle>]}>
        {hint}
      </Text>
    </View>
  </View>
)

const styles = StyleSheet.create<{
  container: ViewStyle
  hintWrap: ViewStyle
  hint: TextStyle
}>({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingTop: 8,
    paddingBottom: 5,
    alignItems: 'center',
    flex: 1,
  },
  hintWrap: {
    marginLeft: 6.5,
    alignItems: 'center',
    flexWrap: 'wrap',
    flex: 1,
  },
  hint: {
    color: 'rgba(255, 50, 50, 1)',
    fontSize: 12,
    fontFamily: 'ArialMT',
    lineHeight: 18,
  },
})
