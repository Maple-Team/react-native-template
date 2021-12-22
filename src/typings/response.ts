import { BOOL } from './common'
import { API_CODE } from '../state/enum'

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
  nameCn: string
}
