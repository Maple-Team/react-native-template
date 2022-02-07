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
  codeValidatecount: number
  isValidateCode: string
  livenessAuthCount: number
  livenessAuthEnable: BOOL
  serviceInfo: ServiceInfo
  smsSendEnable: string
  smsWaitInterval: number
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
