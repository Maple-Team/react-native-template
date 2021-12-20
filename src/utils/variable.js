import { PERMISSIONS } from 'react-native-permissions'
import { Platform } from 'react-native'

export const PREFIX = 'SurityCash_'

export default {
  ISFIRSTOPEN: `${PREFIX}IsFirstOpen`,
  APPLY: 'Apply',
  DAYS: 'Days',
  CONTINUE: 'Continue',
  GRANT_PERMISSION: `${PREFIX}grant_permission`, // 是否阅读了启动时的权限说明
  PermissionContent: {
    location: {
      name: 'location',
      permissionName:
        Platform.OS === 'android'
          ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
          : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      content:
        'After receiving and processing your Location, we can assist in quickly filling out your loan application.',
      hint: 'Please allow us for accessing your Location, your privacy security will be under strict protection;',
    },
    phone: {
      name: 'device',
      permissionName: Platform.OS === 'android' ? PERMISSIONS.ANDROID.READ_PHONE_STATE : '', // fixme
      content:
        'After receiving and processing your Phone Information, we can more quickly process your loan application.',
      hint: 'Please allow us for accessing your Device, your privacy security will be under strict protection;',
    },
    contacts: {
      name: 'contacts',
      permissionName:
        Platform.OS === 'android' ? PERMISSIONS.ANDROID.READ_CONTACTS : PERMISSIONS.IOS.CONTACTS,
      content:
        'After receiving and processing access to your Contacts, we can help you with phoning functionalities.',
      hint: 'Please allow us for accessing your Contacts, your privacy security will be under strict protection;',
    },
    camera: {
      name: 'camera',
      permissionName:
        Platform.OS === 'android' ? PERMISSIONS.ANDROID.CAMERA : PERMISSIONS.IOS.CAMERA,
      content:
        'After receiving and processing access to your Camera, we can accept your uploaded photos.',
      hint: 'Please allow us for accessing your Camera, your privacy security will be under strict protection;',
    },
    file: {
      name: 'file',
      permissionName: Platform.OS === 'android' ? PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE : '',
      content: '',
      hint: 'Please allow us for accessing your Files, your privacy security will be under strict protection;',
    },
  },
  CONTINUE_LOAN_TAG: ['SETTLE', 'CANCEL', 'CONTINUED_LOAN_CANCEL'],
}
