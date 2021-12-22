import type { UserInfo } from '@/typings/user'
import type { CommonHeader } from '../typings/request'

interface State {
  header: CommonHeader
  user?: UserInfo
}
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
}
export const UPDATE_TOKEN = 'UPDATE_TOKEN'
export const UPDATE_GPS = 'UPDATE_GPS'
export const UPDATE_DEVICEID = 'UPDATE_DEVICEID'
export const UPDATE_USERINFO = 'UPDATE_USERINFO'

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
    default:
      throw state
  }
}
