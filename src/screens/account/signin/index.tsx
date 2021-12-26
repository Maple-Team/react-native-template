import { NativeStackHeaderProps } from '@react-navigation/native-stack'
import React, { useEffect, useReducer } from 'react'
import { View, Image } from 'react-native'
import { Button } from '@ant-design/react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'

import { login } from '@/services/user'
import { initiateState, reducer, UPDATE_TOKEN } from '@/state'
import styles from './style'
import { ScrollView } from 'react-native-gesture-handler'

const SigninScreen = ({ navigation }: NativeStackHeaderProps) => {
  const [state, dispatch] = useReducer(reducer, initiateState)
  const { t } = useTranslation()

  useEffect(() => {
    // console.log(navigation)
  }, [navigation])

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <Image
            source={require('@/assets/images/bg.png')}
            resizeMode="contain"
            style={styles.img}
          />
          <View style={styles.logoWrapper}>
            <Image source={require('@/assets/images/logo.webp')} style={styles.logo} />
            <Image source={require('@/assets/images/moneyya.webp')} style={styles.moneyya} />
          </View>
          <View>
            <Button
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
              {t('login')}
            </Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SigninScreen
