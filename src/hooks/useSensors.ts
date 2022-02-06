import { useCallback, useEffect, useState } from 'react'
import { gyroscope, setUpdateIntervalForType, SensorTypes } from 'react-native-sensors'

const NS2S = 1.0 / 1000000000.0
interface Sendor {
  angleX: string
  angleY: string
  angleZ: string
}
// 将弧度转化为角度
const toDegree = (radians: number) => radians * (180 / Math.PI)
export const useSensor = () => {
  const [sensor, setSensor] = useState<Sendor>()
  const slow = useCallback(() => {
    return () => setUpdateIntervalForType(SensorTypes.gyroscope, 5 * 1000 * 2)
  }, [])
  // const fast = useCallback(() => {
  //   return () => setUpdateIntervalForType(SensorTypes.gyroscope, 400)
  // }, [])
  useEffect(() => {
    slow()
    const subscribe = () => {
      let _timestamp = 0

      const subscription = gyroscope.subscribe(
        ({ x, y, z, timestamp }) => {
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
        err => {
          console.error(err)
          setSensor({
            angleX: '0.0,0.0',
            angleY: '0.0,0.0',
            angleZ: '0.0,0.0',
          })
        }
      )
      return subscription
    }
    const subscription = subscribe()
    return () => {
      // FIXME
      // @ts-ignore
      subscription.remove()
    }
  }, [sensor, slow])

  return sensor
}
