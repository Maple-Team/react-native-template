import { BOOL } from '@/typings/common'
import { NativeModules } from 'react-native'

const { AppModule } = NativeModules

type Environment = 'production' | 'staging' | 'development'
interface SomeInfo {
  screenSize: string
  bootTime: string
  isAgent: string
  isBreakPrison: string
  photoNum: number
}
interface APPInfo {
  packageName: string
  versionName: string
  versionCode: number
  firstInstallTime: number
  lastUpdateTime: number
  appName: string
  apkDir: string
  size: number
  isSystem: BOOL
  isAppActive: boolean
}
/**
 * App基础信息模块
 */
interface AppModuleInterface {
  /**
   * 获取Android环境变量
   */
  getEnv(): Environment
  /**
   * 获取baseURL
   */
  getBaseUrl(): string
  getVersionID(): number
  getInfo(): Promise<SomeInfo>
  getApps(): Promise<APPInfo>
  /**
   * @deprecated
   */
  getImei(): Promise<string[]>
  getBrightnessLevel(): Promise<number>
  carrierName(): Promise<string>
}
export default AppModule as AppModuleInterface
