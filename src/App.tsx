import React, { useEffect, useReducer } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { Toast } from '@ant-design/react-native'

import BottomTabNavigator from '@/navigation/bottomTab'
import AccountStack from '@/navigation/accountStack'
import { initiateState, reducer } from '@/state'
import emitter from '@/eventbus'
import '@/locales/i18n'

const MESSAGE_DURATION = 1000
// FIXME 是否确保一个toast/message的显示时间符合其设置的时间，
// 即后续的toast/message是否会顶掉前一个toast/message

Toast.config({
  /**
   * 自动关闭的延时，单位秒. 为0时，需要手动调用rmove来关闭
   */
  duration: MESSAGE_DURATION,
  onClose: () => {},
  mask: true,
  /**
   * 是否允许叠加显示 boolean
   */
  stackable: false,
})

const App = () => {
  const [state, dispatch] = useReducer(reducer, initiateState)
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
      Toast[type](message, MESSAGE_DURATION)
    })
    // 监听请求状态
    emitter.on('REQUEST_LOADING', ({ dispatchType, loading }) => {
      dispatch({
        type: dispatchType,
        loading,
      })
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
