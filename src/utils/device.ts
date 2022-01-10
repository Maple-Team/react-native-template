import DeviceInfo from 'react-native-device-info'
// import AsyncStorage from '@react-native-async-storage/async-storage'
// import IMEI from 'react-native-imei'
// import RNAdvertisingId from 'react-native-advertising-id'
// import NetInfo from '@react-native-community/netinfo'
// import { getTimeSinceStartup } from 'react-native-startup-time'
import * as RNLocalize from 'react-native-localize'
// import ScreenBrightness from '@adrianso/react-native-device-brightness'
// import dayjs from 'dayjs'
// import NfcManager from 'react-native-nfc-manager'
// import { NativeModules } from 'react-native'
// import { errorCaptured } from './util'
import type { Device } from '@/typings/device'

const locales = RNLocalize.getLocales()
const timezone = RNLocalize.getTimeZone()

/**
 * 一部分从项目中的原生模块获取
 * 一部分从第三方模块中获取
 * 一部分从全局状态中获取(已经获取的，不需要重复获取)
 */
const {} = DeviceInfo

export default async function getDeviceInfo(): Promise<Device> {
  // 使用Promise.all并行获取
  const device: Device = {
    anglex: '',
    angley: '',
    anglez: '',
    applyId: '',
    bootTime: '',
    availableMemory: '',
    isAgent: '',
    googleAdvertisingId: '',
    basebandVersion: '',
    howLongBootTime: '',
    batteryPower: '',
    batteryStatus: '',
    buildDate: '',
    isBreakPrison: '',
    screenBrightness: '',
    isCommunication: 'N',
    device: '',
    deviceId: '',
    deviceName: '',
    deviceVersion: '',
    persistentDeviceId: '',
    nfcFunction: 'N',
    gpsInfo: '',
    idcard: '',
    intranetIP: '',
    isSimulator: 'N',
    requestIp: '',
    language: locales[0].languageTag,
    mcc: '',
    meid: '',
    memoryUsed: '',
    mnc: '',
    mobileNetworkType: '',
    runMemory: '',
    wifiMac: '',
    residualMemory: '',
    networkOperators: '',
    numberOfPhotos: 0,
    numberOfSongs: 0,
    numberOfVideos: 0,
    wifiName: '',
    phone: '',
    screenSize: '',
    signalStrength: '',
    startTime: 0,
    systemTime: '',
    timeZone: timezone,
  }
  return device
}
