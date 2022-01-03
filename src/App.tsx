import React, { useEffect, useReducer, useState, StrictMode } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { Toast } from '@ant-design/react-native'
import {
  BackHandler,
  Alert,
  Linking,
  Platform,
  ActivityIndicator,
  View,
  // Dimensions,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import StyleSheet from 'react-native-adaptive-stylesheet'
import { Text } from 'react-native-elements'
import { QueryClient, QueryClientProvider } from 'react-query'
// import NetInfo from '@react-native-community/netinfo'
// import { onlineManager } from 'react-query'
import * as RNLocalize from 'react-native-localize'
import BottomTabNavigator from '@/navigation/bottomTab'
import AccountStack from '@/navigation/accountStack'
import { initiateState, reducer } from '@/state'
import i18n, { getI18nConfig } from '@/locales/i18n'
import { navigationRef } from '@/navigation/rootNavigation'
import { Color } from '@/styles/color'
import { MESSAGE_DURATION } from '@/utils/constant'
import SplashScreen from 'react-native-splash-screen'
import { getStorageValue } from '@/utils/storage'
import Init from '@screens/init'
import emitter from '@/eventbus'

// onlineManager.setEventListener(setOnline => {
//   return NetInfo.addEventListener(state => {
//     const isConnected = state.isConnected || false
//     emitter.emit('NETWORK_CONNECTED', isConnected)
//     setOnline(state.isConnected || false)
//   })
// })

const queryClient = new QueryClient()
if (__DEV__) {
  import('react-query-native-devtools').then(({ addPlugin }) => {
    addPlugin({ queryClient })
  })
}

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

const App = () => {
  const [state] = useReducer(reducer, initiateState)

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
    // TODO change language
    // FIXME 'i18next: init: i18next is already initialized. You should call init just once!'
    RNLocalize.addEventListener('change', (e: any) => {
      console.log(e)
    })
    i18n.init(getI18nConfig(lng))
  }, [])

  useEffect(() => {
    emitter.on('FIRST_INIT', first => {
      setHasInit(!first)
    })
  }, [])
  const [isReady, setIsReady] = useState(__DEV__ ? false : true)
  const [initialState, setInitialState] = useState()
  const [hasInit, setHasInit] = useState<boolean>()

  useEffect(() => {
    const query = async () => {
      const value = (await getStorageValue('hasInit')) as boolean
      setHasInit(!value)
    }
    query()
  }, [])

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
    return <Loading />
  }

  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer
          ref={navigationRef}
          initialState={initialState}
          onStateChange={_ => AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(_))}>
          {hasInit === undefined ? (
            <Loading />
          ) : hasInit === true ? (
            <Init />
          ) : state.user ? (
            <BottomTabNavigator />
          ) : (
            <AccountStack />
          )}
        </NavigationContainer>
      </QueryClientProvider>
    </StrictMode>
  )
}

export default App

const loadingStyles = StyleSheet.create({
  container: {
    justiftContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    padding: 10,
    flex: 1,
  },
  loadingHint: {
    marginTop: 10,
  },
})
const Loading = () => (
  <View style={loadingStyles.container}>
    <ActivityIndicator size="large" color={Color.primary} />
    <Text style={loadingStyles.loadingHint}>Loading...</Text>
  </View>
)
