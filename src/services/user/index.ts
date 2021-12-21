import { ValidateCodeParameter } from '@/typings/request'
import { ValidCode } from '@/typings/response'
import { errorCaptured } from '@/utils'
import api from '@/utils/axios'

/**
 * 获取验证码
 * @returns
 */
export async function getValidateCode(data: ValidateCodeParameter) {
  const [err, res] = await errorCaptured(() => api.post('/smart-loan/app/getValidateCode', data))
  if (!err) {
    return res as ValidCode
  }
}
