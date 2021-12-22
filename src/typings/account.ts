import { BOOL } from './common'
import { UserLevel, Gender, UserState } from './user'

export interface ValidCode {
  kaptcha: string
}
export interface RegisterUser {
  org: string
  password: string
  phone: string
  regTime: number
  status: string
  userId: number
  userType: string
}

export interface LoginUser {
  email: string
  firstName: string
  idcard: string
  isWhite: UserLevel
  lastName: string
  middleName: string
  name: string
  password: string
  phone: string
  regTime: number
  sex: Gender
  status: UserState
  userAuthStatus: BOOL
  userId: number
  userType: 'CUSTOMER'
}

export interface ResetPwdParameter {
  phone: string
  idcard: string
  password: string
  comfirmPassword: string
  validateCode: string
}
export interface Account {
  ip: string
  /**
   * 贷款次数
   */
  loanCount: number
  accessToken: string
  user: LoginUser
  deviceId: string
}
