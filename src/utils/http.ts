import axios from 'axios'
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import DeviceInfo from 'react-native-device-info'

import AppModule from '@/modules/AppModule'
import type { CommonHeader } from '@/typings/request'
import type { Status } from '@/typings/response'
import { API_CODE, APPLY_STATE } from '@/state/enum'
import emitter from '@/eventbus'
import { DispatchRVMap } from '@/eventbus/type'

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
    const headers = config.headers as unknown as CommonHeader // FIXME
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
          emitter.emit('SHOW_MESSAGE', { message, type: 'fail' })
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

/**
 * 更新每个请求的请求状态
 * @param url 请求接口url
 * @param loading 请求状态
 */
export const updateRequestStatus = (url: string, loading: boolean) => {
  emitter.emit('REQUEST_LOADING', {
    dispatchType: DispatchRVMap[url],
    loading,
  })
}
/**
 * 统一请求入口
 * @param config
 * @returns
 */
export const request = async <T = any>(config: AxiosRequestConfig): Promise<T> => {
  try {
    updateRequestStatus(config.url!, true)
    const res = api.request({ method: 'GET', ...config })
    updateRequestStatus(config.url!, false)
    return res as unknown as Promise<T>
  } catch (error) {
    updateRequestStatus(config.url!, false)
    return Promise.reject(error)
  }
}
