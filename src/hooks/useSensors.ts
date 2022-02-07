import { useEffect, useState } from 'react'
import {
  gyroscope,
  setUpdateIntervalForType,
  SensorTypes,
  setLogLevelForType,
} from 'react-native-sensors'

const NS2S = 1.0 / 1000000000.0
interface Sendor {
  angleX: string
  angleY: string
  angleZ: string
}
type Mode = 'slow' | 'fast'

setLogLevelForType('gyroscope', 2)

export const useSensor = (mode: Mode = 'slow') => {
  const [sensor, setSensor] = useState<Sendor>()
  setUpdateIntervalForType(SensorTypes.gyroscope, mode === 'slow' ? 10 * 1000 : 4 * 1000)
  useEffect(() => {
    /**
     * 将弧度转化为角度
     * @param radians
     * @returns
     */
    const toDegree = (radians: number) => radians * (180 / Math.PI)
    /**
     * 监听陀螺仪
     * @returns
     */
    const subscribe = () => {
      let _timestamp = 0
      return gyroscope.subscribe({
        error: e => {
          console.error(e)
          setSensor({
            angleX: '0.0,0.0',
            angleY: '0.0,0.0',
            angleZ: '0.0,0.0',
          })
        },
        next: ({ x, y, z, timestamp }) => {
          if (_timestamp !== 0) {
            let x1 = 0
            let y1 = 0
            let z1 = 0
            // 得到两次检测到手机旋转的时间差（纳秒），并将其转化为秒
            const dT = (timestamp - _timestamp) * NS2S
            // 将手机在各个轴上的旋转角度相加，即可得到当前位置相对于初始位置的旋转弧度
            x1 = x * (1 + dT)
            y1 = y * (1 + dT)
            z1 = z * (1 + dT)
            setSensor({
              angleX: `${x},${toDegree(x1)}`,
              angleY: `${y},${toDegree(y1)}`,
              angleZ: `${z},${toDegree(z1)}`,
            })
          } else {
            _timestamp = timestamp
          }
        },
      })
    }
    const subscription = subscribe()
    return () => subscription.unsubscribe()
  }, [])

  return sensor
}
