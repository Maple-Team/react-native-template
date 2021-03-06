import { MMKV } from '@/utils'
import { KEY_GPS } from '@/utils/constant'
import { onRequestPermission } from '@/utils/permission'
import { t } from 'i18next'
import { useEffect, useState } from 'react'
import Geolocation from 'react-native-geolocation-service'

export interface GPS {
  longitude: number
  latitude: number
}
export const useLocation = () => {
  const [location, setLocation] = useState<GPS>({ latitude: 0, longitude: 0 })

  useEffect(() => {
    const onGetLocation = async () => {
      Geolocation.getCurrentPosition(
        position => {
          const { longitude, latitude } = position.coords
          setLocation({ latitude, longitude })
        },
        error => {
          // See error code charts below.
          console.log('onGetLocation', error.code, error.message)
          setLocation({ latitude: 0, longitude: 0 })
        },
        { enableHighAccuracy: true, timeout: 15000 * 4, maximumAge: 10000 }
      )
    }
    Promise.race([
      // onRequestPermission({
      //   permission: 'android.permission.ACCESS_BACKGROUND_LOCATION',
      //   blockedMessage: '权限被禁止',
      //   unavailableMessage: '定位权限不可用',
      //   onGranted: () => {
      //     onGetLocation()
      //   },
      // }).catch(console.error),
      onRequestPermission({
        permission: 'android.permission.ACCESS_FINE_LOCATION',
        blockedMessage: t('permission-blocked', { permission: t('permission.location') }),
        unavailableMessage: t('permission-unavailable', { permission: t('permission.location') }),

        onGranted: () => {
          onGetLocation()
        },
      }).catch(console.error),
    ])
    return () => {
      Geolocation.stopObserving()
    }
  }, [])
  useEffect(() => {
    const { latitude, longitude } = location
    const gps = `${latitude},${longitude}`
    MMKV.setString(KEY_GPS, gps)
  }, [location])

  return location
}
