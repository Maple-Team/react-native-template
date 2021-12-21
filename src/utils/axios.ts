import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

import DeviceInfo from 'react-native-device-info'
import AppModule from '@/modules/AppModule'
import { CommonHeader } from '@/typings/request'
import { Response } from '@/typings/response'
import { API_CODE } from '@/typings/enum'
import emitter from '@/eventbus'

const { getBuildNumber } = DeviceInfo
const AXIOS_TIMEOUT = 10000

let url
switch (AppModule.ENVIRONMENT) {
  case 'production':
    url = ' ' //TODO
    break
  case 'test':
  default:
    url = 'http://218.17.185.83:9182'
    break
}
const api = axios.create({
  timeout: AXIOS_TIMEOUT,
  baseURL: url,
  validateStatus: status => status >= 200 && status < 300,
})

api.interceptors.request.use(
  async function (config: AxiosRequestConfig) {
    const headers = config.headers as CommonHeader
    if (headers) {
      headers.inputChannel = (await AsyncStorage.getItem('inputChannel')) || ''
      headers.deviceId = (await AsyncStorage.getItem('deviceId')) || ''
      headers.gps = (await AsyncStorage.getItem('gps')) || ''
      headers.merchantId = (await AsyncStorage.getItem('merchantId')) || ''
      headers.source = 'APP'
      headers.versionId = getBuildNumber()
      const channel = await AsyncStorage.getItem('channel')
      if (channel) {
        headers.channel = channel
      }
      const accessToken = await AsyncStorage.getItem('accessToken')
      if (accessToken) {
        headers.accessToken = accessToken
      }
    }
    return config
  },
  function (error: AxiosError) {
    emitter.emit('REQUEST_ERROR', error.message)
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response: AxiosResponse) => {
    const {
      status: { code, msg, msgCn },
      body,
    } = response.data as Response<any>
    if (code === API_CODE.SUCCESS) {
      return body ?? false
    } else {
      // 处理业务逻辑错误
      const message = __DEV__ ? msgCn : msg
      switch (code) {
        case API_CODE.SESSION_EXPIRED:
          emitter.emit('SESSION_EXPIRED')
          break
        default:
          emitter.emit('MESSAGE', message)
          break
      }
      return false
    }
  },
  (error: AxiosError) => {
    emitter.emit('RESPONSE_ERROR', error.message)
    return Promise.reject(error)
  }
)

export default api
