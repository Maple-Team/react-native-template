import React, { PureComponent } from 'react'
import { View } from 'react-native'
import { colors } from '../../utils'
import { FormStyles } from '../../styles'
import FloatingLabelPicker from './FloatingLabelPicker'
// fixme 1.错误提示定位
export default class FloatingPhoneInput extends PureComponent {
  constructor(props) {
    super(props)
  }
  render() {
    const { label, value, containerStyle, error, onPress, isDark = false, ...rest } = this.props
    return (
      <View
        style={[
          FormStyles.container,
          containerStyle,
          error && { borderColor: '#FF0F20' },
          isDark && { backgroundColor: '#F8F8F8' },
        ]}>
        <FloatingLabelPicker onOpen={onPress} label={label} value={value} error={error} {...rest} />
      </View>
    )
  }
}
