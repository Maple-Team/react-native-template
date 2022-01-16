import { AppModule } from '@/modules'
import { KEY_DEVICEID, KEY_GPS, KEY_INIT, KEY_TOKEN, KEY_VERSIONID } from '@/utils/constant'
import { MMKV } from '@/utils/storage'
import { createContext } from 'react'
import type { State } from './index'

export const moneyyaState: State = {
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

const StateContext = createContext(moneyyaState)

export default StateContext
