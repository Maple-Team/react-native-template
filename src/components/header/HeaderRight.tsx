import React from 'react'
import { Pressable, Image } from 'react-native'

export function HeaderRight({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress}>
      <Image source={require('@/assets/compressed/common/active/help.webp')} resizeMode="cover" />
    </Pressable>
  )
}
