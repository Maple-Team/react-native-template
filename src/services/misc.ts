import { BaseResponse, request } from '@/utils/http'
import type { ZhanneiLetter } from '@/typings/user'
import { MMKV } from '@/utils'
import { KEY_JPUSH_ID } from '@/utils/constant'
import type { ValidateCodeType } from '@/typings/request'

/**
 * 站内信数量未读 展示红点
 * @param data
 * @returns
 */
export async function queryZhanLetterCount() {
  return request<number>({
    url: '/smart-loan/system/message/count',
    method: 'POST',
  })
}
interface MessageListParameter {
  currentPage: number
  messageType?: string
  pageSize: number
  status?: string
}

/**
 * 站内信列表
 * @param data
 * @returns
 */
export async function queryZhanLetterList(data: MessageListParameter) {
  return request<ZhanneiLetter[]>({
    url: '/smart-loan/system/message/list',
    method: 'POST',
    data,
  })
}
/**
 * 站内信详情
 * @param data
 * @returns
 *
 */
export async function markZhanLetterRead(messageId: string) {
  return request<ZhanneiLetter>({
    url: '/smart-loan/system/message/read',
    method: 'POST',
    params: { messageId },
  })
}
interface JpushParameter {
  customerId?: string
  deviceId?: string
  phone: string
  /**
   * 证件号
   */
  custId?: string
  // 固定
  appName?: string
  deviceType?: 'android'
  registrationId?: string
}
/**
 * 极光信息绑定
 * @param id
 * @returns
 */
export async function uploadJpush(data: JpushParameter) {
  const jpushId = MMKV.getString(KEY_JPUSH_ID)
  if (!jpushId) {
    return
  }
  return request<BaseResponse>({
    baseURL: 'https://sms.loannaira.com', // TODO change url
    url: '/ap-web/jpush/saveCustomerJpushInfo',
    method: 'POST',
    data: {
      customerId: '',
      deviceId: '',
      custId: '',
      ...data,
      registrationId: jpushId,
      appName: 'MONEYYA_APP',
      deviceType: 'android',
    },
  })
}
interface ValidateValidateCodeParameter {
  phone: string
  appId: string
  kaptcha: string
  skipValidate: 'N'
  type: ValidateCodeType
}
/**
 * 校验验证码
 * @param data
 * @returns
 */
export async function validateValidCode(data: ValidateValidateCodeParameter) {
  return request<BaseResponse>({
    url: '/smart-loan/app/validate/kaptcha',
    method: 'POST',
    data,
  })
}
