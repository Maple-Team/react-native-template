import { request } from '@/utils/http'
import type { BaseResponse } from '@/utils/http'

/**
 * 站内信数量
 * @param data
 * @returns
 */
export async function queryZhanLetter() {
  return request<BaseResponse>({
    url: '',
    method: 'get',
  })
}
/**
 * 站内信列表
 * @param data
 * @returns
 */
export async function queryZhanLetterList() {
  return request<BaseResponse>({
    url: '',
    method: 'get',
  })
}
/**
 * 站内信详情
 * @param data
 * @returns
 */
export async function queryZhanLetterDetail() {
  return request<BaseResponse>({
    url: '',
    method: 'get',
  })
}
