import { APPLY_STATE } from './enum'
export type APPLY_BOOL = 'Y' | 'N'
interface RegisterUser {
  org: string
  password: string
  phone: string
  regTime: number
  status: string
  userId: number
  userType: string
}
export type UserState = 'ACTIVE' | 'UNACTIVE' | 'BLACK_LIST'
export type Gender = 'male' | 'female'
enum UserLevel {
  NORMAL = '0',
  WHITE = '1',
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
  userAuthStatus: APPLY_BOOL
  userId: number
  userType: 'CUSTOMER'
}

interface Body {
  applyId: number
  applyStatus: APPLY_STATE
  canReApplyDays: number
  continuedLoan: APPLY_BOOL
  contractNo: string
  currentStep: number
  customerDto: Customer
  customerId: string
  docType: string
  firstName: string
  homeAddr: string
  idcard: string
  images: Image[]
  inLoanCount: number
  lastName: string
  loanCount: number
  maritalStatus: string
  middleName: string
  name: string
  phone: string
  sex: string
  totalSteps: number
  userAuthStatus: APPLY_BOOL
  userId: number
  videoAuthFlag: string
}
export type ImageType = 'INE_OR_IFE_FRONT' | 'INE_OR_IFE_BACK' | 'LIVENESS_IMAGE' | 'AUTH_VIDEO '

interface Image {
  applyId: number
  imageType: ImageType
  imageUrl: string
}
/**
 * 用户进件信息
 */
interface Customer {
  bankCardNo: string
  bankCode: string
  birth: number
  contactName: string
  contactPhone: string
  contactRelation: string
  contactRelationCode: string
  customerId: number
  deviceId: string
  docType: string
  email: string
  firstName: string
  homeAddrCity: string
  homeAddrCityCode: string
  homeAddrDetail: string
  homeAddrProvince: string
  homeAddrProvinceCode: string
  idcard: string
  isAutoRepayment: APPLY_BOOL
  lastName: string
  liabilities: number
  maritalStatus: string
  middleName: string
  monthlyRepayment: number
  name: string
  otherContactName: string
  otherContactPhone: string
  otherContactRelation: string
  otherContactRelationCode: string
  phone: string
  preApplyId: number
  primaryCardType: string
  sex: string
  thirdInfos: SocialInfo[]
  userId: number
}
/**
 * 社交软件信息
 */
export interface SocialInfo {
  authPhone: string
  authType: string
  isAuth: APPLY_BOOL
  thirdCode: 'whatsApp'
  thirdName: 'whatsApp'
}
