import type { AccountInfo } from '@/typings/account'
import type { Brand } from '@/typings/response'
import type { UserInfo } from '@/typings/user'
import type { AxiosError } from 'axios'
import mitt, { type Emitter } from 'mitt'
import type { DispatchMapType } from './type'

/**
 * 弹窗消息类型
 */
type MessageType = 'info' | 'success' | 'fail' | 'offline'

/**
 * 通用事件类型及参数
 */
export type Events = {
  SESSION_EXPIRED?: string
  SHOW_MESSAGE: { message: string; type: MessageType }
  SHOW_LOADING?: string
  LOGIN_SUCCESS?: AccountInfo
  LOGOUT_SUCCESS?: string
  RESPONSE_ERROR: AxiosError
  REQUEST_ERROR: AxiosError
  REQUEST_LOADING: { dispatchType: DispatchMapType; loading: boolean }
  NETWORK_CONNECTED: boolean
  FIRST_INIT: boolean
  UPDATE_DEVICEID: string
  UPDATE_VERSIONID: number
  UPDATE_GPS: string
  USER_INFO: UserInfo
  EXISTED_USER?: string
  UNREGISTER_USER?: string
  UPDATE_BRAND: Brand
  REGISTER_SUCCESS: AccountInfo
  UPDATE_HAS_INIT: boolean
  AGREE_WITH_TERMS: boolean
}

/**
 * 事件管理实例
 */
const emitter: Emitter<Events> = mitt<Events>()

export default emitter
