import { request } from '@/utils/http'
import type { ZhanneiLetter } from '@/typings/user'

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
