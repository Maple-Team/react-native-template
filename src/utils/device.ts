import {
  getBrand,
  getModel,
  getSystemVersion,
  getUniqueId,
  getPowerState,
  getCarrier,
  getDevice,
  getFreeDiskStorage,
  getMacAddress,
  getTotalDiskCapacity,
  getTotalMemory,
  getUsedMemory,
} from 'react-native-device-info'
import NetInfo from '@react-native-community/netinfo'
import { getTimeSinceStartup } from 'react-native-startup-time'
import * as RNLocalize from 'react-native-localize'
import { getSystemBrightnessLevel } from '@adrianso/react-native-device-brightness'
import dayjs from 'dayjs'
import NfcManager from 'react-native-nfc-manager'
import type { Device } from '@/typings/device'
import { AppModule } from '@/modules'
import { MMKV } from './storage'
const locales = RNLocalize.getLocales()
const timezone = RNLocalize.getTimeZone()

/**
 * 一部分从项目中的原生模块获取
 * 一部分从第三方模块中获取
 * 一部分从全局状态中获取(已经获取的，不需要重复获取)
 */

export type FromView =
  | 'anglex'
  | 'angley'
  | 'anglez'
  | 'googleAdvertisingId'
  | 'applyId'
  | 'phone'
  | 'deviceId'
  | 'gpsInfo'
  | 'idcard'
  | 'intranetIP'
  | 'isSimulator'
  | 'requestIp'
type PrtialDevice = Omit<Device, FromView>
const memoryFormat = (number: number) => `${(number / (1024 * 1024 * 1024)).toFixed(2)}GB`
export async function getDeviceInfo(): Promise<PrtialDevice> {
  // 使用Promise.all并行获取
  const [
    powerState,
    carrier,
    macAddress,
    totalMemory,
    usedMemory,
    totalDiskCapacity,
    freeDiskStorage,
    howLongBootTime,
    appInfo,
    netInfo,
    screenBrightness,
    deviceName,
    hasNRCfunction,
    _carrierName,
    _mobileCountryCode,
    _mobileNetworkCode,
  ] = await Promise.all([
    getPowerState().catch(() => ({
      batteryLevel: 0,
      batteryState: 'unknown',
    })),
    getCarrier().catch(() => ''),
    getMacAddress().catch(() => ''),
    getTotalMemory().catch(() => 0),
    getUsedMemory().catch(() => 0),
    getTotalDiskCapacity().catch(() => 0),
    getFreeDiskStorage().catch(() => 0),
    getTimeSinceStartup().catch(() => 0),
    AppModule.getInfo().catch(() => ({
      screenSize: '',
      bootTime: '',
      isAgent: '',
      isBreakPrison: '',
      photoNum: 0,
    })),
    NetInfo.fetch().catch(() => ({ type: '', details: { strength: 0, bssid: '' } })),
    getSystemBrightnessLevel().catch(() => 0),
    getDevice().catch(() => ''),
    NfcManager.isSupported().catch(() => false),
    AppModule.carrierName().catch(() => ''),
    AppModule.mobileCountryCode().catch(() => ''),
    AppModule.mobileNetworkCode().catch(() => ''),
  ])
  const device: PrtialDevice = {
    screenSize: appInfo.screenSize,
    bootTime: appInfo.bootTime,
    availableMemory: memoryFormat(totalDiskCapacity),
    isAgent: appInfo.isAgent,
    basebandVersion: getBrand(),
    howLongBootTime: `${howLongBootTime}`,
    batteryPower: `${powerState.batteryLevel}`,
    batteryStatus: `${powerState.batteryState}`,
    buildDate: AppModule.getBuildDate(),
    isBreakPrison: appInfo.isBreakPrison,
    screenBrightness: screenBrightness.toFixed(2),
    isCommunication: _carrierName ? 'Y' : 'N',
    device: deviceName,
    deviceName: getModel(),
    deviceVersion: getSystemVersion(),
    persistentDeviceId: getUniqueId(),
    nfcFunction: hasNRCfunction ? 'Y' : 'N',
    language: locales[0].languageTag,
    mcc: _mobileCountryCode,
    meid: '',
    memoryUsed: memoryFormat(usedMemory),
    mnc: _mobileNetworkCode,
    mobileNetworkType: netInfo.type,
    runMemory: memoryFormat(totalMemory),
    wifiMac: macAddress,
    residualMemory: memoryFormat(freeDiskStorage),
    networkOperators: carrier,
    numberOfPhotos: appInfo.photoNum,
    numberOfSongs: 0,
    numberOfVideos: 0,
    //@ts-ignore
    wifiName: netInfo.details.bssid,
    //@ts-ignore
    signalStrength: netInfo.details.strength,
    startTime: MMKV.getInt('startTime') || 0,
    systemTime: dayjs(Date()).format('YYYY-MM-DD'),
    timeZone: timezone,
  }
  return device
}
