import type { APPLY_SOURCE } from '@/typings/request'
import { MMKV } from '@/utils/storage'
import { createContext } from 'react'
import type { State } from './index'

export const moneyyaState: State = {
  header: {
    versionId: MMKV.getString('versionId') || '',
    merchantId: MMKV.getString('merchantId') || '',
    inputChannel: MMKV.getString('inputChannel') || 'Moneyya',
    source: (MMKV.getString('source') as APPLY_SOURCE) || 'APP',
    channel: MMKV.getString('channel') || '',
    gps: MMKV.getString('gps') || '0,0',
    deviceId: MMKV.getString('deviceId') || '',
    accessToken: MMKV.getString('accessToken') || '',
  },
  loading: {
    effects: {},
  },
  hasInit: MMKV.getBool('hasInit') || false,
}

const StateContext = createContext(moneyyaState)

export default StateContext
