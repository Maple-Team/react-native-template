import { get, post, Logger } from '../../utils'
import url from './constant'
import AsyncStorage from '@react-native-community/async-storage'
const TIMEOUT = 2000
const {
  applyUrl,
  prepareCalcUrl,
  productUrl,
  userInfoUrl,
  dictUrl,
  imageUploadUrl,
  contractUrl,
  extensionDayUrl,
  extensionCalcUrl,
  progressUrl,
  suppleImageAuthUrl,
  inviteRegisterUrl,
  inviteValidateUrl,
  queryStatusUrl,
  payFeeUrl,
  needWukaUrl,
  authTypeUrl,
  updateAmountUrl,
  registerUrl,
  phoneContactUrl,
  deviceInfoUrl,
  appsUrl,
  fbUrl,
  traceUrl,
  authUrl,
  contactSubmitUrl,
  contactSubmitUrl2,
  livenessSwitchUrl,
  fbLoginUrl,
  fbBindingUrl,
} = url
// 首页
export function prepareCalc(option) {
  return post({ url: prepareCalcUrl, ...option })
}
export function getProduct(option) {
  return get({ url: productUrl, ...option })
}
export function getUser(option) {
  return get({ url: userInfoUrl, ...option })
}

export function submit(option) {
  return post({ url: applyUrl, ...option })
}
// Note 字典请求，网络不好时从缓存里面取
export function dict(word) {
  return Promise.race([
    new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, TIMEOUT)
    }),
    get({ url: `${dictUrl}/${word}` }).then(res => {
      Logger.log(`get dict [${word}] from network`)
      AsyncStorage.setItem(word, JSON.stringify(res))
      return res
    }),
  ]).then(async res => {
    if (res) {
      return res
    } else {
      const data = await AsyncStorage.getItem(word)
      Logger.log(`get dict [${word}] from storage`)
      return JSON.parse(data)
    }
  })
}

// 影像认证
export function uploadImage(options) {
  Logger.log('options', options)
  return post({
    url: imageUploadUrl,
    ...options,
  })
}

export function getContract(options) {
  return post({ url: `${contractUrl}`, ...options })
}
export function getExtensionDay(applyId) {
  return get({ url: `${extensionDayUrl}${applyId}` }).catch(e => Logger.error(e))
}
export function getExtensionCalc(options) {
  return post({ url: extensionCalcUrl, ...options })
}

export function progress(id) {
  return get({ url: `${progressUrl}${id}` }).catch(e => Logger.error(e))
}

export function suppleImageAuth(option) {
  return post({ url: suppleImageAuthUrl, ...option })
}
//
export function getInviteValidateCode(option) {
  return get({ url: inviteValidateUrl, option }).catch(e => e)
}
export function invite2Register(option) {
  return post({ url: inviteRegisterUrl, option }).catch(e => e)
}
export function queryStatus(option) {
  return get({ url: queryStatusUrl, ...option })
}
export function payFee(option) {
  return get({ url: payFeeUrl, ...option })
}
export function needWuka(option) {
  return get({ url: needWukaUrl, ...option })
}
export function authType(option) {
  return get({ url: authTypeUrl, ...option })
}
export function updateAmount(option) {
  return post({ url: updateAmountUrl, ...option })
}
export function register(option) {
  return post({ url: registerUrl, ...option })
}
export function uploadPhoneContacts(options) {
  return post({ url: `${phoneContactUrl}`, ...options })
}
export function uploadDeviceInfo(options) {
  return post({ url: `${deviceInfoUrl}`, ...options })
}
export function uploadAppsInfo(options) {
  return post({ url: `${appsUrl}`, ...options })
}
export function uploadFBinfo(options) {
  return post({ url: `${fbUrl}`, ...options })
}
export function trace(options) {
  return get({ url: `${traceUrl}`, ...options })
}
export function uploadPermissionInfo(options) {
  return post({ url: `${authUrl}`, ...options })
}
export function contactSubmit(options) {
  return post({ url: `${contactSubmitUrl}`, ...options })
}
export function contactSubmit2(options) {
  return post({ url: `${contactSubmitUrl2}`, ...options })
}
export function livenessSwitch(options) {
  return get({ url: `${livenessSwitchUrl}`, ...options })
}

export function fbLogin(options) {
  return post({ url: `${fbLoginUrl}`, ...options })
}
export function fbBinding(options) {
  return post({ url: `${fbBindingUrl}`, ...options })
}
