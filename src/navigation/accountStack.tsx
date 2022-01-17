import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React, { useEffect } from 'react'
import { SigninScreen, EntryScreen, SignupScreen, ResetScreen } from '@/screens/account'
import { useTranslation } from 'react-i18next'
import { HeaderLeft } from '@components/header'
import emitter from '@/eventbus'
import { useLocation } from '@/hooks'
import AppModule from '@/modules/AppModule'
import RNAdvertisingId from 'react-native-advertising-id'
import DeviceInfo from 'react-native-device-info'
import { usePersmission } from '@/utils/permission'

export type AccountStackParams = {
  Entry: undefined
  SignIn: undefined
  SignUp: undefined
  Reset: undefined
}
const Stack = createNativeStackNavigator<AccountStackParams>()

export function AccountStack() {
  const { t } = useTranslation()
  usePersmission()
  useEffect(() => {
    emitter.on('LOGIN_SUCCESS', () => {
      emitter.emit('SHOW_MESSAGE', { type: 'success', message: t('login.success') })
    })
  }, [t])
  useEffect(() => {
    emitter.on('EXISTED_USER', message => {
      message && emitter.emit('SHOW_MESSAGE', { type: 'info', message })
    })
  }, [])
  useEffect(() => {
    const versionID = AppModule.getVersionID()
    emitter.emit('UPDATE_VERSIONID', versionID)
    async function query() {
      RNAdvertisingId.getAdvertisingId()
        .then(({ advertisingId }: { advertisingId: string }) => {
          emitter.emit('UPDATE_DEVICEID', advertisingId)
        })
        .catch((e: any) => {
          console.error('googleID', e)
          DeviceInfo.getAndroidId().then(id => {
            emitter.emit('UPDATE_DEVICEID', id)
          })
        })
    }
    query()
  }, [])

  useLocation()
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
        options={({ navigation: na }) => ({
          title: t('signup'),
          headerLeft: () => (
            <HeaderLeft
              onPress={() => {
                na.navigate('Entry')
              }}
            />
          ),
        })}
      />
      <Stack.Screen
        key="Reset"
        name="Reset"
        component={ResetScreen}
        options={({ navigation: na }) => ({
          title: t('resetpwd'),
          headerLeft: () => (
            <HeaderLeft
              onPress={() => {
                na.navigate('Entry')
              }}
            />
          ),
        })}
      />
    </Stack.Navigator>
  )
}
