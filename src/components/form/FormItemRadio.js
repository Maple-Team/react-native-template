import React from 'react'
import { View } from 'react-native'
import PropTypes from 'prop-types'
import styles from '../../styles/formStyles'
import RadioGroup from './RadioGroup'
import { _getFieldError } from './icon'
import stylesheet from 'react-native-adaptive-stylesheet'
export default function FormItemRadio({ value, data, error, onChange }) {
  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <View style={{ position: 'relative' }}>
      <RadioGroup
        radioButtons={data}
        justifyContent="flex-start"
        value={value}
        onPress={_value => onChange(_value)}
        flexDirection="row"
      />
      <View style={[styles.error, styles2.err]}>{_getFieldError(error)}</View>
    </View>
  )
}

FormItemRadio.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  error: PropTypes.array,
}

const styles2 = stylesheet.create({
  err: {
    bottom: -20,
    paddingLeft: 6.5,
  },
})
