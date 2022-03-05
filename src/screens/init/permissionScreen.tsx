import React, { useEffect, useMemo, useState } from 'react'
import emitter from '@/eventbus'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'
import { PermissionModal } from '@components/permission'
import { request, RESULTS, type Permission } from 'react-native-permissions'
import { permissionContent, permissions } from '@/utils/permission'
import { useCustomBack } from '@/hooks'

interface Result {
  isShow: boolean
  hasPermission: boolean
}
export default () => {
  useCustomBack()
  const permissionObj = useMemo(() => {
    //@ts-ignore
    const map: Record<Permission, Result> = {}
    permissions.forEach(p => {
      map[p] = { hasPermission: false, isShow: false }
    })
    map['android.permission.READ_PHONE_STATE'].isShow = true
    return map
  }, [])
  const [permissionState, setPermissionState] = useState(permissionObj)
  useEffect(() => {
    const everyModalIsShow = Object.keys(permissionState).every(
      //@ts-ignore
      (k: Permission) => permissionState[k].hasPermission
    )
    if (everyModalIsShow) {
      emitter.emit('UPDATE_HAS_INIT', true)
    }
  }, [permissionState])
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ width: '100%', flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
        {permissions.map((permission, index) => {
          return (
            <PermissionModal
              icon={permissionContent[permission].icon}
              key={permission}
              hint={permissionContent[permission].hint}
              visible={
                !permissionState[permission].hasPermission && permissionState[permission].isShow
              }
              onPress={async () => {
                request(permission)
                  .then(status => {
                    if (status === RESULTS.GRANTED || status === RESULTS.BLOCKED) {
                      const res = {
                        ...permissionState,
                        [permission]: { hasPermission: true, isShow: false },
                      }
                      if (permissions[index + 1]) {
                        res[permissions[index + 1]] = { hasPermission: false, isShow: true }
                      }
                      setPermissionState(res)
                    } else if (status === RESULTS.DENIED) {
                      const res = {
                        ...permissionState,
                        [permission]: { hasPermission: false, isShow: false },
                      }
                      if (permissions[index + 1]) {
                        res[permissions[index + 1]] = { hasPermission: false, isShow: true }
                      }
                      setPermissionState(res)
                    }
                  })
                  .catch(console.error)
              }}
            />
          )
        })}
      </ScrollView>
    </SafeAreaView>
  )
}
