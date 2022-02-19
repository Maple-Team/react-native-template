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
export const KEY_BEHAVIOR_DATA = 'moneyya_Behavior'
export const KEY_PHONE = 'moneyya_Phone'
export const KEY_GPS = 'moneyya_GPS'
export const KEY_TOKEN = 'moneyya_AccessToken'
export const KEY_DEVICEID = 'moneyya_DeviceId'
export const KEY_INIT = 'moneyya_HasInit'
export const KEY_APPLYID = 'moneyya_ApplyID'
export const KEY_BRAND = 'moneyya_Brand'
export const KEY_USER = 'moneyya_User'
export const KEY_VERSIONID = 'moneyya_VersionID'
export const KEY_INTERIP = 'moneyya_Interip'
export const KEY_OUTERIP = 'moneyya_Outerip'
export const KEY_JPUSH_ID = 'moneyya_jpush_id'

export const TOTAL_STEPS = 8
