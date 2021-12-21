import { Brand, Dict, Version } from '@/typings/response'
import { errorCaptured } from '@/utils'
import api from '@/utils/axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

const TIMEOUT = 2000
// 首页

/**
 * 字典请求，网络不好时从缓存里面取
 * @param field
 * @returns
 */
export function dict(field: string): Promise<Dict[]> {
  return Promise.race([
    new Promise<void>(resolve => {
      setTimeout(() => {
        resolve()
      }, TIMEOUT)
    }),
    api.get(`/smart-loan/dictionary/${field}`).then(res => {
      AsyncStorage.setItem(`moneyya_${field}`, JSON.stringify(res))
      return res as unknown as Dict[]
    }),
  ]).then(async res => {
    if (res) {
      return res
    } else {
      const data = await AsyncStorage.getItem(`moneyya_${field}`)
      return data ? (JSON.parse(data) as Dict[]) : []
    }
  })
}
/**
 * 获取品牌信息
 * @returns
 */
export async function queryBrand() {
  const [err, res] = await errorCaptured(() => api.get('/smart-loan/system/brand'))
  if (!err) {
    return res as Brand
  }
}

/**
 * 获取版本信息
 * @returns
 */
export async function queryVersion() {
  const [err, res] = await errorCaptured(() => api.get('/smart-loan/app/version'))
  if (!err) {
    return res as Version
  }
}
