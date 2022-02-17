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
export const UPDATE_USER_INFO = 'UPDATE_USER_INFO'

import { AppModule } from '@/modules'
import {
  KEY_BRAND,
  KEY_DEVICEID,
  KEY_GPS,
  KEY_INIT,
  KEY_TOKEN,
  KEY_USER,
  KEY_VERSIONID,
} from '@/utils/constant'
import { MMKV } from '@/utils/storage'
import { createContext } from 'react'

/**
 * 全局状态
 */
export let moneyyaState: State = {
  header: {
    merchantId: 'b5a84f164746cfd448b144f543e22808',
    inputChannel: 'MONEYYA',
    source: 'APP',
    channel: 'app',
    versionId: MMKV.getInt(KEY_VERSIONID) || AppModule.getVersionID(),
    gps: MMKV.getString(KEY_GPS) || '0,0',
    deviceId: MMKV.getString(KEY_DEVICEID) || '',
    accessToken: MMKV.getString(KEY_TOKEN) || '',
  },
  loading: {
    effects: {},
  },
  hasInit: MMKV.getBool(KEY_INIT) || false,
  user: MMKV.getMap(KEY_USER) || undefined,
  brand: MMKV.getMap(KEY_BRAND) || undefined,
}

const StateContext = createContext(moneyyaState)

export default StateContext

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case UPDATE_TOKEN:
      MMKV.setString(KEY_TOKEN, action.token)
      moneyyaState = {
        ...state,
        header: {
          ...state.header,
          accessToken: action.token,
        },
      }
      break
    case UPDATE_GPS:
      MMKV.setString(KEY_GPS, action.gps)
      moneyyaState = {
        ...state,
        header: {
          ...state.header,
          gps: action.gps,
        },
      }
      break
    case UPDATE_DEVICEID:
      MMKV.setString(KEY_DEVICEID, action.deviceId)
      moneyyaState = {
        ...state,
        header: {
          ...state.header,
          deviceId: action.deviceId,
        },
      }
      break
    case UPDATE_VESIONID:
      moneyyaState = {
        ...state,
        header: {
          ...state.header,
          versionId: action.versionID,
        },
      }
      break
    case UPDATE_USERINFO:
      moneyyaState = {
        ...state,
        user: action.user,
      }
      break
    case UPDATE_HAS_INIT:
      MMKV.setBool(KEY_INIT, action.hasInit)
      moneyyaState = {
        ...state,
        hasInit: action.hasInit,
      }
      break
    case UPDATE_USER_INFO:
      MMKV.setMapAsync(KEY_USER, action.user)
      moneyyaState = {
        ...state,
        user: action.user,
      }
      break
    case UPDATE_BRAND:
      MMKV.setMapAsync(KEY_BRAND, action.brand)
      moneyyaState = {
        ...state,
        brand: action.brand,
      }
      break
    default:
      if ([...NormalTypeArray, ...DictTypeArray].includes(action.type)) {
        moneyyaState = {
          ...state,
          loading: {
            effects: {
              ...state.loading.effects,
              [`${action.type}`]: action.loading,
            },
          },
        }
      } else {
        moneyyaState = { ...state }
      }
      break
  }
  return moneyyaState
}

interface State {
  header: CommonHeader
  user?: UserInfo
  /**
   * 加载请求的状态
   * 借鉴dva-loading的思路 https://github.com/dvajs/dva/tree/master/packages/dva-loading
   */
  loading: {
    /**
     * 是否全局显示,
     */
    global?: boolean
    effects: {
      /**
       * 单个请求的请求状态
       */
      [key: string]: boolean
    }
  }
  brand?: Brand
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
      versionID: number
    }
  | {
      type: typeof UPDATE_BRAND
      brand: Brand
    }
  | {
      type: typeof UPDATE_USER_INFO
      user: UserInfo
    }
