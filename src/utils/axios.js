import axios from 'axios'
import commonConfig from './config'
import { Platform, NativeModules } from 'react-native'
import NavigationUtil from '../navigation/NavigationUtil'
import AsyncStorage from '@react-native-community/async-storage'
import { Toast } from '@ant-design/react-native'
import Logger from './logger'
import DeviceInfo from 'react-native-device-info'
// import NetInfo from '@react-native-community/netinfo'
const { getUserAgent, getBuildNumber } = DeviceInfo
// let unsubscribe
const { brandName: inputChannel } = commonConfig
const AXIOS_TIMEOUT = 10000

let os = Platform.OS.toLowerCase()
if (os === 'android') {
  os = 'APP'
}
os = os.toUpperCase()
let url
switch (NativeModules.AppConstants.ENVIRONMENT) {
  case 'production':
    url = 'https://suritycash.com'
    break
  case 'qa':
  default:
    url = 'http://120.79.78.76:8087'
    break
}
const baseURL = url
const _axios = axios.create({
  timeout: AXIOS_TIMEOUT,
  baseURL,
  validateStatus: status => status >= 200 && status < 300,
})
// Add a request interceptor
_axios.interceptors.request.use(
  async function (config) {
    config.headers['User-Agent'] = await getUserAgent()
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
  function (error) {
    Toast.fail(error.msg, 1)
    Logger.log(`[development error] [request]: ${error}`)
    return Promise.reject(error)
  }
)

_axios.interceptors.response.use(
  response => {
    // unsubscribe()
    // fixme code data整理
    const { status, body, code, data } = response.data
    // 处理业务逻辑错误
    if (code === 200) {
      return data
    }
    if (status && status.code !== '000') {
      if (__DEV__) {
        status.code !== '119' &&
          status.code !== '127' &&
          status.code !== '128' &&
          Toast.fail(status.msgCn, 1)
      } else {
        status.code !== '119' &&
          status.code !== '127' &&
          status.code !== '128' &&
          Toast.fail(status.msg, 2)
      }
      switch (status.code) {
        case '997': // 会话超时
        case '986': // token过期
          setTimeout(async () => {
            await AsyncStorage.removeItem('accessToken')
            NavigationUtil.goPage('Login')
          }, 1000)
          break
        case '985':
          setTimeout(() => {
            NavigationUtil.goPage('Loading')
          }, 1000)
          break
        case '129':
          setTimeout(() => {
            NavigationUtil.goPage('Verify')
          }, 1000)
          break
        default:
          break
      }
      // 127 128额度调整相关
      return Promise.reject(status.code !== '127' && status.code !== '128' ? status : response.data)
    } else {
      if (body !== null) {
        return body
      } else {
        return response.data
      }
    }
  },
  error => {
    Logger.log('[development error] [response]: ', error)
    // 提醒超时错误等
    Toast.fail('There might be something wrong with your network, please try again later.', 2)
    // Do something with response error
    return Promise.reject(error)
  }
)

export default _axios
