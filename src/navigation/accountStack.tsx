import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React, { useEffect } from 'react'
import { SigninScreen, EntryScreen, SignupScreen, ResetScreen } from '@/screens/account'
import { useTranslation } from 'react-i18next'
import { HeaderLeft } from '@components/header'
import emitter from '@/eventbus'

export type AccountStackParams = {
  Entry: undefined
  SignIn: undefined
  SignUp: undefined
  Reset: undefined
}
const Stack = createNativeStackNavigator<AccountStackParams>()

export function AccountStack() {
  const { t } = useTranslation()
  useEffect(() => {
    emitter.on('LOGIN_SUCCESS', () => {
      emitter.emit('SHOW_MESSAGE', { type: 'success', message: t('login.success') })
    })
  }, [t])
  return (
    <Stack.Navigator
      initialRouteName="Entry"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        key="Entry"
        name="Entry"
        component={EntryScreen}
        options={{
          // presentation: 'fullScreenModal',
          headerShown: false,
          statusBarHidden: true,
          // animationTypeForReplace: 'pop',
        }}
      />
      <Stack.Screen
        key="SignIn"
        name="SignIn"
        component={SigninScreen}
        options={{ headerShown: false, statusBarHidden: true }}
      />
      <Stack.Screen
        key="SignUp"
        name="SignUp"
        component={SignupScreen}
        options={({ navigation }) => ({
          title: t('signup'),
          headerLeft: () => (
            <HeaderLeft
              onPress={() => {
                navigation.navigate('Entry')
              }}
            />
          ),
        })}
      />
      <Stack.Screen
        key="Reset"
        name="Reset"
        component={ResetScreen}
        options={({ navigation }) => ({
          title: t('resetpwd'),
          headerLeft: () => (
            <HeaderLeft
              onPress={() => {
                navigation.navigate('Entry')
              }}
            />
          ),
        })}
      />
    </Stack.Navigator>
  )
}
