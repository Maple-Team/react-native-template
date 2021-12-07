import React, { PureComponent } from 'react'
import { gyroscope, setUpdateIntervalForType, SensorTypes } from 'react-native-sensors'
import { Logger } from '../utils'
const NS2S = 1.0 / 1000000000.0
export default class GyroscopeSensor extends PureComponent {
  componentDidMount() {
    this._slow()
    this._subscribe()
  }

  componentWillUnmount() {
    this._unsubscribe()
  }

  _slow = () => {
    // defaults to 100ms
    setUpdateIntervalForType(SensorTypes.gyroscope, 1000)
  }

  _fast = () => {
    setUpdateIntervalForType(SensorTypes.gyroscope, 400)
  }

  _subscribe = () => {
    let _timestamp = 0
    const { send } = this.props
    this._subscription = gyroscope.subscribe(
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
          send({
            angleX: `${x},${toDegree(x1)}`,
            angleY: `${y},${toDegree(y1)}`,
            angleZ: `${z},${toDegree(z1)}`,
          })
        } else {
          _timestamp = timestamp
        }
      },
      err => {
        Logger.log(err)
        send({
          angleX: '0.0,0.0',
          angleY: '0.0,0.0',
          angleZ: '0.0,0.0',
        })
      }
    )
  }

  _unsubscribe = () => {
    this._subscription && this._subscription.remove()
    this._subscription = null
  }

  render() {
    return <></>
  }
}
// 将弧度转化为角度
const toDegree = radians => radians * (180 / Math.PI)
