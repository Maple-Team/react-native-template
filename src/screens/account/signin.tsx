import emitter from '@/eventbus'
import { login } from '@/services/user'
import { initiateState, reducer, UPDATE_TOKEN } from '@/state'
import { NativeStackHeaderProps } from '@react-navigation/native-stack'
import React, { useEffect, useReducer, useState } from 'react'
import { Text, View } from 'react-native'
import { Button } from '@ant-design/react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const SigninScreen = ({ navigation }: NativeStackHeaderProps) => {
  const [loading, setLoading] = useState(false)
  const [state, dispatch] = useReducer(reducer, initiateState)
  useEffect(() => {
    emitter.on('REQUEST_LOADING', _loading => setLoading(_loading))
    console.log(navigation)
  }, [navigation])

  return (
    <SafeAreaView>
      <View>
        <Text>1</Text>
        <Button
          loading={loading}
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
