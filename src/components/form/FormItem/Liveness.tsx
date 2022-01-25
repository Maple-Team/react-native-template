import React from 'react'
import { View, Image, Pressable } from 'react-native'
import formItemStyles from './style'
import { Text } from '@/components'
interface Props {
  error?: string
  onPress: () => void
}

export function LivenessPicker({ onPress, error }: Props) {
  return (
    <View style={style.container}>
      <Text>Make sure you are operating by yourself</Text>
      <View
        style={{
          paddingTop: 36.5,
          paddingBottom: 47.5,
        }}>
        <Pressable onPress={onPress}>
          <Image source={require('@assets/images/apply/liveness.webp')} resizeMode="cover" />
        </Pressable>
      </View>
      <View>
        {error && (
          <Text styles={[formItemStyles.warn, formItemStyles.error, style.error]}>{error}</Text>
        )}
      </View>
      <View>
        <Text>
          Keep face clear,expose completely and without obstructions,Avoid blurring
          casedinsufficient light.
        </Text>
      </View>
    </View>
  )
}

import { ViewStyle } from 'react-native'
import StyleSheet from 'react-native-adaptive-stylesheet'

const style = StyleSheet.create<{
  container: ViewStyle
  error: ViewStyle
}>({
  container: {
    paddingTop: 37,
  },
  error: {
    marginBottom: 30,
  },
})
