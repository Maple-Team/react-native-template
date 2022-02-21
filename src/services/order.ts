import type { Order } from '@/typings/order'
import { ValidateCodeParameter } from '@/typings/request'
import type { BaseResponse } from '@/utils/http'
import { request } from '@/utils/http'
/**
 * 合同列表
 * @param params
 * @returns
 */
export async function queryOrders(type: 'payment' | 'order') {
  switch (type) {
    case 'payment':
      return request<Order[]>({
        url: '/smart-loan/contract/repayList',
        method: 'POST',
      })
    case 'order':
      return request<Order[]>({
        url: '/smart-loan/contract/list',
        method: 'POST',
      })
  }
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
 * @param data
 * @returns
 */
export async function queryPayCode(data: FormData) {
  return request<{ barcode: string; barcodeUrl: string }>({
    url: '/smart-loan/pay/barCode',
    method: 'POST',
    data,
  })
}
/**
 * 获取clabe账号
 * @param data
 * @returns
 */
export async function queryClabe(data: FormData) {
  return request<{ clabe: string }>({
    url: '/smart-loan/pay/clabe',
    method: 'POST',
    data,
  })
}

export async function getValidateCode(data: ValidateCodeParameter) {
  return request<BaseResponse>({
    url: '/smart-loan/app/validate/kaptcha',
    method: 'POST',
    data,
  })
}
