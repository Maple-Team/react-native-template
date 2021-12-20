import { create } from 'apisauce'
import commonConfig from './config'
import { Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Toast } from '@ant-design/react-native'
import Logger from './logger'
import DeviceInfo from 'react-native-device-info'
import AppModule from '../modules/AppModule'
const { getUserAgent, getBuildNumber } = DeviceInfo

const { brandName: inputChannel } = commonConfig
const AXIOS_TIMEOUT = 10000

let os = Platform.OS.toLowerCase()
if (os === 'android') {
  os = 'APP'
}
os = os.toUpperCase()
let url
switch (AppModule.ENVIRONMENT) {
  case 'production':
    url = ' ' //TODO
    break
  case 'test':
  default:
    url = '' // TODO
    break
}
const baseURL = url
const api = create({
  timeout: AXIOS_TIMEOUT,
  baseURL,
  validateStatus: status => status >= 200 && status < 300,
})
// Add a request interceptor
api.axiosInstance.interceptors.request.use(
  async function (config: any) {
    config.headers['User-Agent'] = await getUserAgent() // TODO 从AsyncStorage里面取
    config.headers.accessToken = await AsyncStorage.getItem('accessToken')
    config.headers.source = os
    config.headers.deviceId = await AsyncStorage.getItem('deviceId')
    config.headers.requestId = await AsyncStorage.getItem('deviceId')
    config.headers.versionId = getBuildNumber()
    config.headers.inputChannel = `${inputChannel}_${os}`

    // // Note 每个请求过来开启网络监听
    // unsubscribe = NetInfo.addEventListener(async state => {
    //   const _isEmulator = await isEmulator()
    //   if (!_isEmulator) {
    //     console.log('Connection type', state)
    //   }
    //   // todo 网络状况提醒
    // })
    return config
  },
  function (error: any) {
    Toast.fail(error.msg, 1)
    Logger.log(`[development error] [request]: ${error}`)
    return Promise.reject(error)
  }
)

api.axiosInstance.interceptors.response.use(
  (response: { data: { status: any; body: any; code: any; data: any } }) => {
    // unsubscribe()
    // fixme code data整理
    const { status, body, code, data } = response.data
    // 处理业务逻辑错误
    if (code === 200) {
      return data
    }
    // TODO 事件总线
  },
  (error: any) => {
    Logger.log('[development error] [response]: ', error)
    // 提醒超时错误等
    Toast.fail('There might be something wrong with your network, please try again later.', 2)
    // Do something with response error
    return Promise.reject(error)
  }
)

export default api

// TODO eventbus react-native-events/react-native-event-listeners/mitt等 观察者模式
