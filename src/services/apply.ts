import AsyncStorage from '@react-native-async-storage/async-storage'

import type {
  ApplyResponse,
  ApplyStep1,
  ApplyStep2,
  ApplyStep3,
  ApplyStep4,
  ApplyStep5,
  ApplyStep6,
  ApplyStep7,
  ApplyStep8,
  Calculate,
  CalculateParameter,
  Product,
  ProductParemeter,
} from '@/typings/apply'
import type { Device } from '@/typings/device'
import type { Brand, Dict, Version } from '@/typings/response'
import type { BaseResponse } from '@/utils/http'
import type { BehaviorModel } from '@/utils/behavior'

import { request } from '@/utils/http'

const TIMEOUT = 2000

/**
 * 字典请求，网络不好时从缓存里面取
 * @param field
 * @returns
 */
export async function dict(field: string): Promise<Dict[]> {
  const res: Dict[] | void = await Promise.race([
    new Promise<void>(resolve => {
      setTimeout(() => {
        resolve()
      }, TIMEOUT)
    }),
    request<Dict[]>({
      url: `/smart-loan/dictionary/${field}`,
    })
      .then(__ => __ as unknown as Dict[])
      .catch(() => {}),
  ])
  if (res) {
    AsyncStorage.setItem(`moneyya_${field}`, JSON.stringify(res))
    return res
  } else {
    const data = await AsyncStorage.getItem(`moneyya_${field}`)
    return data ? (JSON.parse(data) as Dict[]) : []
  }
}
/**
 * 获取品牌信息
 * @returns
 */
export async function queryBrand() {
  return request<Brand>({
    url: '/smart-loan/system/brand',
  })
}

/**
 * 获取版本信息
 * @returns
 */
export async function queryVersion() {
  return request<Version>({
    url: '/smart-loan/app/version',
  })
}
/**
 * 每步的申请参数
 */
export type ApplyStep =
  | ApplyStep1
  | ApplyStep2
  | ApplyStep3
  | ApplyStep4
  | ApplyStep5
  | ApplyStep6
  | ApplyStep7
  | ApplyStep8
/**
 * 每一步提交信息
 * @param params
 * @returns
 */
export async function submit(data: ApplyStep) {
  return request<ApplyResponse>({
    url: '/smart-loan/apply/step',
    method: 'POST',
    data,
  })
}
/**
 * 提交设备信息
 * @param params
 * @returns
 */
export async function submitDevice(data: Device) {
  return request<null>({
    url: '/smart-loan/login/deviceInfo',
    method: 'POST',
    data,
  })
}
/**
 * 获取产品信息
 * @param data
 * @returns
 */
export async function queryProduct(data: ProductParemeter) {
  return request<Product>({
    url: '/smart-loan/product/v1/getProduct',
    method: 'POST',
    data,
  })
}
/**
 * 产品试算
 * @param params
 * @returns
 */
export async function scheduleCalc(data: CalculateParameter) {
  return request<Calculate>({
    url: '/smart-loan/contract/scheduleCalc',
    method: 'POST',
    data,
  })
}
/**
 * 首页PV
 * @param data
 * @returns
 */
export async function pv(data: CalculateParameter) {
  return request<Calculate>({
    url: '/smart-loan/app/index',
    method: 'delete',
    data,
  })
}
/**
 * 行为上传
 * @param data
 * @returns
 */
export async function uploadBehavior(data: BehaviorModel) {
  return request<BaseResponse>({
    url: '/smart-loan/app/index', // TODO
    method: 'post',
    data,
  })
}
