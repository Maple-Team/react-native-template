import axios from 'axios'
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { MMKV } from '@/utils/storage'

import AppModule from '@/modules/AppModule'
import type { APPLY_SOURCE, CommonHeader } from '@/typings/request'
import type { Status } from '@/typings/response'
import { API_CODE, APPLY_STATE } from '@/state/enum'
import emitter from '@/eventbus'
import { DispatchRVMap } from '@/eventbus/type'

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
  baseURL: AppModule.getBaseUrl(),
  validateStatus: status => status >= 200 && status < 300,
})

api.interceptors.request.use(
  async function (config: AxiosRequestConfig) {
    const headers = config.headers as unknown as CommonHeader // FIXME
    if (headers) {
      headers.inputChannel = MMKV.getString('inputChannel') || ''
      headers.deviceId = MMKV.getString('deviceId') || ''
      headers.gps = MMKV.getString('gps') || '0,0'
      headers.merchantId = MMKV.getString('merchantId') || ''
      headers.source = (MMKV.getString('source') as APPLY_SOURCE) || ''
      headers.versionId = AppModule.getVersionID()
      const channel = MMKV.getString('channel')
      if (channel) {
        headers.channel = channel
      }
      const accessToken = MMKV.getString('accessToken')
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
    __DEV__ && console.log('data', response.config.data)
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
      return Promise.reject(false)
    }
  },
  (error: AxiosError) => {
    const message = (error || {}).message
    message && emitter.emit('RESPONSE_ERROR', message)
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
