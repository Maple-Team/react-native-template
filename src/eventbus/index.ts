import type { RegisterResponse } from '@/typings/account'
import type { UserInfo } from '@/typings/user'
import mitt, { Emitter } from 'mitt'
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
  LOGIN_SUCCESS?: RegisterResponse
  LOGOUT_SUCCESS?: string
  RESPONSE_ERROR: string
  REQUEST_ERROR: string
  REQUEST_LOADING: { dispatchType: DispatchMapType; loading: boolean }
  NETWORK_CONNECTED: boolean
  FIRST_INIT: boolean
  UPDATE_DEVICEID: string
  UPDATE_VERSIONID: string
  UPDATE_GPS: string
  USER_INFO: UserInfo
}

/**
 * 事件管理实例
 */
const emitter: Emitter<Events> = mitt<Events>()

export default emitter
