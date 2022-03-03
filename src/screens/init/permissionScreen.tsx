import React, { useEffect, useMemo, useState } from 'react'
import emitter from '@/eventbus'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'
import { PermissionModal } from '@components/permission'
import { request, type Permission } from 'react-native-permissions'
import { permissionContent, permissions } from '@/utils/permission'

export default () => {
  //
  const permissionObj = useMemo(() => {
    //@ts-ignore
    const map: Record<Permission, boolean> = {}
    permissions.forEach(p => {
      map[p] = false
    })
    //@ts-ignore
    permissions['android.permission.READ_PHONE_STATE'] = true
    return map
  }, [])
  const [permissionState, setPermissionState] = useState(permissionObj)
  useEffect(() => {
    //@ts-ignore
    const everyModalIsShow = Object.keys(permissionState).every(k => permissionState[k])
    if (everyModalIsShow) {
      emitter.emit('UPDATE_HAS_INIT', true)
    }
  }, [permissionState])
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ width: '100%', flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
        {permissions.map((permission, index) => (
          <PermissionModal
            icon={0}
            key={permission}
            hint={permissionContent[permission].hint}
            visible={permissionObj[permission]}
            onPress={async () => {
              request(permission).finally(() => {
                if (permissions[index + 1]) {
                  setPermissionState({
                    ...permissionObj,
                    [permission]: false,
                    [permissions[index + 1]]: true,
                  })
                }
              })
            }}
            iconStyle={{}}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}
