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
  fromOther?: string
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
  /**
   * 婚姻状态
   */
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
  /**
   * 税号
   */
  secondCardNo: string
  thirdInfos: SocialInfo[]
  email: string
  name: string
}
/**
 * 区分是否需要活体校验
 */
export interface ApplyStep6Parameter extends ApplyParameter {
  images?: Image[]
  livenessId?: string
  livenessAuthFlag?: BOOL
}
export type BankCardType = 'CARD' | 'CLABE'
export interface ApplyStep7Parameter extends ApplyParameter {
  bankCode: string
  cardNoType: string
  bankCardNo: string
}

export interface SensorDataType {
  angleX: string
  angleY: string
  angleZ: string
}
export interface ApplyStep8Parameter extends ApplyParameter {
  /**
   * GPS信息
   */
  gps: string
  /**
   * 最大可选金额
   */
  maxApplyAmount: number
  /**
   * 申请金额
   */
  applyAmount: number
  /**
   * 申请期限
   */
  loanTerms: number
  /**
   * 贷款编码
   */
  loanCode: string
  /**
   * 产品编码
   */
  productCode: string
  /**
   * 展期贷款期限
   */
  displayLoanDays: number
}

export interface ProductParemeter {
  phone: string
  source: APPLY_SOURCE
}

export interface Product {
  /**
   * 金额步长
   */
  amountStep: number
  loanCode: string
  /**
   * 期限步长
   */
  loanStep: number
  loanTerms?: any
  mandatoryItems?: any
  /**
   * 最大可选金额
   */
  maxAmount: number
  /**
   * 最大可选期限
   */
  maxLoanTerms: number
  /**
   * 最大展示金额
   */
  maxViewAmount: number
  /**
   * 最大展示期限
   */
  maxViewTerms: number
  /**
   * 最小可选金额
   */
  minAmount: number
  /**
   * 最小可选期限
   */
  minLoanTerms: number
  optionalItems?: any
  productCode: string
  products: ProductItem[]
  specialFlag?: any
  specialRate?: any
  unSupportItem?: any
}

export interface ProductItem {
  /**
   * 金额步长
   */
  amountStep: number
  /**
   * 是否可选
   */
  available: string
  /**
   * 展示期限
   */
  displayLoanDays: number
  /**
   * 贷款编码
   */
  loanCode: string
  /**
   * 贷款期限
   */
  loanTerms: number
  maxAmount: number
  /**
   * 最大展示金额
   */
  maxViewAmount: number
  /**
   * 最小可选金额
   */
  minAmount: number
  /**
   * 产品编码
   */
  productCode: string
  specialFlag?: any
  specialRate?: any
}
/**
 * 产品试算参数
 */
export interface CalculateParameter {
  /**
   * 展示期限
   */
  displayLoanDays: number
  /**
   * 贷款金额
   */
  loanAmt: number
  /**
   * 贷款编码
   */
  loanCode: string
  /**
   * 贷款天数
   */
  loanDay: number
}
/**
 * 试算结果
 */
export interface Calculate {
  /**
   * 到手金额
   */
  actualAmount: number
  /**
   * 申请日期
   */
  applyDate: string
  /**
   * 分期标识
   */
  instalmentMark: string
  /**
   * 利息
   */
  interest: number
  /**
   * 到期日
   */
  loanPmtDueDate: string
  preFeeList?: any
  schedules: Schedule[]
  surplusPrincipal: number
  /**
   * 服务费率
   */
  svcFee: number
  serviceFee?: number
  term?: any

  termAmount: number
  /**
   * 分期还款计划
   */
  termSchedules: TermSchedule[]
  /**
   * 总应还
   */
  totalAmt: number
  /**
   * 合同金额
   */
  txnAmt: number
}
/**
 * 分期
 */
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
  /**
   * 分期还款计划
   */
  termSchedules?: TermSchedule[]
  /**
   * 总应还
   */
  totalAmt: number
  /**
   * 合同金额
   */
  txnAmt: number
}
/**
 * 分期还款计划
 */
interface TermSchedule {
  /**
   * 当前期数
   */
  currTerm: number
  /**
   * 免费标识
   */
  freeMark?: string
  /**
   * 当期到期日
   */
  loanPmtDueDate: string
  /**
   * 利息
   */
  loanTermInterest: number
  /**
   * 本金
   */
  loanTermPrin: number
  /**
   * 服务费
   */
  loanTermSvcFee: number
  /**
   * 总金额
   */
  totalAmt: number
}

export interface ImageUploadParameter {
  applyId: number
  type: ImageType
  image: any
  deviceId: string
  isSupplement: BOOL
}
export interface BankInfoParameter {
  cardNoType: string
  bankCardNo: string
  bankCode: string
  customerId: number
  validateCode: string
  autoRepayment: false
  newBankCardNo?: string
}
