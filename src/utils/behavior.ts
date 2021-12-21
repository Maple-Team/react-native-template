import axios from './axios'
import dayjs from 'dayjs'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { prefix, errorCaptured } from './request'
import { Dimensions } from 'react-native'

// 1.数据模型
let model = {
  applyId: '',
  outerIp: '',
  internalIp: '',
  screenWidth: '',
  screenHeight: '',
  records: [],
}

let tempRecord = {
  startTime: '',
  value: '',
}
//TODO
const _getDa = async () => {
  let _model = JSON.parse((await AsyncStorage.getItem('da')) || '')
  model = Object.assign(model, _model)
}
// 2.读取本地数据
_getDa()

// 3.设置属性
setModelPrototype(model)

function findUnElement(arr, id) {
  let idpx = id.substr(0, 3)
  let index = -1
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id.substr(0, 3) !== idpx) {
      index = i
      break
    }
  }
  return index
}
function findElement(arr, id) {
  let idpx = id.substr(0, 3)
  let index = -1
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id.substr(0, 3) === idpx) {
      index = i
      break
    }
  }
  return index
}
async function setModelPrototype() {
  const window = Dimensions.get('window')
  model.screenWidth = window.width
  model.screenHeight = window.height
  model.internalIp = ''
}
export default {
  // 获取当前时间
  getNowTime: () => dayjs().format('YYYY-MM-DD HH:mm:ss'),
  // 保存到localstorage
  save2storage() {
    // Logger.log('da', model)
    AsyncStorage.setItem('da', JSON.stringify(model))
  },

  setStartModify(id, val) {
    let _val = val || ''
    tempRecord.startTime = this.getNowTime()
    tempRecord.value = _val
    Logger.log(arguments.callee, ...arguments)
  },

  setEndModify(id, val) {
    let _val = val || ''
    if (tempRecord.value.toString() === _val.toString()) {
      return
    }
    model.records.push({
      id: id,
      oldValue: tempRecord.value.toString(),
      newValue: _val.toString(),
      startTime: tempRecord.startTime,
      endTime: this.getNowTime(),
    })
    Logger.log(arguments.callee, ...arguments)
    this.save2storage()
  },

  setModify(id, newValue, oldValue) {
    let _oldValue = oldValue || ''
    let _newValue = newValue || ''

    model.records.push({
      id: id,
      oldValue: _oldValue == null ? null : _oldValue.toString(),
      newValue: _newValue.toString(),
      startTime: this.getNowTime(),
    })
    Logger.log(arguments.callee, ...arguments)
    this.save2storage()
  },

  setClickTime(id) {
    model.records.push({ id: id, startTime: this.getNowTime() })
    this.save2storage()
  },

  setLeavePageTime(id) {
    model.records.push({ id, startTime: this.getNowTime() })
    this.save2storage()
  },

  setEnterPageTime(id) {
    model.records.push({ id, startTime: this.getNowTime() })
    this.save2storage()
  },

  getSendMsg(id) {
    let _model = JSON.parse(JSON.stringify(model))
    let aa = findUnElement(_model.records, id)
    while (aa !== -1) {
      _model.records.splice(aa, 1)
      aa = findUnElement(_model.records, id)
    }
    return _model
  },

  clearSendMsg(id) {
    let aa = findElement(model.records, id)
    while (aa !== -1) {
      model.records.splice(aa, 1)
      aa = findElement(model.records, id)
    }
    this.save2storage()
  },

  async send(id) {
    model.applyId = (await AsyncStorage.getItem('applyId')) || ''
    this.save2storage()
    let data = this.getSendMsg(id)
    if (data.records && data.records.length) {
      let [err] = await errorCaptured(() =>
        axios({
          url: `${prefix}/app/behavior`,
          method: 'post',
          data,
        })
      )
      if (err) {
        if (err && err.data && err.data.status !== 200) {
          this.clearSendMsg(id)
        }
      } else {
        this.clearSendMsg(id)
      }
    }
  },
}
