import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import DeviceInfo from 'react-native-device-info'

import AppModule from '@/modules/AppModule'
import { CommonHeader } from '@/typings/request'
import { API_CODE, APPLY_STATE } from '@/typings/enum'
import emitter from '@/eventbus'
import { Status } from '@/typings/response'

const { getBuildNumber } = DeviceInfo
const AXIOS_TIMEOUT = 10000

export interface Response<T = any> {
  body?: T
  sourceId?: string
  sourceName?: APPLY_STATE
  status: Status
}

export type BaseResponse<T = any> = Promise<Response<T>>

const api = axios.create({
  timeout: AXIOS_TIMEOUT,
  baseURL: AppModule.BASE_URL,
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
    emitter.emit('REQUEST_LOADING', true)
    return config
  },
  function (error: AxiosError) {
    emitter.emit('REQUEST_LOADING', false)
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
    emitter.emit('REQUEST_LOADING', false)
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
    emitter.emit('REQUEST_LOADING', false)
    return Promise.reject(error)
  }
)

export const request = async <T = any>(config: AxiosRequestConfig): Promise<T> => {
  try {
    return api.request({ method: 'GET', ...config })
  } catch (error) {
    return Promise.reject(error)
  }
}
