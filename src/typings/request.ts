import type { BOOL } from './common'

export interface RegisterParameter {
  phone: string
  password: string
  comfirmPassword: string
  validateCode?: string
  isValidateCode: BOOL
}
export type APPLY_SOURCE = 'APP' | 'H5'
export interface CommonHeader {
  /**
   * 进件端版本号
   */
  versionId: number
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

export interface LoginParameter {
  phone: string
  code?: string
  password?: string
  deviceId: string
  gps: string
  loginType: 'CODE_LOGIN' | 'PWD_LOGIN'
}

export interface ChangePwdParmeter {
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
export type SendChannel = 'SMS' | 'IVR'
export interface ValidateCodeParameter {
  phone: string
  sendChannel: SendChannel
  type: ValidateCodeType
}
