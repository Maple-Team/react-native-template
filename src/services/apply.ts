import AsyncStorage from '@react-native-async-storage/async-storage'

import type {
  ApplyResponse,
  ApplyStep1Parameter,
  ApplyStep2Parameter,
  ApplyStep3Parameter,
  ApplyStep4Parameter,
  ApplyStep5Parameter,
  ApplyStep6Parameter,
  ApplyStep7Parameter,
  ApplyStep8Parameter,
  BankInfoParameter,
  Calculate,
  CalculateParameter,
  Product,
  ProductParemeter,
} from '@/typings/apply'
import type { Device } from '@/typings/device'
import type { Brand, Dict, DictField, Version } from '@/typings/response'
import type { BaseResponse } from '@/utils/http'
import type { BehaviorModel, PAGE_ID } from '@/typings/behavior'

import { request } from '@/utils/http'

const TIMEOUT = 2000

/**
 * 字典请求，网络不好时从缓存里面取
 * @param field
 * @returns
 */
export async function fetchDict(field: DictField, params?: any): Promise<Dict[]> {
  if (!field) {
    return []
  }
  const res: Dict[] | void = await Promise.race([
    new Promise<void>(resolve => {
      setTimeout(() => {
        resolve()
      }, TIMEOUT)
    }),
    request<Dict[]>({
      url: `/smart-loan/dictionary/${field}`,
      params,
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
type Steps = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8'

type ApplyStep<T extends Steps> = T extends '1'
  ? ApplyStep1Parameter
  : T extends '2'
  ? ApplyStep2Parameter
  : T extends '3'
  ? ApplyStep3Parameter
  : T extends '4'
  ? ApplyStep4Parameter
  : T extends '5'
  ? ApplyStep5Parameter
  : T extends '6'
  ? ApplyStep6Parameter
  : T extends '7'
  ? ApplyStep7Parameter
  : T extends '8'
  ? ApplyStep8Parameter
  : never
/**
 * 每一步提交信息
 * @param params
 * @returns
 */
export async function submit<T extends Steps>(data: ApplyStep<T>) {
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
 * 签约试算
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
export async function pv() {
  return request<BaseResponse>({
    url: '/smart-loan/app/index',
    method: 'POST',
  })
}
/**
 * 行为上传
 * @param data
 * @returns
 */
export async function uploadBehavior<T extends PAGE_ID>(data: BehaviorModel<T>) {
  return request<BaseResponse>({
    url: '/smart-loan/app/behavior',
    method: 'POST',
    data,
  })
}
/**
 * 更新银行卡号
 * @param data
 * @returns
 */
export async function updateBankInfo(data: BankInfoParameter) {
  return request<BaseResponse>({
    url: '/smart-loan/customer/updateBankInfo',
    method: 'POST',
    data,
  })
}
