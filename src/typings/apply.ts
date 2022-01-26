import type { BOOL } from './common'
import type { APPLY_STATE } from '../state/enum'
import type { APPLY_SOURCE } from './request'
import type { Gender, ImageType, SocialInfo } from './user'

export interface ApplyResponse {
  accessToken: string
  applyId: number
  applyStatus: APPLY_STATE
  name: string
  ocrResult?: OcrResult
}

export interface OcrResult {
  addressAll: string
  birthday: string
  fathersurname: string
  gender: string
  idCard: string
  mothersurname: string
  userName: string
}
export interface ApplyStep1Parameter extends ApplyParameter {
  deviceId: string
  phone: string
  idcard: string
  gps: string
}
export interface ApplyParameter {
  applyId: number
  currentStep: number
  totalSteps: number
}
export interface ApplyStep2Parameter extends ApplyParameter {
  industryCode: string
  industry: string
  jobTypeCode: string
  jobType: string
  monthlyIncome: string
  /**
   * 	发薪周期
   */
  salaryType: string
  /**
   * 	发薪日期
   */
  salaryDate: string
  company: string
  companyPhone: string
  companyAddrProvinceCode: string
  companyAddrProvince: string
  companyAddrCityCode: string
  companyAddrCity: string
  companyAddrDetail: string
  /**
   * 在职时长
   */
  incumbency: string
}
export interface ApplyStep3Parameter extends ApplyParameter {
  contacts: Contact[]
}

export interface Contact {
  contactName: string
  contactRelation: string
  contactRelationCode: string
  contactPhone: string
}

export interface ApplyStep4Parameter extends ApplyParameter {
  images: Image[]
}

interface Image {
  imageId: number
}

export interface ApplyStep5Parameter extends ApplyParameter {
  firstName: string
  middleName: string
  lastName: string
  sex: Gender
  birth: string
  idcard: string
  maritalStatus: string
  homeAddrProvinceCode: string
  homeAddrProvince: string
  homeAddrCityCode: string
  homeAddrCity: string
  homeAddrDetail: string
  docType: string
  backupPhone: string
  educationCode: string
  loanPurpose: string
  secondCardNo: string
  thirdInfos: SocialInfo[]
  email: string
  name: string
}

export interface ApplyStep6Parameter extends ApplyParameter {
  images: Image[]
  livenessId: string
  livenessAuthFlag: BOOL
}
export type BankCardType = 'CARD' | 'CLABE'
export interface ApplyStep7Parameter extends ApplyParameter {
  bankCode: string
  cardNoType: string
  bankCardNo: string
}

export interface ApplyStep8Parameter extends ApplyParameter {
  gps: string
  maxApplyAmount: number
  applyAmount: number
  loanTerms: number
  loanCode: string
  productCode: string
  displayLoanDays: number
}

export interface ProductParemeter {
  phone: string
  source: APPLY_SOURCE
}

export interface Product {
  amountStep: number
  loanCode: string
  loanStep: number
  loanTerms?: any
  mandatoryItems?: any
  maxAmount: number
  maxLoanTerms: number
  maxViewAmount: number
  maxViewTerms: number
  minAmount: number
  minLoanTerms: number
  optionalItems?: any
  productCode: string
  products: ProductItem[]
  specialFlag?: any
  specialRate?: any
  unSupportItem?: any
}

export interface ProductItem {
  amountStep: number
  available: string
  displayLoanDays: number
  loanCode: string
  loanTerms: number
  maxAmount: number
  maxViewAmount: number
  minAmount: number
  productCode: string
  specialFlag?: any
  specialRate?: any
}

export interface CalculateParameter {
  displayLoanDays: number
  loanAmt: number
  loanCode: string
  loanDay: number
}

export interface Calculate {
  actualAmount: number
  applyDate: string
  instalmentMark: string
  interest: number
  loanPmtDueDate: string
  preFeeList?: any
  schedules: Schedule[]
  surplusPrincipal: number
  svcFee: number
  term?: any
  termAmount: number
  termSchedules: TermSchedule[]
  totalAmt: number
  txnAmt: number
}
interface Schedule {
  actualAmount: number
  applyDate: string
  instalmentMark?: any
  interest: number
  loanPmtDueDate: string
  preFeeList?: any
  schedules?: any
  surplusPrincipal: number
  svcFee: number
  term?: any
  termAmount: number
  termSchedules?: any
  totalAmt: number
  txnAmt: number
}
export interface TermSchedule {
  currTerm: number
  freeMark?: string
  loanPmtDueDate: string
  loanTermInterest: number
  loanTermPrin: number
  loanTermSvcFee: number
  totalAmt: number
}

export interface ImageUploadParameter {
  applyId: number
  type: ImageType
  image: ''
  deviceId: string
  isSupplement: BOOL
}
