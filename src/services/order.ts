import type { BaseResponse } from '@/utils/http'
import { request } from '@/utils/http'

export async function queryOrders() {
  return request<BaseResponse>({
    url: '/smart-loan/contract/contractList',
    method: 'GET',
  })
}
