import type { APPLY_BOOL } from './user'

export interface Device {
  anglex: string
  angley: string
  anglez: string
  applyId: string
  /**
   * 可用内存，示例值：108.439453 GB
   */
  availableMemory: string
  basebandVersion: string
  /**
   * 电池电量，示例值：71
   */
  batteryPower: string
  batteryStatus: string
  bootTime: string
  buildDate: string
  device: string
  deviceId: string
  deviceName: string
  deviceVersion: string
  googleAdvertisingId: string
  /**
   * 经纬度，示例值：`${},${}`
   */
  gpsInfo: string
  howLongBootTime: string
  idcard: string
  intranetIP: string
  isAgent: string
  isBreakPrison: string
  isCommunication: APPLY_BOOL
  isSimulator: APPLY_BOOL
  language: string
  mcc: string
  meid: string
  /**
   * 已用内存，示例值：108.439453 GB
   */
  memoryUsed: string
  mnc: string
  /**
   * TODO
   */
  mobileNetworkType: string
  /**
   * TODO
   */
  networkOperators: string
  nfcFunction: APPLY_BOOL
  numberOfPhotos: number
  numberOfSongs: number
  numberOfVideos: number
  /**
   * 值/unknown
   */
  persistentDeviceId: string
  phone: string
  requestIp: string
  /**
   * 存储内存，示例值：108.439453 GB
   */
  residualMemory: string
  /**
   * 运行内存，示例值：108.439453 GB
   */
  runMemory: string
  screenBrightness: string
  /**
   * 屏幕尺寸 width,height
   */
  screenSize: string
  signalStrength: string
  /**
   * TODO
   */
  startTime: number
  systemTime: string
  /**
   * 时区，简写
   */
  timeZone: string
  /**
   * wifi mac地址
   */
  wifiMac: string
  wifiName: string
}
