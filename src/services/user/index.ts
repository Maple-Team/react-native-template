import { get, post, del } from '../../utils/index.ts'
import url from './constant'

const {
  loginUrl,
  userInfoUrl,
  validateCodeUrl,
  passwordUrl1,
  passwordUrl2,
  logoutUrl,
  repaymentUrl,
  loanlistUrl,
  loandetailUrl,
  refreshTokenUrl,
  myCouponUrl,
  useMyCouponUrl,
  prizeCountUrl,
  getPrizeUrl,
  messageUrl,
  messageUpdateUrl,
  messageCountUrl,
  versionUrl,
  notificationUrl,
} = url
// 登录
export function login(option) {
  return post({ url: loginUrl, ...option })
}
export function refreshToken(option) {
  return post({ url: refreshTokenUrl, ...option })
}
export function getUser(option) {
  return get({ url: userInfoUrl, ...option })
}
export function getValidateCode(option) {
  return get({ url: validateCodeUrl, ...option })
}
export function getRepayment(option) {
  return get({ url: repaymentUrl, ...option })
}
export function getLoanList(option) {
  return get({ url: loanlistUrl, ...option })
}
export function getLoanDetail(option) {
  return get({ url: loandetailUrl, ...option })
}
export function modifyPassword1(option) {
  return post({ url: passwordUrl1, ...option })
}
export function modifyPassword2(option) {
  return post({ url: passwordUrl2, ...option })
}
export function logout(option) {
  return del({ url: logoutUrl, ...option })
}
export function getMyCoupon(option) {
  return get({ url: myCouponUrl, ...option })
}
export function useMyCoupon(option) {
  return post({ url: useMyCouponUrl, ...option })
}
export function prizeCount(option) {
  return get({ url: prizeCountUrl, ...option })
}
export function getPrize(option) {
  return get({ url: getPrizeUrl, ...option })
}
export function getMessage(option) {
  return get({ url: messageUrl, ...option })
}
export function getMessageCount(option) {
  return get({ url: messageCountUrl, ...option })
}
export function updateMessage(option) {
  return post({ url: messageUpdateUrl, ...option })
}
export function checkVersion(option) {
  return get({ url: versionUrl, ...option })
}
export function getNotificationVersion(option) {
  return get({ url: notificationUrl, ...option })
}
