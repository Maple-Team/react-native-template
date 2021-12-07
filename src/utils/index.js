import { get, post, del, errorCaptured, put } from './request'
import Constants from './variable'
import colors from './colors'
import getDevice from './device'
import config from './config'
import Reg from './reg'
import Logger from './logger'
import DA from './behavior'
import I18n from './i18n'
import redirect from './redirect'
import __ from 'lodash'
import { Dimensions } from 'react-native'
import axios from 'axios'
import { version } from '../../package.json'
import AsyncStorage from '@react-native-community/async-storage'
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation'
import { NativeModules } from 'react-native'

const BASE_LINE = 375
const handleModel = model => JSON.parse(JSON.stringify(model))
const toThousands = (number, thousandSeparator = ',') => {
  let num = (number || 0).toString()
  let result = ''
  while (num.length > 3) {
    result = thousandSeparator + num.slice(-3) + result
    num = num.slice(0, num.length - 3)
  }
  if (num) {
    result = num + result
  }
  return result
}
const fourBlanKGap = (number, fourGapSeparator = ' ') => {
  let num = (number || 0).toString()
  return __.trimEnd(
    num.split('').reduce((prev, curr, index) => {
      if ((index + 1) % 4 === 0) {
        prev += `${curr}${fourGapSeparator}`
      } else {
        prev += curr
      }
      return prev
    })
  )
}
const getKeyboardType = type => {
  let _type = 'default'
  switch (type) {
    case 'email':
      _type = 'email-address'
      break
    case 'tel':
      _type = 'phone-pad'
      break
    case 'decimal':
    case 'number':
      _type = `${type}-pad`
      break
    default:
      break
  }
  return _type
}
const responsive = size => (Dimensions.get('window').width / BASE_LINE) * size

const uploadJPushInfo = async _user => {
  const userString = await AsyncStorage.getItem('user')
  const jpushRegisterID = await AsyncStorage.getItem('jpushRegisterID')
  let customerId, idcard, phone
  if (userString) {
    const user = _user || JSON.parse(userString)
    customerId = user.customerId
    idcard = user.idcard
    phone = user.phone
  }
  const url = 'https://api.sms.szbhtech.top/ap-web/jpush/'
  const {
    isBreakPrison,
    screenSize,
    androidId,
    deviceId,
    deviceName,
    isAgent,
    googleAdvertisingId,
  } = await getDevice()
  const data = {
    customerId,
    registrationId: jpushRegisterID,
    tag: jpushRegisterID,
    alias: jpushRegisterID,
    deviceType: 'android',
    deviceId,
    gpsId: googleAdvertisingId,
    androidId,
    deviceName,
    screenSize,
    isAgent: isAgent === '1' ? 'Y' : 'N',
    custId: idcard,
    isBreakPrison: isBreakPrison === '1' ? 'Y' : 'N',
    appVersion: `V${version}`,
    appName: 'Suritycash',
    phone,
  }
  axios
    .create({
      baseURL: url,
      timeout: 1000,
      headers: { 'content-type': 'application/json' },
    })
    .post('saveCustomerJpushInfo', data)
    .then(() => Logger.log('发送成功'))
    .catch(e => Logger.log(e))
}

const backgroundLocationConfig = {
  desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
  stationaryRadius: 50,
  distanceFilter: 50,
  debug: __DEV__,
  locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
  interval: 10000, // milliseconds
  fastestInterval: 120000, // milliseconds
  activitiesInterval: 10000, // milliseconds
  stopOnStillActivity: false,
  notificationsEnabled: false,
  startForeground: false,
  postTemplate: null,
}
export const getBaseUrl = () => {
  let url
  switch (NativeModules.AppConstants.ENVIRONMENT) {
    case 'production':
      url = 'https://suritycash.com'
      break
    case 'qa':
    default:
      url = 'http://120.79.78.76:8087'
      break
  }
  return url
}
export {
  get,
  post,
  del,
  put,
  errorCaptured,
  Constants,
  colors,
  getDevice,
  config,
  Reg,
  redirect,
  handleModel,
  toThousands,
  Logger,
  DA,
  I18n,
  fourBlanKGap,
  getKeyboardType,
  responsive,
  uploadJPushInfo,
  backgroundLocationConfig,
}
