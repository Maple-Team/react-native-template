import type { DispatchMapType } from '@/eventbus/type'
import { DictTypeArray, NormalTypeArray } from '@/eventbus/type'
import type { UserInfo } from '@/typings/user'
import { MMKV } from '@/utils/storage'
import type { APPLY_SOURCE, CommonHeader } from '../typings/request'

interface State {
  header: CommonHeader
  user?: UserInfo
  /**
   * 加载请求的状态
   * 借鉴dva-loading的思路 https://github.com/dvajs/dva/tree/master/packages/dva-loading
   */
  loading: {
    /**
     * 是否全局显示, TODO IMPLEMENTTAION
     */
    global?: boolean
    effects: {
      /**
       * 单个请求的请求状态
       */
      [key: string]: boolean
    }
  }
  hasInit: boolean
}
/**
 * App全局状态设定
 */
export const initiateState: State = {
  header: {
    versionId: MMKV.getString('versionId') || '',
    merchantId: MMKV.getString('merchantId') || '',
    inputChannel: MMKV.getString('inputChannel') || 'Moneyya',
    source: (MMKV.getString('source') as APPLY_SOURCE) || 'APP',
    channel: MMKV.getString('channel') || 'mk',
    gps: MMKV.getString('gps') || '0,0',
    deviceId: MMKV.getString('deviceId') || '',
    accessToken: MMKV.getString('accessToken') || '',
  },
  loading: {
    effects: {},
  },
  hasInit: false,
}
export const UPDATE_TOKEN = 'UPDATE_TOKEN'
export const UPDATE_GPS = 'UPDATE_GPS'
export const UPDATE_DEVICEID = 'UPDATE_DEVICEID'
export const UPDATE_VESIONID = 'UPDATE_VESIONID'
export const UPDATE_USERINFO = 'UPDATE_USERINFO'
export const UPDATE_HAS_INIT = 'UPDATE_HAS_INIT'

type Action =
  | {
      type: typeof UPDATE_TOKEN
      token: string
    }
  | {
      type: typeof UPDATE_GPS
      gps: string
    }
  | {
      type: typeof UPDATE_DEVICEID
      deviceId: string
    }
  | {
      type: typeof UPDATE_USERINFO
      user: UserInfo
    }
  | {
      type: DispatchMapType
      loading: boolean
    }
  | {
      type: typeof UPDATE_HAS_INIT
      hasInit: boolean
    }
  | {
      type: typeof UPDATE_VESIONID
      versionID: string
    }

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case UPDATE_TOKEN:
      MMKV.setString('accessToken', action.token)
      return {
        ...state,
        header: {
          ...state.header,
          accessToken: action.token,
        },
      }
    case UPDATE_GPS:
      MMKV.setString('gps', action.gps)
      return {
        ...state,
        header: {
          ...state.header,
          gps: action.gps,
        },
      }
    case UPDATE_DEVICEID:
      MMKV.setString('deviceId', action.deviceId)
      return {
        ...state,
        header: {
          ...state.header,
          deviceId: action.deviceId,
        },
      }
    case UPDATE_VESIONID:
      return {
        ...state,
        header: {
          ...state.header,
          versionId: action.versionID,
        },
      }
    case UPDATE_USERINFO:
      return {
        ...state,
        user: action.user,
      }
    case UPDATE_HAS_INIT:
      return {
        ...state,
        hasInit: action.hasInit,
      }
    default:
      if ([...NormalTypeArray, ...DictTypeArray].includes(action.type)) {
        return {
          ...state,
          loading: {
            effects: {
              [`${action.type}`]: action.loading,
            },
          },
        }
      }
      return { ...state }
  }
}
