import React, { useEffect, useReducer, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { Toast } from '@ant-design/react-native'
import {
  BackHandler,
  Alert,
  Linking,
  Platform,
  ActivityIndicator,
  View,
  Dimensions,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import StyleSheet from 'react-native-adaptive-stylesheet'

import BottomTabNavigator from '@/navigation/bottomTab'
import AccountStack from '@/navigation/accountStack'
import { initiateState, reducer } from '@/state'
import emitter from '@/eventbus'
import '@/locales/i18n'
import { navigationRef, navigate } from './navigation/rootNavigation'
import { Color } from './styles/color'
import { Text } from 'react-native-elements'

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
const PERSISTENCE_KEY = 'NAVIGATION_STATE'
const window = Dimensions.get('window')
const App = () => {
  const [state, dispatch] = useReducer(reducer, initiateState)
  useEffect(() => {
    emitter.on('SESSION_EXPIRED', () => {
      navigate('signin', null)
    })
    emitter.on('LOGOUT_SUCCESS', () => {
      navigate('signin', null) //TODO 携带手机号
    })
    emitter.on('LOGIN_SUCCESS', user => {
      if (user) {
        console.log(user) //TODO switch user state
      } else {
        navigate('home', null)
      }
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

  useEffect(() => {
    const backAction = () => {
      Alert.alert('Hold on!', 'Are you sure you want to go back?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        { text: 'YES', onPress: () => BackHandler.exitApp() },
      ])
      return true
    }
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction)
    return () => backHandler.remove()
  }, [])

  const [isReady, setIsReady] = useState(__DEV__ ? false : true)
  const [initialState, setInitialState] = useState()

  // NOTE 处理用户上一次打开的页面(进件过程) https://reactnavigation.org/docs/state-persistence
  useEffect(() => {
    const restoreState = async () => {
      try {
        const initialUrl = await Linking.getInitialURL()

        if (Platform.OS !== 'web' && initialUrl == null) {
          // Only restore state if there's no deep link and we're not on web
          const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY)
          const urlState = savedStateString ? JSON.parse(savedStateString) : undefined

          if (urlState !== undefined) {
            setInitialState(urlState)
          }
        }
      } finally {
        setIsReady(true)
      }
    }

    if (!isReady) {
      restoreState()
    }
  }, [isReady])

  if (!isReady) {
    return (
      <View style={loadingStyles.container}>
        <ActivityIndicator size="large" color={Color.primary} />
        <Text style={loadingStyles.loadingHint}>Loading...</Text>
      </View>
    )
  }

  // TODO splash display logic
  return (
    <NavigationContainer
      ref={navigationRef}
      initialState={initialState}
      onStateChange={_ => AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(_))}>
      {state.user ? <BottomTabNavigator /> : <AccountStack />}
    </NavigationContainer>
  )
}

export default App

const loadingStyles = StyleSheet.create({
  container: {
    width: window.width,
    height: window.height,
    flex: 1,
    justiftContent: 'center',
    flexDirection: 'row',
    padding: 10,
  },
  loadingHint: {
    marginTop: 10,
  },
})
