import React from 'react'
import { Pressable, Image } from 'react-native'

export function HeaderRight({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress}>
      <Image source={require('@/assets/images/common/normal/help.webp')} resizeMode="cover" />
    </Pressable>
  )
}
