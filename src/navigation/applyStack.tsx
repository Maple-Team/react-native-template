import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'

const Stack = createNativeStackNavigator()

function AccountStack() {
  return (
    <Stack.Navigator>
      {/* <Stack.Group screenOptions={{ headerShown: false }} /> */}
    </Stack.Navigator>
  )
}

export default AccountStack
