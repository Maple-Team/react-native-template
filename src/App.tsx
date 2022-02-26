import React, { useEffect, useReducer } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { Provider, Toast } from '@ant-design/react-native'
import { BackHandler, Alert } from 'react-native'
import { getLocales, addEventListener } from 'react-native-localize'
import { MainStack } from '@/navigation/mainStack'
import { AccountStack } from '@/navigation/accountStack'
import i18n, { getI18nConfig } from '@/locales/i18n'
import { KEY_DEVICEID, KEY_JPUSH_ID, KEY_PHONE, MESSAGE_DURATION } from '@/utils/constant'
import SplashScreen from 'react-native-splash-screen'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useEventListener } from '@/hooks'
import { reducer, default as MoneyyaContext, moneyyaState } from '@/state'
import emitter from '@/eventbus'
import { MMKV } from '@/utils/storage'
import JPush from 'jpush-react-native'
import { InitStack } from '@navigation/initStack'
import { uploadJpush } from './services/misc'

// Authentication flows: https://reactnavigation.org/docs/auth-flow/
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
// const PERSISTENCE_KEY = 'NAVIGATION_STATE'

const App = () => {
  const [
    {
      hasInit,
      header: { accessToken },
      user,
    },
    dispatch,
  ] = useReducer(reducer, moneyyaState)

  useEventListener()
  useEffect(() => {
    SplashScreen.hide()
  }, [])
  // 处理实体键返回逻辑
  useEffect(() => {
    const backAction = () => {
      // FIXME
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
    const locales = getLocales()
    const language = locales[0].languageTag
    // FIXME 'i18next: init: i18next is already initialized. You should call init just once!'
    addEventListener('change', (e: any) => {
      console.error('RNLocalize', e)
    })
    i18n.init(getI18nConfig(language.toLowerCase().includes('zh') ? 'zh-CN' : 'es-MX'))
  }, [])

  // const [isReady, setIsReady] = useState(__DEV__ ? false : true)
  // const [initialState, setInitialState] = useState()
  // useFlipper(navigationRef)
  // NOTE 处理用户上一次打开的页面(进件过程), 开发环境? https://reactnavigation.org/docs/state-persistence
  // useEffect(() => {
  //   const restoreState = async () => {
  //     try {
  //       const initialUrl = await Linking.getInitialURL()
  //       if (Platform.OS !== 'web' && initialUrl == null) {
  //         // Only restore state if there's no deep link and we're not on web
  //         const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY)
  //         const urlState = savedStateString ? JSON.parse(savedStateString) : undefined

  //         if (urlState !== undefined) {
  //           setInitialState(urlState)
  //         }
  //       }
  //     } finally {
  //       setIsReady(true)
  //     }
  //   }

  //   if (!isReady) {
  //     restoreState()
  //   }
  // }, [isReady])

  useEffect(() => {
    emitter.on('EXISTED_USER', message => {
      message && emitter.emit('SHOW_MESSAGE', { type: 'info', message })
    })
  }, [])
  useEffect(() => {
    emitter.on('LOGIN_SUCCESS', u => {
      dispatch({
        type: 'UPDATE_TOKEN',
        token: u?.accessToken || '',
      })
      // NOTE JPUSH login Success
      uploadJpush({
        phone: user?.phone || '',
        deviceId: MMKV.getString(KEY_DEVICEID) || '',
      })
      emitter.emit('SHOW_MESSAGE', { type: 'success', message: i18n.t('login.success') })
    })
  }, [user?.phone])

  useEffect(() => {
    emitter.on('FIRST_INIT', init => {
      dispatch({
        type: 'UPDATE_HAS_INIT',
        hasInit: init,
      })
    })

    emitter.on('LOGOUT_SUCCESS', () => {
      dispatch({
        type: 'UPDATE_TOKEN',
        token: '',
      })
    })
    emitter.on('UPDATE_DEVICEID', id => {
      dispatch({
        type: 'UPDATE_DEVICEID',
        deviceId: id,
      })
    })
    emitter.on('UPDATE_BRAND', brand => {
      dispatch({
        type: 'UPDATE_BRAND',
        brand,
      })
    })
    emitter.on('USER_INFO', u => {
      dispatch({
        type: 'UPDATE_USER_INFO',
        user: u,
      })
    })
    emitter.on('UPDATE_HAS_INIT', u => {
      dispatch({
        type: 'UPDATE_HAS_INIT',
        hasInit: u,
      })
    })
  }, [])
  useEffect(() => {
    emitter.on('SESSION_EXPIRED', () => {
      MMKV.setString(KEY_PHONE, user?.phone || '')
      dispatch({
        type: 'UPDATE_TOKEN',
        token: '',
      })
    })
  }, [user?.phone])

  useEffect(() => {
    JPush.init({
      appKey: 'adb72c2b4a8434dcefd4f9bd',
      channel: 'developer-default',
      production: __DEV__,
    })
    JPush.setLoggerEnable(true)
    JPush.getRegistrationID(({ registerID }) => {
      MMKV.setString(KEY_JPUSH_ID, registerID)
    })
    //连接状态
    JPush.addConnectEventListener(result => {
      console.log('connectListener:' + JSON.stringify(result))
    })

    JPush.addNotificationListener(result => {
      console.log('notificationListener:' + JSON.stringify(result))
    })
    //本地通知回调
    JPush.addLocalNotificationListener(result => {
      console.log('localNotificationListener:' + JSON.stringify(result))
    })
  })

  return (
    <SafeAreaProvider>
      <Provider>
        <MoneyyaContext.Provider value={moneyyaState}>
          <NavigationContainer
          // ref={navigationRef}
          // initialState={initialState}
          // onStateChange={_ => AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(_))}
          >
            {!hasInit ? <InitStack /> : accessToken ? <MainStack /> : <AccountStack />}
          </NavigationContainer>
        </MoneyyaContext.Provider>
      </Provider>
    </SafeAreaProvider>
  )
}

export default App
