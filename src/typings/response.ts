import { API_CODE, APPLY_STATE } from './enum'
import { APPLY_BOOL, LoginUser } from './user'

export interface Response<T> {
  body?: T
  sourceId?: string
  sourceName?: APPLY_STATE
  status: Status
}

export interface Status {
  code: API_CODE
  msg: string
  msgCn: string
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

export interface ValidCode {
  kaptcha: string
}

export interface Version {
  filePath: string
  isForceUpdate: APPLY_BOOL
  versionDesc: string
  versionId: number
  versionNo: string
  versionType: string
}

interface Brand {
  channelInfo: ChannelInfo
  isValidateCode: APPLY_BOOL
  smsSendEnable: APPLY_BOOL
  smsWaitInterval: number
  codeValidatecount: number
  handheldUploadFlag: APPLY_BOOL
  serviceInfo: ServiceInfo
}

interface ServiceInfo {
  email: string
  fb: string
  ccphone: string
  ccphones: string[]
  corpAddr: string
  corpName: string
  svcCorp: string
  svcCorpAddr: string
}

interface ChannelInfo {
  privacyUrl: string
  policyUrl: string
  serviceUrl: string
  videoAuthUrl: string
}
