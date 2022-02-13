import type { BOOL } from './common'
import type { API_CODE } from '../state/enum'

export interface Status {
  code: API_CODE
  msg: string
  msgCn: string
}

export interface Version {
  filePath: string
  isForceUpdate: BOOL
  versionDesc: string
  versionId: number
  versionNo: string
  versionType: string
}
export interface Brand {
  channelInfo: ChannelInfo
  /**
   * 注册环节验证次数，如果1次，读秒结束跳过不校验
   * TODO 验证几次后跳过
   */
  codeValidatecount: number
  /**
   * 注册环节是否需要校验验证码，暂不取值处理
   */
  isValidateCode: string
  /**
   * 验证码读秒数, 短信服务不佳时跳过
   */
  smsWaitInterval: number
  livenessAuthCount: number
  livenessAuthEnable: BOOL
  serviceInfo: ServiceInfo
  smsSendEnable: string
}

interface ServiceInfo {
  ccphone: string
  corpAddr: string
  corpName: string
  email: string
  fb: string
  svcCorp: string
  svcCorpAddr: string
}

interface ChannelInfo {
  privacyUrl: string
  videoAuthUrl: string
}

export interface Dict {
  name: string
  code: string
  nameCn?: string
}

export type DictField =
  | 'INDUSTRY'
  | 'PROFESSION'
  | 'MONTHLY_INCOME'
  | 'SALARY_TYPE'
  | 'WEEKLY'
  | 'MONTHLY'
  | 'DISTRICT'
  | 'INCUMBENCY'
  | 'INDUSTRY'
  | 'RELATIONSHIP'
  | 'OTHER_RELATIONSHIP'
  | 'MARITAL_STATUS'
  | 'PRIMAARYID'
  | 'EDUCATION'
  | 'LOAN_PURPOSE'
  | 'CARD_NO_TYPE'
  | 'PRIMAARYID'
  | 'BANK'

export type PickerField =
  | 'industryCode'
  | 'jobTypeCode'
  | 'monthlyIncome'
  | 'salaryType'
  | 'salaryDate'
  | 'companyAddrProvinceCode'
  | 'homeAddrProvinceCode'
  | 'homeAddrCityCode'
  | 'companyAddrCityCode'
  | 'incumbency'
  | 'maritalStatus'
  | 'docType'
  | 'educationCode'
  | 'loanPurpose'
  | 'cardNoType'
  | 'contactRelationCode1'
  | 'contactRelationCode2'
  | 'contactRelationCode3'
  | 'bankCode'
