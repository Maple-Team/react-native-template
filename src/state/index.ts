import type { DispatchMapType } from '@/eventbus/type'
import { DictTypeArray, NormalTypeArray } from '@/eventbus/type'
import type { CommonHeader } from '@/typings/request'
import type { Brand } from '@/typings/response'
import type { UserInfo } from '@/typings/user'

export const UPDATE_TOKEN = 'UPDATE_TOKEN'
export const UPDATE_GPS = 'UPDATE_GPS'
export const UPDATE_DEVICEID = 'UPDATE_DEVICEID'
export const UPDATE_VESIONID = 'UPDATE_VESIONID'
export const UPDATE_USERINFO = 'UPDATE_USERINFO'
export const UPDATE_HAS_INIT = 'UPDATE_HAS_INIT'
export const UPDATE_BRAND = 'UPDATE_BRAND'

import { AppModule } from '@/modules'
import { KEY_DEVICEID, KEY_GPS, KEY_INIT, KEY_TOKEN, KEY_VERSIONID } from '@/utils/constant'
import { MMKV } from '@/utils/storage'
import { createContext } from 'react'

export let moneyyaState: State = {
  header: {
    merchantId: 'b5a84f164746cfd448b144f543e22808',
    inputChannel: 'MONEYYA',
    source: 'APP',
    channel: 'app',
    versionId: MMKV.getString(KEY_VERSIONID) || AppModule.getVersionID(),
    gps: MMKV.getString(KEY_GPS) || '0,0',
    deviceId: MMKV.getString(KEY_DEVICEID) || '',
    accessToken: MMKV.getString(KEY_TOKEN) || '',
  },
  loading: {
    effects: {},
  },
  hasInit: MMKV.getBool(KEY_INIT) || false,
}
// FIXME context不能修改
const StateContext = createContext(moneyyaState)

export default StateContext

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
  barnd?: Brand
  hasInit?: boolean
}

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
  | {
      type: typeof UPDATE_BRAND
      brand: Brand
    }

export function reducer(state: State, action: Action): State {
  console.log('action', action)
  let newState: State | null = null
  switch (action.type) {
    case UPDATE_TOKEN:
      MMKV.setString(KEY_TOKEN, action.token)
      newState = {
        ...state,
        header: {
          ...state.header,
          accessToken: action.token,
        },
      }
      break
    case UPDATE_GPS:
      MMKV.setString(KEY_GPS, action.gps)
      newState = {
        ...state,
        header: {
          ...state.header,
          gps: action.gps,
        },
      }
      break
    case UPDATE_DEVICEID:
      MMKV.setString(KEY_DEVICEID, action.deviceId)
      newState = {
        ...state,
        header: {
          ...state.header,
          deviceId: action.deviceId,
        },
      }
      break
    case UPDATE_VESIONID:
      newState = {
        ...state,
        header: {
          ...state.header,
          versionId: action.versionID,
        },
      }
      break
    case UPDATE_USERINFO:
      newState = {
        ...state,
        user: action.user,
      }
      break
    case UPDATE_HAS_INIT:
      MMKV.setBool(KEY_INIT, action.hasInit)
      newState = {
        ...state,
        hasInit: action.hasInit,
      }
      break
    case UPDATE_BRAND:
      newState = {
        ...state,
        barnd: action.brand,
      }
      break
    default:
      if ([...NormalTypeArray, ...DictTypeArray].includes(action.type)) {
        newState = {
          ...state,
          loading: {
            effects: {
              [`${action.type}`]: action.loading,
            },
          },
        }
      }
      newState = { ...state }
      break
  }
  moneyyaState = newState
  return newState
}
