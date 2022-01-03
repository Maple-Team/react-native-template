import type { DispatchMapType } from '@/eventbus/type'
import { DictTypeArray, NormalTypeArray } from '@/eventbus/type'
import type { UserInfo } from '@/typings/user'
import type { CommonHeader } from '../typings/request'

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
    versionId: '',
    merchantId: '',
    inputChannel: '',
    source: 'APP',
    channel: '',
    gps: '',
    deviceId: '',
    accessToken: '',
  },
  loading: {
    effects: {},
  },
  hasInit: false,
}
export const UPDATE_TOKEN = 'UPDATE_TOKEN'
export const UPDATE_GPS = 'UPDATE_GPS'
export const UPDATE_DEVICEID = 'UPDATE_DEVICEID'
export const UPDATE_USERINFO = 'UPDATE_USERINFO'
export const UPDATE_IS_FIRST = 'UPDATE_IS_FIRST'

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
      type: typeof UPDATE_IS_FIRST
      hasInit: boolean
    }

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case UPDATE_TOKEN:
      return {
        ...state,
        header: {
          ...state.header,
          accessToken: action.token,
        },
      }
    case UPDATE_GPS:
      return {
        ...state,
        header: {
          ...state.header,
          gps: action.gps,
        },
      }
    case UPDATE_DEVICEID:
      return {
        ...state,
        header: {
          ...state.header,
          deviceId: action.deviceId,
        },
      }
    case UPDATE_USERINFO:
      return {
        ...state,
        user: action.user,
      }
    case UPDATE_IS_FIRST:
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
