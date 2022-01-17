import type { DebounceSettings } from 'lodash'

/**
 * ant-design toast duration 自动关闭的延时，单位秒
 */
export const MESSAGE_DURATION = 3
// debounce
export const DEBOUNCE_WAIT = 500
export const DEBOUNCE_OPTIONS: DebounceSettings = { leading: true, trailing: false }
// request
export const AXIOS_TIMEOUT = 10000
// 一系列MMKV字符串key
export const KEY_BEHAVIOR_DATA = 'moneyyaBehavior'
export const KEY_PHONE = 'moneyyaPhone'
export const KEY_GPS = 'moneyyaGPS'
export const KEY_TOKEN = 'moneyyaAccessToken'
export const KEY_DEVICEID = 'moneyyaDeviceId'
export const KEY_INIT = 'moneyyaHasInit'
export const KEY_APPLYID = 'moneyyaApplyID'
export const KEY_VERSIONID = 'moneyyaVersionID'

export const TOTAL_STEPS = 8
