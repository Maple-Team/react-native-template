import emitter from '@/eventbus'
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
  console.log(permission, state)
  switch (state) {
    case RESULTS.DENIED:
      emitter.emit('SHOW_MESSAGE', { type: 'fail', message: blockedMessage })
      break
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
      await request(PERMISSIONS.ANDROID.READ_CONTACTS)
      await onRequestPermission({ permission, onGranted, blockedMessage, unavailableMessage })
      break
  }
}
