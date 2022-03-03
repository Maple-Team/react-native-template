import emitter from '@/eventbus'
import { useEffect } from 'react'
import { check, PERMISSIONS, RESULTS, request, Permission } from 'react-native-permissions'

export const onRequestPermission = async ({
  blockedMessage,
  unavailableMessage,
  permission,
  onGranted,
}: {
  blockedMessage: string
  unavailableMessage: string
  permission: Permission
  onGranted: () => void
}) => {
  const state = await check(permission)
  console.log('permission: ', permission, state)
  switch (state) {
    // case RESULTS.DENIED:
    //   emitter.emit('SHOW_MESSAGE', { type: 'fail', message: blockedMessage })
    //   break
    case RESULTS.BLOCKED:
      emitter.emit('SHOW_MESSAGE', { type: 'fail', message: blockedMessage })
      break
    case RESULTS.UNAVAILABLE:
      emitter.emit('SHOW_MESSAGE', { type: 'fail', message: unavailableMessage })
      break
    case RESULTS.GRANTED:
      onGranted()
      break
    default:
      await request(permission)
      await onRequestPermission({ permission, onGranted, blockedMessage, unavailableMessage })
      break
  }
}

export const permissions = [
  PERMISSIONS.ANDROID.READ_PHONE_STATE,
  PERMISSIONS.ANDROID.READ_CONTACTS,
  PERMISSIONS.ANDROID.CAMERA,
  PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
]
interface PermissionContent {
  name: string
  permissionName: string
  content: string
  hint: string
}
export const permissionContent: Record<string, PermissionContent> = {
  'android.permission.ACCESS_FINE_LOCATION': {
    name: 'location',
    permissionName: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    content:
      'After receiving and processing your Location, we can assist in quickly filling out your loan application.',
    hint: 'Please allow us for accessing your Location, your privacy security will be under strict protection;',
  },
  'android.permission.READ_PHONE_STATE': {
    name: 'device',
    permissionName: PERMISSIONS.ANDROID.READ_PHONE_STATE, // fixme
    content:
      'After receiving and processing your Phone Information, we can more quickly process your loan application.',
    hint: 'Please allow us for accessing your Device, your privacy security will be under strict protection;',
  },
  'android.permission.READ_CONTACTS': {
    name: 'contacts',
    permissionName: PERMISSIONS.ANDROID.READ_CONTACTS,
    content:
      'After receiving and processing access to your Contacts, we can help you with phoning functionalities.',
    hint: 'Please allow us for accessing your Contacts, your privacy security will be under strict protection;',
  },
  'android.permission.CAMERA': {
    name: 'camera',
    permissionName: PERMISSIONS.ANDROID.CAMERA,
    content:
      'After receiving and processing access to your Camera, we can accept your uploaded photos.',
    hint: 'Please allow us for accessing your Camera, your privacy security will be under strict protection;',
  },
  'android.permission.WRITE_EXTERNAL_STORAGE': {
    name: 'file',
    permissionName: PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
    content: '',
    hint: 'Please allow us for accessing your Files, your privacy security will be under strict protection;',
  },
}
export const usePersmission = () => {
  useEffect(() => {
    permissions.reduce((prev, curr) => {
      return prev.then(() => {
        return new Promise(async resolve => {
          const state = await check(curr)
          switch (state) {
            case RESULTS.BLOCKED:
            case RESULTS.UNAVAILABLE:
            case RESULTS.GRANTED:
              resolve()
              break
            default:
              const s = await request(curr)
              switch (s) {
                case RESULTS.BLOCKED:
                case RESULTS.UNAVAILABLE:
                case RESULTS.GRANTED:
                  resolve()
                  break
                default:
                  const s1 = await request(curr) //TODO 请求权限策略
                  console.log({ s1 })
                  resolve()
                  break
              }
              break
          }
        })
      })
    }, Promise.resolve())
  }, [])
}
