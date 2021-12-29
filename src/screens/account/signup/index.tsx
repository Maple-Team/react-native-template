import { NativeStackHeaderProps } from '@react-navigation/native-stack'
import React, { useReducer } from 'react'
import { View, Image } from 'react-native'
import { Button } from '@ant-design/react-native'
import { useTranslation } from 'react-i18next'

import { Logo } from '@components/logo'
import { login } from '@/services/user'
import { initiateState, reducer, UPDATE_TOKEN } from '@/state'
import styles from './style'
import { SafeAreaView } from 'react-native-safe-area-context'

export const SignupScreen = ({ navigation }: NativeStackHeaderProps) => {
  const [state, dispatch] = useReducer(reducer, initiateState)
  const { t } = useTranslation()

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Image
          source={require('@/assets/images/account/bg.webp')}
          resizeMode="stretch"
          style={styles.bg}
        />
        <View style={styles.wrap}>
          <Logo />
          <View style={styles.form}>
            <Button
              style={[styles.signin, styles.btn]}
              type="primary"
              loading={state.loading.effects.LOGIN}
              onPress={async () => {
                login({
                  loginType: 'PWD_LOGIN',
                  password: '',
                  phone: '',
                  deviceId: state.header.deviceId,
                  gps: state.header.gps,
                  code: '',
                }).then(user => {
                  dispatch({
                    type: UPDATE_TOKEN,
                    token: user.email, // FIXME
                  })
                })
              }}>
              {t('signin')}
            </Button>
            <Button
              style={[styles.signup, styles.btn]}
              loading={state.loading.effects.LOGIN}
              onPress={async () => {
                navigation.navigate('SignIn')
              }}>
              {t('back')}
            </Button>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}
