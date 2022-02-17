import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import { AuthorizationScreen, PrivacyScreen } from '@screens/init'

export type InitStackParams = {
  Authorization: undefined
  Privacy: undefined
}
const Stack = createNativeStackNavigator<InitStackParams>()

export function InitStack() {
  return (
    <Stack.Navigator initialRouteName="Authorization">
      <Stack.Screen
        key="Authorization"
        name="Authorization"
        component={AuthorizationScreen}
        options={{
          headerShown: false,
          statusBarHidden: true,
          animationTypeForReplace: 'push',
        }}
      />
      <Stack.Screen
        key="Privacy"
        name="Privacy"
        component={PrivacyScreen}
        options={{ headerShown: false, statusBarHidden: true }}
      />
    </Stack.Navigator>
  )
}
