import React from 'react'
import { Pressable, Image } from 'react-native'

export function HeaderLeft({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress}>
      <Image source={require('@/assets/compressed/common/left.webp')} resizeMode="cover" />
    </Pressable>
  )
}
