import { AxiosRequestHeaders } from 'axios'

interface RegisterParameter {
  phone: string
  idcard: string
  password: string
  comfirmPassword: string
  validateCode: string
}
export type APPLY_SOURCE = 'APP' | 'H5'
export interface CommonHeader extends AxiosRequestHeaders {
  /**
   * 进件端版本号
   */
  versionId: string
  /**
   * 商户ID
   */
  merchantId: string
  /**
   * 进件端
   */
  inputChannel: string
  /**
   * 数据来源，APP、H5
   */
  source: APPLY_SOURCE
  /**
   * 营销渠道
   */
  channel: string
  /**
   * GPS定位信息 <经度,纬度>
   */
  gps: string
  /**
   * 设备ID
   */
  deviceId: string
  /**
   *
   */
  accessToken: string
}

interface LoginParameter {
  phone: string
  code: string
  password: string
  deviceId: string
  gps: string
  loginType: 'CODE_LOGIN' | 'PWD_LOGIN'
}

interface ChangePwdParmeter {
  phone: string
  idcard: string
  password: string
  comfirmPassword: string
  validateCode: string
}
export type ValidateCodeType =
  | 'LOGIN'
  | 'REGISTER'
  | 'MODIFY_PASSWORD'
  | 'MODIFY_BANKCARD'
  | 'CONFIRM'
interface ValidateCodeParameter {
  phone: string
  sendChannel: 'SMS'
  type: ValidateCodeType
}
