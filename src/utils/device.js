import DeviceInfo from 'react-native-device-info'
import AsyncStorage from '@react-native-community/async-storage'
import IMEI from 'react-native-imei'
import RNAdvertisingId from 'react-native-advertising-id'
import NetInfo from '@react-native-community/netinfo'
import CarrierInfo from 'react-native-carrier-info'
import { getTimeSinceStartup } from 'react-native-startup-time'
import * as RNLocalize from 'react-native-localize'
import ScreenBrightness from 'react-native-device-brightness'
import dayjs from 'dayjs'
import NfcManager from 'react-native-nfc-manager'
import Sot from 'react-native-sot'
import { NativeModules } from 'react-native'
import { errorCaptured } from './request'

const _locales = RNLocalize.getLocales()
const timezone = RNLocalize.getTimeZone()
let locale
if (Array.isArray(_locales)) {
  locale = _locales[0].languageTag
}
// 基本信息
const {
  getUniqueId, // string
  getManufacturer, // string
  getBrand, // string
  getDevice,
  getDeviceId, // string
  getSystemName, // string
  getSystemVersion, // string
  getBuildId, // string
  getBundleId, // string
  getApplicationName, // string
  getBuildNumber, // string
  getVersion, // string
  getUsedMemory, // number
  getReadableVersion, // string
  getDeviceName, // string
  getUserAgent, // string
  isEmulator, // promise<boolean>
  isTablet, // boolean
  getCarrier, // string
  getModel,
  getIpAddress,
  getMacAddress,
  getTotalMemory, // number
  getTotalDiskCapacity, // number
  getFreeDiskStorage, // number
  getBatteryLevel, // promise<number>
  getPowerState, // promise<PowerState>
  isBatteryCharging, // promise<boolean>
  isLandscape, // boolean
  getDeviceType, // DeviceType: '',
  supportedAbis, // string[]: '',
  getAndroidId,
  // isLocationEnabled, // promise<boolean>
  // getAvailableLocationProviders, // () => Promise<LocationProviderInfo>: '',
} = DeviceInfo
const ANDROID_Q = 29

