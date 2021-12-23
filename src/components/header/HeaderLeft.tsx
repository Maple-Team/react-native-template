import { useNavigation } from '@react-navigation/native'
import React from 'react'
import EvilIcons from 'react-native-vector-icons/EvilIcons'

export default function HeaderLeft() {
  const { navigate } = useNavigation()
  return (
    <EvilIcons
      name="chevron-left"
      size={40}
      color="#00A24D"
      onPress={() => {
        navigate('home' as unknown as never)
      }}
    />
  )
}
