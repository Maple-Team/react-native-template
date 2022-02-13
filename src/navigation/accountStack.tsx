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
import { StackActions } from '@react-navigation/native'
import { Color } from '@/styles/color'

export type AccountStackParams = {
  Entry: undefined
  SignIn: {
    phone: string
  }
  SignUp: {
    phone: string
  }
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
      screenOptions={({ navigation }) => ({
        headerStyle: {
          backgroundColor: Color.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontFamily: 'ArialMT',
        },
        headerTitleAlign: 'center',
        headerRight: () => null,
        headerLeft: () => (
          <HeaderLeft
            onPress={() => {
              navigation.goBack()
            }}
          />
        ),
        gestureEnabled: true,
      })}>
      <Stack.Screen
        key="Entry"
        name="Entry"
        component={EntryScreen}
        options={{
          // presentation: 'fullScreenModal',
          headerShown: false,
          statusBarHidden: true,
          animationTypeForReplace: 'push',
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
        options={({ navigation: { dispatch } }) => ({
          title: t('signup'),
          headerShown: true,
          headerLeft: () => <HeaderLeft onPress={() => dispatch(StackActions.replace('Entry'))} />,
        })}
      />
      <Stack.Screen
        key="Reset"
        name="Reset"
        component={ResetScreen}
        // @ts-ignore
        options={({ navigation: { dispatch } }) => ({
          title: t('resetpwd.label'),
          headerLeft: () => <HeaderLeft onPress={() => dispatch(StackActions.replace('Entry'))} />,
        })}
      />
    </Stack.Navigator>
  )
}
