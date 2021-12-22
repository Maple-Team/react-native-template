import type { LoginUser, RegisterUser, ResetPwdParameter, ValidCode } from '@/typings/account'
import type { LoginParameter, RegisterParameter, ValidateCodeParameter } from '@/typings/request'
import type { UserInfo } from '@/typings/user'
import { request } from '@/utils/http'

/**
 * 获取验证码
 * @returns
 */
export async function getValidateCode(data: ValidateCodeParameter) {
  return request<ValidCode>({
    url: '/smart-loan/app/getValidateCode',
    method: 'POST',
    data,
  })
}

/**
 * 注册
 * @param data
 * @returns
 */
export async function register(data: RegisterParameter) {
  return request<RegisterUser>({
    url: '/smart-loan/user/registeredUser',
    method: 'POST',
    data,
  })
}

/**
 * 登录
 * @param data
 * @returns
 */
export async function login(data: LoginParameter) {
  return request<LoginUser>({
    url: '/smart-loan/user/login',
    method: 'POST',
    data,
  })
}

/**
 * 重置密码
 * @param data
 * @returns
 */
export async function reset(data: ResetPwdParameter) {
  return request<null>({
    url: '/smart-loan/user/modify/password',
    method: 'POST',
    data,
  })
}

/**
 * 登出
 */
export async function logout() {
  return request<null>({
    url: '/smart-loan/user/logout',
    method: 'DELETE',
  })
}

/**
 * 查询用户信息
 * @returns
 */
export async function queryUserinfo() {
  return request<UserInfo>({
    url: '/smart-loan/user/getUserInfo',
    method: 'POST',
  })
}
