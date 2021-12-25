import { BOOL } from './common'
import { APPLY_STATE } from '../state/enum'
import { APPLY_SOURCE } from './request'
import { Gender, ImageType, SocialInfo } from './user'

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
export interface ApplyStep1 {
  deviceId: string
  phone: string
  idcard: string
  gps: string
  currentStep: number
  totalSteps: number
}
export interface ApplyStep2 {
  applyId: number
  currentStep: number
  totalSteps: number
  industryCode: string
  industry: string
  jobTypeCode: string
  jobType: string
  monthlyIncome: string
  salaryType: string
  salaryDate: string
  company: string
  companyPhone: string
  companyAddrProvinceCode: string
  companyAddrProvince: string
  companyAddrCityCode: string
  companyAddrCity: string
  companyAddrDetail: string
  incumbency: string
}
export interface ApplyStep3 {
  applyId: number
  currentStep: number
  totalSteps: number
  contacts: Contact[]
}
type ContactRelationCode = 'CHILDREN' | 'FRIEND'
type ContactRelation = 'Friend' | 'Hijos'
export interface Contact {
  contactName: string
  contactRelation: ContactRelation
  contactRelationCode: ContactRelationCode
  contactPhone: string
}

export interface ApplyStep4 {
  applyId: number
  currentStep: number
  totalSteps: number
  images: Image[]
}

export interface Image {
  imageId: number
}

export interface ApplyStep5 {
  applyId: number
  currentStep: number
  totalSteps: number
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

export interface ApplyStep6 {
  applyId: number
  currentStep: number
  totalSteps: number
  images: Image[]
  livenessId: string
  livenessAuthFlag: BOOL
}
export type BankCardType = 'CARD' | 'CLABE'
export interface ApplyStep7 {
  applyId: number
  currentStep: number
  totalSteps: number
  bankCode: string
  cardNoType: BankCardType
  bankCardNo: string
}

export interface ApplyStep8 {
  applyId: number
  gps: string
  currentStep: number
  totalSteps: number
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
  loanStep: number
  maxAmount: number
  maxLoanTerms: number
  maxViewAmount: number
  maxViewTerms: number
  minAmount: number
  minLoanTerms: number
  products: ProductItem[]
}

export interface ProductItem {
  amountStep: number
  available: BOOL
  displayLoanDays: number
  loanCode: string
  loanTerms: number
  maxViewAmount: number
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
  dailyInterestRate: number
  extendFeeRate: number
  instalmentMark: BOOL
  interest: number
  interestRate: number
  loanPmtDueDate: string
  penaltyRate: number
  surplusPrincipal: number
  svcFee: number
  svcFeeRate: number
  termAmount: number
  termSchedules: TermSchedule[]
  totalAmt: number
  txnAmt: number
}

export interface TermSchedule {
  currTerm: number
  loanPmtDueDate: string
  loanTermInterest: number
  loanTermPrin: number
  loanTermSvcFee: number
  totalAmt: number
  freeMark?: string
}

export interface ImageUploadParameter {
  applyId: number
  type: ImageType
  image: '' // FIXME
  deviceId: string
  isSupplement: BOOL
}
