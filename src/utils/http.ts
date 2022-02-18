import axios from 'axios'
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'

import { AppModule } from '@/modules'
import type { Status } from '@/typings/response'
import { API_CODE, APPLY_STATE } from '@/state/enum'
import emitter from '@/eventbus'
import { DispatchRVMap } from '@/eventbus/type'
import { AXIOS_TIMEOUT, KEY_DEVICEID, KEY_GPS, KEY_TOKEN } from '@/utils/constant'
import { moneyyaState } from '@/state'
import { MMKV } from './storage'
export interface Response<T = any> {
  body?: T
  sourceId?: string
  sourceName?: APPLY_STATE
  status: Status
}

export type BaseResponse<T = any> = Promise<Response<T>>

const api = axios.create({
  timeout: AXIOS_TIMEOUT,
  baseURL: AppModule.getBaseUrl(),
  validateStatus: status => status >= 200 && status < 300,
})

api.interceptors.request.use(
  async function (config: AxiosRequestConfig) {
    if (config.headers) {
      const {
        header: { inputChannel, merchantId, source, gps, versionId, channel },
      } = moneyyaState
      config.headers.inputChannel = inputChannel
      config.headers.deviceId = MMKV.getString(KEY_DEVICEID) || ''
      config.headers.gps = MMKV.getString(KEY_GPS) || gps
      config.headers.merchantId = merchantId
      config.headers.source = source
      config.headers.versionId = `${versionId}`
      if (channel) {
        config.headers.channel = channel
      }
      const accessToken = MMKV.getString(KEY_TOKEN) || ''
      if (accessToken) {
        config.headers.accessToken = accessToken
      }
    }
    return config
  },
  function (error: AxiosError) {
    emitter.emit('REQUEST_ERROR', error)
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
      response.config.data && console.log('response request data', response.config.data)
      response.config.url && console.log('response request url', response.config.url)
      // 处理业务逻辑错误
      const message = __DEV__ ? msgCn : msg
      switch (code) {
        case API_CODE.SESSION_EXPIRED:
        case API_CODE.ILLEGAL_USER:
          emitter.emit('SESSION_EXPIRED')
          break
        case API_CODE.EXISTED_USER:
          emitter.emit('EXISTED_USER', message)
          return Promise.reject(true)
        case API_CODE.UNREGISTER_USER:
          emitter.emit('UNREGISTER_USER')
          return Promise.reject(true)
        default:
          emitter.emit('SHOW_MESSAGE', { message, type: 'fail' })
          break
      }
      return Promise.reject(false)
    }
  },
  (error: AxiosError) => {
    emitter.emit('RESPONSE_ERROR', error)
    return Promise.reject(error)
  }
)

/**
 * @deprecated
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
    const res = api.request({ method: 'GET', ...config })
    return res as unknown as Promise<T>
  } catch (error) {
    return Promise.reject(error)
  }
}
