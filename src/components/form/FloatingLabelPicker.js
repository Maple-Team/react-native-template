import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { View, Animated, TouchableOpacity, Easing } from 'react-native'
import { responsive } from '../../utils'
import { FormStyles } from '../../styles'
import { _getFieldError } from './icon'
import Text from '../Text'

export default class FloatingLabelPicker extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isFocused: false,
    }
  }

  UNSAFE_componentWillMount() {
    this._animatedIsFocused = new Animated.Value(!this.props.name ? 0 : 1)
    this.rotateValue = new Animated.Value(!this.props.visible ? 0 : 1)
  }

  handleFocus = () => this.setState({ isFocused: true })
  handleBlur = () => this.setState({ isFocused: false })
  componentDidUpdate() {
    Animated.timing(this._animatedIsFocused, {
      toValue: this.state.isFocused || !!this.props.name ? 1 : 0,
      duration: 200,
    }).start()
    Animated.timing(this.rotateValue, {
      toValue: this.props.visible ? 1 : 0,
      duration: 300,
      easing: Easing.linear,
    }).start()
  }

  render() {
    const { label, error, extra, onOpen, name, required = true } = this.props
    const labelStyle = {
      position: 'absolute',
      left: 0,
      textTransform: 'capitalize',
      width: 500, // 父容器oveflow: 'hidden'
      top: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [responsive(24), responsive(14)],
      }),
      fontSize: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [responsive(16), responsive(12)],
      }),
      color: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: ['#7B7B7B', '#7B7B7B'],
      }),
    }
    const arrowStyle = {
      width: responsive(14),
      height: responsive(10),
    }
    return (
      <>
        <View style={FormStyles.inputWrap}>
          <Animated.Text style={labelStyle} onPress={() => !name && onOpen()}>
            {`${label}${required ? '*' : ''}`}
          </Animated.Text>
          <Text style={FormStyles.input} onPress={onOpen}>
            {name}
          </Text>
        </View>
        {extra || (
          <TouchableOpacity onPress={onOpen}>
            <Animated.Image
              style={[
                arrowStyle,
                {
                  transform: [
                    {
                      rotate: this.rotateValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '180deg'],
                      }),
                    },
                  ],
                },
              ]}
              source={require('../../assets/images/common/arrow.png')}
            />
          </TouchableOpacity>
        )}
        <View style={FormStyles.error}>{_getFieldError(error)}</View>
      </>
    )
  }
}
FloatingLabelPicker.defaultProps = {
  required: true,
}
FloatingLabelPicker.propTypes = {
  label: PropTypes.string.isRequired,
  error: PropTypes.array,
  extra: PropTypes.element,
  onOpen: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  required: PropTypes.bool.isRequired,
}
