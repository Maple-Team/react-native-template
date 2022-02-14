import { NativeModules } from 'react-native'

const { AppModule } = NativeModules

type Environment = 'production' | 'staging' | 'development'

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
}
export default AppModule as AppModuleInterface
