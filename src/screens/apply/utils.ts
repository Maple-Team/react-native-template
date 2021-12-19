import {
  uploadPhoneContacts,
  uploadDeviceInfo,
  uploadAppsInfo as _uploadAppsInfo,
  uploadPermissionInfo,
} from '../../services/apply'
import Storage from 'react-native-expire-storage'
import { Logger, errorCaptured, getDevice, Constants } from '../../utils'
import AsyncStorage from '@react-native-community/async-storage'
import Contacts from 'react-native-contacts'
import __ from 'lodash'
import Sot from 'react-native-sot'
import { check, RESULTS } from 'react-native-permissions'
import dayjs from 'dayjs'

// import { NativeModules } from 'react-native'

const uploadDevice = async ({ applyId, phone, anglex, angley, anglez, idcard }) => {
  const data = await getDevice()
  const [err, res] = await errorCaptured(() =>
    uploadDeviceInfo({
      data: { ...data, applyId, phone, anglex, angley, anglez, idcard },
    })
  )
  Logger.log(err, res)
}
const uploadContacts = async ({ applyId, phone }) => {
  let storagedContacts = await Storage.getItem('contacts')
  // let contactLog = await Storage.getItem('contactLog')
  // await Storage.removeItem('contacts')
  // FIXME
  if (
    !storagedContacts ||
    !storagedContacts instanceof Array ||
    !Object.keys(storagedContacts).length
  ) {
    // 处理通话记录
    // const map = await NativeModules.ContactModule.getContactInfo()
    // contactLog = __.groupBy(map, 'number')
    // 未存，去拿通讯录
    const [err1, contacts] = await errorCaptured(_getAllContact)
    if (err1) {
      storagedContacts = []
    } else {
      if (contacts) {
        const modifiedContacts = __.flattenDepth(
          contacts.map(item => {
            return item.phoneNumbers.map(i => {
              // const log = contactLog[i.number]
              // const contactLastCallTime = log
              //   ? dayjs.unix(parseFloat(log[0].date) / 1000).format('YYYY-MM-DD HH:mm:ss')
              //   : null
              // const contactCallCount = log ? log.length : 0
              return {
                contactName: `${item.givenName ? item.givenName : ''} ${
                  item.middlName ? item.middlName : ''
                } ${item.familyName ? item.familyName : ''}`.trim(),
                contactPhone: i.number,
                contactRelation: 'default',
                contactLastCallTime: '',
                contactCallCount: 0,
              }
            })
          })
        )
        Logger.log('通讯录联系人信息', modifiedContacts)
        storagedContacts = modifiedContacts
        Storage.setItem('contacts', modifiedContacts, 60 * 10)
        // Storage.setItem('contactLog', contactLog, 60 * 10)
      } else {
        storagedContacts = []
      }
    }
  }

  const [err, res] = await errorCaptured(() =>
    uploadPhoneContacts({
      data: {
        applyId,
        phone,
        list: storagedContacts,
      },
    })
  )
  Logger.log(err, res)
}
const uploadAppsInfo = async applyId => {
  const [_err, apps] = await errorCaptured(Sot.getApps)
  if (_err) {
    return
  }
  const getAppInfo = app => {
    const {
      packageName,
      versionName,
      versionCode,
      firstInstallTime,
      lastUpdateTime,
      isAppActive,
      isSystem,
      appName,
      icon, // Base64
      apkDir,
      size, // Bytes
    } = app
    const datetime = new Date()
    datetime.setTime(firstInstallTime)
    const time = dayjs(datetime).format('YYYY-MM-DD HH:mm:ss')
    return {
      appInstallTime: time,
      isSystem,
      name: appName,
      packageName,
      packagePath: apkDir,
      versionCode,
      versionName,
      isAppActive: isAppActive ? 'Y' : 'N',
    }
  }
  const deviceId = await AsyncStorage.getItem('deviceId')
  await errorCaptured(() =>
    _uploadAppsInfo({
      data: {
        appInfos: apps.map(getAppInfo),
        applyId,
        deviceId,
      },
    })
  )
}
const _getAllContact = async () => {
  return new Promise(resolve => {
    Contacts.getAll((err, contacts) => {
      if (err) {
        Logger.log('获取全部通讯录出错: ', err)
        resolve()
      } else {
        resolve(contacts)
      }
    })
    // Contacts.getCount(count => {
    //   Logger.log("contact's count", count)
    // })
  })
}
const permissions = [
  'ACCESS_FINE_LOCATION',
  'READ_PHONE_STATE',
  'READ_CONTACTS',
  'CAMERA',
  'WRITE_EXTERNAL_STORAGE',
]
const handlePermissionCheck = async () => {
  const keys = Object.keys(Constants.PermissionContent)
  const promises = keys.map(name =>
    check(Constants.PermissionContent[name].permissionName).then(state => state === RESULTS.GRANTED)
  )
  return Promise.all(promises)
}
const uploadPermission = async ({ applyId, phone, idcard }) => {
  const deviceId = await AsyncStorage.getItem('deviceId')
  const results = await handlePermissionCheck()
  uploadPermissionInfo({
    data: permissions.map((_, index) => {
      return {
        deviceId,
        authId: applyId,
        idcard,
        phone,
        authType: _,
        isAuth: results[index] ? 'Y' : 'N',
      }
    }),
  })
}

export { uploadDevice, uploadContacts, uploadAppsInfo, uploadPermission }
