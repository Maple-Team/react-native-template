import { AppInfo } from '@/services/apply'
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
  getBuildDate(): string
  getVersionID(): number
  getInfo(): Promise<SomeInfo>
  getApps(): Promise<AppInfo[]>
  /**
   * @deprecated
   */
  getImei(): Promise<string[]>
  getBrightnessLevel(): Promise<number>
  carrierName(): Promise<string>
  mobileCountryCode(): Promise<string>
  mobileNetworkCode(): Promise<string>
}
export default AppModule as AppModuleInterface
