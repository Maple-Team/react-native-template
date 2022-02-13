import type { Order } from '@/typings/order'
import type { BaseResponse } from '@/utils/http'
import { request } from '@/utils/http'
/**
 * 合同列表
 * @param params
 * @returns
 */
export async function queryOrders() {
  return request<Order[]>({
    url: '/smart-loan/contract/list',
    method: 'POST',
  })
}
/**
 * 合同详情
 * @param params
 * @returns
 */
export async function queryOrderDetail(params: { applyId: string }) {
  return request<Order>({
    url: '/smart-loan/contract/detail',
    method: 'POST',
    params,
  })
}
/**
 * 预览合同
 * @param params
 * @returns
 */
export async function queryOrderAgreement(data: {
  applyAmount: number
  applyId: number
  loanCode: string
  loanTerms: number
  productCode: string
}) {
  return request<BaseResponse>({
    url: '/smart-loan/contract/loan/agreement',
    method: 'POST',
    data,
  })
}
/**
 * 获取还款码
 * @param params
 * @returns
 */
export async function queryPayCode(params: { applyId: number; amount: number }) {
  return request<BaseResponse>({
    url: '/smart-loan/contract/barCode',
    method: 'POST',
    params,
  })
}
export async function queryClabe(params: { applyId: number }) {
  return request<BaseResponse>({
    url: '/smart-loan/pay/clabe',
    method: 'POST',
    params,
  })
}
