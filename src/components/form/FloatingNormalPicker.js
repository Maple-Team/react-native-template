import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { View, Platform } from 'react-native'
import NormalPicker from './NormalPicker'
import { FormStyles } from '../../styles'
import { Constants } from '../../utils'
import FloatingLabelPicker from './FloatingLabelPicker'
const isAndroid = Platform.OS === 'android'

export default class FloatingNormalPicker extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
    }
  }
  onClose = () => this.setState({ visible: false })
  onOpen = () => {
    if (this.props.editable === false) {
      return
    }
    this.setState({ visible: true })
  }
  render() {
    const {
      error,
      label,
      data = [],
      onValueChange,
      required,
      value = '',
      attr1,
      isDark,
    } = this.props
    const { visible } = this.state
    let name = null
    const selectedItem = data.length ? data.find(item => item.code === value) : ''
    if (selectedItem) {
      // fixme
      if (label === 'Loan Period') {
        name = `${selectedItem.name} ${Constants.DAYS}`
      } else {
        name = `${selectedItem.name}`
      }
    }

    return (
      <View
        style={[
          FormStyles.container,
          error && { borderColor: '#FF0F20' },
          isDark && { backgroundColor: '#F8F8F8' },
        ]}>
        <FloatingLabelPicker
          label={label}
          name={name}
          error={error}
          required={required}
          onOpen={this.onOpen.bind(this)}
          visible={visible}
        />
        <NormalPicker
          value={value}
          onValueChange={obj => {
            onValueChange(obj)
            isAndroid && this.onClose()
          }}
          name={name}
          onConfirm={obj => {
            onValueChange(obj, 'confirm')
            isAndroid && this.onClose()
          }}
          onClose={this.onClose}
          visible={visible}
          title={label}
          attr1={attr1}
          dataSource={data}
          type="normal"
        />
      </View>
    )
  }
}
FloatingNormalPicker.defaultProps = {
  required: true,
}
FloatingNormalPicker.propTypes = {
  error: PropTypes.array,
  label: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  onValueChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  attr1: PropTypes.string, // 额外控制字段
}
