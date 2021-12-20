import { NativeStackHeaderProps } from '@react-navigation/native-stack'
import React from 'react'
import { Button } from 'react-native-elements'

const SignupScreen = ({ navigation }: NativeStackHeaderProps) => {
  return (
    <Button onPress={() => navigation.navigate('Profile', { name: 'Jane' })}>
      Go to Jane's profile
    </Button>
  )
}

export default SignupScreen
