import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import About from '../screens/user/about'
import Main from '../screens/user/main'

const Stack = createNativeStackNavigator()

function AccountStack() {
  return (
    <Stack.Navigator>
      <Stack.Group screenOptions={{ headerShown: false }}>
        <Stack.Screen name="About" component={About} />
        <Stack.Screen name="Main" component={Main} />
      </Stack.Group>
    </Stack.Navigator>
  )
}

export default AccountStack
