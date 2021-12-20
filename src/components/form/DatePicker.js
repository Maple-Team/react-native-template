import React from 'react'
import ModalWrapper from './ModalWrapper'
import { DatePickerIOS, Dimensions, Platform } from 'react-native'
import dayjs from 'dayjs'
import DatePickerAndroid from 'react-native-date-picker'
import StyleSheet from 'react-native-adaptive-stylesheet'

const isAndroid = Platform.OS === 'android'

// eslint-disable-next-line valid-jsdoc
/**
 * Note 生日：70年前-现在
 * Note 发薪日： 今天-一年后的今天
 */
const DatePicker = ({ value, onDateChange, dateType }) => {
  const _minimumDate =
    dateType === 'birth' ? dayjs().subtract(70, 'y').toDate() : dayjs().add(1, 'y').toDate()

  return !isAndroid ? (
    <DatePickerIOS
      mode="date"
      date={value}
      onDateChange={onDateChange}
      maximumDate={new Date()}
      minimumDate={_minimumDate}
    />
  ) : (
    <DatePickerAndroid
      date={value}
      mode="date"
      style={styles.datePicker}
      onDateChange={onDateChange}
      maximumDate={new Date()}
      minimumDate={_minimumDate}
    />
  )
}
export default ModalWrapper(DatePicker)

const styles = StyleSheet.create({
  datePicker: {
    width: Dimensions.get('screen').width,
  },
})
