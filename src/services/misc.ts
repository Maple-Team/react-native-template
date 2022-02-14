import { request } from '@/utils/http'
import type { BaseResponse } from '@/utils/http'
import type { ZhanneiLetter } from '@/typings/user'

/**
 * 站内信数量未读 展示红点
 * @param data
 * @returns
 */
export async function queryZhanLetter() {
  return request<BaseResponse>({
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
 * TODO 10条
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
 * TODO
 */
export async function markZhanLetterRead(messageId: string) {
  return request<ZhanneiLetter>({
    url: '/smart-loan/system/message/read',
    method: 'POST',
    params: { messageId },
  })
}
