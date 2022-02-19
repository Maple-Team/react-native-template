import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import { AuthorizationScreen, PrivacyScreen } from '@screens/init'
import { useTranslation } from 'react-i18next'
import { Color } from '@/styles/color'

export type InitStackParams = {
  Authorization: undefined
  Privacy: undefined
}
const Stack = createNativeStackNavigator<InitStackParams>()

export function InitStack() {
  const { t } = useTranslation()
  return (
    <Stack.Navigator
      initialRouteName="Authorization"
      screenOptions={{
        headerShown: true,
        statusBarHidden: true,
        animationTypeForReplace: 'push',
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: Color.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontFamily: 'ArialMT',
        },
      }}>
      <Stack.Screen
        key="Authorization"
        name="Authorization"
        component={AuthorizationScreen}
        options={{
          title: t('screenTitle.authorizaiton'),
        }}
      />
      <Stack.Screen
        key="Privacy"
        name="Privacy"
        component={PrivacyScreen}
        options={{
          title: t('screenTitle.privacy'),
        }}
      />
    </Stack.Navigator>
  )
}
