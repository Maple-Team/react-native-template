import axios from './axios';
import Logger from './logger';
export const prefix = '/';

export function get(options) {
  return axios({
    method: 'get',
    ...options,
  });
}

export function post(options) {
  return axios({
    method: 'post',
    ...options,
  });
}
export function put(options) {
  Logger.log(options);
  return axios({
    method: 'put',
    ...options,
  });
}

export function del(options) {
  return axios({
    method: 'delete',
    ...options,
  });
}

// TODO debounce
export async function errorCaptured(func: Function) {
  try {
    const res = await func();
    return [null, res];
  } catch (e) {
    return [e, null];
  }
}
