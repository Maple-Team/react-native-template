import { request } from '@/utils/http'
import type { BaseResponse } from '@/utils/http'

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
/**
 * 站内信列表
 * @param data
 * @returns
 * TODO 10条
 */
export async function queryZhanLetterList() {
  return request<BaseResponse>({
    url: '/smart-loan/system/message/list',
    method: 'POST',
  })
}
/**
 * 站内信详情
 * @param data
 * @returns
 * TODO
 */
export async function queryZhanLetterDetail(id: string) {
  return request<BaseResponse>({
    url: '/smart-loan/system/message/read',
    method: 'POST',
    params: { id },
  })
}