export default async function getDeviceInfo() {
  const { VERSION, getDeviceUnionID, getImei } = NativeModules.AppConstants
  const [e1, r1] = await errorCaptured(isEmulator)
  const IsEmulator = e1 || r1
  let batteryStatus = ''
  let batteryPower = ''
  if (!IsEmulator) {
    const [e2, r2] = await errorCaptured(getPowerState)
    const powerState = e2 || r2
    let _batteryStatus = powerState.batteryState
    switch (_batteryStatus) {
      case 'unplugged':
        batteryStatus = 'unCharging'
        break
      case 'charging':
      case 'full':
        batteryStatus = 'Charging'
        break
      default:
        batteryStatus = 'unknown'
        break
    }
    batteryPower = `${parseFloat(powerState.batteryLevel).toFixed(2)}`
  }
  const brand = getBrand()
  // const buildNumber = getBuildNumber()
  // const bundleId = getBundleId() // "com.learnium.mobile"
  const [e3, r3] = await errorCaptured(getCarrier) // 网络运营商
  const carrier = e3 || r3 // 网络运营商
  const deviceName = getModel()
  const [e4, r4] = await errorCaptured(getDevice)
  const device = e4 || r4
  const [e5, r5] = await errorCaptured(getIpAddress) // @react-native-community/netinfo
  const ip = e5 || r5
  const [e6, r6] = await errorCaptured(getMacAddress)
  const macAddress = e6 || r6
  const systemVersion = getSystemVersion()
  const [e7, r7] = await errorCaptured(getTotalMemory) // 1995018240
  const totalMemory = e7 || `${(r7 / (1024 * 1024 * 1024)).toFixed(2)}GB` // 1995018240
  const [e8, r8] = await errorCaptured(getUsedMemory)
  const usedMemory = e8 || `${(r8 / (1024 * 1024 * 1024)).toFixed(2)}GB` // 1995018240
  const uniqueId = getUniqueId()
  const [e21, r21] = await errorCaptured(RNAdvertisingId.getAdvertisingId)
  let googleAdvertisingId = e21 ? '' : r21.advertisingId
  let meid, deviceId
  if (VERSION >= ANDROID_Q) {
    const [errD, _deviceId] = await errorCaptured(getDeviceUnionID)
    const [errImei, imei] = await errorCaptured(getImei)
    deviceId = _deviceId ? _deviceId : googleAdvertisingId ? googleAdvertisingId : 'UNKNOWN'
    meid = imei ? imei : googleAdvertisingId ? googleAdvertisingId : 'UNKNOWN'
    console.log(errD, errImei)
  } else {
    const [e10, r10] = await errorCaptured(IMEI.getImei)
    meid = e10 || r10
    deviceId = meid
      ? Array.isArray(meid)
        ? meid[0]
          ? meid[0]
          : uniqueId
        : meid.split(',')[0]
      : 'UNKNOWN'
  }
  const version = getVersion()
  const [e11, r11] = await errorCaptured(NetInfo.fetch)
  const netInfo = e11 || r11
  const [e12, r12] = await errorCaptured(() => AsyncStorage.getItem('gps'))
  const gps = e12 ? '0,0' : !r12 ? '0,0' : r12
  const [e13, r13] = await errorCaptured(getTotalDiskCapacity)
  const availableMemory = e13 || `${(r13 / (1024 * 1024 * 1024)).toFixed(2)}GB`
  const [e14, r14] = await errorCaptured(getFreeDiskStorage)
  const residualMemory = e14 || `${(r14 / (1024 * 1024 * 1024)).toFixed(2)}GB`
  const [e15, r15] = await errorCaptured(Sot.getInfo)
  const { screenSize, bootTime, isAgent, isBreakPrison, photoNum } = e15 || r15
  const [e16, r16] = await errorCaptured(CarrierInfo.mobileCountryCode)
  const mcc = e16 || r16
  const [e17, r17] = await errorCaptured(CarrierInfo.mobileNetworkCode)
  const mnc = e17 || r17
  const [e18, r18] = await errorCaptured(getTimeSinceStartup)
  const howLongBootTime = e18 || r18
  const timeZone = timezone
  const [e19, r19] = await errorCaptured(ScreenBrightness.getSystemBrightnessLevel)
  const screenBrightness = e19 || r19.toFixed(2)
  const [e20, r20] = await errorCaptured(() => AsyncStorage.getItem('startTime'))
  const startTime = e20 || r20

  const [e22, r22] = await errorCaptured(NfcManager.isSupported)
  const hasNRCfunction = e22 || r22
  const [e23, r23] = await errorCaptured(CarrierInfo.carrierName)
  const isCommunication = e23 ? false : r23 != null
  const [e24, r24] = await errorCaptured(getAndroidId)
  const androidId = e24 || r24
  await AsyncStorage.setItem('deviceId', deviceId)
  return {
    androidId,
    startTime,
    availableMemory,
    residualMemory,
    persistentDeviceId: uniqueId,
    deviceId,
    deviceName,
    device,
    deviceVersion: systemVersion,
    screenSize,
    gpsInfo: gps,
    intranetIP: ip,
    wifiMac: macAddress,
    wifiName: netInfo.details ? netInfo.details.ssid : '',
    isAgent,
    isBreakPrison,
    googleAdvertisingId,
    isCommunication,
    isSimulator: IsEmulator,
    meid: Array.isArray(meid) ? meid.join(',') : meid,
    runMemory: totalMemory,
    memoryUsed: usedMemory,
    basebandVersion: brand,
    batteryStatus: batteryStatus,
    batteryPower,
    networkOperators: carrier,
    signalStrength: netInfo.details.strength,
    mobileNetworkType: netInfo.type,
    mcc,
    mnc,
    howLongBootTime,
    language: locale,
    timeZone,
    systemTime: dayjs(Date()).format('YYYY-MM-DD'),
    screenBrightness,
    nfcFunction: hasNRCfunction ? 'Y' : 'N',
    numberOfPhotos: photoNum,
    bootTime,
    version,
  }
}
