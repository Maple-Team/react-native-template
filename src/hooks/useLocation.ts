import emitter from '@/eventbus'
import { onRequestPermission } from '@/utils/permission'
import { useEffect, useState } from 'react'
import Geolocation from 'react-native-geolocation-service'

export interface GPS {
  longitude: number
  latitude: number
}
export const useLoction = () => {
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
        blockedMessage: '权限被禁止',
        unavailableMessage: '定位权限不可用',
        onGranted: () => {
          onGetLocation()
        },
      }).catch(console.error),
    ])
  }, [])
  useEffect(() => {
    const { latitude, longitude } = location
    emitter.emit('UPDATE_GPS', `${latitude},${longitude}`)
  }, [location])

  return location
}
