import React, { useEffect, useReducer } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { Toast } from '@ant-design/react-native'

import BottomTabNavigator from '@/navigation/bottomTab'
import AccountStack from '@/navigation/accountStack'
import { initiateState, reducer } from '@/state'
import emitter from '@/eventbus'

const MESSAGE_DURATION = 1000
Toast.config({
  duration: MESSAGE_DURATION,
  onClose: () => {},
  mask: true,
  stackable: true, // FIXME ?
})

const App = () => {
  const [state] = useReducer(reducer, initiateState)
  useEffect(() => {
    emitter.on('SESSION_EXPIRED', () => {
      // 登录超时，TODO 跳转登录页面
    })
    emitter.on('LOGOUT_SUCCESS', () => {
      // 登出，TODO 处理跳转
    })
    emitter.on('LOGIN_SUCCESS', () => {
      // 登出，TODO 处理跳转
    })
    emitter.on('SHOW_LOADING', () => {
      Toast.loading('', 1000)
    })
    emitter.on('REQUEST_ERROR', e => {
      console.error(`request: ${e}`)
    })
    emitter.on('RESPONSE_ERROR', e => {
      console.error(`response: ${e}`)
      // TODO 错误上报
    })
    emitter.on('SHOW_MESSAGE', ({ message, type }) => {
      Toast[type](message, MESSAGE_DURATION) //TODO 可见message实例：维持一个，维持已有展示时间
    })
  }, [])

  // TODO splash display logic
  return (
    <NavigationContainer>
      {state.user ? <BottomTabNavigator /> : <AccountStack />}
    </NavigationContainer>
  )
}

export default App
