import React, { useEffect, useState, StrictMode, useReducer } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { Provider, Toast } from '@ant-design/react-native'
import {
  BackHandler,
  Alert,
  Linking,
  Platform,
  ActivityIndicator,
  View,
  ViewStyle,
  // Dimensions,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import StyleSheet from 'react-native-adaptive-stylesheet'
import { Text } from 'react-native-elements'
import * as RNLocalize from 'react-native-localize'
import { MainStack } from '@/navigation/mainStack'
import { AccountStack } from '@/navigation/accountStack'
import i18n, { getI18nConfig } from '@/locales/i18n'
import { navigationRef } from '@/navigation/rootNavigation'
import { Color } from '@/styles/color'
import { MESSAGE_DURATION } from '@/utils/constant'
import SplashScreen from 'react-native-splash-screen'
import Init from '@screens/init'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useEventListener } from '@/hooks/useListener'
import { reducer, initiateState } from '@/state'
import { useFlipper } from '@react-navigation/devtools'
import emitter from './eventbus'

// FIXME 是否确保一个toast/message的显示时间符合其设置的时间，
// 即后续的toast/message是否会顶掉前一个toast/message
// NOTE Authentication flows: https://reactnavigation.org/docs/auth-flow/
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

const App = () => {
  const [
    {
      hasInit,
      header: { accessToken },
    },
  ] = useReducer(reducer, initiateState)

  const [token, setToken] = useState<string>(accessToken)
  const [isFirstInit, setFirstInit] = useState<boolean | undefined>(!hasInit)

  useEventListener()
  useEffect(() => {
    SplashScreen.hide()
  }, [])
  // 处理实体键返回逻辑
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

  // 处理语言
  useEffect(() => {
    const locales = RNLocalize.getLocales()
    console.log('locales:', locales)
    const lng = locales[0].languageTag
    // FIXME 'i18next: init: i18next is already initialized. You should call init just once!'
    RNLocalize.addEventListener('change', (e: any) => {
      console.log(e)
    })
    i18n.init(getI18nConfig(lng))
  }, [])

  // TODO 处理token超时
  const [isReady, setIsReady] = useState(__DEV__ ? false : true)
  const [initialState, setInitialState] = useState()
  useFlipper(navigationRef)
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

  useEffect(() => {
    emitter.on('FIRST_INIT', v => {
      setFirstInit(v)
    })
    emitter.on('LOGIN_SUCCESS', r => {
      setToken(r?.accessToken || '')
    })
  }, [])

  if (!isReady) {
    return <Loading />
  }

  return (
    <StrictMode>
      <SafeAreaProvider>
        <Provider>
          <NavigationContainer
            ref={navigationRef}
            initialState={initialState}
            onStateChange={_ => AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(_))}>
            {isFirstInit ? <Init /> : token ? <MainStack /> : <AccountStack />}
          </NavigationContainer>
        </Provider>
      </SafeAreaProvider>
    </StrictMode>
  )
}

export default App

const loadingStyles = StyleSheet.create<{
  container: ViewStyle
  loadingHint: ViewStyle
}>({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    flex: 1,
  },
  loadingHint: {
    marginTop: 10,
  },
})
// TODO change to SplashScreen
const Loading = () => (
  <View style={loadingStyles.container}>
    <ActivityIndicator size="large" color={Color.primary} />
    <Text style={loadingStyles.loadingHint}>Loading...</Text>
  </View>
)
