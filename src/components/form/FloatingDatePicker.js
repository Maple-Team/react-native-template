import React, { useState } from 'react'
import { View } from 'react-native'
import PropTypes from 'prop-types'
import DatePicker from './DatePicker'
import dayjs from 'dayjs'
import FloatingLabelPicker from './FloatingLabelPicker'
import { FormStyles } from '../../styles'

export default function FloatingDatePicker({
  onConfirm,
  value: _value,
  error,
  label,
  dateType,
  required,
}) {
  const [visible, setVisible] = useState(false)
  const [value, setValue] = useState(
    _value
      ? dayjs(_value).toDate()
      : dayjs()
          .subtract(20, 'y')
          .toDate()
  )
  const onClose = () => setVisible(false)
  const onOpen = () => setVisible(true)
  const _onDateChange = val => setValue(val)

  return (
    <View style={[FormStyles.container, error && { borderColor: '#FF0F20' }]}>
      <FloatingLabelPicker
        label={label}
        name={_value}
        required={required}
        onOpen={onOpen}
        visible={visible}
        error={error}
      />
      <DatePicker
        value={value}
        dateType={dateType}
        onDateChange={_onDateChange}
        onConfirm={() => {
          let __value
          if (!value) {
            // NOTE 出生年月默认20年前
            if (dateType === 'birth') {
              __value = dayjs()
                .subtract(20, 'y')
                .toDate()
            } else {
              __value = dayjs().toDate()
            }
            setValue(value ? value : __value)
          }
          onConfirm(value ? value : __value)
        }}
        onClose={onClose}
        visible={visible}
        type="date"
      />
    </View>
  )
}

FloatingDatePicker.propTypes = {
  label: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string,
  error: PropTypes.array,
}
