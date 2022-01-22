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
  isValidateCode: BOOL
  smsSendEnable: BOOL
  smsWaitInterval: number
  codeValidatecount: number
  handheldUploadFlag: BOOL
  serviceInfo: ServiceInfo
}

export interface ServiceInfo {
  email: string
  fb: string
  ccphone: string
  ccphones: string[]
  corpAddr: string
  corpName: string
  svcCorp: string
  svcCorpAddr: string
}

export interface ChannelInfo {
  privacyUrl: string
  policyUrl: string
  serviceUrl: string
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
  | string

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
  | 'contactRelationCode'
  | 'maritalStatus'
  | 'docType'
  | 'educationCode'
  | 'loanPurpose'
  | 'cardNoType'
  | 'contactRelationCode1'
  | 'contactRelationCode2'
  | 'contactRelationCode3'
  | 'bankCode'
