import axios from './axios'
import Logger from './logger'
export const prefix = '/upeso-loan'

export function get(options) {
  return axios({
    method: 'get',
    ...options,
  })
}

export function post(options) {
  return axios({
    method: 'post',
    ...options,
  })
}
export function put(options) {
  Logger.log(options)
  return axios({
    method: 'put',
    ...options,
  })
}

export function del(options) {
  return axios({
    method: 'delete',
    ...options,
  })
}

export async function errorCaptured(asyncFunc) {
  try {
    const res = await asyncFunc()
    return [null, res]
  } catch (e) {
    return [e, null]
  }
}
