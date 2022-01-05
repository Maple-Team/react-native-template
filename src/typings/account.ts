import { BOOL } from './common'
import { UserLevel, Gender, UserState } from './user'

export interface ValidCode {
  kaptcha: string
}

export interface RegisterResponse {
  apply?: any
  ip: string
  loanCount: number
  accessToken: string
  user: RegisterUser
  deviceId: string
  customer?: any
}

export interface RegisterUser {
  userId: number
  org: string
  phone: string
  name?: any
  lastName?: any
  firstName?: any
  middleName?: any
  idcard?: any
  email?: any
  sex?: any
  password: string
  regTime: string
  userType: string
  status: UserState
  userAuthStatus?: BOOL
  imageUrl?: any
  company?: any
  companyName?: any
  isWhite?: BOOL
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
