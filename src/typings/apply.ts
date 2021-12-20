import { APPLY_STATE } from './enum'
import { APPLY_SOURCE } from './request'
import { APPLY_BOOL, Gender, ImageType, SocialInfo } from './user'

interface ApplyResponse {
  accessToken: string
  applyId: number
  applyStatus: APPLY_STATE
  name: string
  ocrResult?: OcrResult
}

interface OcrResult {
  addressAll: string
  birthday: string
  fathersurname: string
  gender: string
  idCard: string
  mothersurname: string
  userName: string
}
interface ApplyStep1 {
  deviceId: string
  phone: string
  idcard: string
  gps: string
  currentStep: number
  totalSteps: number
}
interface ApplyStep2 {
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
interface ApplyStep3 {
  applyId: number
  currentStep: number
  totalSteps: number
  contacts: Contact[]
}
type ContactRelationCode = 'CHILDREN' | 'FRIEND'
type ContactRelation = 'Friend' | 'Hijos'
interface Contact {
  contactName: string
  contactRelation: ContactRelation
  contactRelationCode: ContactRelationCode
  contactPhone: string
}

interface ApplyStep4 {
  applyId: number
  currentStep: number
  totalSteps: number
  images: Image[]
}

interface Image {
  imageId: number
}

interface ApplyStep5 {
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

interface ApplyStep6 {
  applyId: number
  currentStep: number
  totalSteps: number
  images: Image[]
  livenessId: string
  livenessAuthFlag: APPLY_BOOL
}
export type BankCardType = 'CARD'
interface ApplyStep7 {
  applyId: number
  currentStep: number
  totalSteps: number
  bankCode: string
  cardNoType: BankCardType
  bankCardNo: string
}

interface ApplyStep8 {
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

interface ProductParemeter {
  phone: string
  source: APPLY_SOURCE
}

interface Product {
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

interface ProductItem {
  amountStep: number
  available: APPLY_BOOL
  displayLoanDays: number
  loanCode: string
  loanTerms: number
  maxViewAmount: number
}

interface CalculateParameter {
  displayLoanDays: number
  loanAmt: number
  loanCode: string
  loanDay: number
}

interface Calculate {
  actualAmount: number
  applyDate: string
  dailyInterestRate: number
  extendFeeRate: number
  instalmentMark: APPLY_BOOL
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

interface TermSchedule {
  currTerm: number
  loanPmtDueDate: string
  loanTermInterest: number
  loanTermPrin: number
  loanTermSvcFee: number
  totalAmt: number
  freeMark?: string
}

interface ImageUploadParameter {
  applyId: number
  type: ImageType
  image: '' // FIXME
  deviceId: string
  isSupplement: APPLY_BOOL
}
