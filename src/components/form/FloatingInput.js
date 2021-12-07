import React, { PureComponent } from 'react'
import { View, TextInput, Animated } from 'react-native'
import { getKeyboardType, responsive } from '../../utils'
import { FormStyles } from '../../styles'
import { _getFieldError } from './icon'
import { TextInputMask } from 'react-native-masked-text'
class FloatingLabelInput extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isFocused: false,
    }
  }

  UNSAFE_componentWillMount() {
    this._animatedIsFocused = new Animated.Value(!this.props.value ? 0 : 1)
  }
  componentDidUpdate() {
    Animated.timing(this._animatedIsFocused, {
      toValue: this.state.isFocused || !!this.props.value ? 1 : 0,
      duration: 200,
    }).start()
  }

  render() {
    const { label, error, extra, required = true, mask, onFocus, onBlur, ...rest } = this.props
    const size1 =
      label.includes('First Name') || label.includes('Middle Name') || label.includes('Last Name')
        ? 11
        : 16
    const size2 =
      label.includes('First Name') || label.includes('Middle Name') || label.includes('Last Name')
        ? 10
        : 12
    const labelStyle = {
      position: 'absolute',
      left: 0,
      top: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [responsive(24), responsive(14)],
      }),
      fontSize: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [responsive(size1), responsive(size2)],
      }),
      color: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: ['#7B7B7B', '#7B7B7B'],
      }),
    }

    return (
      <>
        <View style={FormStyles.inputWrap}>
          <Animated.Text style={labelStyle}>{`${label}${required ? '*' : ''}`}</Animated.Text>
          {mask ? (
            <TextInputMask
              style={FormStyles.input}
              onFocus={() => {
                this.setState({ isFocused: true })
                onFocus()
              }}
              onBlur={() => {
                this.setState({ isFocused: false })
                onBlur()
              }}
              clearButtonMode="while-editing"
              type={'custom'}
              includeRawValueInChangeText={true}
              options={{
                mask,
              }}
              {...rest}
            />
          ) : (
            <TextInput
              style={FormStyles.input}
              onFocus={() => {
                this.setState({ isFocused: true })
                onFocus()
              }}
              onBlur={() => {
                this.setState({ isFocused: false })
                onBlur()
              }}
              clearButtonMode="while-editing"
              {...rest}
            />
          )}
        </View>
        {extra}
        <View style={FormStyles.error}>{_getFieldError(error)}</View>
      </>
    )
  }
}
export default class FloatingInput extends PureComponent {
  constructor(props) {
    super(props)
  }
  render() {
    const {
      label,
      value,
      type,
      onChangeText,
      containerStyle,
      error,
      isDark = false,
      ...rest
    } = this.props
    return (
      <View
        style={[
          FormStyles.container,
          containerStyle,
          error && { borderColor: '#FF0F20' },
          isDark && { backgroundColor: '#F8F8F8' },
        ]}>
        <FloatingLabelInput
          label={label}
          value={value}
          error={error}
          onChangeText={onChangeText}
          keyboardType={getKeyboardType(type)}
          {...rest}
        />
      </View>
    )
  }
}
