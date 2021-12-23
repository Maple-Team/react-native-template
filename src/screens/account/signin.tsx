import { NativeStackHeaderProps } from '@react-navigation/native-stack'
import React, { useEffect, useReducer } from 'react'
import { Text, View } from 'react-native'
import { Button } from '@ant-design/react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'

import { login } from '@/services/user'
import { initiateState, reducer, UPDATE_TOKEN } from '@/state'
// import useSensor from '@/hooks/useSensors'

const SigninScreen = ({ navigation }: NativeStackHeaderProps) => {
  const [state, dispatch] = useReducer(reducer, initiateState)
  const { t } = useTranslation()
  // for test
  // const [sensor] = useSensor()
  // console.log(sensor)

  useEffect(() => {
    console.log(navigation)
  }, [navigation])

  return (
    <SafeAreaView>
      <View>
        <Text>{t('title')}</Text>
        <Button
          loading={state.loading.effects.LOGIN}
          onPress={async () =>
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
          }>
          mock login
        </Button>
      </View>
    </SafeAreaView>
  )
}

export default SigninScreen
