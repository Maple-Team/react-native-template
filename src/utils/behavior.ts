import dayjs from 'dayjs'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Dimensions } from 'react-native'

import { uploadBehavior } from '@/services/apply'

import type {
  BehaviorModel,
  BehaviorRecords,
  EnterID,
  InputTypeID,
  LeaveID,
  SelectTypeID,
  PAGE_ID,
  MatchedIDs,
  ClickTypeID,
} from '@/typings/behavior'

const window = Dimensions.get('window')
export default class Behavior<T extends PAGE_ID> {
  private model: BehaviorModel<T> = {
    screenWidth: `${window.width}`,
    screenHeight: `${window.height}`,
    applyId: '',
    outerIp: '',
    internalIp: '',
    records: [],
  }
  private tempRecord: Pick<BehaviorRecords<T>, 'startTime' | 'value'> = {
    startTime: '',
    value: '',
  }
  constructor(initModel?: BehaviorModel<T>) {
    if (initModel) {
      this.model = initModel
    }
  }

  getCurrentModel() {
    return this.model
  }

  private findUnElement(arr: BehaviorRecords<T>[], id: PAGE_ID) {
    return this.find(arr, id, (a, b) => a !== b)
  }
  private findElement(arr: BehaviorRecords<T>[], id: PAGE_ID) {
    return this.find(arr, id, (a, b) => a === b)
  }
  /**
   * 查找符合条件元素
   * @param arr
   * @param id
   * @param cb
   * @returns
   */
  private find(arr: BehaviorRecords<T>[], id: PAGE_ID, cb: (a: PAGE_ID, b: PAGE_ID) => boolean) {
    let index = -1
    arr.some((item, i) => {
      if (cb(item.id.substring(0, 3) as PAGE_ID, id)) {
        index = i
        return true
      }
      return false
    })
    return index
  }
  /**
   * 获取系统时间
   * @returns
   */
  private getNowTime() {
    //TODO TIMEZONE?
    return dayjs().format('YYYY-MM-DD HH:mm:ss')
  }
  private save2storage() {
    AsyncStorage.setItem('da', JSON.stringify(this.model))
  }

  /**
   * 开始更新
   * @param id
   * @param val
   */
  setStartModify(id: MatchedIDs<T, InputTypeID>, val: string) {
    this.tempRecord.startTime = this.getNowTime()
    this.tempRecord.value = val || ''
    console.log('setStartModify', this.tempRecord)
  }

  /**
   * 结束更新
   * @param id
   * @param val
   * @returns
   */
  setEndModify(id: MatchedIDs<T, InputTypeID>, val: string) {
    let _val = val || ''
    if (this.tempRecord.value?.toString() === _val.toString()) {
      return
    }
    this.model.records.push({
      id,
      oldValue: this.tempRecord.value?.toString(),
      newValue: _val.toString(),
      startTime: this.tempRecord.startTime,
      endTime: this.getNowTime(),
    })
    console.log('setEndModify', this.tempRecord)
    this.save2storage()
  }
  /**
   * 设置更新
   * @param id
   * @param newValue
   * @param oldValue
   */
  setModify(id: MatchedIDs<T, SelectTypeID>, newValue: string, oldValue: string) {
    this.model.records.push({
      id,
      oldValue: (oldValue || '').toString(),
      newValue: (newValue || '').toString(),
      startTime: this.getNowTime(),
    })
    console.log('setModify', this.tempRecord)
    this.save2storage()
  }
  /**
   * 设置离开页面时间
   * @param id
   */
  setLeavePageTime(id: MatchedIDs<T, LeaveID>) {
    this.model.records.push({ id, startTime: this.getNowTime() })
    this.save2storage()
  }
  /**
   * 设置进入页面时间
   * @param id
   */
  setEnterPageTime(id: MatchedIDs<T, EnterID>) {
    this.model.records.push({ id, startTime: this.getNowTime() })
    this.save2storage()
  }
  /**
   * 点击提交
   * @param id
   */
  setClickTime(id: MatchedIDs<T, ClickTypeID>) {
    this.model.records.push({ id, startTime: this.getNowTime() })
    this.save2storage()
  }
  /**
   * 取出单个id对应的所有记录
   * @param id
   */
  private getSendMsg(id: PAGE_ID) {
    let model = { ...this.model }
    let aa = this.findUnElement(model.records, id)
    while (aa !== -1) {
      model.records.splice(aa, 1)
      aa = this.findUnElement(model.records, id)
    }
    return model
  }
  /**
   * 清除单个id对应的信息
   * @param id
   */
  private clearSendMsg(id: PAGE_ID) {
    let aa = this.findElement(this.model.records, id)
    while (aa !== -1) {
      this.model.records.splice(aa, 1)
      aa = this.findElement(this.model.records, id)
    }
    this.save2storage()
  }
  /**
   * 发送单个id的信息
   * @param id
   */
  async send(id: PAGE_ID) {
    this.model.applyId = (await AsyncStorage.getItem('applyId')) || '' //FIXME applyId确保有值
    this.save2storage()
    let data = this.getSendMsg(id)
    if (data.records && data.records.length) {
      await uploadBehavior(data)
      this.clearSendMsg(id)
    }
  }
}
